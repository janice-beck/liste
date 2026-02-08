// Firebase Config
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "liste-j",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Welche Collection?
const page = document.body.dataset.page || "film";
const listCollection = db.collection(`lists_${page}`);

// Add Item
function addItem() {
  const person = document.getElementById("person").value;
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;
  if (!title || !link) return;

  listCollection.add({ person, title, link }).then(() => {
    document.getElementById("title").value = "";
    document.getElementById("link").value = "";
  });
}

// EventListener
document.getElementById("addBtn").addEventListener("click", addItem);

// Render Funktion
function render(snapshot) {
  const container = document.getElementById("lists");
  if (!container) return;

  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const item = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <a href="${item.link}" target="_blank">${item.title}</a> – ${item.person}
      <button class="deleteBtn">✕</button>
    `;

    div.querySelector(".deleteBtn").onclick = () => {
      listCollection.doc(id).delete();
    };

    container.appendChild(div);
  });
}

// Echtzeit-Updates
listCollection.onSnapshot(render);
