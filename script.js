// ⚡ Firebase modular / compat (kompatibel für GitHub Pages)
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

// === Helfer: Welche Collection für diese Seite? ===
const page = document.body.dataset.page || "film"; // Default: "film"
const listCollection = db.collection(`lists_${page}`);

// === addItem-Funktion global machen ===
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
window.addItem = addItem; // global verfügbar für Button

// === render-Funktion ===
function render() {
  const container = document.getElementById("lists");
  if (!container) return; // Sicherheit

  container.innerHTML = "";

  listCollection.get().then(snapshot => {
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
  });
}

// === Echtzeit-Updates automatisch ===
listCollection.onSnapshot(render);

// === Initial render ===
render();
