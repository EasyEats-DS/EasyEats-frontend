import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Map() {
  const position = [6.1688, 80.1794];
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const customIcon = L.icon({
      iconUrl: "https://storage.googleapis.com/traveller_app/0acbd3d5-000d-4e88-aea7-70ea93316511-3d-traveller-character-lying-on-big-gps-icon-png.png",
      iconSize: [50, 50],
      iconAnchor: [40, 60],
    });
    setIcon(customIcon);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[7.8731, 80.7718]} 
        zoom={8} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {icon && (
          <Marker position={position} icon={icon}>
            <Popup>
              <p>username</p>
            </Popup>
          </Marker>
        )}
       
      </MapContainer>
    </div>
  );
}