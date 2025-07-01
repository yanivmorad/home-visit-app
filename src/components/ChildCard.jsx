// src/components/ChildCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ChildCard({ child }) {
  const [userPos, setUserPos] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setUserPos({ lat: coords.latitude, lng: coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => {
    if (!userPos || child.lat == null || child.lng == null) return;
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(child.lat - userPos.lat);
    const dLon = toRad(child.lng - userPos.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userPos.lat)) *
        Math.cos(toRad(child.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistance((R * c).toFixed(1));
  }, [userPos, child.lat, child.lng]);

  return (
    <Link
      to={`/child/${child.id}`}
      dir="rtl"
      className="
        block bg-white rounded-lg shadow p-4 
        hover:scale-105 hover:shadow-md transition 
        text-right
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-primary-600">
            {child.name}
          </h2>

          {/* מרחק אם חושב */}
          {!distance && (
            <p className="text-neutral-400 text-xs mt-1">מרחק לא זמין</p>
          )}
          {distance && (
            <p className="text-neutral-500 text-sm mt-1">
              מרחק: {distance} ק״מ
            </p>
          )}

          {/* עיר */}
          {child.city && (
            <p className="text-neutral-500 text-sm">עיר: {child.city}</p>
          )}

          {/* פגישה אחרונה */}
          {child.lastVisit && (
            <p className="text-neutral-400 text-xs mt-1">
              פגישה אחרונה: {child.lastVisit}
            </p>
          )}
        </div>

        {child.urgent && (
          <span className="text-red-600 font-bold self-start">דחוף!</span>
        )}
      </div>
    </Link>
  );
}
