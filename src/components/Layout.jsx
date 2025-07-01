// src/components/Layout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import SettingsBar from "./SettingsBar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white shadow py-4">
        {/* relative כדי שה־SettingsBar יוכל למקם את התפריט באופן מוחלט */}
        <div
          dir="rtl"
          className="container mx-auto relative flex justify-between items-center px-4"
        >
          {/* כותרת/HomeVisit */}
          <Link
            to="/"
            className="text-3xl font-bold text-primary-600 hover:underline"
          >
            HomeVisit
          </Link>

          {/* כפתורים: הוספת ילד + הגדרות */}
          <div className="flex items-center gap-4">
            {/* כפתור הוסף ילד */}
            <Link
              to="/add-child"
              className="
                px-3 py-1 bg-blue-600 text-white rounded 
                hover:bg-blue-700 transition
              "
            >
              + הוספת ילד
            </Link>

            {/* כפתור הגדרות */}
            <SettingsBar />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
