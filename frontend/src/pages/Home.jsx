import React, { useEffect, useMemo, useState } from "react";
import CafeDetails from "../Components/CafeDetails.jsx";
import CafeList from "../Components/CafeList.jsx";
import Header from "../Components/Header.jsx";
import MiniMap from "../Components/MiniMap.jsx";
import RadiusControl from "../Components/RadiusControl.jsx";
import { getCafeDetails, getNearbyCafes } from "../services/placesApi.js";

function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationMeta, setLocationMeta] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [selectedCafeDetails, setSelectedCafeDetails] = useState(null);
  const [isLoadingCafes, setIsLoadingCafes] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(nextLocation);
        setLocationMeta({
          ...nextLocation,
          accuracy: position.coords.accuracy,
          updatedAt: new Date(),
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission denied.");
        } else {
          setLocationError("Unable to fetch location.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    let isActive = true;
    setIsLoadingCafes(true);
    setFetchError("");

    getNearbyCafes({
      lat: userLocation.lat,
      lng: userLocation.lng,
      radiusMeters: radiusKm * 1000,
    })
      .then((data) => {
        if (!isActive) return;
        setCafes(data);
      })
      .catch((error) => {
        if (!isActive) return;
        setFetchError(error.message || "Failed to load cafes.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingCafes(false);
      });

    return () => {
      isActive = false;
    };
  }, [userLocation, radiusKm]);

  useEffect(() => {
    if (!cafes.length) {
      setSelectedCafeId(null);
      setSelectedCafeDetails(null);
      return;
    }

    if (selectedCafeId && cafes.some((cafe) => cafe.placeId === selectedCafeId)) {
      return;
    }

    setSelectedCafeId(null);
    setSelectedCafeDetails(null);
  }, [cafes, selectedCafeId]);

  const selectedCafe = useMemo(
    () => cafes.find((cafe) => cafe.placeId === selectedCafeId) || null,
    [cafes, selectedCafeId]
  );

  const handleSelectCafe = async (cafe) => {
    if (!cafe) {
      setSelectedCafeId(null);
      setSelectedCafeDetails(null);
      return;
    }

    setSelectedCafeId(cafe.placeId);
    setIsLoadingDetails(true);

    try {
      const details = await getCafeDetails(cafe.placeId);
      setSelectedCafeDetails(details);
    } catch (error) {
      setFetchError(error.message || "Failed to load cafe details.");
      setSelectedCafeDetails(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f2e8] text-stone-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <Header
          locationReady={Boolean(userLocation)}
          locationError={locationError}
          locationMeta={locationMeta}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <MiniMap
              userLocation={userLocation}
              cafes={cafes}
              selectedCafeId={selectedCafeId}
              onSelectCafe={handleSelectCafe}
            />

            <RadiusControl radiusKm={radiusKm} onChange={setRadiusKm} />

            {fetchError && (
              <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-800">
                {fetchError}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white/90 p-5 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900">
                  Nearby Cafes
                </h2>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                  {cafes.length}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                Showing results within {radiusKm} km.
              </p>
              <div className="mt-4 max-h-[360px] overflow-y-auto pr-2">
                {isLoadingCafes ? (
                  <p className="text-sm text-stone-500">Loading cafes...</p>
                ) : cafes.length ? (
                  <CafeList
                    cafes={cafes}
                    selectedCafeId={selectedCafeId}
                    onSelectCafe={handleSelectCafe}
                  />
                ) : (
                  <p className="text-sm text-stone-500">
                    No cafes found within this radius.
                  </p>
                )}
              </div>
            </div>

            <CafeDetails
              details={selectedCafeDetails || selectedCafe}
              isLoading={isLoadingDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;