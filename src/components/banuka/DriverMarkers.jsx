// src/components/DriverMarkers.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import car from '../banuka/img/car.png';
import driver from '../banuka/img/driver.png';

const DriverMarkers = ({ drivers, driverIcon }) => {
  console.log("DriverMarkers drivers-:", drivers);
  if (!driverIcon) return null;
 

  return drivers.map(driver => (
    //console.log("DriverMarkers driver--:", driver),
    console.log(driver.position.coordinates),
    <Marker 
      key={driver.id} 
      position={driver.position.coordinates} 
      icon={driverIcon}
    >
      <Popup>
        <div>
          <strong>{driver.firstName}</strong>
          <p>Status: {driver.status || 'Available'}</p>
          <small>Last update: {new Date().toLocaleTimeString()}</small>
        </div>
      </Popup>
    </Marker>
  ));
};

// Helper function to create driver icon
DriverMarkers.createDriverIcon = () => {
  return L.icon({
    iconUrl: car,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

DriverMarkers.createDriverIconDriver = () => {
    return L.icon({
      iconUrl: driver,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

export default DriverMarkers;