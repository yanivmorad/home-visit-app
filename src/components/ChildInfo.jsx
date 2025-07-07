// src/components/ChildInfo.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteChild } from "../hooks/useChildren";

export default function ChildInfo({ child, onDelete }) {
  const navigate = useNavigate();

  // גיל
  const age = useMemo(() => {
    if (!child.birthDate) return null;
    const birth = new Date(child.birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return years;
  }, [child.birthDate]);

  // טלפונים
  const [showAll, setShowAll] = useState(false);
  const phones = child.phoneNumbers || [];
  const displayed = showAll ? phones : phones.slice(0, 2);

  // מחיקה
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteMutation = useDeleteChild();
  const handleConfirmDelete = () => {
    deleteMutation.mutate(
      { id: child.id },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          onDelete?.(child.id);
          navigate("/");
        },
        onError: (err) => console.error("שגיאה במחיקה:", err),
      }
    );
  };

  // תפריט “עוד”
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  // סגירה בלחיצה מחוץ
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <section
        dir="rtl"
        className="
   bg-white shadow-lg rounded-lg
   relative
   p-4 md:p-6
   flex flex-col md:flex-row
   md:divide-y md:divide-gray-200 md:divide-x
   gap-2 md:gap-4 md:space-x-6
 "
      >
        {/* מידע אישי */}
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-semibold text--700">
            {child.name} {age != null && `, גיל ${age}`}
          </h2>
          <div className="flex items-center text-gray-600">
            <svg
              aria-hidden="true"
              className="h-5 w-5 ml-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6z" />
            </svg>
            <p>
              {child.address}, {child.city}
            </p>
          </div>
        </div>

        {/* טלפונים */}
        {phones.length > 0 && (
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-medium text-gray-700">טלפון</h3>
            <ul className="space-y-1">
              {displayed.map((p, i) => (
                <li key={i} className="flex items-center text-gray-800">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 ml-2 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884l.518 2.07a1 1 0 00.988.774h1.581a1 1 0 01.946.684l.517 1.55a1 1 0 01-.272 1.04l-1.15 1.15a11.042 11.042 0 005.516 5.516l1.15-1.15a1 1 0 011.04-.272l1.55.517a1 1 0 01.684.946v1.581a1 1 0 00.774.988l2.07.518a1 1 0 001.06-.746c.27-.93.403-1.897.385-2.868A16.022 16.022 0 003.75 4.472a1 1 0 00-.746 1.06z" />
                  </svg>
                  <span className="font-medium ml-1">{p.label}:</span>
                  <span className="ml-1">{p.number}</span>
                </li>
              ))}
            </ul>
            {phones.length > 2 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showAll ? "הסתר עוד" : `+${phones.length - 2} נוספים`}
              </button>
            )}
          </div>
        )}

        {/* פעולות */}
        <div className="pt-4 md:pt-0 flex items-start md:flex-col md:justify-center gap-2">
          {/* בדסקטופ: כפתורים גלויים */}
          <div className="hidden md:flex flex-col gap-2">
            <Link
              to={`/edit-child/${child.id}`}
              state={{ child }}
              className="
                px-4 py-2 text-sm font-medium rounded-md
                border border-gray-300 text-gray-700
                bg-white hover:bg-gray-50 transition
              "
            >
              ערוך
            </Link>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="
                px-4 py-2 text-sm font-medium rounded-md
                bg-red-600 text-white hover:bg-red-700 transition
              "
            >
              מחק ילד
            </button>
          </div>

          {/* כפתור עוד בפינה (מובייל) */}
          <div className="md:hidden" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="
      absolute top-3 left-3
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
        absolute top-10 left-3
        w-32 bg-white border border-gray-200
        rounded-md shadow-lg z-10
      "
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/edit-child/${child.id}`, { state: { child } });
                  }}
                  className="
          block w-full text-right px-4 py-2 text-sm
          text-gray-700 hover:bg-gray-100
        "
                >
                  ערוך
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsConfirmOpen(true);
                  }}
                  className="
          block w-full text-right px-4 py-2 text-sm
          text-red-600 hover:bg-gray-100
        "
                >
                  מחק
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* פופאפ אישור מחיקה */}
      {isConfirmOpen && (
        <div
          className="
            fixed inset-0 flex items-center justify-center
            bg-black/10 backdrop-blur-sm p-4 z-50
          "
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">אישור מחיקה</h3>

            {deleteMutation.isLoading ? (
              <div className="flex items-center justify-center space-x-2 py-4">
                <svg
                  className="animate-spin h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="text-gray-700">מחיקה...</span>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  האם אתה בטוח שברצונך למחוק את&nbsp;
                  <span className="font-medium text-gray-800">
                    {child.name}
                  </span>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="
                      px-3 py-1 text-sm font-medium rounded-md
                      bg-gray-100 text-gray-700 hover:bg-gray-200
                      transition
                    "
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="
                      px-3 py-1 text-sm font-medium rounded-md
                      bg-red-600 text-white hover:bg-red-700
                      transition
                    "
                  >
                    מחק
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
