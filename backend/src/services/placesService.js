import axios from "axios";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/lookup";

const osmHeaders = {
  "User-Agent": "CafeFinder/1.0 (local-dev)",
  "Accept-Language": "en",
};

const toPlaceId = (type, id) => `${type}-${id}`;

const mapOverpassElement = (element) => {
  const tags = element.tags || {};
  const location = element.lat
    ? { lat: element.lat, lng: element.lon }
    : element.center
    ? { lat: element.center.lat, lng: element.center.lon }
    : null;

  const name = tags.name || "Cafe";
  const vicinity =
    tags["addr:full"] ||
    [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]]
      .filter(Boolean)
      .join(" ") ||
    tags["addr:city"] ||
    tags["addr:street"] ||
    "";

  return {
    placeId: toPlaceId(element.type[0], element.id),
    name,
    vicinity,
    rating: null,
    userRatingsTotal: null,
    location,
    photoUrl: null,
  };
};

export const fetchNearbyCafes = async ({ lat, lng, radius }) => {
  const query = `[out:json];(node["amenity"="cafe"](around:${radius},${lat},${lng});way["amenity"="cafe"](around:${radius},${lat},${lng});relation["amenity"="cafe"](around:${radius},${lat},${lng}););out center tags;`;

  const response = await axios.post(OVERPASS_URL, query, {
    headers: osmHeaders,
  });

  const elements = response.data?.elements || [];
  return elements.map(mapOverpassElement).filter((cafe) => cafe.location);
};

export const fetchCafeDetails = async (placeId) => {
  const [typeLetter, idValue] = placeId.split("-");
  if (!typeLetter || !idValue) {
    throw new Error("Invalid placeId format");
  }

  const response = await axios.get(NOMINATIM_URL, {
    params: {
      osm_ids: `${typeLetter.toUpperCase()}${idValue}`,
      format: "json",
      addressdetails: 1,
      extratags: 1,
    },
    headers: osmHeaders,
  });

  const result = response.data?.[0];
  if (!result) {
    throw new Error("Cafe details not found");
  }

  const tags = result.extratags || {};

  return {
    placeId,
    name: result.display_name?.split(",")[0] || "Cafe",
    rating: null,
    userRatingsTotal: null,
    address: result.display_name || "",
    phone: tags.phone || tags["contact:phone"] || null,
    website: tags.website || tags["contact:website"] || null,
    location: result.lat && result.lon
      ? { lat: Number(result.lat), lng: Number(result.lon) }
      : null,
    openingHours: tags.opening_hours
      ? {
          openNow: null,
          weekdayText: [tags.opening_hours],
        }
      : null,
    photos: [],
    reviews: [],
  };
};
