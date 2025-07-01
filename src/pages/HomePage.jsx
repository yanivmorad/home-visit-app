// src/pages/HomePage.jsx
import React, { useState, useMemo } from "react";
import ChildCard from "../components/ChildCard";
import { useChildren } from "../hooks/useChildren";

export default function HomePage() {
  const { data: children = [], isLoading, error } = useChildren();

  // states לכל שדה חיפוש/סינון
  const [nameTerm, setNameTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

  // מביא את כל האזורים הייחודיים עבור ה-select
  const areas = useMemo(() => {
    const setA = new Set(children.map((c) => c.area).filter(Boolean));
    return ["all", ...Array.from(setA)];
  }, [children]);

  // מסנן לפי שם, עיר ואזור
  const filtered = useMemo(() => {
    return children.filter((c) => {
      // 1. שם
      if (
        nameTerm &&
        !c.name.toLowerCase().includes(nameTerm.trim().toLowerCase())
      ) {
        return false;
      }

      // 2. עיר
      if (
        cityTerm &&
        !c.city.toLowerCase().includes(cityTerm.trim().toLowerCase())
      ) {
        return false;
      }

      // 3. אזור
      if (areaFilter !== "all" && c.area !== areaFilter) {
        return false;
      }

      return true;
    });
  }, [children, nameTerm, cityTerm, areaFilter]);

  if (isLoading) return <p>טוען ילדים…</p>;
  if (error) return <p>שגיאה בטעינת ילדים</p>;

  return (
    <div dir="rtl" className="space-y-6">
      {/* שורת החיפוש/סינון */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* חיפוש לפי שם */}
        <input
          type="text"
          value={nameTerm}
          onChange={(e) => setNameTerm(e.target.value)}
          placeholder="חפש שם ילד…"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* חיפוש לפי עיר */}
        <input
          type="text"
          value={cityTerm}
          onChange={(e) => setCityTerm(e.target.value)}
          placeholder="חפש עיר…"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* סינון לפי אזור */}
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

      {/* תצוגת כרטיסי הילדים */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>
    </div>
  );
}
