// src/api/client.js
// import { useNavigate } from "react-router-dom";

// מחלץ טוקן מה־URL או מה־localStorage ושומר אותו ל־30 יום
export function getAccessToken() {
  const url = new URL(window.location.href);
  const tokenFromUrl = url.searchParams.get("access");

  if (tokenFromUrl) {
    localStorage.setItem("access_token", tokenFromUrl);
    const expiryDate = Date.now() + 1000 * 60 * 60 * 24 * 30;
    localStorage.setItem("access_expiry", expiryDate.toString());
    console.log("TOKEN BEING SENT (from URL):", tokenFromUrl);
    return tokenFromUrl;
  }

  const token = localStorage.getItem("access_token");
  const expiry = parseInt(localStorage.getItem("access_expiry"), 10);

  if (!token || !expiry || Date.now() > expiry) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_expiry");
    console.log("TOKEN BEING SENT: null (missing or expired)");
    return null;
  }

  console.log("TOKEN BEING SENT (from localStorage):", token);
  return token;
}

export async function clientFetch(url, options = {}) {
  const token = getAccessToken();

  if (!token || token.trim() === "") {
    const error = new Error("Missing access token");
    error.status = 401;
    throw error;
  }

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "x-access-token": token, // זה מה שהשרת מחפש
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const error = new Error(errData.error || response.statusText);
    error.status = response.status;

    // כאן הפנייה אוטומטית ל־Unauthorized אם 401 או 403
    if (error.status === 401 || error.status === 403) {
      window.location.href = "/unauthorized";
      return; // חשוב לעצור את הפונקציה
    }

    throw error;
  }

  return response.status === 204 ? null : response.json();
}
