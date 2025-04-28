// src/pages/DeliveryTrackingPage.jsx
import { useState, useEffect,useRef } from 'react';
import MapComponent from '../../components/banuka/Maps';
import DeliveryList from '../../components/banuka/DeliveryList';
import axios from 'axios';
import './DeliveryTrackingPage.css';
import useDriversSocket from '../../components/banuka/hooks/useDriversSocket';
const BASE_URL = import.meta.env.VITE_BASE_URL;


const DeliveryTrackingPage = ({ userRole }) => {

  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [highlightedDriver, setHighlightedDriver] = useState(null);
  const currentUser = userRole === 'driver' 
    ? JSON.parse(localStorage.getItem('driver')) 
    : JSON.parse(localStorage.getItem('Customer'));
  
    const token = localStorage.getItem('authToken');
    console.log("token_______:", token);
    console.log("Current User:", currentUser);

    const {availableDrivers} = useDriversSocket();
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
        setSelectedDelivery(response.data[0]); // Auto-select first delivery
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

  const fetchRoute = async () => {
    console.log("Fetching route for delivery:", selectedDelivery); // Log the selected delivery ID
    if (!selectedDelivery || !selectedDelivery.restaurantId?.position || !selectedDelivery.customerId?.position) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/api/google/route`,
        {
          params: {
            origin: `${selectedDelivery.restaurantId.position.coordinates}`,
            destination: `${selectedDelivery.customerId.position.coordinates}`
          }
        }
      );
      setRoutePath(response.data.route);
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  useEffect(() => {
    
    fetchDeliveries();
  }, [currentUser._id, userRole]);

  useEffect(() => {
    fetchRoute();
  }, [selectedDelivery]);

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

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your deliveries...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="delivery-tracking-container">
      <div className="map-container">
        <MapComponent 
        ref={mapRef}  // <-- add this!
          userRole={userRole}
          customDeliveries={deliveries}
          selectedDelivery={selectedDelivery}
          //routePath={routePath}
          //currentUser={currentUser}
          highlightedDriver={highlightedDriver}
        />
      </div>
      
      <div className="delivery-list-container">
        <DeliveryList 
          deliveries={deliveries}
          selectedDelivery={selectedDelivery}
          onSelectDelivery={handleDeliverySelect}
          onStatusUpdate={userRole === 'driver' ? handleStatusUpdate : null}
          userRole={userRole}
          onFocusDriver={handleFocusDriver}
        />
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;