const container = document.getElementById("categories");
const input = document.getElementById("categoryName");
const button = document.getElementById("addCategory");

let categories = JSON.parse(localStorage.getItem("categories")) || [];

function renderCategories() {
  container.innerHTML = "";

  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category";
    div.textContent = cat;

    // Später Klick auf Unterseite
    div.onclick = () => {
      alert("Später: " + cat);
    };

    container.appendChild(div);
  });
}

button.onclick = () => {
  if (!input.value) return;

  categories.push(input.value);
  localStorage.setItem("categories", JSON.stringify(categories));
  input.value = "";
  renderCategories();
};

renderCategories();

const movieList = document.getElementById("movieList");
const titleInput = document.getElementById("title");
const linkInput = document.getElementById("link");
const addedBySelect = document.getElementById("addedBy");
const addButton = document.getElementById("addMovie");

let movies = JSON.parse(localStorage.getItem("movies")) || [];

function renderMovies(filter = "Alle") {
  movieList.innerHTML = "";

  movies
    .filter(m => filter === "Alle" || m.addedBy === filter)
    .forEach(m => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${m.link}" target="_blank">${m.title}</a> – ${m.addedBy}`;
      movieList.appendChild(li);
    });
}

// Hinzufügen
addButton.onclick = () => {
  const title = titleInput.value.trim();
  const link = linkInput.value.trim();
  const addedBy = addedBySelect.value;

  if (!title || !link) return;

  movies.push({ title, link, addedBy });
  localStorage.setItem("movies", JSON.stringify(movies));

  titleInput.value = "";
  linkInput.value = "";

  renderMovies(document.getElementById("filter").value);
};

// Filter ändern
document.getElementById("filter").onchange = (e) => {
  renderMovies(e.target.value);
};

// Initial render
renderMovies();

