// src/components/FiltersBar.jsx
import React from "react";
import ChildCard from "./ChildCard";

export default function FiltersBar({ childrenList = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {childrenList.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </div>
  );
}
