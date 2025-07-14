// src/components/ChildActionMenu.jsx
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChildActionMenu({
  child,
  showMenu,
  setShowMenu,
  onDeleteRequest,
}) {
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMenu]);

  return (
    <div className="md:hidden relative" ref={menuRef}>
      {/* כפתור “עוד” בפינה השמאלית-עליונה */}
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="
          absolute top-0 left-0
          bg-gray-100 hover:bg-gray-200
          text-gray-700 text-xs font-medium
          px-3 py-1 rounded-full
          transition
        "
      >
        עוד
      </button>

      {showMenu && (
        <div
          className="
            absolute top-8 left-0
            w-32 bg-white border border-gray-200
            rounded-md shadow-lg z-10
          "
        >
          <button
            onClick={() => {
              setShowMenu(false);
              navigate(`/edit-child/${child.id}`, { state: { child } });
            }}
            className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            ערוך
          </button>
          <button
            onClick={() => {
              setShowMenu(false);
              onDeleteRequest();
            }}
            className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            מחק
          </button>
        </div>
      )}
    </div>
  );
}
