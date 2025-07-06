// src/hooks/useDistance.js
import { useState, useEffect, useRef } from "react";
import pLimit from "p-limit";

// הגבלת קריאות API ל-5 במקביל
const limit = pLimit(5);
// מטמון לתוצאות גיאוקוד
const cache = new Map();

/**
 * חישוב מרחק Haversine בין שתי נקודות
 * @param {Object} coord1 - { lat, lon }
 * @param {Object} coord2 - { lat, lon }
 * @returns {number} - מרחק בק"מ, מעוגל לעשירית
 */
function haversineDistance(coord1, coord2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lon - coord1.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * גיאוקוד כתובת עם fallback ורמת דיוק גבוהה
 * @param {string} address
 * @param {AbortSignal} signal
 * @returns {Promise<Object|null>} - { lat, lon } או null
 */
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

/**
 * חישוב מרחק מכתובת למיקום
 * @param {string} address
 * @param {Object} currentCoords - { lat, lon }
 * @param {AbortSignal} signal
 * @returns {Promise<number|null>}
 */
async function geocodeAndCalc(address, currentCoords, signal) {
  const target = await geocodeAddress(address, signal);
  if (!target) return null;
  return haversineDistance(currentCoords, target);
}

/**
 * Hook לחישוב מרחק מדויק יותר
 * @param {string} address
 * @param {Object} currentCoords - { lat, lon }
 * @param {Object} [opts]
 * @param {boolean} opts.highAccuracy - להשתמש ב-GPS מדויק
 * @returns {{ distanceKm: number|null, loading: boolean, error: Error|null }}
 */
export function useDistanceTo(address, currentCoords, opts = {}) {
  const { highAccuracy = true } = opts;
  const [distanceKm, setDistanceKm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortCtrl = useRef(null);

  useEffect(() => {
    if (!address || !currentCoords) {
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
        // אופציונלי: בקשת מיקום מדויק יותר
        if (highAccuracy && navigator.geolocation) {
          await new Promise((res, rej) =>
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                currentCoords.lat = pos.coords.latitude;
                currentCoords.lon = pos.coords.longitude;
                res();
              },
              rej,
              { enableHighAccuracy: true, timeout: 10000 }
            )
          );
        }
        const dist = await limit(() =>
          geocodeAndCalc(address, currentCoords, controller.signal)
        );
        if (!cancelled) setDistanceKm(dist);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [address, currentCoords, highAccuracy]);

  return { distanceKm, loading, error };
}
