// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",
  authDomain: "liste-j.firebaseapp.com",
  projectId: "liste-j"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Variablen ---
const listCollection = db.collection("lists_termin");
const addBtn = document.getElementById("addBtn");
let editId = null;

// --- Add Item ---
function addItem() {
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date");

  const title = titleInput.value.trim();
  const date = dateInput.value.trim();

  if (!title || !date) return; // nichts einfügen, wenn leer

  const data = { title, date, done: false };

  if (editId) {
    listCollection.doc(editId).update(data);
    editId = null;
    addBtn.textContent = "+";
  } else {
    listCollection.add(data);
  }

  titleInput.value = "";
  dateInput.value = "";
}

// Button Event
addBtn.addEventListener("click", addItem);

// --- Render Liste ---
function render(snapshot) {
  const container = document.getElementById("lists");
  if (!container) return;
  container.innerHTML = "";

  // Abgehakte Einträge nach unten sortieren
  const docs = snapshot.docs.sort((a, b) => {
    const ad = a.data().done ? 1 : 0;
    const bd = b.data().done ? 1 : 0;
    return ad - bd; // offene zuerst
  });

  docs.forEach(doc => {
    const item = doc.data();

    const div = document.createElement("div");
    div.className = "item";

    // Text
    const text = document.createElement("span");
    text.textContent = item.date + " – " + item.title;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;

    checkbox.addEventListener("change", () => {
      listCollection.doc(doc.id).update({ done: checkbox.checked });
    });

    // Bearbeiten Button
    const edit = document.createElement("button");
    edit.textContent = "B";
    edit.className = "delete";

    edit.addEventListener("click", () => {
      document.getElementById("title").value = item.title;
      document.getElementById("date").value = item.date;
      editId = doc.id;
      addBtn.textContent = "✓";
    });

    // Notiz Button
    const noteBtn = document.createElement("button");
    noteBtn.textContent = "K";
    noteBtn.className = "noteBtn";
    if (item.note && item.note.trim() !== "") noteBtn.classList.add("active");

    // Notiz Box
    const noteBox = document.createElement("div");
    noteBox.className = "noteBox";
    noteBox.style.display = "none";

    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.placeholder = "Notiz hinzufügen...";
    noteInput.value = item.note || "";

    noteBox.appendChild(noteInput);

    noteBtn.addEventListener("click", () => {
      noteBox.style.display = noteBox.style.display === "none" ? "block" : "none";
    });

    noteInput.addEventListener("change", () => {
      listCollection.doc(doc.id).update({ note: noteInput.value });
      if (noteInput.value.trim() !== "") noteBtn.classList.add("active");
      else noteBtn.classList.remove("active");
    });

    // Actions Container
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.appendChild(checkbox);
    actions.appendChild(noteBtn);
    actions.appendChild(edit);

    // Done Style
    if (item.done) {
      div.style.opacity = 0.5;
      div.style.textDecoration = "line-through";
    }

    // Elemente zusammenfügen
    div.appendChild(text);
    div.appendChild(actions);
    div.appendChild(noteBox);

    container.appendChild(div);
  });
}

// Echtzeit Updates
listCollection.onSnapshot(render);
