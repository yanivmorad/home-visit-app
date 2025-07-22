// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChildCard from "../components/ChildCard";
import { useFilteredChildren } from "../hooks/useFilteredChildren";
import ChildrenFiltersForm from "../components/ChildrenFiltersForm";
import LegalRepSelector from "../components/LegalRepSelector";
import ChildrenSkeletonGrid from "../components/ChildrenSkeletonGrid";

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

  const { filtered, displayedChildren } = useFilteredChildren({
    allChildren,
    legalRepFilter,
    nameTerm,
    cityTerm,
    areaFilter,
  });

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

        <Link
          to="/add-child"
          className="
            justify-self-end
            px-5 py-2 text-sm sm:px-6 sm:py-3 sm:text-base font-semibold
            bg-[#1F3A93] text-white
            rounded-full shadow-md
            hover:bg-[#162D6F] transition-colors
          "
        >
          + הוספת ילד
        </Link>
      </div>

      {legalRepFilter && (
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
              מוצגים {displayedChildren.length} מתוך {filtered.length} ילדים.
              חפש או סנן כדי לראות יותר.
            </p>
          )}
        </>
      )}
    </div>
  );
}
