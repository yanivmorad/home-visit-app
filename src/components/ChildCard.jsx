// src/components/ChildCard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDistanceTo } from "../hooks/useDistance";

export default React.memo(function ChildCard({ child, currentPos }) {
  // 1. חיבור address + city לכתובת מלאה
  const fullAddress = useMemo(
    () => `${child.address}, ${child.city}`,
    [child.address, child.city]
  );

  // 2. שימוש ב-hook לחישוב מרחק
  const { distanceKm, loading, error } = useDistanceTo(fullAddress, currentPos);

  // 3. המרת תאריך מפורמט ISO ללוקלי בעברית
  const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const formattedLastVisit = useMemo(
    () => formatDate(child.lastVisit),
    [child.lastVisit]
  );

  // 4. תגית דחיפות
  const getUrgencyTag = (status) => {
    switch (status) {
      case "Urgent":
        return { text: "דחוף", className: "bg-red-100 text-red-700" };
      case "Medium":
        return { text: "חשוב", className: "bg-yellow-100 text-yellow-700" };
      default:
        return { text: "רגיל", className: "bg-green-100 text-green-700" };
    }
  };
  const { text: tagText, className: tagClass } = getUrgencyTag(child.status);

  return (
    <Link
      to={`/child/${child.id}`}
      dir="rtl"
      className="
        block bg-white rounded-lg shadow p-4
        hover:scale-105 hover:shadow-md transition
        text-right
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-primary-600">
            {child.name}
          </h2>

          {/* טיפול במרחק */}
          {loading ? (
            <p className="text-neutral-400 text-xs mt-1">טוען מרחק…</p>
          ) : error ? (
            <p className="text-red-500 text-xs mt-1">מרחק לא זמין</p>
          ) : distanceKm != null ? (
            <p className="text-neutral-500 text-sm mt-1">
              מרחק: {distanceKm} ק״מ
            </p>
          ) : null}

          {child.city && (
            <p className="text-neutral-500 text-sm">עיר: {child.city}</p>
          )}

          {formattedLastVisit && (
            <p className="text-neutral-400 text-xs mt-1">
              פגישה אחרונה: {formattedLastVisit}
            </p>
          )}
        </div>

        <span
          className={`
            px-2 py-1 rounded text-xs font-bold
            ${tagClass}
          `}
        >
          {tagText}
        </span>
      </div>
    </Link>
  );
});
