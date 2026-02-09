import { Router } from "express";
import {
  fetchCafeDetails,
  fetchNearbyCafes,
} from "../services/placesService.js";

const router = Router();

router.get("/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const radiusMeters = Number.isFinite(radius) ? radius : 5000;
    const safeRadius = Math.min(Math.max(radiusMeters, 500), 50000);

    const cafes = await fetchNearbyCafes({ lat, lng, radius: safeRadius });

    return res.json({ cafes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/details", async (req, res) => {
  try {
    const placeId = req.query.placeId;
    if (!placeId) {
      return res.status(400).json({ error: "placeId is required" });
    }

    const details = await fetchCafeDetails(placeId);
    return res.json({ details });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
