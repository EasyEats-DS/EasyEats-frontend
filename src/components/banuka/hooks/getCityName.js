

export default async function getCityName   (lat, lng)  {
  console.log("lat, lng",lat,lng)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      console.log("11111111111111", data.address);
      console.log("City name response:", data.address.road,data.address.suburb,data.address.city);
      let sub = data.address.suburb?data.address.suburb:" ";
      let cit = data.address.city?data.address.city:" ";

      let district = data.address.state_district;
      let cityName = data.address.road + '  ' + sub + '  ' + cit;
      return cityName?.trim() ? cityName : district || 'Unknown locationsss';
    //   return data.address.city || data.address.town || data.address.village || 'Unknown location';
    } catch (error) {
      console.error('Failed to fetch city name:', error);
      return 'Unknown locationEEEEEE';
    }
  };