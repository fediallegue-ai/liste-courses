// app.js — logique de la liste de courses partagée
// Nécessite firebase-config.js (voir firebase-config.example.js) à côté de ce fichier.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, onValue, push, update, remove, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const itemsRef = ref(db, "items");

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("emptyState");
const countEl = document.getElementById("itemCount");
const stampEl = document.getElementById("statusStamp");
const formEl = document.getElementById("addForm");
const itemInput = document.getElementById("itemInput");
const nameInput = document.getElementById("nameInput");

// on se souvient du prénom sur cet appareil
nameInput.value = localStorage.getItem("courses:nom") || "";
nameInput.addEventListener("change", () => {
  localStorage.setItem("courses:nom", nameInput.value.trim());
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = itemInput.value.trim();
  if (!text) return;
  const who = nameInput.value.trim() || "?";
  push(itemsRef, {
    text,
    who,
    checked: false,
    createdAt: serverTimestamp()
  });
  itemInput.value = "";
  itemInput.focus();
});

onValue(itemsRef, (snapshot) => {
  const data = snapshot.val() || {};
  const entries = Object.entries(data).sort((a, b) => {
    // non cochés d'abord, puis par date d'ajout
    const [, itemA] = a, [, itemB] = b;
    if (!!itemA.checked !== !!itemB.checked) return itemA.checked ? 1 : -1;
    return (itemA.createdAt || 0) - (itemB.createdAt || 0);
  });

  render(entries);
  setStatus("ok", "à jour");
}, (error) => {
  console.error(error);
  setStatus("err", "hors ligne");
});

function render(entries) {
  listEl.innerHTML = "";
  const remaining = entries.filter(([, it]) => !it.checked).length;

  if (entries.length === 0) {
    listEl.classList.add("hidden");
    emptyEl.classList.add("show");
  } else {
    listEl.classList.remove("hidden");
    emptyEl.classList.remove("show");
  }

  countEl.textContent = `${remaining} article${remaining === 1 ? "" : "s"}`;

  for (const [id, it] of entries) {
    listEl.appendChild(renderItem(id, it));
  }
}

function renderItem(id, it) {
  const row = document.createElement("div");
  row.className = "item";

  const check = document.createElement("button");
  check.className = "item__check";
  check.type = "button";
  check.dataset.checked = !!it.checked;
  check.textContent = it.checked ? "✓" : "";
  check.setAttribute("aria-label", it.checked ? "Marquer non acheté" : "Marquer acheté");
  check.addEventListener("click", () => {
    update(ref(db, `items/${id}`), { checked: !it.checked });
  });

  const text = document.createElement("span");
  text.className = "item__text";
  text.dataset.checked = !!it.checked;
  text.textContent = it.text;

  const who = document.createElement("span");
  who.className = "item__who";
  who.textContent = it.who || "?";

  const del = document.createElement("button");
  del.className = "item__del";
  del.type = "button";
  del.textContent = "✕";
  del.setAttribute("aria-label", "Supprimer");
  del.addEventListener("click", () => remove(ref(db, `items/${id}`)));

  row.append(check, text, who, del);
  return row;
}

function setStatus(state, label) {
  stampEl.dataset.state = state;
  stampEl.textContent = label;
}
