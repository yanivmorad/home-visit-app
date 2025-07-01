// src/data/kids.js

export const kids = [
  {
    id: 1,
    name: "דניאל",
    age: 3,
    distance: 1.2,
    urgent: false,
    address: "רחוב הדקל 5, פתח תקווה",
    visits: [
      {
        id: 101,
        date: "2025-05-10",
        notes: "בדיקת גובה ומשקל – הכל תקין.",
      },
      {
        id: 102,
        date: "2025-06-20",
        notes: "שיחה עם ההורים על שעות שינה ואכילה.",
      },
    ],
  },
  {
    id: 2,
    name: "שרה",
    age: 2,
    distance: 0.5,
    urgent: true,
    address: "שדרות הציונות 12, לוד",
    visits: [
      {
        id: 201,
        date: "2025-04-15",
        notes: "בדיקת עיניים – הופנתה לרופא מומחה.",
      },
    ],
  },
  {
    id: 3,
    name: "עמית",
    age: 4,
    distance: 2.8,
    urgent: false,
    address: "רחוב האלון 3, רמלה",
    visits: [
      {
        id: 301,
        date: "2025-03-01",
        notes: "שיחה עם הגננת על התנהגות – בוצע מעקב.",
      },
      {
        id: 302,
        date: "2025-06-05",
        notes: "בדיקה שגרתית – כל המדדים תקינים.",
      },
    ],
  },
  {
    id: 4,
    name: "יואב",
    age: 5,
    distance: 0.8,
    urgent: true,
    address: "שדרות בן־גוריון 21, ראשון לציון",
    visits: [
      {
        id: 401,
        date: "2025-02-12",
        notes: "פגישה עם המטפלת – עלה נושא של פחדים בלילה.",
      },
    ],
  },
];
