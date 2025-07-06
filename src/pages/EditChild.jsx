// src/pages/EditChild.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useChild, useUpdateChild } from "../hooks/useChildren";

export default function EditChild() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: child, isLoading, error } = useChild(id);
  const { mutate: updateChild, isLoading: isUpdating } = useUpdateChild();

  // parse areas only once
  const parsedAreas = useMemo(() => {
    try {
      const stored = localStorage.getItem("areas");
      return stored ? JSON.parse(stored).filter((a) => a) : [];
    } catch {
      return [];
    }
  }, []);

  // form state
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([{ label: "", number: "" }]);

  // seed form when child loads
  useEffect(() => {
    if (!child) return;

    setName(child.name || "");
    setBirthDate(child.birthDate || "");
    setIdNumber(child.idNumber || "");
    setCity(child.city || "");
    setAddress(child.address || "");

    // choose existing or custom
    if (parsedAreas.includes(child.area)) {
      setSelectedArea(child.area);
      setCustomArea("");
    } else {
      setSelectedArea("custom");
      setCustomArea(child.area || "");
    }

    setPhoneNumbers(
      child.phoneNumbers?.length
        ? child.phoneNumbers.map((p) => ({ label: p.label, number: p.number }))
        : [{ label: "", number: "" }]
    );
  }, [child, parsedAreas]);

  // phone handlers
  const handlePhoneChange = (idx, field, value) => {
    setPhoneNumbers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };
  const addPhoneField = () =>
    setPhoneNumbers((prev) => [...prev, { label: "", number: "" }]);
  const removePhoneField = (idx) =>
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== idx));

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validPhones = phoneNumbers.filter((p) => p.number.trim());
    if (!name.trim() || !city.trim() || validPhones.length === 0) {
      alert("שם, עיר ומספר טלפון אחד לפחות הם שדות חובה.");
      return;
    }

    const areaValue =
      selectedArea === "custom" ? customArea.trim() : selectedArea.trim();
    if (!areaValue) {
      alert("אנא בחר או הזן אזור.");
      return;
    }

    updateChild(
      {
        id,
        data: {
          name: name.trim(),
          birthDate,
          idNumber: idNumber.trim(),
          area: areaValue,
          city: city.trim(),
          address: address.trim(),
          phoneNumbers: validPhones,
        },
      },
      { onSuccess: () => navigate(`/child/${id}`) }
    );
  };

  if (isLoading) return <p className="p-6 text-center">טוען נתונים…</p>;
  if (error || !child) return <p className="p-6 text-center">אירעה שגיאה.</p>;

  return (
    <div dir="rtl" className="max-w-lg mx-auto p-6 space-y-6 text-right">
      <Link to="/" className="text-primary-600 hover:underline">
        ← חזרה
      </Link>

      <h1 className="text-3xl font-bold text-primary-600">ערוך פרטי מטופל</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* שם */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">שם</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full"
            required
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
            required
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
          />
        </div>

        {/* תעודת זהות */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            מס׳ תעודת זהות
          </label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* אזור: תמיד דורש ערך, אופציה ראשונה = הוסף חדש */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">אזור</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="border rounded p-2 w-full"
            required
          >
            <option value="custom">הוסף אזור חדש...</option>
            {parsedAreas.map((area, idx) => (
              <option key={idx} value={area}>
                {area}
              </option>
            ))}
          </select>
          {selectedArea === "custom" && (
            <input
              type="text"
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              placeholder="הזן שם אזור חדש"
              className="border rounded p-2 w-full mt-2"
              required
            />
          )}
        </div>

        {/* מספרי טלפון */}
        <div className="space-y-2">
          <span className="block text-sm text-neutral-700 mb-1">
            מספרי טלפון (לפחות אחד חובה)
          </span>
          {phoneNumbers.map((p, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="תווית (אמא, אבא…)"
                value={p.label}
                onChange={(e) =>
                  handlePhoneChange(idx, "label", e.target.value)
                }
                className="border rounded p-2 flex-1"
              />
              <input
                type="tel"
                placeholder="טלפון"
                value={p.number}
                onChange={(e) =>
                  handlePhoneChange(idx, "number", e.target.value)
                }
                className="border rounded p-2 flex-1"
                required={idx === 0}
              />
              {phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhoneField(idx)}
                  className="text-red-500 hover:underline"
                >
                  הסר
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPhoneField}
            className="text-primary-600 hover:underline text-sm"
          >
            + הוסף מספר נוסף
          </button>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isUpdating ? "שומר…" : "שמור שינויים"}
        </button>
      </form>
    </div>
  );
}
