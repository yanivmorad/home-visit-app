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
      <Link to="/" className="text-primary-600 hover:underline">
        ← חזרה
      </Link>

      <h1 className="text-3xl font-bold text-primary-600">ערוך פרטי מטופל</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* מייצג משפטי */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            מייצג משפטי <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="legalRep"
                value="שלמה"
                checked={legalRep === "שלמה"}
                onChange={(e) => setLegalRep(e.target.value)}
                required
              />
              שלמה
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="legalRep"
                value="שלומית"
                checked={legalRep === "שלומית"}
                onChange={(e) => setLegalRep(e.target.value)}
                required
              />
              שלומית
            </label>
          </div>
        </div>

        {/* שם */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            שם <span className="text-red-500">*</span>
          </label>
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

        {/* אזור */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">אזור</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="border rounded p-2 w-full"
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
            />
          )}
        </div>

        {/* קטגוריה */}
        <div>
          <label className="block text-sm text-neutral-700 mb-1">סטטוס</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded p-2 w-full"
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
              className="border rounded p-2 w-full mt-2"
            />
          )}
        </div>

        <div className="space-y-4">
          <span className="block text-sm text-neutral-700 mb-1">
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
                className="border rounded p-2 w-full"
              />
              <input
                type="tel"
                placeholder="טלפון"
                value={p.number}
                onChange={(e) =>
                  handlePhoneChange(idx, "number", e.target.value)
                }
                className="border rounded p-2 w-full"
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
