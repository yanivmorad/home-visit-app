// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import HomePage from "./pages/HomePage";
import ChildDetails from "./pages/ChildDetails";
import AddChild from "./pages/AddChild";
import EditChild from "./pages/EditChild";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* דף פתוח לכולם */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* כל ה־routes הבאים עטופים ב־RequireAuth */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/child/:id" element={<ChildDetails />} />
          <Route path="/add-child" element={<AddChild />} />
          <Route path="/edit-child/:id" element={<EditChild />} />
        </Route>
      </Route>
    </Routes>
  );
}
