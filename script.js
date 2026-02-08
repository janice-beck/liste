// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyAZ-_7KekhRyOrCqzdK1-4JOwlqtIrAeuQ",

  authDomain: "liste-j.firebaseapp.com",

  projectId: "liste-j",

  storageBucket: "liste-j.firebasestorage.app",

  messagingSenderId: "950349344673",

  appId: "1:950349344673:web:707c157b50e02592ea65e0"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const listCollection = db.collection("lists");


let data = JSON.parse(localStorage.getItem("lists")) || [];

function addItem() {
  const person = document.getElementById("person").value;
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;

  if (!title || !link) return;

  // In Firestore speichern
  listCollection.add({ person, title, link })
    .then(() => {
      document.getElementById("title").value = "";
      document.getElementById("link").value = "";
    });
}


function render() {
  const container = document.getElementById("lists");
  container.innerHTML = "";

  listCollection.get().then(snapshot => {
    snapshot.forEach((doc) => {
      const item = doc.data();
      const id = doc.id;

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

// Echtzeit-Updates automatisch
listCollection.onSnapshot(render);


render();
