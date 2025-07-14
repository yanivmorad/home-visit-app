//src/utils/date.js

// פורמט תאריך ל־he-IL
export const formatDate = (isoDate = "") => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
};

// חישוב גיל מלא משנת לידה
export function getAgeFromDate(dateString = "") {
  if (!dateString) return null;
  const birth = new Date(dateString);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
