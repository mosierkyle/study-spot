const getMap = async () => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-120.6632,35.3037,12.65,0/300x200?access_token=pk.eyJ1IjoibW9zaWVya3lsZSIsImEiOiJjbHN0bXR5NGswMDRzMm1ycWZxdHE3cnpsIn0.WBrqwng_VnG7M3yg6AIo5g`
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
