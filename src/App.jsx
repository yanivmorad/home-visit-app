import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import ChildDetails from "./pages/ChildDetails";
import AddChild from "./pages/AddChild";
import EditChild from "./pages/EditChild";
import Unauthorized from "./pages/Unauthorized";
import { useChildren } from "./hooks/useChildren";
import { getAccessToken } from "./api/client";

export default function App() {
  let token;
  try {
    token = getAccessToken();
    console.log("Token from getAccessToken:", token);
    // בדיקה נוספת של תקינות הטוקן
    if (token && (typeof token !== "string" || token.trim() === "")) {
      console.error("Invalid token format:", token);
      token = null;
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    token = null;
  }

  // קריאה ל-useChildren תמיד מתבצעת
  const { data: allChildren = [], isLoading, error } = useChildren();
  console.log("useChildren data:", { allChildren, isLoading, error });

  // חישוב areas ו-categories תמיד מתבצע
  const areas = useMemo(() => {
    const result = Array.from(
      new Set(allChildren.map((c) => c?.area).filter(Boolean))
    );
    console.log("Computed areas:", result);
    return result;
  }, [allChildren]);

  const categories = useMemo(() => {
    const categoriesFromDB = allChildren
      .map((c) => c?.category)
      .filter(Boolean);
    const baseCategories = [
      "אומנה",
      "אימוץ",
      "פנימיה",
      "מרכז חירום",
      "צו ביניים",
      "ניזקקות",
    ];
    const result = Array.from(
      new Set([...categoriesFromDB, ...baseCategories])
    );
    console.log("Computed categories:", result);
    return result;
  }, [allChildren]);

  // טיפול במקרה של אין טוקן או טוקן לא תקין
  if (!token) {
    console.log("No valid token, redirecting to Unauthorized");
    return (
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    );
  }

  // טיפול בשגיאה של useChildren
  if (error) {
    console.error("Error in useChildren:", error);
    // הסר טוקן לא תקין
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_expiry");
    console.log("Removed invalid token, redirecting to Unauthorized");
    return (
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    );
  }

  // // טיפול במצב טעינה
  // if (isLoading) {
  //   console.log("useChildren is loading");
  //   return <div>Loading...</div>;
  // }

  console.log("Rendering Routes with allChildren:", allChildren);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/"
            element={
              <HomePage
                allChildren={allChildren}
                isLoading={isLoading}
                error={error}
                areas={areas}
              />
            }
          />
          <Route path="/child/:id" element={<ChildDetails />} />
          <Route
            path="/add-child"
            element={<AddChild areas={areas} categories={categories} />}
          />
          <Route
            path="/edit-child/:id"
            element={<EditChild areas={areas} categories={categories} />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Route>
    </Routes>
  );
}
