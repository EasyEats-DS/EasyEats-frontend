// src/components/UserMarker.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import img from '../banuka/img/cus.png';

const UserMarker = ({ position, icon,user }) => {

  console.log("Current User:",user);
//   const userIcon = L.icon({
//     iconUrl: "https://storage.googleapis.com/traveller_app/0acbd3d5-000d-4e88-aea7-70ea93316511-3d-traveller-character-lying-on-big-gps-icon-png.png",
//     iconSize: [50, 50],
//     iconAnchor: [40, 60],
//   });

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <h3>{user.fullname?user.fullname:user.name}</h3>
        <p>You are here</p>
      </Popup>
    </Marker>
  );
};

UserMarker.createUserIcon = () => {
  return L.icon({
    //iconUrl: "https://storage.googleapis.com/traveller_app/0acbd3d5-000d-4e88-aea7-70ea93316511-3d-traveller-character-lying-on-big-gps-icon-png.png",
    iconUrl: img,
    iconSize: [50, 50],
    iconAnchor: [40, 60],
  });
};

export default UserMarker;