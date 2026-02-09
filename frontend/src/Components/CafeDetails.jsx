import React from "react";

function CafeDetails({ details, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white/90 p-6 shadow">
        <p className="text-stone-600">Loading cafe details...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="rounded-3xl bg-white/90 p-6 shadow">
        <p className="text-stone-600">
          Select a cafe to see details, photos, and reviews.
        </p>
      </div>
    );
  }

  const addressText = details.address || details.vicinity || "";

  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">
            {details.name}
          </h2>
          {addressText && (
            <p className="text-sm text-stone-600">{addressText}</p>
          )}
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          {details.rating || "N/A"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-stone-600">
        {details.phone && <p>☎ {details.phone}</p>}
        {details.website && (
          <a
            href={details.website}
            target="_blank"
            rel="noreferrer"
            className="text-amber-700 underline"
          >
            Visit website
          </a>
        )}
        {details.openingHours?.weekdayText?.length > 0 && (
          <div>
            <p className="font-semibold text-stone-700">Opening hours</p>
            <ul className="mt-1 list-disc pl-5">
              {details.openingHours.weekdayText.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold text-stone-800">Photos</h3>
        {details.photos?.length ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {details.photos.map((url) => (
              <img
                key={url}
                src={url}
                alt={details.name}
                className="h-28 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-stone-500">No photos available.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold text-stone-800">Reviews</h3>
        {details.reviews?.length ? (
          <div className="mt-3 space-y-3">
            {details.reviews.slice(0, 4).map((review) => (
              <div key={`${review.authorName}-${review.relativeTimeDescription}`}>
                <p className="text-sm font-semibold text-stone-700">
                  {review.authorName} • {review.rating}⭐
                </p>
                <p className="text-sm text-stone-600">{review.text}</p>
                <p className="text-xs text-stone-400">
                  {review.relativeTimeDescription}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-stone-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default CafeDetails;
