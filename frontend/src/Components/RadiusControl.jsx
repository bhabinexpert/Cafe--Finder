import React from "react";

function RadiusControl({ radiusKm, onChange }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Radius
        </p>
        <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-semibold text-stone-700">
          {radiusKm} km
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={15}
        step={1}
        value={radiusKm}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-emerald-600"
      />
      <p className="text-xs text-stone-500">
        Drag to adjust how far we search for cafes near you.
      </p>
    </div>
  );
}

export default RadiusControl;
