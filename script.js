const firebaseConfig = {
  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",
  authDomain: "liste-j.firebaseapp.com",
  projectId: "liste-j",
  storageBucket: "liste-j.firebasestorage.app",
  messagingSenderId: "950349344673",
  appId: "1:950349344673:web:707c157b50e02592ea65e0"
};

let activeGenre = null;

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

listCollection.add({
  person,
  title,
  link,
  genres
});

document.getElementById("genres").value = "";



  document.getElementById("title").value = "";
  document.getElementById("link").value = "";
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

    const a = document.createElement("a");
    a.href = item.link;
    a.target = "_blank";
    a.textContent = item.title;

  const del = document.createElement("button");
del.textContent = "✕";
del.className = "delete";


    // LÖSCHEN
    del.addEventListener("click", () => {
      listCollection.doc(doc.id).delete();
    });

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
