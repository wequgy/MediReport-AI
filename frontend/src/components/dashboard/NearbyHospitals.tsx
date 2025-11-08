import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 🧭 Fix missing marker icons
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

// 🧍 Red marker for user location
const userLocationIcon = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 🏥 Blue marker for hospitals
const hospitalIcon = L.icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const NearbyHospitals = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧮 Simple distance function (Haversine)
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 📍 Get location & nearby hospitals
  useEffect(() => {
    const fetchHospitals = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://overpass-api.de/api/interpreter?data=[out:json];
           node["amenity"="hospital"](around:10000,${lat},${lon});
           out;`
        );
        const data = await res.json();

        // Clean + distance-sort + limit to 10
        const places = data.elements
          .map((el: any) => ({
            id: el.id,
            name: el.tags.name || "Unnamed Hospital",
            lat: el.lat,
            lon: el.lon,
            address: el.tags["addr:full"] || el.tags["addr:street"] || "No address",
            distance: getDistanceKm(lat, lon, el.lat, el.lon),
          }))
          .filter((h: any) => h.distance <= 10)
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, 10);

        setHospitals(places);
      } catch (err) {
        console.error("❌ Error fetching hospitals:", err);
      } finally {
        setLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setPosition([lat, lon]);
            fetchHospitals(lat, lon);
          },
          (err) => {
            console.error("Geolocation error:", err);
            setPosition([19.0760, 72.8777]); // fallback: Mumbai
            fetchHospitals(19.0760, 72.8777);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        console.warn("Geolocation not supported, using default.");
        setPosition([19.0760, 72.8777]);
        fetchHospitals(19.0760, 72.8777);
      }
    };

    getUserLocation();
  }, []);

  // 🧭 Directions link
  const handleDirections = (lat: number, lon: number) => {
    if (position) {
      const [userLat, userLon] = position;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${lat},${lon}`;
      window.open(url, "_blank");
    }
  };

  if (loading) return <p className="text-center mt-10">📡 Finding hospitals near you...</p>;
  if (!position) return <p className="text-center mt-10">⚠ Unable to get location</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Hospitals</h1>
        <p className="text-gray-600">Healthcare facilities within 10 km of your location</p>
      </div>

      {/* 🗺 Compact Map Section */}
      <div className="h-[40vh] w-full rounded-xl overflow-hidden shadow-md">
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={userLocationIcon}>
            <Popup>📍 You are here</Popup>
          </Marker>
          {hospitals.map((h) => (
            <Marker key={h.id} position={[h.lat, h.lon]} icon={hospitalIcon}>
              <Popup>
                <b>{h.name}</b>
                <br />
                {h.address}
                <br />
                <span className="text-sm text-gray-600">{h.distance.toFixed(1)} km away</span>
                <br />
                <Button
                  size="sm"
                  className="mt-2 bg-sky-500 text-white hover:bg-sky-600"
                  onClick={() => handleDirections(h.lat, h.lon)}
                >
                  <Navigation className="h-4 w-4 mr-1" /> Get Directions
                </Button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 📋 Hospital List */}
      <Card className="border-sky-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-sky-500" />
            Hospitals within 10 km
          </CardTitle>
          <CardDescription>Showing closest facilities to your location</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {hospitals.length === 0 ? (
            <p className="text-gray-600 text-center">No hospitals found nearby.</p>
          ) : (
            hospitals.map((h) => (
              <div
                key={h.id}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{h.name}</p>
                  <p className="text-sm text-gray-600">
                    {h.address} • {h.distance.toFixed(1)} km away
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sky-600 hover:bg-sky-50"
                  onClick={() => handleDirections(h.lat, h.lon)}
                >
                  Get Directions
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyHospitals;
