import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default React.memo(function ChildCard({ child }) {
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

  const getUrgencyTag = (status) => {
    switch (status) {
      case "Urgent":
        return {
          text: "דחוף",
          bg: "from-red-100 to-red-200",
          border: "border-red-300",
        };
      case "Medium":
        return {
          text: "חשוב",
          bg: "from-yellow-100 to-yellow-200",
          border: "border-yellow-300",
        };
      default:
        return {
          text: "רגיל",
          bg: "from-green-100 to-green-200",
          border: "border-green-300",
        };
    }
  };

  const { text: tagText, bg, border, text } = getUrgencyTag(child.status);
  const getShadowColor = (status) => {
    switch (status) {
      case "Urgent":
        return "shadow-[0_4px_12px_rgba(248,113,113,0.25)]"; // אדום רך
      case "Medium":
        return "shadow-[0_4px_12px_rgba(251,191,36,0.25)]"; // צהוב רך
      default:
        return "shadow-[0_4px_12px_rgba(74,222,128,0.25)]"; // ירוק רך
    }
  };

  const shadowClass = getShadowColor(child.status);

  return (
    <Link
      to={`/child/${child.id}`}
      dir="rtl"
      className={`block bg-white rounded-lg ring-1 ring-gray-200
    transition-all duration-200 overflow-hidden text-right
    ${shadowClass}
    hover:shadow-lg hover:ring-2 hover:ring-primary-300`}
    >
      <div className="p-5 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-primary-600">
            {child.name}
          </h2>

          {formattedLastVisit && (
            <p className="mt-2 text-base font-semibold text-primary-700">
              פגישה אחרונה: {formattedLastVisit}
            </p>
          )}

          {child.city && (
            <p className="mt-1 text-neutral-500 text-s">עיר: {child.city}</p>
          )}

          {child.category && (
            <p className="mt-1 text-neutral-500 text-s">
              סטטוס: {child.category}
            </p>
          )}
        </div>

        <span
          className={`
            inline-block px-3 py-1 rounded-full text-xs font-bold
            bg-gradient-to-r ${bg}
            border ${border}
            ${text}
          `}
        >
          {tagText}
        </span>
      </div>
    </Link>
  );
});
