import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { getCurrentUser, isDriver } from '../../../lib/auth';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

/**
 * The one socket connection for the app, and the delivery state it carries.
 *
 * Two roles share it. A driver receives one offer at a time and answers it; a
 * customer watches their order move from "finding a driver" to a live position
 * on the map. Both are held here rather than in the pages so that an offer is
 * not lost when the driver happens to be on a different screen.
 */
export default function useDriversSocket() {
  const [data, setData] = useState({
    drivers: [],
    availableDrivers: [],
    restaurants: [],
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);

  /** The offer this driver is being asked to answer right now, if any. */
  const [offer, setOffer] = useState(null);
  /** What this driver is currently delivering, once an offer is accepted. */
  const [activeDelivery, setActiveDelivery] = useState(null);
  /** Where the customer's order stands: searching, assigned, delivered... */
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  /** The assigned driver's latest position, for the customer's map. */
  const [driverLocation, setDriverLocation] = useState(null);
  /**
   * Whether the server accepted this connection's identity.
   *
   * null while the answer is outstanding. A driver whose token has expired
   * connects and renders normally but is invisible to dispatch, so this has to
   * be observable by the UI rather than only logged.
   */
  const [identified, setIdentified] = useState(null);
  const [authError, setAuthError] = useState(null);

  const socketRef = useRef(null);

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?._id;
  const userIsDriver = isDriver(currentUser);

  const emit = useCallback((event, payload) => {
    if (!socketRef.current) return false;
    socketRef.current.emit(event, payload);
    return true;
  }, []);

  /**
   * Reports this device's position.
   *
   * The server derives who is reporting from the connection's token, so the
   * user argument older callers pass is accepted and ignored rather than
   * trusted.
   */
  const sendLiveLocation = useCallback(
    (location) => emit('live_location', { location }),
    [emit],
  );

  const status_update = useCallback((delivery) => emit('status_update', { orderId: delivery }), [emit]);

  const acceptOffer = useCallback(() => {
    if (!offer) return;
    emit('delivery:accept', {
      assignmentId: offer.assignmentId,
      offerToken: offer.offerToken,
    });
    // Cleared optimistically: the countdown should stop the instant they tap,
    // and the server answers with delivery:offer_result either way.
    setOffer(null);
  }, [emit, offer]);

  const rejectOffer = useCallback(() => {
    if (!offer) return;
    emit('delivery:reject', {
      assignmentId: offer.assignmentId,
      offerToken: offer.offerToken,
    });
    setOffer(null);
  }, [emit, offer]);

  /** Re-joins an order's tracking room, e.g. when opening the order page. */
  const subscribeToTracking = useCallback((orderId) => emit('tracking:subscribe', { orderId }), [emit]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // Identity comes from the signed token; the server no longer accepts a
      // client-supplied id, since a socket can now claim a delivery.
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('identify');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setIdentified(null);
    });
    socket.on('error', (err) => setError(err));
    socket.on('connect_error', (err) => setError(err));

    socket.on('identify:result', (result) => {
      setIdentified(Boolean(result?.ok));
      setAuthError(result?.ok ? null : result?.reason || 'unauthenticated');

      if (!result?.ok) {
        console.warn('Socket identification refused:', result?.reason);
      }
    });

    // ---- map data ----------------------------------------------------------

    socket.on('map:init', (response) => {
      try {
        if (!response) throw new Error('No data received');

        const drivers = Array.isArray(response.availableDrivers) ? response.availableDrivers : [];
        const restaurants = Array.isArray(response.restaurants) ? response.restaurants : [];

        const others = currentUserId ? drivers.filter((d) => d._id !== currentUserId) : drivers;

        setData({
          drivers,
          availableDrivers: others.filter((d) => d?.role === 'DELIVERY_PERSON'),
          restaurants,
        });
      } catch (err) {
        console.error('Error processing initial data:', err);
        setError(err);
      }
    });

    socket.on('location_updated', ({ userId, role, location }) => {
      if (role === 'CUSTOMER' || role === 'customer') {
        setCustomerLocation(location);
      }

      setData((previous) => {
        const drivers = previous.drivers.map((driver) =>
          driver._id === userId
            ? { ...driver, position: { type: 'Point', coordinates: location } }
            : driver,
        );

        return {
          ...previous,
          drivers,
          availableDrivers: drivers.filter(
            (driver) => driver?.role === 'DELIVERY_PERSON' && driver._id !== currentUserId,
          ),
        };
      });
    });

    // ---- driver: the offer loop -------------------------------------------

    socket.on('delivery:offer', (incoming) => setOffer(incoming));

    // The countdown ran out, or the order was withdrawn. Close the popup
    // silently; the driver did not do anything wrong.
    socket.on('delivery:offer_cancelled', ({ assignmentId }) => {
      setOffer((current) => (current?.assignmentId === assignmentId ? null : current));
    });

    socket.on('delivery:offer_result', (result) => {
      setOffer((current) => (current?.assignmentId === result?.assignmentId ? null : current));

      if (result?.ok) {
        setActiveDelivery(result);
        if (result.customer?.position?.coordinates) {
          setCustomerLocation(result.customer.position.coordinates);
        }
      } else {
        setError(null);
        console.info('Offer could not be claimed:', result?.reason);
      }
    });

    // ---- customer: watching the search ------------------------------------

    socket.on('delivery:searching', (payload) =>
      setDeliveryStatus({ ...payload, state: 'searching' }),
    );

    socket.on('delivery:driver_rejected', (payload) =>
      setDeliveryStatus({ ...payload, state: 'driver_rejected' }),
    );

    socket.on('delivery:assigned', (payload) => {
      setDeliveryStatus({ ...payload, state: 'assigned' });
      if (payload?.driver?.position?.coordinates) {
        setDriverLocation({ coordinates: payload.driver.position.coordinates });
      }
    });

    socket.on('delivery:search_failed', (payload) =>
      setDeliveryStatus({ ...payload, state: 'failed' }),
    );

    socket.on('delivery:status', (payload) =>
      setDeliveryStatus((current) => ({ ...current, ...payload, state: payload.status })),
    );

    // ---- tracking ----------------------------------------------------------

    socket.on('delivery:driver_location', ({ coordinates, at, orderId, driverId }) => {
      setDriverLocation({ coordinates, at, orderId, driverId });
    });

    // Sent on reconnect when this user is already party to a live order, so a
    // refresh mid-delivery does not lose the tracking view.
    socket.on('delivery:restored', (payload) => {
      setDeliveryStatus({ ...payload, state: payload.state });
      if (payload?.state === 'accepted' || payload?.state === 'picked_up') {
        setActiveDelivery((current) => current ?? payload);
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId]);

  return {
    ...data,
    isConnected,
    identified,
    authError,
    error,

    customerLocation,
    setCustomerLocation,
    driverLocation,

    offer,
    acceptOffer,
    rejectOffer,
    activeDelivery,

    deliveryStatus,
    subscribeToTracking,

    sendLiveLocation,
    status_update,

    isDriver: userIsDriver,
  };
}
