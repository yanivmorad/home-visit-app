// src/pages/Unauthorized.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Unauthorized() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  // const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from?.pathname || "/";
  const reason = state?.reason;

  let message;
  if (reason === "missing") {
    message = "ההתחברות נכשלה: אין טוקן";
  } else if (reason === "invalid") {
    message = "הטוקן לא נכון, נסה שוב";
  } else {
    message = "נא להזין את הטוקן כדי להמשיך";
  }

  function onSubmit(e) {
    e.preventDefault();
    const token = input.trim();
    if (!token) {
      setError("נא להזין טוקן");
      return;
    }

    localStorage.setItem("access_token", token);
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem("access_expiry", expiry.toString());

    // רענון אמיתי
    window.location.href = from;
  }

  return (
    <div className="h-screen flex flex-col items-center  bg-gradient-to-b from-gray-50 to-gray-100 px-4 pt-20">
      <div className="bg-white shadow-md rounded-2xl max-w-md w-full p-8 space-y-6 border border-gray-200">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-[#1F3A93] text-center">
            אין לך גישה
          </h1>
          <p className="text-gray-500 text-center">{message}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-right">
          <div>
            <label
              htmlFor="token"
              className="block text-sm text-neutral-700 mb-1"
            >
              טוקן גישה
            </label>
            <input
              id="token"
              type="text"
              placeholder="הזן כאן את הטוקן שלך"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="
    w-full py-2 rounded-md
    bg-[#1F3A93] text-white font-semibold 
    hover:bg-[#162D6F] transition
  "
          >
            שלח טוקן
          </button>
        </form>
      </div>
    </div>
  );
}
