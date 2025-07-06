// src/components/ChildInfo.jsx
import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteChild } from "../hooks/useChildren";

export default function ChildInfo({ child, onDelete }) {
  const navigate = useNavigate();

  // חישוב גיל מבוסס תאריך לידה
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

  // Toggle להצגת כל המספרים
  const [showAll, setShowAll] = useState(false);
  const phones = child.phoneNumbers || [];
  const displayed = showAll ? phones : phones.slice(0, 2);

  // Toggle לפופאפ אישור המחיקה
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // הפעלת ה-mutation של המחיקה
  const deleteMutation = useDeleteChild();

  // קריאה למחיקה לאחר אישור
  const handleConfirmDelete = () => {
    deleteMutation.mutate(
      { id: child.id },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          if (onDelete) onDelete(child.id);
          // נווט לדף הראשי לאחר מחיקה מוצלחת
          navigate("/");
        },
        onError: (err) => {
          console.error("שגיאה במחיקה:", err);
        },
      }
    );
  };

  return (
    <>
      <section
        dir="rtl"
        className="bg-white p-6 rounded-lg shadow-md space-y-4 text-right"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-primary-600">
              {child.name} {age != null && `, גיל: ${age}`}
            </h2>
            <p className="text-neutral-700">
              כתובת: {child.address}, {child.city}
            </p>
          </div>

          {/* כפתורי מחיקה ועריכה */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="
                px-4 py-2 text-sm font-medium
                rounded-lg border border-red-300
                text-red-600 bg-white hover:bg-red-50
                shadow-sm transition
              "
            >
              מחק ילד
            </button>

            <Link
              to={`/edit-child/${child.id}`}
              state={{ child }}
              className="
                px-4 py-2 text-sm font-medium
                rounded-lg border border-gray-300
                text-gray-700 bg-white hover:bg-gray-50
                shadow-sm transition
              "
            >
              ערוך
            </Link>
          </div>
        </div>

        {phones.length > 0 && (
          <div className="space-y-1">
            <p className="font-semibold text-neutral-600">טלפון:</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {displayed.map((p, i) => (
                <div key={i} className="flex items-center">
                  <span className="font-medium text-neutral-800 ml-1">
                    {p.label}:
                  </span>
                  <span className="text-neutral-700">{p.number}</span>
                </div>
              ))}
            </div>

            {phones.length > 2 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showAll
                  ? "הסתר מספרים נוספים"
                  : `+${phones.length - 2} מספרים נוספים`}
              </button>
            )}
          </div>
        )}
      </section>

      {/* פופאפ אישור מחיקה */}
      {isConfirmOpen && (
        <div
          className="
            fixed inset-0
            flex items-center justify-center
            bg-black/10
            backdrop-blur-sm
            p-4 z-50
          "
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">אישור מחיקה</h3>

            {/* מציגים spinner בזמן המחיקה */}
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
                      px-3 py-1 text-sm font-medium
                      rounded-md bg-gray-100 text-gray-700
                      hover:bg-gray-200 transition
                    "
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="
                      px-3 py-1 text-sm font-medium
                      rounded-md bg-red-600 text-white
                      hover:bg-red-700 transition
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
