import React, { useEffect, useState } from 'react';
import './DeliveryList.css';
import getCityName from '../banuka/hooks/getCityName';

const DeliveryList = ({ 
  deliveries, 
  selectedDelivery, 
  onSelectDelivery, 
  onStatusUpdate,
  userRole,
  onFocusDriver  
}) => {
  console.log("Deliveries:____", deliveries);
  const [cityMap, setCityMap] = useState({});
  const [expandedDelivery, setExpandedDelivery] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      const newCityMap = {};
      for (const delivery of deliveries) {
        try {
          if (delivery.customerId?.position) {
            const [lat, lng] = delivery.customerId.position.coordinates;
            const city = await getCityName(lat, lng);
            newCityMap[delivery._id] = city;
          }
        } catch (error) {
          console.error("Error fetching city name:", error);
          newCityMap[delivery._id] = "Location unavailable";
        }
      }
      setCityMap(newCityMap);
    };

    if (deliveries.length) fetchCities();
  }, [deliveries]);

  const handleContactDriver = (delivery, e) => {
    e.stopPropagation();
    if (delivery.driverId && delivery.driverId._id) {
      // Call the focus function with driver ID
      onFocusDriver(delivery.driverId._id);
    } else {
      alert('No driver assigned to this delivery yet');
    }
  };

  const handleStatusUpdate = (deliveryId, status, e) => {
    e.stopPropagation();
    if (onStatusUpdate) {
      onStatusUpdate(deliveryId, status);
    }
  };

  const toggleExpand = (deliveryId, e) => {
    e.stopPropagation();
    setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      in_progress: 'badge-in-progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled'
    };
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getActionButtons = (delivery) => {
    if (userRole === 'driver') {
      return (
        <>
          {delivery.deliveryStatus === 'assigned' && (
            <button 
              className="btn-start"
              onClick={(e) => handleStatusUpdate(delivery._id, 'in_progress', e)}
            >
              Start Delivery
            </button>
          )}
          
          {delivery.deliveryStatus === 'in_progress' && (
            <button 
              className="btn-complete"
              onClick={(e) => handleStatusUpdate(delivery._id, 'completed', e)}
            >
              Complete
            </button>
          )}
        </>
      );
    } else {
      return (
        <button 
          className="btn-contact"
          onClick={(e) => {
            handleContactDriver(delivery, e);
            // Implement contact driver functionality
          }}
        >
          {delivery.driverId ? 'Track Driver' : 'No Driver Assigned'}
        </button>
      );
    }
  };

  return (
    <div className="delivery-list">
      <h2>{userRole === 'driver' ? 'Your Assigned Deliveries' : 'Your Orders'}</h2>
      {deliveries.length === 0 ? (
        <div className="no-deliveries">
          {userRole === 'driver' ? 'No deliveries assigned' : 'No orders found'}
        </div>
      ) : (
        <div className="delivery-items">
          {deliveries.map(delivery => (
            <div 
              key={delivery._id}
              className={`delivery-item ${selectedDelivery?._id === delivery._id ? 'active' : ''}`}
              onClick={() => onSelectDelivery(delivery)}
            >
              <div className="delivery-header">
                <h3>Order #{delivery.orderId}</h3>
                {getStatusBadge(delivery.deliveryStatus)}
              </div>
              
              <div className="delivery-info">
                <p className="info-row">
                  <span className="info-label">
                    {userRole === 'driver' ? 'Customer:' : 'Restaurant:'}
                  </span>
                  <span>
                    {userRole === 'driver' 
                      ? delivery.customerId?.firstName || 'Unknown' 
                      : delivery.restaurantId?.name || 'Unknown'}
                  </span>
                </p>
                <p className="info-row">
                  {/* <span className="info-label">Location:</span>
                  <span>{cityMap[delivery._id] || 'Loading...'}</span> */}
                </p>
                
                {expandedDelivery === delivery._id && (
                  <div className="delivery-details">
                    {userRole === 'driver' && (
                      <p className="info-row">
                        <span className="info-label">Restaurant:</span>
                        <span>{delivery.restaurantId?.name || 'Unknown'}</span>
                      </p>
                    )}
                    <p className="info-row">
                      <span className="info-label">Created:</span>
                      <span>{new Date(delivery.createdAt).toLocaleString()}</span>
                    </p>
                    <p className="info-row">
                      <span className="info-label">Status:</span>
                      <span className="status-text">{delivery.deliveryStatus.replace('_', ' ')}</span>
                    </p>
                    {delivery.driverId && userRole === 'customer' && (
                      <p className="info-row">
                        <span className="info-label">Driver:</span>
                        <span>{delivery.driverId.firstName || 'Not assigned'}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="delivery-actions">
                <button 
                  className="btn-details"
                  onClick={(e) => toggleExpand(delivery._id, e)}
                >
                  {expandedDelivery === delivery._id ? 'Less' : 'More'} Details
                </button>
                {getActionButtons(delivery)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryList;