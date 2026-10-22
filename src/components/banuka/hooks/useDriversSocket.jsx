import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function useDriversSocket() {
  const [data, setData] = useState({
    drivers: [],
    availableDrivers: [],
    restaurants: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const [customerLocation, setCustomerLocation] = useState(null);

  const socketRef = useRef(null); // Store socket globally

  const userType = localStorage.getItem('userType');
  const loggedInDriver = userType === 'driver' ? JSON.parse(localStorage.getItem('driver')) : JSON.parse(localStorage.getItem('Customer'));

// ✅ Send location with global socket ref
  const sendLiveLocation = (location,user) => {
    console.log("sendLiveLocation-:socket", socketRef.current);
    if (socketRef.current) {
      console.log("Sending live location:", location," user :", user);
      socketRef.current.emit('live_location', { location,user });
    }
  };

  const status_update = (orderId) => {
    console.log("status_update-:socket", orderId);
    if (socketRef.current) {
      console.log("Sending status update:", orderId );
      console.log("socketRef.current-:", socketRef.current);
      try {
        socketRef.current.emit('status_update', { orderId });
      }
      catch (error) {
        console.error("Error sending status update:", error);
      }
      
    }
  };
  

  useEffect(() => {


    const getCityName = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || 'Unknown location';
      } catch (error) {
        console.error('Failed to fetch city name:', error);
        return 'Unknown location';
      }
    };


    const socket = io(`http://localhost:3001`, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket; // 💾 Store it in the ref

    const identifySocket = (targetSocket) => {
      const sock = targetSocket || socketRef.current;
      if (!sock || !sock.connected) return;
      const type = localStorage.getItem('userType');
      const user = type === 'driver'
        ? JSON.parse(localStorage.getItem('driver') || 'null')
        : JSON.parse(localStorage.getItem('Customer') || 'null');
      
      if (type && user?._id) {
        console.log('useDriversSocket: identifying as', type, user._id);
        sock.emit('identify', { role: type, id: user._id });
      }
    };

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WebSocket server');
    
      socket.emit('map:init');
      identifySocket(socket);
    });

    const handleAuthChange = () => {
      console.log('Auth change detected, re-identifying socket...');
      identifySocket(socket);
    };
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket server');
    });

    

    

    // Data events with error handling
    socket.on('map:init', (response) => {
      try {
       
        console.log("Logged in driver-:", loggedInDriver);
        if (!response) {
          throw new Error('No data received');
        }
    
        const drivers = Array.isArray(response.availableDrivers) ? response.availableDrivers : [];
        const restaurants = Array.isArray(response.restaurants) ? response.restaurants : [];
        console.log("Initial data:", response);
        console.log("drivers-:", drivers);
        console.log("restaurants-:", restaurants);
        console.log("userType-:", userType);

        let filteredDrivers;
        if(userType === 'driver' && loggedInDriver){
           filteredDrivers = loggedInDriver
          ? drivers.filter(d => d._id !== loggedInDriver._id)
          : drivers;   
        }else{
           filteredDrivers = drivers; 
        }

        console.log("filteredDrivers-:", filteredDrivers);
        const filterdDrivers = filteredDrivers.filter(d => d?.role === 'DELIVERY_PERSON');
            console.log("filterdDrivers1111:", filterdDrivers);
        setData({
          drivers,
          availableDrivers:filterdDrivers,//: filteredDrivers.filter(d => d?.status === 'available'),
          restaurants
        });

        console.log("drivers-N",data)


        
      } catch (err) {
        console.error('Error processing initial data:', err);
        setError(err);
      }
    });

    socket.on('location_updated', ({ userId, role, location }) => {
      console.log("Location updated111:", userId, role, location);
      setData(prevData => {
        let updatedDrivers = prevData.drivers;
        let updatedRestaurants = prevData.restaurants;
    
        if (role === 'DELIVERY_PERSON') {
          console.log("Location updated222:", userId, role, location);
          updatedDrivers = prevData.drivers.map(driver => {
            console.log("Location updated333:", driver._id, userId, role, location);
            if (driver._id === userId) {
              return {
                ...driver,
                position: {
                  type: 'Point',
                  coordinates: location
                }
              };
            }
            return driver;
          });
        }
    
        // If you want to handle customer location updates too:
        if (role === 'customer') {
          setCustomerLocation(location);
        }
        
        const updatedfilteredDrivers = updatedDrivers.filter(driver => driver._id !== loggedInDriver._id);
        const updatedDrivers1 = updatedfilteredDrivers.filter(driver => driver?.role === 'DELIVERY_PERSON');
        return {
          ...prevData,
          drivers: updatedDrivers,
          availableDrivers: updatedDrivers1,
          restaurants: updatedRestaurants
        };
      });
    });

    // socket.on('map:update', (response) => {
    //   try {
    //     if (!response) {
    //       throw new Error('No data received');
    //     }

    //     const drivers = Array.isArray(response.drivers) ? response.drivers : [];
    //     setData(prev => ({
    //       ...prev,
    //       drivers,
    //       availableDrivers: drivers.filter(d => d?.status === 'available')
    //     }));

    //   } catch (err) {
    //     console.error('Error processing update:', err);
    //     setError(err);
    //   }
    // });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err);
    });

    socket.on('new_order', async(order) => {
      console.log("New order received:", order);
      
      // CRITICAL: Only active drivers should receive and see new delivery requests!
      const currentRole = localStorage.getItem('userType');
      if (currentRole !== 'driver') {
        console.log("Ignoring new_order event: current user is not a driver:", currentRole);
        return;
      }

      const activeDriver = JSON.parse(localStorage.getItem('driver') || 'null');
      if (!activeDriver || !activeDriver._id) {
        console.log("Ignoring new_order event: driver profile not found in storage");
        return;
      }

      // Do NOT notify if the order was placed by this user
      const orderCusId = (order.userId || order.customer?._id || '').toString();
      if (orderCusId && orderCusId === activeDriver._id.toString()) {
        console.log("Ignoring new_order: driver is same as ordering customer");
        return;
      }

      const pickupLat = order.restaurant?.position?.coordinates?.[0];
      const pickupLng = order.restaurant?.position?.coordinates?.[1];
      const dropoffLat = order.customer?.position?.coordinates?.[0];
      const dropoffLng = order.customer?.position?.coordinates?.[1];

      let pickupCity = '';
      let dropoffCity = '';
      try {
        if (pickupLat && pickupLng) {
          pickupCity = await getCityName(pickupLat, pickupLng);
        }
        if (dropoffLat && dropoffLng) {
          dropoffCity = await getCityName(dropoffLat, dropoffLng);
        }
      } catch (geoErr) {
        console.warn('Geocoding lookup warning:', geoErr);
      }

      const dropoffDisplay = order.deliveryAddress 
        || (dropoffCity && dropoffCity !== 'Unknown location' ? dropoffCity : '') 
        || order.customer?.address?.street 
        || 'Delivery Location';

      const customerDisplayName = order.customer?.firstName 
        ? `${order.customer.firstName} ${order.customer.lastName || ''}`.trim()
        : 'Customer';

      toast.info(
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#2c2c2c',
          padding: '10px 5px',
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
            New delivery request from <span style={{ color: '#00c569' }}>{customerDisplayName}</span>
          </p>
          <p style={{ margin: '4px 0' }}> <strong>Pick-up:</strong> {order.restaurant?.name || 'Restaurant'}{pickupCity && pickupCity !== 'Unknown location' ? `, ${pickupCity}` : ''}</p>
          <p style={{ margin: '4px 0' }}> <strong>Drop-off:</strong> {dropoffDisplay}</p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#555' }}>
            <strong>Total:</strong> USD {Number(order.totalAmount || 0).toFixed(2)} ({order.paymentMethod === 'card' ? '💳 Paid Online (Stripe)' : '💵 Cash on Delivery'})
          </p>
      
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => {
                const freshDriver = JSON.parse(localStorage.getItem('driver') || '{}');
                socket.emit('accept_order', { driver: freshDriver, order });
                toast.dismiss();
                toast.success("Order accepted! Delivery assigned to you.");
                window.dispatchEvent(new Event('driverOrderAccepted'));
              }}
              style={{
                padding: '7px 16px',
                backgroundColor: '#00c569',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Accept
            </button>
            <button
              onClick={() => toast.dismiss()}
              style={{
                padding: '7px 16px',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Decline
            </button>
          </div>
        </div>,
        { autoClose: false, closeOnClick: false }
      );
    });

    socket.on('order_assigned_driver', ({ order }) => {
      console.log("Order assigned to this driver via socket:", order);
      window.dispatchEvent(new Event('driverOrderAccepted'));
    });

    socket.on('order_assigned', ({ name, order }) => {
      toast.success(
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#2c2c2c',
          padding: '10px 5px',
        }}>
          🎉 Order Accepted!  
          <p style={{ margin: '5px 0', fontWeight: 600 }}>
            Driver <span style={{ color: '#00c569' }}>{name}</span> is on the way!
          </p>
        </div>,
        { position: "top-right", autoClose: 4000, hideProgressBar: false }
      );
    });

    socket.on('customer_location', ({ cus, coords }) => {
      setCustomerLocation(coords);
      console.log("Customer location:", cus, coords);
    });

    socket.on('order_status_updated',(orderId) =>{
      console.log("Order status updated:", orderId.orderId.orderId);
      const status = orderId.orderId.deliveryStatus;
      toast.success(
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#2c2c2c',
          padding: '10px 5px',
        }}>
          🎉 Order Status Updated!  
          <p style={{ margin: '5px 0', fontWeight: 600 }}>
            Order Status Updated : <span style={{ color: '#00c569' }}>{status}</span> !
          </p>
        </div>,
        { position: "top-right", autoClose: 4000, hideProgressBar: false }
      );
    })

  

    // Request initial data after connection
    // socket.on('connect', () => {
    //   socket.emit('map:init');
    //   socket.emit('identify', { role: userType, id: loggedInDriver?._id });

    // });

    // Cleanup
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('map:init');
      socket.off('map:update');
      socket.off('error');
      socket.off('new_order');
      socket.off('order_assigned');
      socket.off('order_assigned_driver');
      socket.off('customer_location');
      socket.off('identify');
      socket.off('live_location');
      socket.off('status_update');
      socketRef.current = null; // Clear the ref
      socket.disconnect();
    };
  }, []);

  return { 
    ...data,
    isConnected,
    customerLocation,
    setCustomerLocation,
    sendLiveLocation,
    status_update,
    error
  };
}