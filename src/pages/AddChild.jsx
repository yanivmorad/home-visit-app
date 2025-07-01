// src/pages/AddChild.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateChild } from "../hooks/useChildren";

export default function AddChild() {
  const navigate = useNavigate();
  const createChild = useCreateChild();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [urgent, setUrgent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age || !birthDate || !address) return;

    createChild.mutate(
      {
        name,
        age: Number(age),
        birthDate, // תאריך לידה
        area, // אזור
        city,
        address,
        phone, // טלפון
        urgent,
      },
      {
        onSuccess: () => navigate("/"),
      }
    );
  };

  return (
    <div dir="rtl" className="max-w-md mx-auto p-6 space-y-4 text-right">
      <Link to="/" className="text-primary-600 hover:underline">
        ← חזרה
      </Link>

      <h1 className="text-2xl font-bold text-primary-600">הוסף ילד חדש</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* שם הילד */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">שם הילד</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        {/* גיל */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">גיל</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        {/* תאריך לידה */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            תאריך לידה
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        {/* אזור */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">אזור</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* עיר */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">עיר</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* כתובת */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">כתובת</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        {/* טלפון */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">טלפון</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* דחוף */}
        <div className="flex items-center gap-2">
          <input
            id="urgent"
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="urgent" className="text-sm text-neutral-700">
            דחוף
          </label>
        </div>

        <button
          type="submit"
          disabled={createChild.isLoading}
          className="
            w-full px-4 py-2 rounded text-white transition
            bg-blue-600 hover:bg-blue-700 disabled:opacity-50
          "
        >
          {createChild.isLoading ? "שומר…" : "הוסף ילד"}
        </button>
      </form>
    </div>
  );
}
