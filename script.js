// =====================
// Firebase Konfiguration
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",
  authDomain: "liste-j.firebaseapp.com",
  projectId: "liste-j",
  storageBucket: "liste-j.firebasestorage.app",
  messagingSenderId: "950349344673",
  appId: "1:950349344673:web:707c157b50e02592ea65e0"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =====================
// Collection je nach Seite
// =====================
const page = document.body.dataset.page || "film";
const listCollection = db.collection(`lists_${page}`);

console.log("Page:", page);

// =====================
// addItem
// =====================
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

// Button
document.getElementById("addBtn").addEventListener("click", addItem);

// =====================
// Render
// =====================
function render(snapshot) {
  const container = document.getElementById("lists");
  if (!container) return;

  container.innerHTML = "";

  snapshot.forEach(doc => {
    const item = doc.data();

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <a href="${item.link}" target="_blank">${item.title}</a> – ${item.person}
    `;

    container.appendChild(div);
  });
}

// =====================
// Live Sync
// =====================
listCollection.onSnapshot(render);
