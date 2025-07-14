//src/components/ChildrenFiltersForm.jsx
import React from "react";

export default function ChildrenFiltersForm({
  nameTerm,
  setNameTerm,
  cityTerm,
  setCityTerm,
  areaFilter,
  setAreaFilter,
  areas,
}) {
  return (
    <div
      className="
      grid grid-cols-2 grid-rows-2 gap-4 
      sm:grid-cols-3 sm:grid-rows-1
    "
    >
      <input
        type="text"
        value={nameTerm}
        onChange={(e) => setNameTerm(e.target.value)}
        placeholder="חפש שם ילד…"
        className="
        col-span-2 sm:col-span-1 
        p-2 rounded-md border border-gray-300 bg-white 
        focus:outline-none focus:ring-2 focus:ring-blue-300 
        text-sm text-neutral-700 placeholder:text-neutral-400
      "
      />

      <input
        type="text"
        value={cityTerm}
        onChange={(e) => setCityTerm(e.target.value)}
        placeholder="חפש עיר…"
        className="
        col-span-1 
        p-2 rounded-md border border-gray-300 bg-white 
        focus:outline-none focus:ring-2 focus:ring-blue-300 
        text-sm text-neutral-700 placeholder:text-neutral-400
      "
      />

      <select
        value={areaFilter}
        onChange={(e) => setAreaFilter(e.target.value)}
        className="
        col-span-1 
        p-2 rounded-md border border-gray-300 bg-white 
        focus:outline-none focus:ring-2 focus:ring-blue-300 
        text-sm text-neutral-700
      "
      >
        {areas.map((area) => (
          <option key={area} value={area}>
            {area === "all" ? "כל האזורים" : area}
          </option>
        ))}
      </select>
    </div>
  );
}
