import React, { useMemo } from "react";

const BuildingIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="4" y="6" width="16" height="14" rx="2" fill="#4b3a2f" />
    <rect x="7" y="9" width="3" height="3" fill="#f2e6d8" />
    <rect x="14" y="9" width="3" height="3" fill="#f2e6d8" />
    <rect x="7" y="14" width="3" height="3" fill="#f2e6d8" />
    <rect x="14" y="14" width="3" height="3" fill="#f2e6d8" />
    <rect x="11" y="15" width="2" height="5" fill="#f2e6d8" />
  </svg>
);

function MiniMap({ userLocation, cafes, selectedCafeId, onSelectCafe }) {
  const points = useMemo(() => {
    const cafePoints = cafes
      .map((cafe) => {
        if (!cafe.location) return null;
        return {
          id: cafe.placeId,
          lat: cafe.location.lat,
          lng: cafe.location.lng,
          cafe,
        };
      })
      .filter(Boolean);

    const allPoints = userLocation
      ? [{ lat: userLocation.lat, lng: userLocation.lng }, ...cafePoints]
      : cafePoints;

    return { cafePoints, allPoints };
  }, [cafes, userLocation]);

  const bounds = useMemo(() => {
    if (!points.allPoints.length) return null;

    let minLat = points.allPoints[0].lat;
    let maxLat = points.allPoints[0].lat;
    let minLng = points.allPoints[0].lng;
    let maxLng = points.allPoints[0].lng;

    points.allPoints.forEach((point) => {
      minLat = Math.min(minLat, point.lat);
      maxLat = Math.max(maxLat, point.lat);
      minLng = Math.min(minLng, point.lng);
      maxLng = Math.max(maxLng, point.lng);
    });

    const paddingLat = Math.max((maxLat - minLat) * 0.2, 0.005);
    const paddingLng = Math.max((maxLng - minLng) * 0.2, 0.005);

    return {
      minLat: minLat - paddingLat,
      maxLat: maxLat + paddingLat,
      minLng: minLng - paddingLng,
      maxLng: maxLng + paddingLng,
    };
  }, [points.allPoints]);

  const toMiniMapPosition = (lat, lng) => {
    if (!bounds) return { left: "50%", top: "50%" };
    const spanLat = Math.max(bounds.maxLat - bounds.minLat, 0.0005);
    const spanLng = Math.max(bounds.maxLng - bounds.minLng, 0.0005);
    const x = (lng - bounds.minLng) / spanLng;
    const y = (bounds.maxLat - lat) / spanLat;
    return {
      left: `${Math.max(0, Math.min(1, x)) * 100}%`,
      top: `${Math.max(0, Math.min(1, y)) * 100}%`,
    };
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#fff8ee] to-[#f0dfc8] p-5 shadow-xl">
      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#fffaf3] via-[#f4e4cf] to-[#e9d5bc]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(75,58,47,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(75,58,47,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {!userLocation && (
          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-stone-600">
            Enable location to see cafes near you.
          </div>
        )}

        {userLocation && (
          <div className="relative z-10 h-full">
            <button
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={toMiniMapPosition(userLocation.lat, userLocation.lng)}
              aria-label="Your location"
              onClick={() => onSelectCafe(null)}
            >
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-600" />
              </span>
            </button>

            {points.cafePoints.map((point) => (
              <button
                key={point.id}
                type="button"
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={toMiniMapPosition(point.lat, point.lng)}
                aria-label={`Cafe: ${point.cafe.name}`}
                onClick={() => onSelectCafe(point.cafe)}
              >
                <span
                  className={`flex items-center justify-center rounded-full bg-white/90 p-2 shadow-lg transition ${
                    selectedCafeId === point.id
                      ? "scale-110 ring-2 ring-amber-500"
                      : "hover:scale-105"
                  }`}
                >
                  <BuildingIcon className="h-6 w-6" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiniMap;
