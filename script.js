const firebaseConfig = {
  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",
  authDomain: "liste-j.firebaseapp.com",
  projectId: "liste-j",
  storageBucket: "liste-j.firebasestorage.app",
  messagingSenderId: "950349344673",
  appId: "1:950349344673:web:707c157b50e02592ea65e0"
};

let activeGenre = null;
let editId = null;


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const page = document.body.dataset.page || "film";
const listCollection = db.collection(`lists_${page}`);

function addItem() {
  const person = document.getElementById("person").value;
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;
  const genres = document.getElementById("genres").value
    .split(",")
    .map(g => g.trim())
    .filter(g => g);

  if (!title || !link) return;

const data = { person, title, link, genres, done: false };

  if (editId) {
    listCollection.doc(editId).update(data);
    editId = null;
    document.getElementById("addBtn").textContent = "+";
  } else {
    listCollection.add(data);
  }

  document.getElementById("title").value = "";
  document.getElementById("link").value = "";
  document.getElementById("genres").value = "";
}


document.getElementById("addBtn").addEventListener("click", addItem);

function render(snapshot) {
  const container = document.getElementById("lists");
  if (!container) return;

  container.innerHTML = "";

 snapshot.forEach(doc => {
  const item = doc.data();

  if (activeGenre && (!item.genres || !item.genres.includes(activeGenre))) return;


    const div = document.createElement("div");
    div.className = "item";

    const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = item.done === true;

checkbox.addEventListener("change", () => {
  listCollection.doc(doc.id).update({
    done: checkbox.checked
  });

  if (item.done) {
  div.style.opacity = "0.5";
  div.style.textDecoration = "line-through";
}


});


    const a = document.createElement("a");
    a.href = item.link;
    a.target = "_blank";
    a.textContent = item.title;

  const del = document.createElement("button");
del.textContent = "✕";
del.className = "delete";


    // LÖSCHEN
// BEARBEITEN
del.addEventListener("click", () => {
  document.getElementById("person").value = item.person;
  document.getElementById("title").value = item.title;
  document.getElementById("link").value = item.link;
  document.getElementById("genres").value = item.genres ? item.genres.join(", ") : "";

  editId = doc.id;
  document.getElementById("addBtn").textContent = "✓";
});


div.appendChild(checkbox);
    div.appendChild(a);
    div.append(" – " + item.person);
    if (item.genres && item.genres.length) {
  const g = document.createElement("div");
  g.className = "genres";
item.genres.forEach(genre => {
  const tag = document.createElement("span");
  tag.textContent = "#" + genre + " ";
  tag.className = "tag";

  tag.addEventListener("click", () => {
    activeGenre = activeGenre === genre ? null : genre;
    listCollection.get().then(render);
  });

  g.appendChild(tag);
});
  div.appendChild(g);
}

    div.appendChild(del);

    container.appendChild(div);


  });
}


listCollection.onSnapshot(render);
