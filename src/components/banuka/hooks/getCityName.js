export default async function getCityName(lat, lng) {
  console.log("lat, lng:", lat, lng);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    // if (!response.ok) {
    //   throw new Error(HTTP error! Status: ${response.status});
    // }

    const data = await response.json();
    const address = data.address || {};

    const road = address.road || '';
    const suburb = address.suburb || '';
    const city = address.city || address.town || address.village || '';
    const district = address.state_district || '';
    
    const cityName = [road, suburb, city].filter(Boolean).join(' ').trim();

    return cityName || district || 'Unknown location';
  } catch (error) {
    console.error('Failed to fetch city name:', error);
    return 'Unknown location';
  }
}