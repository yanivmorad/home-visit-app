// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ChildDetails from "./pages/ChildDetails";
import AddChild from "./pages/AddChild";
import HomePage from "./pages/HomePage";
import EditChild from "./pages/EditChild";
export default function App() {
  return (
    <Routes>
      {/* כל המסלולים עטופים בתוך Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/child/:id" element={<ChildDetails />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/edit-child/:id" element={<EditChild />} />
      </Route>
    </Routes>
  );
}
