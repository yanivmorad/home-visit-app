// src/pages/ChildDetails.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useMeetings, useAddMeeting } from "../hooks/useMeetings";
import ChildInfo from "../components/ChildInfo";
import MeetingSection from "../components/MeetingSection";
import { useChild } from "../hooks/useChildren";

export default function ChildDetails() {
  const { id } = useParams();
  console.log("🔍 ChildDetails render, id =", id);

  const {
    data: child,
    isLoading: loadingChild,
    isError: errorChild,
  } = useChild(id);
  console.log(
    "🧒 child data:",
    child,
    "loadingChild:",
    loadingChild,
    "errorChild:",
    errorChild
  );

  const {
    data: meetings = [],
    isLoading: loadingMeetings,
    isError: errorMeetings,
  } = useMeetings(id);
  console.log(
    "📅 meetings data:",
    meetings,
    "loadingMeetings:",
    loadingMeetings,
    "errorMeetings:",
    errorMeetings
  );

  const addMeeting = useAddMeeting(id);

  if (loadingChild) return <p>טוען פרטי ילד…</p>;
  if (errorChild) return <p>שגיאה בטעינת פרטי ילד</p>;

  return (
    <div dir="rtl" className="space-y-6 text-right">
      <Link to="/" className="text-primary-600 hover:underline">
        ← חזרה
      </Link>

      <ChildInfo child={child} />

      {loadingMeetings ? (
        <p>טוען פגישות…</p>
      ) : errorMeetings ? (
        <p>שגיאה בטעינת פגישות</p>
      ) : (
        <MeetingSection
          meetings={meetings}
          onAdd={async ({ date, summary }) => {
            console.log("➕ Adding meeting:", { date, summary });
            await addMeeting.mutateAsync({ date, summary });
            console.log("✅ Meeting added");
          }}
        />
      )}
    </div>
  );
}
