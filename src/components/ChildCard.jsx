//src/components/ChildCard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/date";

function getUrgencyStyles(status) {
  switch (status) {
    case "Urgent":
      return {
        tagText: "דחוף",
        bg: "bg-red-50",
        border: "border-red-200",
        textColor: "text-red-600",
        shadow: "shadow-[0_4px_12px_rgba(248,113,113,0.1)]",
      };
    case "Medium":
      return {
        tagText: "חשוב",
        bg: "bg-[#D4AF37]/10",
        border: "border-[#D4AF37]/30",
        textColor: "text-[#D4AF37]",
        shadow: "shadow-[0_4px_12px_rgba(212,175,55,0.1)]",
      };
    default:
      return {
        tagText: "רגיל",
        bg: "bg-green-50",
        border: "border-green-200",
        textColor: "text-green-600",
        shadow: "shadow-[0_4px_12px_rgba(34,197,94,0.1)]",
      };
  }
}

function ChildInfo({ child, formattedLastVisit, hasVisit }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold text-[#1F3A93]">{child.name}</h2>

      <p className="text-base font-medium text-[#162D6F]">
        {hasVisit
          ? `פגישה אחרונה: ${formattedLastVisit}`
          : "אין היסטוריית פגישות"}
      </p>

      {child.city && (
        <p className="text-neutral-500 text-sm">עיר: {child.city}</p>
      )}

      {child.category && (
        <p className="text-gray-400 text-xs mt-1">סטטוס: {child.category}</p>
      )}
    </div>
  );
}

export default React.memo(function ChildCard({ child }) {
  const hasVisit = Boolean(child.lastVisit);
  const formattedLastVisit = useMemo(
    () => formatDate(child.lastVisit),
    [child.lastVisit]
  );

  const { tagText, bg, border, textColor, shadow } = getUrgencyStyles(
    child.status
  );

  return (
    <Link
      to={`/child/${child.id}`}
      dir="rtl"
      className={`
        block bg-white rounded-2xl ring-1 ring-gray-200
        transition-all duration-200 overflow-hidden text-right
        ${shadow}
        hover:shadow-lg hover:ring-2 hover:ring-[#1F3A93]/30
      `}
    >
      <div className="p-5 flex justify-between items-start">
        <ChildInfo
          child={child}
          formattedLastVisit={formattedLastVisit}
          hasVisit={hasVisit}
        />
        <span
          className={`
            inline-block px-3 py-1 rounded-full text-xs font-medium
            ${bg} ${border} ${textColor}
          `}
        >
          {tagText}
        </span>
      </div>
    </Link>
  );
});
