// src/api/client.js

// שולף את הטוקן מה־URL או מ-localStorage
export function getAccessToken() {
  const url = new URL(window.location.href);
  const tokenFromUrl = url.searchParams.get("access");
  if (tokenFromUrl) {
    localStorage.setItem("access_token", tokenFromUrl);
  }
  return localStorage.getItem("access_token");
}

// wrapper סביב fetch שמוסיף את ה־token
export async function clientFetch(url, options = {}) {
  const token = getAccessToken();

  // הוספת header של הטוקן
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "x-access-token": token,
  };

  // עבור GET עם query param, אפשר גם לצרף את ?access=token אם תרצו
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || response.statusText);
  }

  // אם אין גוף (204) נחזיר null
  return response.status === 204 ? null : response.json();
}
