import React from "react";

function CafeList({ cafes, selectedCafeId, onSelectCafe }) {
  return (
    <div className="flex flex-col gap-3">
      {cafes.map((cafe) => (
        <button
          key={cafe.placeId}
          type="button"
          onClick={() => onSelectCafe(cafe)}
          className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition ${
            selectedCafeId === cafe.placeId
              ? "border-amber-400 bg-amber-50 shadow"
              : "border-stone-200 bg-white/80 hover:-translate-y-0.5 hover:shadow"
          }`}
        >
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              {cafe.name}
            </h3>
            <p className="text-sm text-stone-600">{cafe.vicinity}</p>
          </div>
          <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
            {cafe.rating || "N/A"}
          </span>
        </button>
      ))}
    </div>
  );
}

export default CafeList;
