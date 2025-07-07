// src/components/MeetingSection.jsx
import React, { useState, useEffect } from "react";
import MeetingItem from "./MeetingItem";

export default function MeetingSection({ meetings = [], onAdd }) {
  const ITEMS_STEP = 4;
  const [visibleCount, setVisibleCount] = useState(ITEMS_STEP);
  const [newDate, setNewDate] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const list = Array.isArray(meetings) ? meetings : [];

  // ברגע שהרשימה משתנה – מתחילים שוב מ-4 האחרונות
  useEffect(() => {
    setVisibleCount(ITEMS_STEP);
  }, [meetings]);

  // מיון יורד לפי תאריך (החדשות בראש)
  const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

  const visibleMeetings = sorted.slice(0, visibleCount);
  const hasMore = sorted.length > visibleCount;
  const canHide = visibleCount > ITEMS_STEP;

  // handleAdd וכו' – כפי שהגדרת כבר
  const handleAdd = () => {
    if (!newDate || !newSummary) return;
    onAdd({ date: newDate, summary: newSummary });
    setNewDate("");
    setNewSummary("");
  };

  return (
    <section dir="rtl" className="space-y-4 text-right">
      <div>
        <h3 className="text-xl font-semibold">היסטוריית פגישות</h3>

        {visibleMeetings.length === 0 ? (
          <p className="text-neutral-500">אין פגישות להצגה</p>
        ) : (
          visibleMeetings.map((m) => <MeetingItem key={m.id} meeting={m} />)
        )}

        <div className="mt-2 flex gap-4">
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_STEP)}
              className="text-blue-600 hover:underline"
            >
              ראה עוד פגישות
            </button>
          )}
          {canHide && (
            <button
              onClick={() => setVisibleCount(ITEMS_STEP)}
              className="text-gray-600 hover:underline"
            >
              הסתר
            </button>
          )}
        </div>
      </div>

      {/* טופס הוספת פגישה חדשה */}
      <div className="bg-white p-6 rounded shadow space-y-2">
        <h3 className="text-xl font-semibold">הוסף פגישה חדשה</h3>
        <input
          type="date"
          className="border rounded p-2 w-full"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <textarea
          className="border rounded p-2 w-full"
          placeholder="סיכום הפגישה..."
          value={newSummary}
          onChange={(e) => setNewSummary(e.target.value)}
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
