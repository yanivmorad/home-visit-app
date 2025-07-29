// src/pages/HomePage.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ChildCard from "../components/ChildCard";
import { useFilteredChildren } from "../hooks/useFilteredChildren";
import ChildrenFiltersForm from "../components/ChildrenFiltersForm";
import LegalRepSelector from "../components/LegalRepSelector";
import ChildrenSkeletonGrid from "../components/ChildrenSkeletonGrid";
import { getAgeFromDate } from "../utils/date";

// Constants for repeated class names
const ADD_CHILD_BUTTON_CLASSES = `
  justify-self-end
  px-5 py-2 text-sm sm:px-6 sm:py-3 sm:text-base font-semibold
  bg-[#1F3A93] text-white
  rounded-full shadow-md
  hover:bg-[#162D6F] transition-colors
`;

// Utility to normalize areas
const normalizeAreas = (areas) =>
  areas.includes("all") ? areas : ["all", ...areas];

// Component for rendering children list and filters
const ChildrenList = ({
  filtered,
  displayedChildren,
  nameTerm,
  setNameTerm,
  cityTerm,
  setCityTerm,
  areaFilter,
  setAreaFilter,
  areas,
}) => (
  <>
    <ChildrenFiltersForm
      nameTerm={nameTerm}
      setNameTerm={setNameTerm}
      cityTerm={cityTerm}
      setCityTerm={setCityTerm}
      areaFilter={areaFilter}
      setAreaFilter={setAreaFilter}
      areas={areas}
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {displayedChildren.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </div>
    {filtered.length > displayedChildren.length && (
      <p className="text-gray-400 text-sm text-center mt-2">
        מוצגים {displayedChildren.length} מתוך {filtered.length} ילדים. חפש או
        סנן כדי לראות יותר.
      </p>
    )}
  </>
);

export default function HomePage({
  allChildren = [],
  isLoading,
  error,
  areas = [],
}) {
  const [legalRepFilter, setLegalRepFilter] = useState(() => {
    try {
      return localStorage.getItem("legalRepFilter") || "";
    } catch {
      return "";
    }
  });
  const [nameTerm, setNameTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

  // Memoize normalized areas to avoid recomputation
  const normalizedAreas = useMemo(() => normalizeAreas(areas), [areas]);

  const { filtered, displayedChildren } = useFilteredChildren({
    allChildren,
    legalRepFilter,
    nameTerm,
    cityTerm,
    areaFilter,
  });
  const sortedDisplayedChildren = useMemo(() => {
    return [...displayedChildren].sort((a, b) => {
      const ageA = getAgeFromDate(a.birthDate); // או a.age אם כבר קיים
      const ageB = getAgeFromDate(b.birthDate);
      const aIsAdult = ageA >= 18 ? 1 : 0;
      const bIsAdult = ageB >= 18 ? 1 : 0;
      return bIsAdult - aIsAdult; // בגירים קודמים
    });
  }, [displayedChildren]);
  // Handle loading and error states
  if (isLoading) return <ChildrenSkeletonGrid />;
  if (error)
    return (
      <p className="text-red-500 text-center">
        שגיאה בטעינת ילדים: {error.message}
      </p>
    );

  return (
    <div dir="rtl" className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 items-center px-4 py-2">
        <div className="hidden sm:block" />
        <div className="flex justify-center">
          <LegalRepSelector
            selected={legalRepFilter}
            onSelect={(rep) => {
              setLegalRepFilter(rep);
              setAreaFilter("all");
              setCityTerm("");
              setNameTerm("");
            }}
          />
        </div>
        <Link to="/add-child" className={ADD_CHILD_BUTTON_CLASSES}>
          + הוספת ילד
        </Link>
      </div>
      {legalRepFilter && (
        <ChildrenList
          filtered={filtered}
          displayedChildren={sortedDisplayedChildren}
          nameTerm={nameTerm}
          setNameTerm={setNameTerm}
          cityTerm={cityTerm}
          setCityTerm={setCityTerm}
          areaFilter={areaFilter}
          setAreaFilter={setAreaFilter}
          areas={normalizedAreas}
        />
      )}
    </div>
  );
}
