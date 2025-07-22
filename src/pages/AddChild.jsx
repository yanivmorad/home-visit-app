// homeVisit/src/pages/AddChild.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateChild } from "../hooks/useChildren";

export default function AddChild({ areas = [], categories = [] }) {
  const navigate = useNavigate();
  const createChild = useCreateChild();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [idNumber, setIdNumber] = useState("");

  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([{ label: "", number: "" }]);

  // חדש: נציג משפטי
  const [legalRep, setLegalRep] = useState("");

  // פורמט מספר טלפון: לאחר 3 ספרות מוסיף מקף
  const formatPhone = (value = "") => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    return `${digits.slice(0, 3)}-${digits.slice(3, 10)}`;
  };

  const handlePhoneChange = (idx, field, rawValue) => {
    const updated = [...phoneNumbers];
    let value = rawValue;
    if (field === "number") {
      value = formatPhone(rawValue);
    }
    updated[idx][field] = value;
    setPhoneNumbers(updated);
  };

  const addPhoneField = () =>
    setPhoneNumbers([...phoneNumbers, { label: "", number: "" }]);

  const removePhoneField = (idx) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !legalRep) {
      alert("שם ונציג משפטי הם שדות חובה.");
      return;
    }

    // ערך האזור והקטגוריה (אם נבחרו)
    const areaValue =
      selectedArea === "custom" ? customArea.trim() : selectedArea.trim();
    const categoryValue =
      selectedCategory === "custom"
        ? customCategory.trim()
        : selectedCategory.trim();

    // אפשר להעביר גם אם ריקים
    createChild.mutate(
      {
        name: name.trim(),
        birthDate,
        idNumber: idNumber.trim(),
        area: areaValue,
        category: categoryValue,
        city: city.trim(),
        address: address.trim(),
        phoneNumbers: phoneNumbers.filter(
          (p) => p.label.trim() || p.number.trim()
        ),
        legalRepresentative: legalRep,
      },
      { onSuccess: () => navigate("/") }
    );
  };

  return (
    <div dir="rtl" className="max-w-lg mx-auto p-6 space-y-6 text-right">
      <Link
        to="/"
        className="inline-block text-sm font-medium text-gray-600 border-b border-gray-300 hover:border-blue-600 hover:text-blue-600 transition"
      >
        ← חזרה
      </Link>

      <h1 className="text-3xl font-bold text-[#1F3A93]">הוסף ילד חדש</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* נציג משפטי */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-md overflow-hidden border border-gray-300 bg-white shadow-sm">
            {[
              { label: 'עו"ד שלומית', value: "שלומית" },
              { label: 'עו"ד שלמה', value: "שלמה" },
            ].map(({ label, value }) => (
              <label
                key={value}
                className={`px-5 py-2.5 text-base font-medium cursor-pointer transition-colors text-center ${
                  legalRep === value
                    ? "bg-[#1F3A93] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="legalRep"
                  value={value}
                  checked={legalRep === value}
                  onChange={(e) => setLegalRep(e.target.value)}
                  required
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            שם <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">עיר</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">כתובת</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">תאריך לידה</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            מס׳ תעודת זהות
          </label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">אזור</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
          >
            <option value="">-- בחר אזור --</option>
            {areas
              .filter((a) => a !== "all")
              .map((a, idx) => (
                <option key={idx} value={a}>
                  {a}
                </option>
              ))}
            <option value="custom">אזור חדש...</option>
          </select>
          {selectedArea === "custom" && (
            <input
              type="text"
              placeholder="הקלד אזור חדש"
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">סטטוס</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
          >
            <option value="">-- בחר סטטוס --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
            <option value="custom">סטטוס חדש...</option>
          </select>
          {selectedCategory === "custom" && (
            <input
              type="text"
              placeholder="הקלדו סטטוס חדש"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
            />
          )}
        </div>

        <div className="space-y-4">
          <span className="block text-sm text-gray-700 mb-1">
            מספרי טלפון (לא חובה)
          </span>

          {phoneNumbers.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
            >
              <input
                type="text"
                placeholder="איש קשר (אמא, אבא…)"
                value={p.label}
                onChange={(e) =>
                  handlePhoneChange(idx, "label", e.target.value)
                }
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
              />
              <input
                type="tel"
                placeholder="טלפון"
                value={p.number}
                onChange={(e) =>
                  handlePhoneChange(idx, "number", e.target.value)
                }
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
                maxLength={12}
              />
              {phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhoneField(idx)}
                  className="text-red-500 text-sm self-start sm:self-auto"
                >
                  הסר
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addPhoneField}
            className="text-[#1F3A93] hover:text-[#162D6F] text-sm transition"
          >
            + הוסף מספר נוסף
          </button>
        </div>

        <button
          type="submit"
          disabled={createChild.isLoading}
          className="
          w-full px-4 py-2 rounded-md text-white transition
          bg-[#1F3A93] hover:bg-[#162D6F] disabled:opacity-50
        "
        >
          {createChild.isLoading ? "שומר…" : "שמור שינויים"}
        </button>
      </form>
    </div>
  );
}
