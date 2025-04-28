

export default async function getCityName   (lat, lng)  {
  console.log("lat, lng",lat,lng)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      console.log("City name response:", data.address.road,data.address.suburb,data.address.city);
      let cityName = data.address.road + ' , ' + data.address.suburb + ' , ' + data.address.city;
      return cityName || 'Unknown location';
    //   return data.address.city || data.address.town || data.address.village || 'Unknown location';
    } catch (error) {
      console.error('Failed to fetch city name:', error);
      return 'Unknown location';
    }
  };