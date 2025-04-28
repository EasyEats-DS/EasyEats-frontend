import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import restuarentPng from '../banuka/img/restuarant.png';

const restaurantIcon = new L.Icon({
  iconUrl: restuarentPng, // Path to your restaurant icon image
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10]
});

export default function RestaurantMarkers({ restaurants }) {
    console.log("Restaurants--", restaurants);
  return restaurants.map(restaurant => (
    
    <Marker
      key={restaurant._id}
      position={restaurant.position.coordinates}
      icon={restaurantIcon}
    >
      <Popup>
        <div className="restaurant-popup">
          <h4>{restaurant.name}</h4>
          <p>{restaurant.address.city}</p>
          <div className="cuisine-tags">
            {restaurant.cuisineType?.map(cuisine => (
              <span key={cuisine} className="cuisine-tag">{cuisine}</span>
            ))}
          </div>
          {/* <div className="rating">
            {'★'.repeat(Math.floor(restaurant.rating))}
            {'☆'.repeat(5 - Math.floor(restaurant.rating))}
          </div> */}
        </div>
      </Popup>
    </Marker>
  ));
}