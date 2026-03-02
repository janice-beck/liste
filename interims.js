// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",
  authDomain: "liste-j.firebaseapp.com",
  projectId: "liste-j"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Variablen ---
const listCollection = db.collection("lists_private");
const addBtn = document.getElementById("addBtn");
const titleInput = document.getElementById("title");
const listsContainer = document.getElementById("lists");
let editId = null;

// --- Offene Notizen merken ---
const openNotes = {}; // doc.id => true/false

// --- Debounce Funktion ---
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// --- Add Item ---
function addItem() {
  const title = titleInput.value.trim();
  if (!title) return;

  const data = { title, done: false };

  if (editId) {
    listCollection.doc(editId).update(data);
    editId = null;
    addBtn.textContent = "+";
  } else {
    listCollection.add(data);
  }

  titleInput.value = "";
}

// --- Button Listener ---
addBtn.addEventListener("click", addItem);

// --- Auto-Resize für Textarea ---
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// --- Render Funktion ---
function render(snapshot) {
  listsContainer.innerHTML = "";

  snapshot.forEach(doc => {
    const item = doc.data();

    const div = document.createElement("div");
    div.className = "item";

    // --- Text ---
    const text = document.createElement("span");
    text.textContent = item.title;

    // --- Checkbox ---
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done === true;

    checkbox.addEventListener("change", () => {
      listCollection.doc(doc.id).update({ done: checkbox.checked });
    });

    // --- Notiz Button ---
    const noteBtn = document.createElement("button");
    noteBtn.textContent = "K";
    noteBtn.className = "noteBtn";
    if (item.note && item.note.trim() !== "") {
      noteBtn.classList.add("active");
    }

    // --- NOTE BOX ---
    const noteBox = document.createElement("div");
    noteBox.className = "noteBox";
    noteBox.style.display = openNotes[doc.id] ? "block" : "none";

    const noteInput = document.createElement("textarea");
    noteInput.placeholder = "Voilà Kommentarfunktion…";
    noteInput.value = item.note || "";

    noteBox.appendChild(noteInput);

    // Auto resize
    autoResize(noteInput);

    noteInput.addEventListener("input", () => {
      autoResize(noteInput);
    });

    // --- Debounced Firestore Update ---
    noteInput.addEventListener("input", debounce(() => {
      listCollection.doc(doc.id).update({ note: noteInput.value });
    }, 500));

    // --- Toggle Notizfeld ---
    noteBtn.addEventListener("click", () => {
      const isOpen = noteBox.style.display === "block";
      noteBox.style.display = isOpen ? "none" : "block";
      openNotes[doc.id] = !isOpen;
    });

    // --- Edit Button ---
    const editBtn = document.createElement("button");
    editBtn.textContent = "B";
    editBtn.className = "delete";

    editBtn.addEventListener("click", () => {
      titleInput.value = item.title;
      editId = doc.id;
      addBtn.textContent = "✓";
    });

    // --- Actions Container ---
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.appendChild(checkbox);
    actions.appendChild(noteBtn);
    actions.appendChild(editBtn);

    // --- Done Style ---
    if (item.done) {
      div.style.opacity = 0.5;
      div.style.textDecoration = "line-through";
    }

    // --- Append ---
    div.appendChild(text);
    div.appendChild(actions);
    div.appendChild(noteBox);

    listsContainer.appendChild(div);
  });
}

// --- Echtzeit Updates ---
listCollection.onSnapshot(render);
