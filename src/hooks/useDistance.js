// src/hooks/useDistance.js
import { useState, useEffect } from "react";

export function useDistanceTo(address) {
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address || !navigator.geolocation) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // 1. Geocode הכתובת (OpenStreetMap Nominatim)
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              address
            )}`
          );
          if (!geoRes.ok) throw new Error("Geocode failed");
          const geoData = await geoRes.json();
          if (!geoData.length) throw new Error("No geocode results");

          const { lat: latStr, lon: lonStr } = geoData[0];
          const lat = parseFloat(latStr);
          const lon = parseFloat(lonStr);

          // 2. חישוב Haversine
          const toRad = (v) => (v * Math.PI) / 180;
          const R = 6371; // km
          const dLat = toRad(lat - coords.latitude);
          const dLon = toRad(lon - coords.longitude);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(coords.latitude)) *
              Math.cos(toRad(lat)) *
              Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const dist = (R * c).toFixed(1);

          if (!cancelled) setDistance(dist);
        } catch (err) {
          if (!cancelled) setError(err);
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      (err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [address]);

  return { distance, loading, error };
}
