let data = JSON.parse(localStorage.getItem("lists")) || [];

function addItem() {
  const person = document.getElementById("person").value;
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;

  if (!title || !link) return;

  data.push({ person, title, link });
  localStorage.setItem("lists", JSON.stringify(data));

  document.getElementById("title").value = "";
  document.getElementById("link").value = "";

  render();
}

function render() {
  const container = document.getElementById("lists");
  container.innerHTML = "";

  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
    <a href="${item.link}" target="_blank">${item.title}</a> – ${item.person}
      <button class="deleteBtn">✕</button>
    `;

    div.querySelector(".deleteBtn").onclick = () => {
      data.splice(index, 1);
      localStorage.setItem("lists", JSON.stringify(data));
      render();
    };

    container.appendChild(div);
  });
}

render();
