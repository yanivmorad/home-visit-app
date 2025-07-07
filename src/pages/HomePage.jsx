// src/pages/HomePage.jsx
import React, { useState, useMemo, useEffect } from "react";
import ChildCard from "../components/ChildCard";
import { useChildren } from "../hooks/useChildren";
// import { useCurrentPosition } from "../hooks/useCurrentPosition";

export default function HomePage() {
  const { data: children = [], isLoading, error } = useChildren();

  // משתמשים עכשיו גם ב-loading, לא רק ב־pos ו־error
  // const { pos, loading: geoLoading, error: geoError } = useCurrentPosition();

  const [nameTerm, setNameTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

  const areas = useMemo(() => {
    const setA = new Set(children.map((c) => c.area).filter(Boolean));
    return ["all", ...Array.from(setA)];
  }, [children]);

  useEffect(() => {
    try {
      localStorage.setItem("areas", JSON.stringify(areas));
    } catch {
      console.warn("לא הצליח לשמור את האזורים ל-localStorage");
    }
  }, [areas]);

  const filtered = useMemo(() => {
    return children.filter((c) => {
      if (
        nameTerm &&
        !c.name.toLowerCase().includes(nameTerm.trim().toLowerCase())
      ) {
        return false;
      }
      if (
        cityTerm &&
        !c.city.toLowerCase().includes(cityTerm.trim().toLowerCase())
      ) {
        return false;
      }
      if (areaFilter !== "all" && c.area !== areaFilter) {
        return false;
      }
      return true;
    });
  }, [children, nameTerm, cityTerm, areaFilter]);

  const displayedChildren = useMemo(() => {
    const isFiltered = nameTerm || cityTerm || areaFilter !== "all";
    return isFiltered ? filtered : filtered.slice(0, 15);
  }, [filtered, nameTerm, cityTerm, areaFilter]);

  // 1. טעינת ילדים
  if (isLoading) {
    return <p>טוען ילדים…</p>;
  }

  // 2. שגיאה ב־API של ילדים
  if (error) {
    return (
      <p className="text-red-500 text-center">
        שגיאה בטעינת ילדים: {error.message}
      </p>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* הודעות על גיאולוקיישן
      {(geoLoading || geoError) && (
        <p className="text-yellow-600 text-center text-sm">
          {geoLoading
            ? "טוען מיקום… מרחקים לא יופיעו בינתיים"
            : `לא ניתן לקבל מיקום: ${geoError.message}. מרחק לא יוצג`}
        </p>
      )} */}

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={nameTerm}
          onChange={(e) => setNameTerm(e.target.value)}
          placeholder="חפש שם ילד…"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="text"
          value={cityTerm}
          onChange={(e) => setCityTerm(e.target.value)}
          placeholder="חפש עיר…"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area === "all" ? "כל האזורים" : area}
            </option>
          ))}
        </select>
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedChildren.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            // currentPos={pos} // pos עשוי להיות null
          />
        ))}
      </div>

      {/* Show note if limited */}
      {filtered.length > displayedChildren.length && (
        <p className="text-neutral-500 text-sm text-center">
          מוצגים {displayedChildren.length} מתוך {filtered.length} ילדים. חפש או
          סנן כדי לראות יותר.
        </p>
      )}
    </div>
  );
}
