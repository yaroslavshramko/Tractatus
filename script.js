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

  // 6.1203: faithful, responsive redrawings of the five diagrams in the
  // published Tractatus. Only the truth-value letters are localized: T/F -> І/Х.
  if (item.number === "6.1203") {
    const figures = [...text.querySelectorAll(".tractatus-figure")];
    const common = `style="display:block;width:min(100%,430px);height:auto;margin:0.6rem auto;overflow:visible" xmlns="http://www.w3.org/2000/svg"`;
    const ink = `fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;
    const font = `fill="currentColor" font-family="Georgia,'Times New Roman',serif" font-size="18"`;

    const svgs = [
      `<svg viewBox="0 0 360 130" ${common} role="img" aria-label="Істиннісні комбінації p та q">
        <g ${font}><text x="55" y="69">І</text><text x="91" y="69" font-style="italic">p</text><text x="126" y="69">Х</text><text x="218" y="69">І</text><text x="254" y="69" font-style="italic">q</text><text x="289" y="69">Х</text></g>
        <g ${ink}>
          <!-- upper braces: each inner brace points outward -->
          <path d="M126 53 C126 43 118 39 109 39 L92 39 C82 39 76 34 76 25 C76 34 70 39 60 39 L55 39"/>
          <path d="M289 53 C289 43 281 39 272 39 L255 39 C245 39 239 34 239 25 C239 34 233 39 223 39 L218 39"/>
          <!-- lower braces: begin at the X poles and open outward -->
          <path d="M126 76 C126 87 118 92 109 92 L92 92 C82 92 76 97 76 106 C76 97 70 92 60 92 L55 92"/>
          <path d="M289 76 C289 87 281 92 272 92 L255 92 C245 92 239 97 239 106 C239 97 233 92 223 92 L218 92"/>
          <!-- outer braces join the two argument-braces -->
          <path d="M55 39 C43 39 37 45 37 55 C37 61 32 65 24 65 C32 65 37 69 37 75 C37 85 43 92 55 92"/>
          <path d="M289 39 C301 39 307 45 307 55 C307 61 312 65 320 65 C312 65 307 69 307 75 C307 85 301 92 289 92"/>
        </g>
      </svg>`,

      `<svg viewBox="0 0 360 190" ${common} role="img" aria-label="Схема для p імплікує q">
        <g ${font}><text x="55" y="96">І</text><text x="91" y="96" font-style="italic">p</text><text x="126" y="96">Х</text><text x="218" y="96">І</text><text x="254" y="96" font-style="italic">q</text><text x="289" y="96">Х</text><text x="170" y="24">Х</text><text x="170" y="178">І</text></g>
        <g ${ink}>
          <path d="M126 80 C126 70 118 66 109 66 L92 66 C82 66 76 61 76 52 C76 61 70 66 60 66 L55 66"/>
          <path d="M289 80 C289 70 281 66 272 66 L255 66 C245 66 239 61 239 52 C239 61 233 66 223 66 L218 66"/>
          <path d="M126 103 C126 114 118 119 109 119 L92 119 C82 119 76 124 76 133 C76 124 70 119 60 119 L55 119"/>
          <path d="M289 103 C289 114 281 119 272 119 L255 119 C245 119 239 124 239 133 C239 124 233 119 223 119 L218 119"/>
          <path d="M55 66 C43 66 37 72 37 82 C37 88 32 92 24 92 C32 92 37 96 37 102 C37 112 43 119 55 119"/>
          <path d="M289 66 C301 66 307 72 307 82 C307 88 312 92 320 92 C312 92 307 96 307 102 C307 112 301 119 289 119"/>
          <!-- published correlation: the sole false case p=I,q=X goes to X; the other three to I -->
          <path d="M175 31 L126 80"/><path d="M175 31 L289 80"/>
          <path d="M175 163 L55 119"/><path d="M175 163 L218 119"/><path d="M175 163 L289 119"/>
        </g>
      </svg>`,

      `<svg viewBox="0 0 180 170" ${common} role="img" aria-label="Схема заперечення">
        <g ${font}><text x="84" y="24">І</text><text x="45" y="89">І</text><text x="84" y="89" font-style="italic">ξ</text><text x="122" y="89">Х</text><text x="84" y="158">Х</text></g>
        <g ${ink}><path d="M91 31 L122 72"/><path d="M91 143 L45 96"/></g>
      </svg>`,

      `<svg viewBox="0 0 360 190" ${common} role="img" aria-label="Схема кон'юнкції ξ та η">
        <g ${font}><text x="55" y="96">І</text><text x="91" y="96" font-style="italic">ξ</text><text x="126" y="96">Х</text><text x="218" y="96">І</text><text x="254" y="96" font-style="italic">η</text><text x="289" y="96">Х</text><text x="170" y="24">І</text><text x="170" y="178">Х</text></g>
        <g ${ink}>
          <path d="M126 80 C126 70 118 66 109 66 L92 66 C82 66 76 61 76 52 C76 61 70 66 60 66 L55 66"/>
          <path d="M289 80 C289 70 281 66 272 66 L255 66 C245 66 239 61 239 52 C239 61 233 66 223 66 L218 66"/>
          <path d="M126 103 C126 114 118 119 109 119 L92 119 C82 119 76 124 76 133 C76 124 70 119 60 119 L55 119"/>
          <path d="M289 103 C289 114 281 119 272 119 L255 119 C245 119 239 124 239 133 C239 124 233 119 223 119 L218 119"/>
          <path d="M55 66 C43 66 37 72 37 82 C37 88 32 92 24 92 C32 92 37 96 37 102 C37 112 43 119 55 119"/>
          <path d="M289 66 C301 66 307 72 307 82 C307 88 312 92 320 92 C312 92 307 96 307 102 C307 112 301 119 289 119"/>
          <!-- conjunction: only I/I goes to I; the other combinations go to X -->
          <path d="M175 31 L55 66"/><path d="M175 163 L126 119"/><path d="M175 163 L218 119"/><path d="M175 163 L289 119"/>
        </g>
      </svg>`,

      `<svg viewBox="0 0 390 300" ${common} role="img" aria-label="Схема для заперечення p і не-q">
        <g ${font}><text x="57" y="139">І</text><text x="91" y="139" font-style="italic">q</text><text x="125" y="139">Х</text><text x="238" y="139">І</text><text x="272" y="139" font-style="italic">p</text><text x="306" y="139">Х</text><text x="191" y="25">І</text><text x="191" y="286">Х</text><text x="147" y="77">Х</text><text x="147" y="211">І</text></g>
        <g ${ink}>
          <path d="M125 123 C125 113 117 109 108 109 L92 109 C82 109 76 104 76 95 C76 104 70 109 60 109 L57 109"/>
          <path d="M306 123 C306 113 298 109 289 109 L273 109 C263 109 257 104 257 95 C257 104 251 109 241 109 L238 109"/>
          <path d="M125 146 C125 157 117 162 108 162 L92 162 C82 162 76 167 76 176 C76 167 70 162 60 162 L57 162"/>
          <path d="M306 146 C306 157 298 162 289 162 L273 162 C263 162 257 167 257 176 C257 167 251 162 241 162 L238 162"/>
          <path d="M57 109 C45 109 39 115 39 125 C39 131 34 135 26 135 C34 135 39 139 39 145 C39 155 45 162 57 162"/>
          <path d="M306 109 C318 109 324 115 324 125 C324 131 329 135 337 135 C329 135 324 139 324 145 C324 155 318 162 306 162"/>
          <!-- inner negation of q -->
          <path d="M153 84 L125 123"/><path d="M153 196 L57 162"/>
          <!-- conjunction of p with ~q -->
          <path d="M153 84 C177 92 204 100 238 109"/><path d="M153 196 C184 183 218 171 306 162"/>
          <!-- outer negation -->
          <path d="M197 32 C188 48 174 61 153 70"/><path d="M197 271 C187 248 171 228 153 217"/>
        </g>
      </svg>`
    ];

    figures.slice(0, 5).forEach((figure, i) => { figure.innerHTML = svgs[i]; });
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
