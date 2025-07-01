// src/components/SettingsBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SettingsBar() {
  const [open, setOpen] = useState(false);

  return (
    <div dir="rtl" className="relative text-right mb-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ⚙️ הגדרות
      </button>

      {open && (
        <div className="absolute mt-2 right-0 bg-white rounded shadow p-2 space-y-1 w-40">
          <Link
            to="/add-child"
            className="block px-3 py-1 hover:bg-gray-100 rounded"
            onClick={() => setOpen(false)}
          >
            הוסף ילד
          </Link>
        </div>
      )}
    </div>
  );
}
