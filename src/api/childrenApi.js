//src/api/childrenApi.js

import { clientFetch } from "./client";

// const BASE = "http://localhost:4000/api/children";
const BASE = "https://home-visit-backend.onrender.com/api/children";

export async function fetchChildren() {
  return await clientFetch(BASE);
}

export async function fetchChild(id) {
  return await clientFetch(`${BASE}/${id}`);
}

export async function createChild(data) {
  return await clientFetch(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function replaceChild(id, data) {
  return await clientFetch(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function patchChild(id, data) {
  return await clientFetch(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteChild(id) {
  return await clientFetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
