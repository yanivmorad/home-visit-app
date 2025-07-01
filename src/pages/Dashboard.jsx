// src/pages/Dashboard.jsx
import React from "react";
import { useChildren } from "../hooks/useChildren";
import FiltersBar from "../components/FiltersBar";

export default function Dashboard() {
  const { data: childrenList = [], isLoading, error } = useChildren();

  if (isLoading) return <p>טוען ילדים…</p>;
  if (error) return <p>שגיאה בטעינת ילדים</p>;

  return <FiltersBar childrenList={childrenList} />;
}
