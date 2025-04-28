// src/components/CustomerMarker.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import person from '../banuka/img/person.png'; 

const CustomerMarker = ({ position, icon,customer }) => {
  if (!position) return null;
  console.log("position---",position)
  console.log("customer_______________________",customer);

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div>
          <strong>{customer.firstName}</strong>
          
          <p>Waiting for order</p>
        </div>
      </Popup>
    </Marker>
  );
};

// Static method to create the customer icon
CustomerMarker.createUserIcon = () => {
  return L.icon({
    iconUrl: person, // You can customize this image
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

export default CustomerMarker;
