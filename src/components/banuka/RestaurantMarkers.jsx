import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import restuarentPng from '../banuka/img/restuarant.png';
import getCityName from './hooks/getCityName';
import { positionToLatLng } from '../../lib/geo';

const restaurantIcon = new L.Icon({
  iconUrl: restuarentPng,
  iconSize: [35, 35],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10]
});

export default function RestaurantMarkers({ restaurants }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchLocations() {
      const data = await Promise.all(
        restaurants.map(async (restaurant) => {
          // Reverse geocoding takes [lat, lng], the opposite of how the
          // position is stored.
          const latLng = positionToLatLng(restaurant.position);
          const city = latLng ? await getCityName(latLng[0], latLng[1]) : '';
          return { ...restaurant, cityName: city, latLng };
        })
      );

      if (!cancelled) setLocations(data);
    }

    if (restaurants.length > 0) {
      fetchLocations();
    }

    return () => {
      cancelled = true;
    };
  }, [restaurants]);

  return locations.map((restaurant) => {
    if (!restaurant.latLng) return null;

    return (
      <Marker
        key={restaurant._id}
        position={restaurant.latLng}
        icon={restaurantIcon}
      >
        <Popup>
          <div className="restaurant-popup">
            <h3>{restaurant.name}</h3>
            <p>City: {restaurant.cityName}</p>
            <strong>Contact:</strong> {restaurant.contact?.phone}
            <div className="cuisine-tags">
              {restaurant.cuisineType?.map((cuisine) => (
                <span key={cuisine} className="cuisine-tag">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}
