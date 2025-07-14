// /src/components/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../api/client";

export default function RequireAuth() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // בכל שינוי במסלול או ברענון נקרא ל־getAccessToken
  useEffect(() => {
    setLoading(true);
    const storedToken = getAccessToken();
    setToken(storedToken);
    setLoading(false);
  }, [location.key]); // location.key משתנה גם אחרי Navigate

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">טוען הרשאות...</p>
      </div>
    );
  }

  if (!token || token.trim() === "") {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location, reason: "missing" }}
      />
    );
  }

  return <Outlet />;
}
