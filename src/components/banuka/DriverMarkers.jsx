// src/components/DriverMarkers.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import car from '../banuka/img/car.png';
import driverPng from '../banuka/img/driver.png';
import { positionToLatLng } from '../../lib/geo';

const DriverMarkers = ({ drivers, driverIcon }) => {
  if (!driverIcon) return null;

  return drivers.map((driver) => {
    // Positions arrive as GeoJSON; Leaflet wants the opposite order. A driver
    // whose position has not been reported yet is skipped rather than dropped
    // at [0, 0].
    const position = positionToLatLng(driver.position);
    if (!position) return null;

    return (
      <Marker key={driver._id ?? driver.id} position={position} icon={driverIcon}>
        <Popup>
          <div>
            <strong>{driver.firstName}</strong>
            <p>Status: {driver.status || 'Available'}</p>
            <small>Last update: {new Date().toLocaleTimeString()}</small>
          </div>
        </Popup>
      </Marker>
    );
  });
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
    iconUrl: driverPng,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

export default DriverMarkers;
