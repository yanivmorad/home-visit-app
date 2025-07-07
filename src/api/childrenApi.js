// const BASE = "http://localhost:4000/api/children";
const BASE = "https://home-visit-backend.onrender.com/api/children";

export async function fetchChildren() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Error fetching children");
  return res.json(); // [{ id,name,age,distance,urgent,… }, …]
}

export async function fetchChild(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Error fetching child details");
  return res.json(); // { id,name,age,address,visits: [… ] }
}

export async function createChild(data) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating child");
  return res.json();
}

export async function replaceChild(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating child");
  return res.json();
}

export async function patchChild(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error patching child");
  return res.json();
}

export async function deleteChild(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting child");
  return res.json();
}
