// src/hooks/useCurrentPosition.js

import { useState, useEffect } from "react";

export function useCurrentPosition() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("גיאולוקיישן אינו נתמך בדפדפן זה"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPos({ lat: coords.latitude, lon: coords.longitude });
      },
      (e) => {
        setError(new Error("לא ניתן לקבל את המיקום הנוכחי: " + e.message));
      },
      { timeout: 10000, maximumAge: 60000 } // מגבלת זמן של 10 שניות, מטמון של 60 שניות
    );
  }, []);

  return { pos, error };
}
