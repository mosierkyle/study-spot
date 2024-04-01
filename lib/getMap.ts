const getMap = async () => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-120.6632,35.3037,12.65,0/300x200?access_token=${process.env.MAPBOX_KEY}`
    );
    const data = response.body;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching map', error);
    return null;
  }
};

export default getMap;
