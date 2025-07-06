import { useState, useEffect, useRef } from "react";
import pLimit from "p-limit";

const limit = pLimit(5);
const cache = new Map();

function haversineDistance(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const c =
    2 *
    Math.atan2(
      Math.sqrt(
        Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(a.lat)) *
            Math.cos(toRad(b.lat)) *
            Math.sin(dLon / 2) ** 2
      ),
      Math.sqrt(
        1 -
          (Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a.lat)) *
              Math.cos(toRad(b.lat)) *
              Math.sin(dLon / 2) ** 2)
      )
    );
  return parseFloat((R * c).toFixed(1));
}

async function geocodeAddress(address, signal) {
  if (cache.has(address)) return cache.get(address);
  const variants = [
    address,
    address.replace(/\d+/, "").trim(),
    address.split(" ").slice(-1)[0],
  ];

  for (const addr of variants) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addr
        )}`,
        {
          signal,
          headers: { "User-Agent": "MyApp/1.0 (your-email@example.com)" },
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.length) {
        const coords = { lat: +data[0].lat, lon: +data[0].lon };
        cache.set(address, coords);
        return coords;
      }
    } catch (e) {
      if (e.name === "AbortError") throw e;
      console.warn(`Geocode failed for '${addr}':`, e.message);
    }
  }

  return null;
}

async function geocodeAndCalc(address, currentCoords, signal) {
  const target = await geocodeAddress(address, signal);
  if (!target) return null;
  return haversineDistance(currentCoords, target);
}

export function useDistanceTo(
  address,
  currentCoords,
  opts = { highAccuracy: true }
) {
  const { highAccuracy } = opts;
  const [distanceKm, setDistanceKm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortCtrl = useRef(null);
  const { lat: initialLat, lon: initialLon } = currentCoords || {};

  useEffect(() => {
    if (!address || initialLat == null || initialLon == null) {
      setDistanceKm(null);
      setLoading(false);
      return;
    }

    abortCtrl.current?.abort();
    const controller = new AbortController();
    abortCtrl.current = controller;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        // בונים אובייקט חדש במקום לשנות props
        let coords = { lat: initialLat, lon: initialLon };

        if (highAccuracy && navigator.geolocation) {
          const pos = await new Promise((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, {
              enableHighAccuracy: true,
              timeout: 10000,
            })
          );
          coords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
        }

        const dist = await limit(() =>
          geocodeAndCalc(address, coords, controller.signal)
        );

        if (!cancelled) {
          setDistanceKm(dist);
        }
      } catch (e) {
        // מתעלמים מ-AbortError
        if (!cancelled && e.name !== "AbortError") {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [address, initialLat, initialLon, highAccuracy]);

  return { distanceKm, loading, error };
}
