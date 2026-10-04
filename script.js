function propositionElement(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "proposition";

  if (/^\d+\.0[1-9]$/.test(item.number)) wrapper.classList.add("tractatus-secondary-direct");
  if (/^\d+\.00[1-9]$/.test(item.number)) wrapper.classList.add("tractatus-tertiary-direct");

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
  text.innerHTML = String(item.text ?? "");

  // First diagram in 6.1203, redrawn from the source document.
  if (item.number === "6.1203") {
    const firstFigure = text.querySelector(".tractatus-figure");
    if (firstFigure) {
      firstFigure.innerHTML = `<svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Перша схема до 6.1203">
        <g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
          <!-- upper outer brace -->
          <path d="M35 46 C38 31 54 25 78 25 L117 25 C128 25 131 19 136 16 C141 19 144 25 155 25 L218 25 C242 25 257 32 260 46"/>
          <!-- lower outer brace -->
          <path d="M35 74 C38 89 54 95 78 95 L117 95 C128 95 131 101 136 104 C141 101 144 95 155 95 L218 95 C242 95 257 88 260 74"/>
          <!-- inner upper braces: both point outwards -->
          <path d="M99 53 C91 49 86 44 86 40 C86 36 91 33 99 31"/>
          <path d="M201 53 C209 49 214 44 214 40 C214 36 209 33 201 31"/>
          <!-- inner lower braces: both point outwards; left begins at X -->
          <path d="M99 67 C91 71 86 76 86 80 C86 84 91 87 99 89"/>
          <path d="M201 67 C209 71 214 76 214 80 C214 84 209 87 201 89"/>
        </g>
        <g fill="currentColor" font-family="Georgia, 'Times New Roman', serif" font-size="18" font-style="italic">
          <text x="48" y="66">I p X</text>
          <text x="205" y="66">I q X</text>
        </g>
      </svg>`;
    }
  }

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

async function fetchJson(path) {
  const response = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

async function fetchBranch(path) {
  const response = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const source = await response.text();
  try { return JSON.parse(source); }
  catch (jsonError) { return Function(`"use strict"; return (${source});`)(); }
}

async function loadTractatus() {
  const tree = document.getElementById("tractatus-tree");
  try {
    const tractatus = await fetchJson("data/tractatus.json");
    const branchFiles = [
      ["3", "data/tractatus3.json"], ["4", "data/tractatus4.json"],
      ["5", "data/tractatus5.json"], ["6", "data/tractatus6.json"],
      ["7", "data/tractatus7.json"]
    ];
    for (const [number, path] of branchFiles) {
      try {
        const branch = await fetchBranch(path);
        const branchIndex = tractatus.findIndex(item => item.number === number);
        if (branchIndex !== -1) tractatus[branchIndex] = branch;
        else tractatus.push(branch);
      } catch (error) { console.error(`Не вдалося завантажити ${path}:`, error); }
    }
    tractatus.sort((a, b) => Number(a.number) - Number(b.number));
    tree.replaceChildren();
    tractatus.forEach(item => tree.appendChild(propositionElement(item)));
  } catch (error) {
    console.error("Не вдалося завантажити основний текст Трактату:", error);
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
