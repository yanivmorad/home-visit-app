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

  // fixed list of categories
  const categoryOptions = useMemo(
    () => ["אומנה", "אימוץ", "פנימיה", "מרכז חירום", "צו ביניים", "ניזקקות"],
    []
  );

  // form state
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [idNumber, setIdNumber] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([{ label: "", number: "" }]);
  // legal representative
  const [legalRep, setLegalRep] = useState("");

  // seed form when child loads
  useEffect(() => {
    if (!child) return;

    setName(child.name || "");
    setBirthDate(child.birthDate || null);
    setIdNumber(child.idNumber || "");
    setCity(child.city || "");
    setAddress(child.address || "");

    // area
    if (parsedAreas.includes(child.area)) {
      setSelectedArea(child.area);
      setCustomArea("");
    } else {
      setSelectedArea("custom");
      setCustomArea(child.area || "");
    }

    // category
    if (categoryOptions.includes(child.category)) {
      setSelectedCategory(child.category);
      setCustomCategory("");
    } else {
      setSelectedCategory("custom");
      setCustomCategory(child.category || "");
    }

    setPhoneNumbers(
      child.phoneNumbers?.length
        ? child.phoneNumbers.map((p) => ({ label: p.label, number: p.number }))
        : [{ label: "", number: "" }]
    );
    setLegalRep(child.legalRepresentative || "");
  }, [child, parsedAreas, categoryOptions]);

  // format phone: add dash after 3 digits
  const formatPhone = (value = "") => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    return `${digits.slice(0, 3)}-${digits.slice(3, 10)}`;
  };

  const handlePhoneChange = (idx, field, rawValue) => {
    setPhoneNumbers((prev) =>
      prev.map((p, i) => {
        if (i !== idx) return p;
        const newVal = field === "number" ? formatPhone(rawValue) : rawValue;
        return { ...p, [field]: newVal };
      })
    );
  };

  const addPhoneField = () =>
    setPhoneNumbers((prev) => [...prev, { label: "", number: "" }]);
  const removePhoneField = (idx) =>
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== idx));

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !legalRep) {
      alert("שם ומייצג משפטי הם שדות חובה.");
      return;
    }

    // area and category (can be empty)
    const areaValue =
      selectedArea === "custom" ? customArea.trim() : selectedArea.trim();
    const categoryValue =
      selectedCategory === "custom"
        ? customCategory.trim()
        : selectedCategory.trim();

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
          category: categoryValue,
          phoneNumbers: phoneNumbers.filter(
            (p) => p.label.trim() || p.number.trim()
          ),
          legalRepresentative: legalRep,
        },
      },
      {
        onSuccess: () => navigate(`/child/${id}`),
      }
    );
  };

  if (isLoading) return <p className="p-6 text-center">טוען נתונים…</p>;
  if (error || !child) return <p className="p-6 text-center">אירעה שגיאה.</p>;

  return (
    <div dir="rtl" className="max-w-lg mx-auto p-6 space-y-6 text-right">
      <Link
        to={`/child/${id}`}
        className="inline-block text-sm font-medium text-gray-600 border-b border-gray-300 hover:border-blue-600 hover:text-blue-600 transition"
      >
        ← חזרה
      </Link>

      <h1 className="text-3xl font-bold text-[#1F3A93]">ערוך פרטי מטופל</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* מייצג משפטי */}
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
            <option value="custom">הוסף אזור חדש...</option>
            {parsedAreas
              .filter((area) => area !== "all")
              .map((area, idx) => (
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
            <option value="custom">הוסף סטטוס חדש...</option>
            {categoryOptions.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {selectedCategory === "custom" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="הזן סטטוס חדש"
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
          disabled={isUpdating}
          className="w-full px-4 py-2 rounded-md text-white bg-[#1F3A93] hover:bg-[#162D6F] disabled:opacity-50 transition"
        >
          {isUpdating ? "שומר…" : "שמור שינויים"}
        </button>
      </form>
    </div>
  );
}
