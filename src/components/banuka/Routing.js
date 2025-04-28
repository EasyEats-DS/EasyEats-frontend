import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

// Custom car icon
const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744515.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Helper functions for bearing calculation
function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function toDeg(radians) {
  return radians * 180 / Math.PI;
}

function calculateBearing(start, end) {
  const startLat = toRad(start.lat);
  const startLng = toRad(start.lng);
  const endLat = toRad(end.lat);
  const endLng = toRad(end.lng);

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  let bearing = Math.atan2(y, x);
  bearing = toDeg(bearing);
  return (bearing + 360) % 360; // Normalize to 0-360
}

export default function Routing() {
  const map = useMap();
  const carMarkerRef = useRef(null);
  const routeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Create car marker if it doesn't exist
    if (!carMarkerRef.current) {
      carMarkerRef.current = L.marker([0, 0], { 
        icon: carIcon,
        rotationAngle: 0 
      }).addTo(map);
    }

    try {
      const waypoints = [
        L.latLng(9.3803, 80.377), // Start point
        L.latLng(6.1395, 80.1063)  // End point
      ];

      const routingControl = L.Routing.control({
        waypoints,
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
      }).addTo(map);

      routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        if (routes && routes[0]) {
          routeRef.current = routes[0];
          animateCarAlongRoute(routes[0]);
        }
      });

      return () => {
        map.removeControl(routingControl);
        if (carMarkerRef.current) {
          map.removeLayer(carMarkerRef.current);
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (error) {
      console.error("Error initializing routing:", error);
    }
  }, [map]);

  const animateCarAlongRoute = (route) => {
    const path = route.coordinates;
    let currentIndex = 0;
    const totalPoints = path.length;
    const duration = 30000; // 30 seconds for whole route
    let lastPosition = null;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentIndex = Math.min(Math.floor(progress * totalPoints), totalPoints - 1);

      if (currentIndex < totalPoints) {
        const currentPoint = path[currentIndex];
        carMarkerRef.current.setLatLng(currentPoint);

        // Calculate bearing if we have a previous position
        if (lastPosition && currentIndex > 0) {
          const bearing = calculateBearing(
            { lat: lastPosition.lat, lng: lastPosition.lng },
            { lat: currentPoint.lat, lng: currentPoint.lng }
          );
          carMarkerRef.current.setRotationAngle(bearing);
        }
        lastPosition = currentPoint;

        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return null;
}