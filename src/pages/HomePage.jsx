import React, { useState, useMemo, useEffect } from "react";
import ChildCard from "../components/ChildCard";
import { useChildren } from "../hooks/useChildren";

export default function HomePage() {
  const [legalRepFilter, setLegalRepFilter] = useState(() => {
    try {
      return localStorage.getItem("legalRepFilter") || "";
    } catch {
      return "";
    }
  });

  const { data: allChildren = [], isLoading, error } = useChildren();

  useEffect(() => {
    try {
      localStorage.setItem("legalRepFilter", legalRepFilter);
    } catch {
      console.warn("לא הצליח לשמור את הבחירה ב־localStorage");
    }
  }, [legalRepFilter]);

  const [nameTerm, setNameTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

  // 1. קבל את כל הילדים של הנציג המסונן (ליצירת רשימת אזורים תקינה)
  const childrenOfRep = useMemo(() => {
    if (!legalRepFilter) return [];
    return allChildren.filter((c) => c.legalRepresentative === legalRepFilter);
  }, [allChildren, legalRepFilter]);

  // 2. רשימת האזורים לפי כל הילדים של הנציג (לא לפי filtered!)
  const areas = useMemo(() => {
    const setA = new Set(childrenOfRep.map((c) => c.area).filter(Boolean));
    return ["all", ...Array.from(setA)];
  }, [childrenOfRep]);

  // 3. סינון מלא (כולל הגנות על שדות חסרים)
  const filtered = useMemo(() => {
    return childrenOfRep.filter((c) => {
      if (
        nameTerm &&
        !(c.name || "").toLowerCase().includes(nameTerm.trim().toLowerCase())
      )
        return false;
      if (
        cityTerm &&
        !(c.city || "").toLowerCase().includes(cityTerm.trim().toLowerCase())
      )
        return false;
      if (areaFilter !== "all" && c.area !== areaFilter) return false;
      return true;
    });
  }, [childrenOfRep, nameTerm, cityTerm, areaFilter]);

  const displayedChildren = useMemo(() => {
    const isFiltered =
      nameTerm || cityTerm || areaFilter !== "all" || legalRepFilter;
    return isFiltered ? filtered : filtered.slice(0, 15);
  }, [filtered, nameTerm, cityTerm, areaFilter, legalRepFilter]);

  if (isLoading) return <p>טוען ילדים…</p>;
  if (error)
    return (
      <p className="text-red-500 text-center">
        שגיאה בטעינת ילדים: {error.message}
      </p>
    );

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-xl p-2 space-x-3">
          <button
            onClick={() => {
              setLegalRepFilter("שלמה");
              setAreaFilter("all");
              setCityTerm("");
              setNameTerm("");
            }}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors focus:outline-none ${
              legalRepFilter === "שלמה"
                ? "bg-white text-blue-700 shadow-xl ring-2 ring-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            עו"ד שלמה
          </button>
          <button
            onClick={() => {
              setLegalRepFilter("שלומית");
              setAreaFilter("all");
              setCityTerm("");
              setNameTerm("");
            }}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors focus:outline-none ${
              legalRepFilter === "שלומית"
                ? "bg-white text-blue-700 shadow-xl ring-2 ring-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            עו"ד שלומית
          </button>
        </div>
      </div>

      {legalRepFilter && (
        <>
          <div
            className="grid 
                grid-cols-2 grid-rows-2 gap-4 
                sm:grid-cols-3 sm:grid-rows-1"
          >
            {/* שדה שם */}
            <input
              type="text"
              value={nameTerm}
              onChange={(e) => setNameTerm(e.target.value)}
              placeholder="חפש שם ילד…"
              className="col-span-2 sm:col-span-1 
               p-2 border rounded 
               focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            {/* שדה עיר */}
            <input
              type="text"
              value={cityTerm}
              onChange={(e) => setCityTerm(e.target.value)}
              placeholder="חפש עיר…"
              className="col-span-1 
               p-2 border rounded 
               focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            {/* שדה אזור */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="col-span-1 
               p-2 border rounded bg-white 
               focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area === "all" ? "כל האזורים" : area}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {displayedChildren.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>

          {filtered.length > displayedChildren.length && (
            <p className="text-neutral-500 text-sm text-center mt-2">
              מוצגים {displayedChildren.length} מתוך {filtered.length} ילדים.
              חפש או סנן כדי לראות יותר.
            </p>
          )}
        </>
      )}
    </div>
  );
}
