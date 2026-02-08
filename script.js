const firebaseConfig = {
  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",
  authDomain: "liste-j.firebaseapp.com",
  projectId: "liste-j",
  storageBucket: "liste-j.firebasestorage.app",
  messagingSenderId: "950349344673",
  appId: "1:950349344673:web:707c157b50e02592ea65e0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const page = document.body.dataset.page || "film";
const listCollection = db.collection(`lists_${page}`);

function addItem() {
  const person = document.getElementById("person").value;
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;

  if (!title || !link) return;

  listCollection.add({
    person: person,
    title: title,
    link: link
  });

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

    const div = document.createElement("div");
    div.className = "item";

    const a = document.createElement("a");
    a.href = item.link;
    a.target = "_blank";
    a.textContent = item.title;

    div.appendChild(a);
    div.append(" – " + item.person);

    container.appendChild(div);
  });
}

listCollection.onSnapshot(render);
