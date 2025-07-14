//src/hooks/useFilteredChildren.js
import { useEffect, useMemo } from "react";

export function useFilteredChildren({
  allChildren,
  legalRepFilter,
  nameTerm,
  cityTerm,
  areaFilter,
}) {
  useEffect(() => {
    try {
      localStorage.setItem("legalRepFilter", legalRepFilter);
    } catch {
      console.warn("לא הצליח לשמור את הבחירה ב־localStorage");
    }
  }, [legalRepFilter]);

  const childrenOfRep = useMemo(() => {
    if (!legalRepFilter) return [];
    return allChildren.filter((c) => c.legalRepresentative === legalRepFilter);
  }, [allChildren, legalRepFilter]);

  const areas = useMemo(() => {
    const setA = new Set(childrenOfRep.map((c) => c.area).filter(Boolean));
    return ["all", ...Array.from(setA)];
  }, [childrenOfRep]);

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

  return {
    childrenOfRep,
    areas,
    filtered,
    displayedChildren,
  };
}
