import { useState, useEffect } from "react";

export function useCurrentPosition() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) {
      if (!cancelled) setError(new Error("גיאולוקיישן אינו נתמך בדפדפן זה"));
      if (!cancelled) setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (cancelled) return;
        setPos({ lat: coords.latitude, lon: coords.longitude });
        setLoading(false);
      },
      (e) => {
        if (cancelled) return;
        setError(new Error("לא ניתן לקבל את המיקום הנוכחי: " + e.message));
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { pos, loading, error };
}
