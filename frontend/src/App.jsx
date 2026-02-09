import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);

  // 1️⃣ Get user's live location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Location permission denied");
      }
    );
  }, []);

  return (
    <div>
      <h1>☕ Cafe Near Me</h1>

      <LoadScript googleMapsApiKey= "AIzaSyAyBFiCXe7zs3jUWQGku5oWEIguJ3ekJgk" libraries={["places"]}>
        {userLocation && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={14}
          >

            {/* User Location Marker */}
            <Marker position={userLocation} />
            useEffect(() => {
  if (!userLocation) return;

  const service = new window.google.maps.places.PlacesService(
    document.createElement("div")
  );

  service.nearbySearch(
    {
      location: userLocation,
      radius: 3000, // 3 km
      type: "cafe",
    },
    (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setCafes(results);
      }
    }
  );
}, [userLocation]);

{cafes.map((cafe) => (
  <Marker
    key={cafe.place_id}
    position={{
      lat: cafe.geometry.location.lat(),
      lng: cafe.geometry.location.lng(),
    }}
    icon={{
      url: "https://maps.google.com/mapfiles/ms/icons/coffeehouse.png",
    }}
    onClick={() => setSelectedCafe(cafe)}
  />
  
))}
{selectedCafe && (
  <InfoWindow
    position={{
      lat: selectedCafe.geometry.location.lat(),
      lng: selectedCafe.geometry.location.lng(),
    }}
    onCloseClick={() => setSelectedCafe(null)}
  >
    <div>
      <h3>{selectedCafe.name}</h3>
      <p>{selectedCafe.vicinity}</p>
      <p>⭐ Rating: {selectedCafe.rating || "N/A"}</p>
    </div>
  </InfoWindow>
)}



          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
}

export default App;
