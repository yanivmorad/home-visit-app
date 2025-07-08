// src/components/Layout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white shadow py-4">
        <div
          dir="rtl"
          className="container mx-auto flex justify-between items-center px-4"
        >
          {/* לוגו / כותרת */}
          <Link
            to="/"
            className="text-3xl font-bold text-primary-600 hover:underline"
          >
            פגישות קטינים
          </Link>

          {/* כפתור הוספת ילד — עיצוב עדין */}
          <Link
            to="/add-child"
            className="
              px-4 py-2
              bg-white
              text-blue-600
              border border-blue-200
              rounded-lg
              shadow-sm
              hover:bg-blue-50
              transition
            "
          >
            + הוספת ילד
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
