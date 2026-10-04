function propositionElement(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "proposition";

  const row = document.createElement("div");
  row.className = "proposition-row";

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  if (hasChildren) {
    row.classList.add("expandable");
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.setAttribute("aria-expanded", "false");
  }

  const number = document.createElement("span");
  number.className = "number";
  number.textContent = item.number;

  const text = document.createElement("span");
  text.className = "text";
  text.innerHTML = item.text;

  function addInfoButton(kind, label, content) {
    const button = document.createElement("button");
    button.className = kind === "note" ? "comment-button note-button" : "comment-button";
    button.textContent = kind === "note" ? "i" : "К";
    button.title = label;
    button.setAttribute("aria-label", `${label} до положення ${item.number}`);
    text.appendChild(document.createTextNode(" "));
    text.appendChild(button);

    const panel = document.createElement("div");
    panel.className = kind === "note" ? "comment note" : "comment";
    panel.innerHTML = content;
    wrapper.appendChild(panel);

    button.addEventListener("click", event => {
      event.stopPropagation();
      panel.classList.toggle("visible");
    });
  }

  if (item.note) addInfoButton("note", "Примітка перекладача", item.note);
  if (item.comment) addInfoButton("comment", "Коментар", item.comment);

  const controls = document.createElement("span");
  if (hasChildren) {
    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "▶";
    chevron.setAttribute("aria-hidden", "true");
    controls.appendChild(chevron);
  }

  row.append(number, text, controls);
  wrapper.insertBefore(row, wrapper.firstChild);

  if (hasChildren) {
    const children = document.createElement("div");
    children.className = "children";
    item.children.forEach(child => children.appendChild(propositionElement(child)));
    wrapper.appendChild(children);

    const toggle = () => {
      const open = wrapper.classList.toggle("open");
      row.setAttribute("aria-expanded", String(open));
    };

    row.addEventListener("click", toggle);
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  }

  return wrapper;
}

async function loadTractatus() {
  const tree = document.getElementById("tractatus-tree");

  try {
    const [mainResponse, proposition3Response, proposition4Response] = await Promise.all([
      fetch("data/tractatus.json"),
      fetch("data/tractatus3.json"),
      fetch("data/tractatus4.json")
    ]);

    if (!mainResponse.ok) throw new Error(`HTTP ${mainResponse.status}`);
    if (!proposition3Response.ok) throw new Error(`HTTP ${proposition3Response.status}`);
    if (!proposition4Response.ok) throw new Error(`HTTP ${proposition4Response.status}`);

    const tractatus = await mainResponse.json();
    const proposition3 = await proposition3Response.json();
    const proposition4 = await proposition4Response.json();
    const replacements = { "3": proposition3, "4": proposition4 };

    Object.entries(replacements).forEach(([number, proposition]) => {
      const index = tractatus.findIndex(item => item.number === number);
      if (index !== -1) tractatus[index] = proposition;
    });

    tractatus.forEach(item => tree.appendChild(propositionElement(item)));
  } catch (error) {
    console.error("Не вдалося завантажити текст Трактату:", error);
    tree.textContent = "Не вдалося завантажити текст. Будь ласка, оновіть сторінку.";
  }
}

loadTractatus();

const prefaceToggle = document.getElementById("preface-toggle");
const prefaceText = document.getElementById("preface-text");
prefaceToggle.addEventListener("click", () => {
  const open = prefaceToggle.getAttribute("aria-expanded") === "true";
  prefaceToggle.setAttribute("aria-expanded", String(!open));
  prefaceText.hidden = open;
  prefaceToggle.classList.toggle("open", !open);
});

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
function showSection(id) {
  sections.forEach(section => section.classList.toggle("active-section", section.id === id));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.section === id));
  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
navLinks.forEach(link => link.addEventListener("click", () => showSection(link.dataset.section)));
const initialSection = location.hash.replace("#", "");
if ([...sections].some(section => section.id === initialSection)) showSection(initialSection);
