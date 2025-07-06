// src/pages/HomePage.jsx
import React, { useState, useMemo, useEffect } from "react";
import ChildCard from "../components/ChildCard";
import { useChildren } from "../hooks/useChildren";
import { useCurrentPosition } from "../hooks/useCurrentPosition";

export default function HomePage() {
  // 1. Fetch children
  const { data: children = [], isLoading, error } = useChildren();

  // 2. Get user position once
  const { pos, error: geoError } = useCurrentPosition();

  // 3. Local state for filters
  const [nameTerm, setNameTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

  // 4. Compute unique areas for select
  const areas = useMemo(() => {
    const setA = new Set(children.map((c) => c.area).filter(Boolean));
    return ["all", ...Array.from(setA)];
  }, [children]);

  // 5. Save areas to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("areas", JSON.stringify(areas));
    } catch (e) {
      console.warn("לא הצליח לשמור את האזורים ל-localStorage", e);
    }
  }, [areas]);

  // 6. Filter children by name, city, area
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

  // 7. Determine displayed list: if no filter applied, show first 15, otherwise full filtered
  const displayedChildren = useMemo(() => {
    const isFiltered = nameTerm || cityTerm || areaFilter !== "all";
    if (isFiltered) return filtered;
    return filtered.slice(0, 15);
  }, [filtered, nameTerm, cityTerm, areaFilter]);

  // 8. Loading / error handling
  if (isLoading) return <p>טוען ילדים…</p>;
  if (error)
    return <p className="text-red-500 text-center">שגיאה בטעינת ילדים</p>;
  if (geoError)
    return <p className="text-red-500 text-center">{geoError.message}</p>;
  if (!pos) return <p className="text-neutral-400 text-center">טוען מיקום…</p>;

  return (
    <div dir="rtl" className="space-y-6">
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
          <ChildCard key={child.id} child={child} currentPos={pos} />
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
