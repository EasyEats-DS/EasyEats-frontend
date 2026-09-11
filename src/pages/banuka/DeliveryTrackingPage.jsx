// src/pages/DeliveryTrackingPage.jsx
import { useState, useEffect,useRef } from 'react';
import MapComponent from '../../components/banuka/Maps';
import DeliveryList from '../../components/banuka/DeliveryList';
import DriverJobSheet from '../../components/banuka/DriverJobSheet';
import axios from 'axios';
import './DeliveryTrackingPage.css';
//import useDriversSocket from '../../components/banuka/hooks/useDriversSocket';
import { useSocket } from '../../components/banuka/SocketContext';
import UserLayout from '../../components/UserLayout';
import { getCurrentUser } from '../../lib/auth';
import { activeLeg, pickActiveDelivery } from '../../lib/navigation';
import { toLatLng } from '../../lib/geo';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ROUTE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';


const DeliveryTrackingPage = ({ userRole }) => {

  // `activeDelivery` changes the moment this driver's accept is confirmed, and
  // `deliveryStatus` on every step after. The list is loaded over HTTP, so
  // without watching these it only ever showed what existed at page load --
  // a driver had to refresh to see the order they had just accepted.
  const { status_update, availableDrivers, activeDelivery, deliveryStatus, driverLocation } =
    useSocket();

  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [highlightedDriver, setHighlightedDriver] = useState(null);
  const currentUser = getCurrentUser();
  
    const token = localStorage.getItem('authToken');
    console.log("token_______:", token);
    console.log("Current User:", currentUser);

    //const {availableDrivers} = useDriversSocket();
    const mapRef = useRef(); // ✅ Add this near the top of the component
  console.log('availableDrivers11', availableDrivers);


  const fetchDeliveries = async () => {
    try {
      let endpoint = '';
      if (userRole === 'driver') {
        endpoint = `${BASE_URL}/deliveries/driver/${currentUser._id}`
      } else {
        endpoint = `${BASE_URL}/deliveries/cus/${currentUser._id}`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("Deliveries response________________________________:", response.data); // Log the response data
      
      if (response.data.length > 0) {
        setDeliveries(response.data);
        // Select the delivery that still needs work, not simply the first one
        // the API happened to return -- a finished delivery has no leg, which
        // made the navigation panel disappear while an order was outstanding.
        setSelectedDelivery((current) => {
          const stillListed =
            current && response.data.find((delivery) => delivery._id === current._id);
          return stillListed || pickActiveDelivery(response.data);
        });
      } else {
        setDeliveries([]);
        setSelectedDelivery(null);
      }
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // The leg the driver is on right now: to the restaurant to collect, then to
  // the customer once they have. Derived from the delivery's own status so the
  // map cannot disagree with the buttons.
  const driverPosition =
    userRole === 'driver'
      ? toLatLng(driverLocation?.coordinates) || null
      : toLatLng(driverLocation?.coordinates);

  const leg = activeLeg(selectedDelivery, driverPosition);

  const fetchRoute = async (currentLeg) => {
    if (!currentLeg?.from || !currentLeg?.to) {
      setRoutePath([]);
      setRouteInfo(null);
      return;
    }

    try {
      // The endpoint speaks GeoJSON "lng,lat"; the leg is in Leaflet order.
      const response = await axios.get(`${ROUTE_URL}/api/google/route`, {
        params: {
          origin: `${currentLeg.from[1]},${currentLeg.from[0]}`,
          destination: `${currentLeg.to[1]},${currentLeg.to[0]}`,
        },
      });
      setRoutePath(response.data.route || []);
      setRouteInfo({
        distanceMeters: response.data.distanceMeters,
        durationSeconds: response.data.durationSeconds,
        degraded: Boolean(response.data.degraded),
      });
    } catch (err) {
      console.error("Error fetching route:", err);
      setRoutePath([]);
      setRouteInfo(null);
    }
  };

  useEffect(() => {
    
    fetchDeliveries();
  }, [currentUser._id, userRole]);

  // Re-pull the list whenever this driver's work changes underneath it: an
  // offer accepted, or a status advanced from another tab or by the server.
  useEffect(() => {
    if (!activeDelivery && !deliveryStatus) return;
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDelivery?.orderId, deliveryStatus?.orderId, deliveryStatus?.state]);

  useEffect(() => {
    fetchRoute(leg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leg?.phase, leg?.to?.[0], leg?.to?.[1], leg?.from?.[0], leg?.from?.[1]]);

  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
  };


  const handleFocusDriver = (driverId) => {
    // Find the driver in availableDrivers (from your WebSocket data)
    const driverToFocus = availableDrivers.find(d => d._id === driverId);
    if (driverToFocus && driverToFocus.position) {
      // You'll need to expose a method from MapComponent to focus on coordinates
      //mapRef.current.flyTo(driverToFocus.position, 15);
      mapRef.current.flyToDriver(driverId)
      // Optional: highlight the driver marker
     console.log("Driver to focus:", driverToFocus);
      setHighlightedDriver(driverId);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      const response = await axios.patch(
        //`http://localhost:3001/api/delivery/${deliveryId}/status`,
        `${BASE_URL}/deliveries/${deliveryId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      status_update(response.data);

      console.log("Status update response:", response); // Log the response data

     // ✅ Only update the status field locally
    setDeliveries(prev =>
      prev.map(d =>
        // console.log("delivwerymap",d),
        d._id === deliveryId ? { ...d, deliveryStatus: newStatus } : d
      )
    );

    // ✅ If selectedDelivery is the updated one, update its status too
    if (selectedDelivery && selectedDelivery._id === deliveryId) {
      setSelectedDelivery(prev => ({ ...prev, deliveryStatus: newStatus }));
    }
      
      // For customers, refresh the list after status update
      if (userRole === 'customer') {
        fetchDeliveries();
      }
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <UserLayout title="EasyEats - Delivery Tracking">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF7A00]" />
          <p className="text-gray-500">Loading your deliveries…</p>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout title="EasyEats - Delivery Tracking">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-[#FF7A00] px-4 py-2.5 font-semibold text-white transition hover:bg-[#e56e00]"
          >
            Try again
          </button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title="EasyEats - Delivery Tracking">
      {/* The map is the page; the job sheet floats over it. Sized against the
          viewport minus the header and the mobile tab bar so neither is covered. */}
      <div className="relative -mx-4 h-[calc(100vh-9.5rem)] overflow-hidden lg:mx-0 lg:h-[calc(100vh-8rem)] lg:rounded-2xl">
        <div className="map-container absolute inset-0">
          <MapComponent
            ref={mapRef}
            userRole={userRole}
            customDeliveries={deliveries}
            selectedDelivery={selectedDelivery}
            routePath={routePath}
            highlightedDriver={highlightedDriver}
          />
        </div>

        <DriverJobSheet
          leg={userRole === 'driver' ? leg : null}
          routeInfo={routeInfo}
          delivery={selectedDelivery}
          onAdvance={handleStatusUpdate}
          title={userRole === 'driver' ? 'Your deliveries' : 'Your orders'}
        >
          <DeliveryList
            deliveries={deliveries}
            selectedDelivery={selectedDelivery}
            onSelectDelivery={handleDeliverySelect}
            onStatusUpdate={userRole === 'driver' ? handleStatusUpdate : null}
            userRole={userRole}
            onFocusDriver={handleFocusDriver}
          />
        </DriverJobSheet>
      </div>
    </UserLayout>
  );
};

export default DeliveryTrackingPage;