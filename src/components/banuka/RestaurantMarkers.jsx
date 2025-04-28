import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import restuarentPng from '../banuka/img/restuarant.png';
import getCityName from './hooks/getCityName';

const restaurantIcon = new L.Icon({
  iconUrl: restuarentPng,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10]
});

export default function RestaurantMarkers({ restaurants }) {
  const [locations, setLocations] = useState([]);
  console.log("RestaurantMarkers restaurants-:", restaurants);

  useEffect(() => {
    async function fetchLocations() {
      const data = await Promise.all(
        restaurants.map(async (restaurant) => {
          const city = await getCityName(restaurant.position.coordinates[0],restaurant.position.coordinates[1]);
          return { ...restaurant, cityName: city };
        })
      );
      setLocations(data);
    }

    if (restaurants.length > 0) {
      fetchLocations();
    }
  }, [restaurants]);

  return locations.map((restaurant) => (
    console.log("RestaurantMarkers restaurant-:", restaurant),
    <Marker
      key={restaurant._id}
      position={restaurant.position.coordinates}
      icon={restaurantIcon}
    >
      <Popup>
        <div className="restaurant-popup">
          <h3>{restaurant.name}</h3>
          <p>City: {restaurant.cityName}</p>
          <strong>Contact:</strong> {restaurant.contact.phone}
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
  ));
}
