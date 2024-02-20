const getLatLong = async (address: string) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_KEY}`
    );
    const data = await response.json();
    const latLong = data.features[0].geometry.coordinates;
    console.log(latLong[1], latLong[0]);
    return latLong;
  } catch (error) {
    console.error('Error fetching latitude and longitude:', error);
    return null;
  }
};

export default getLatLong;
