// src/components/MeetingSection.jsx
import React, { useState, useEffect } from "react";
import MeetingItem from "./MeetingItem";

export default function MeetingSection({
  meetings = [], // ברירת מחדל למערך
  onAdd,
}) {
  const [newDate, setNewDate] = useState("");
  const [newSummary, setNewSummary] = useState("");

  // ודא שמתקבל תמיד מערך
  const list = Array.isArray(meetings) ? meetings : [];

  // לוג ברגע שהפרופס meetings משתנים
  useEffect(() => {
    console.log("📦 [MeetingSection] meetings prop:", meetings);
    console.log("📦 [MeetingSection] normalized list:", list);
  }, [meetings, list]);

  // לוג כשנכנס לפונקציית הוספה
  const handleAdd = () => {
    console.log("🔍 [MeetingSection] onAdd is", onAdd);
    console.log("🖱️ [MeetingSection] handleAdd called", {
      date: newDate,
      summary: newSummary,
    });
    if (!newDate || !newSummary) return;
    onAdd({ date: newDate, summary: newSummary });
    console.log("✅ [MeetingSection] onAdd invoked");
    setNewDate("");
    setNewSummary("");
  };

  return (
    <section dir="rtl" className="space-y-4 text-right">
      <div>
        <h3 className="text-xl font-semibold">היסטוריית פגישות</h3>
        {list.length === 0 ? (
          <p className="text-neutral-500">אין פגישות להצגה</p>
        ) : (
          list.map((m) => {
            console.log("🔹 [MeetingSection] rendering meeting:", m);
            return <MeetingItem key={m.id} meeting={m} />;
          })
        )}
      </div>

      <div className="bg-white p-6 rounded shadow space-y-2">
        <h3 className="text-xl font-semibold">הוסף פגישה חדשה</h3>

        <input
          type="date"
          className="border rounded p-2 w-full"
          value={newDate}
          onChange={(e) => {
            console.log(
              "🗓️ [MeetingSection] newDate changed to",
              e.target.value
            );
            setNewDate(e.target.value);
          }}
        />

        <textarea
          className="border rounded p-2 w-full"
          placeholder="סיכום הפגישה..."
          value={newSummary}
          onChange={(e) => {
            console.log(
              "✏️ [MeetingSection] newSummary changed to",
              e.target.value
            );
            setNewSummary(e.target.value);
          }}
        />

        <button
          type="button"
          onClick={handleAdd}
          disabled={!newDate || !newSummary}
          className="
            mt-2 px-4 py-2 rounded text-white transition 
            bg-blue-600 hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          הוסף פגישה
        </button>
      </div>
    </section>
  );
}
