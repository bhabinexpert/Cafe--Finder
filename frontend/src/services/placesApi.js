import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:2005";

export const getNearbyCafes = async ({ lat, lng, radiusMeters }) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/places/nearby`, {
      params: {
        lat,
        lng,
        radius: radiusMeters,
      },
    });

    return response.data.cafes || [];
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
};

export const getCafeDetails = async (placeId) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/places/details`, {
      params: { placeId },
    });

    return response.data.details;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
};
