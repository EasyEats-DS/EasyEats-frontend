import React, { useState, useEffect, useRef, forwardRef,useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useDriversSocket from '../banuka/hooks/useDriversSocket';
import DriverMarkers from './DriverMarkers';
import UserMarker from './UserMarker';
import RestaurantMarkers from './RestaurantMarkers';
import CustomerMarker from './CustomerMarker';
import L from 'leaflet';
import axios from 'axios';

import { useSocket } from './SocketContext';
import { getCurrentUser } from '../../lib/auth';
import { positionToLatLng, toLatLng } from '../../lib/geo';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = forwardRef(({ userRole, customDeliveries, selectedDelivery, onFocusDriver }, ref) => {
  const [userPosition, setUserPos] = useState([6.1688, 80.1794]); // default: southern SL
  const [driverIcon, setDriverIcon] = useState(null);
  const [customerIcon, setCustomerIcon] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [highlightedDriverId, setHighlightedDriverId] = useState(null);
  //const { drivers, isConnected, availableDrivers, restaurants, customerLocation, setCustomerLocation, sendLiveLocation } = useDriversSocket();
  const {
    isConnected,
    availableDrivers,
    restaurants,
    customerLocation,
    setCustomerLocation,
    sendLiveLocation,
    driverLocation,
    subscribeToTracking,
  } = useSocket();
  const [routePath, setRoutePath] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const mapRef = useRef();


  const BASE_URL = import.meta.env.VITE_BASE_URL;

  console.log("Map component mounted");
  console.log("ARes",restaurants);
  console.log("availableDriversmap: ", availableDrivers);
  const token = localStorage.getItem('authToken');
  console.log("token_______:", token);
  // Expose map methods to parent
  useImperativeHandle(ref, () => ({
    flyToDriver: (driverId) => {
      const driver = availableDrivers.find(d => d._id === driverId);
      const latLng = positionToLatLng(driver?.position);
      if (latLng) {
        setHighlightedDriverId(driverId);
        mapRef.current.flyTo(latLng, 15);
      }
    }
  }));



  // Set initial user location and driver icon
  useEffect(() => {
    
    console.log("maps___________")
    console.log("availableDriversN: ",availableDrivers)
    const currentUser = getCurrentUser();
    setCurrentUser(currentUser);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPos([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );

      // Watch position changes
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Sending live location:", { latitude, longitude });
          sendLiveLocation({ latitude, longitude }, currentUser);
          setUserPos([latitude, longitude]);
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Initialize custom icons
  useEffect(() => {
    if (userRole === 'driver') {
      setDriverIcon(DriverMarkers.createDriverIcon?.());
      setUserMarker(DriverMarkers.createDriverIconDriver?.());
      setCustomerIcon(CustomerMarker.createUserIcon?.());
    } else {
      setUserMarker(UserMarker.createUserIcon?.());
      setDriverIcon(DriverMarkers.createDriverIcon?.());
    }
  }, [userRole]);

  // Fetch deliveries and routes
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        if (userRole === 'driver') {
          const driver = getCurrentUser();
          const driverId = driver?._id;
          const delivery = await axios.get(`${BASE_URL}/deliveries/driver/${driverId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          if (delivery.data.length > 0) {
            console.log("maps Delivery response________________________________:", delivery.data); // Log the response data
            console.log("location_____:",delivery.data[0].customerId.position.coordinates)
            setDeliveries(delivery.data);
            setCustomerLocation(delivery.data[0].customerId.position.coordinates);
          }
        }

        if (selectedDelivery?.restaurantId?.position && selectedDelivery?.customerId?.position) {
          const res = await axios.get(`http://localhost:3001/api/google/route`, {
            params: {
              origin: `${selectedDelivery.restaurantId.position.coordinates}`,
              destination: `${selectedDelivery.customerId.position.coordinates}`
            }
          });
          console.log("Route response________________________________:", res.data.route); // Log the route data
          setRoutePath(res.data.route);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchRoute();
  }, [userRole, selectedDelivery, setCustomerLocation]);

  // Rejoin this order's tracking room whenever the watched delivery changes, so
  // a page reload does not silently stop the live position updates.
  useEffect(() => {
    const orderId = selectedDelivery?.orderId ?? deliveries[0]?.orderId;
    if (orderId) subscribeToTracking(orderId);
  }, [selectedDelivery, deliveries, subscribeToTracking]);

  const trackedDriverPosition = toLatLng(driverLocation?.coordinates);

  // Handle driver focus from parent
  // useEffect(() => {
  //   if (onFocusDriver) {
  //     onFocusDriver.current = (driverId) => {
  //       const driver = availableDrivers.find(d => d._id === driverId);
  //       if (driver && driver.position && mapRef.current) {
  //         setHighlightedDriverId(driverId);
  //         mapRef.current.flyTo([driver.position.coordinates[0], driver.position.coordinates[1]], 15);
  //       }
  //     };
  //   }
  // }, [availableDrivers, onFocusDriver]);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <MapContainer
        center={userPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <UserMarker position={userPosition} icon={userMarker} user={currentUser} />
        
        <DriverMarkers 
          drivers={availableDrivers} 
          driverIcon={driverIcon} 
          highlightedDriverId={highlightedDriverId}
        />
        
        <RestaurantMarkers restaurants={restaurants} />
        
        {deliveries.map((delivery, index) => {
          const position =
            positionToLatLng(delivery.customerId?.position) || toLatLng(customerLocation);
          if (!position) return null;

          return (
            <CustomerMarker
              key={delivery._id ?? index}
              position={position}
              icon={customerIcon}
              customer={delivery.customerId}
            />
          );
        })}

        {/* The assigned driver, streamed into this order's tracking room. Only
            the customer waiting on this delivery receives these updates. */}
        {trackedDriverPosition && (
          <DriverMarkers
            drivers={[{ _id: 'tracked-driver', firstName: 'Your driver', position: { coordinates: driverLocation.coordinates } }]}
            driverIcon={driverIcon}
          />
        )}

        {routePath.length > 0 && (
          <Polyline positions={routePath} color="blue" weight={5} />
        )}

        {!isConnected && (
          <div className="connection-status">
            Reconnecting to server...
          </div>
        )}
      </MapContainer>
    </div>
  );
});

export default Map;