import React from "react";

function Header({ locationReady, locationError, locationMeta }) {
  const coordsText = locationMeta
    ? `Lat ${locationMeta.lat.toFixed(5)}, Lng ${locationMeta.lng.toFixed(5)}`
    : "";
  const accuracyText =
    locationMeta?.accuracy != null
      ? `±${Math.round(locationMeta.accuracy)}m`
      : "";

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
          Cafe Finder
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900 md:text-4xl">
          Cafes near you, with real reviews.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-stone-600 md:text-base">
          Set your search radius, discover nearby cafes, and browse photos and
          feedback from other visitors.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
        {locationError && (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            {locationError}
          </span>
        )}
        {!locationError && !locationReady && (
          <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
            Waiting for location…
          </span>
        )}
        {locationReady && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Location ready
          </span>
        )}
        {locationMeta && (
          <div className="text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Live:</span> {coordsText}
            {accuracyText ? ` (${accuracyText})` : ""}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
