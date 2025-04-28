import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export default function Routing() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    try {
      const waypoints = [
        L.latLng(9.3803, 80.377), 
        L.latLng(6.1395, 80.1063)
      ];
      
      const routingControl = L.Routing.control({
        waypoints,
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
      }).addTo(map);

    //   return () => {
    //     map.removeControl(routingControl);
    //   };
    } catch (error) {
      console.error("Error initializing routing:", error);
    }
  }, [map]);

  return null;
}