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
    // bearbeiten
    listCollection.doc(editId).update(data);
    editId = null;
    addBtn.textContent = "+";
  } else {
    // neu hinzufügen
    listCollection.add(data);
  }

  // Felder leeren
  titleInput.value = "";
  dateInput.value = "";
}

// Button Event
addBtn.addEventListener("click", addItem);

// --- Render Liste ---
function render(snapshot) {
  const container = document.getElementById("lists");
  container.innerHTML = "";

  snapshot.forEach(doc => {
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
    edit.textContent = "✕";
    edit.className = "delete";

    edit.addEventListener("click", () => {
      document.getElementById("title").value = item.title;
      document.getElementById("date").value = item.date;
      editId = doc.id;
      addBtn.textContent = "✓";
    });

    // Actions Container rechts
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.appendChild(checkbox);
    actions.appendChild(edit);

    // erledigt durchstreichen
    if (item.done) {
      div.style.opacity = 0.5;
      div.style.textDecoration = "line-through";
    }

    // Elemente zusammenfügen
    div.appendChild(text);
    div.appendChild(actions);
    container.appendChild(div);
  });
}

// --- Echtzeit Updates ---
listCollection.onSnapshot(render);
