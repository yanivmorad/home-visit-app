import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useChild } from "../hooks/useChild";
import { useMeetings, useAddMeeting } from "../hooks/useMeetings";
import MeetingItem from "../components/MeetingItem";

export default function ChildDetails() {
  const { id } = useParams();
  const { data: child, isLoading: kidLoading, error: kidError } = useChild(id);
  const {
    data: meetings = [],
    isLoading: meetLoading,
    error: meetError,
  } = useMeetings(id);

  const addM = useAddMeeting(id);
  const [newDate, setNewDate] = useState("");
  const [newSummary, setNewSummary] = useState("");

  if (kidLoading || meetLoading) return <p>טוען…</p>;
  if (kidError) return <p>שגיאה בטעינת פרטי ילד</p>;
  if (meetError) return <p>שגיאה בטעינת פגישות</p>;

  const handleAdd = () => {
    console.log("handleAdd called", newDate, newSummary);
    if (!newDate || !newSummary) return;
    addM.mutate({ date: newDate, summary: newSummary });
    setNewDate("");
    setNewSummary("");
  };

  return (
    <div dir="rtl" className="space-y-6 text-right">
      <Link to="/" className="text-primary-600 hover:underline">
        ← חזרה
      </Link>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-primary-600 mb-1">
          {child.name}
        </h2>
        <p className="text-neutral-700">
          כתובת: {child.address} {child.city}
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">היסטוריית פגישות</h3>
        {meetings.length === 0 && (
          <p className="text-neutral-500">אין פגישות להצגה</p>
        )}
        {meetings.map((m) => (
          <MeetingItem key={m.id} meeting={m} childId={id} />
        ))}
      </section>

      <section className="bg-white p-6 rounded shadow space-y-2">
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
          disabled={!newDate || !newSummary || addM.isLoading}
          className="
    mt-2 px-4 py-2 rounded text-white transition 
    bg-blue-600 hover:bg-blue-700 
    disabled:opacity-50 disabled:cursor-not-allowed
  "
        >
          {addM.isLoading ? "מוסיף..." : "הוסף פגישה"}
        </button>
      </section>
    </div>
  );
}
