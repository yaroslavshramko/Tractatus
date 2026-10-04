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

  if (item.number === "6.1203") {
    const figures = text.querySelectorAll(".tractatus-figure");
    if (figures[0]) {
      figures[0].innerHTML = `<img src="assets/t6-61203-1.svg" alt="Перша схема до положення 6.1203" style="display:block;width:280px;max-width:100%;height:auto;margin:0.65rem auto;">`;
    }
    if (figures[1]) {
      figures[1].innerHTML = `<img src="data:image/png;base64,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" alt="Друга схема до положення 6.1203" style="display:block;width:280px;max-width:100%;height:auto;margin:0.65rem auto;">`;
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
    button.addEventListener("click", event => { event.stopPropagation(); panel.classList.toggle("visible"); });
  }

  if (item.number === "4.0031" && !item.note) item.note = "Фріц Маутнер (1849–1923) — філософ, письменник і журналіст, автор тритомної праці <em>Beiträge zu einer Kritik der Sprache</em> («Нариси до критики мови», 1901–1902), у якій розвинув скептичну концепцію критики мови (<em>Sprachkritik</em>). — Прим. перекл.";
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
    const toggle = () => { const open = wrapper.classList.toggle("open"); row.setAttribute("aria-expanded", String(open)); };
    row.addEventListener("click", toggle);
    row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } });
  }
  return wrapper;
}

async function fetchJson(path) { const response = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" }); if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`); return response.json(); }
async function fetchBranch(path) { const response = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" }); if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`); const source = await response.text(); try { return JSON.parse(source); } catch (jsonError) { return Function(`"use strict"; return (${source});`)(); } }
async function loadTractatus() {
  const tree = document.getElementById("tractatus-tree");
  try {
    const tractatus = await fetchJson("data/tractatus.json");
    const branchFiles = [["3","data/tractatus3.json"],["4","data/tractatus4.json"],["5","data/tractatus5.json"],["6","data/tractatus6.json"],["7","data/tractatus7.json"]];
    for (const [number,path] of branchFiles) { try { const branch=await fetchBranch(path); const branchIndex=tractatus.findIndex(item=>item.number===number); if(branchIndex!==-1) tractatus[branchIndex]=branch; else tractatus.push(branch); } catch(error) { console.error(`Не вдалося завантажити ${path}:`,error); } }
    tractatus.sort((a,b)=>Number(a.number)-Number(b.number)); tree.replaceChildren(); tractatus.forEach(item=>tree.appendChild(propositionElement(item)));
  } catch(error) { console.error("Не вдалося завантажити основний текст Трактату:",error); tree.textContent="Не вдалося завантажити текст. Будь ласка, оновіть сторінку."; }
}
loadTractatus();
const prefaceToggle=document.getElementById("preface-toggle"); const prefaceText=document.getElementById("preface-text"); prefaceToggle.addEventListener("click",()=>{const open=prefaceToggle.getAttribute("aria-expanded")==="true";prefaceToggle.setAttribute("aria-expanded",String(!open));prefaceText.hidden=open;prefaceToggle.classList.toggle("open",!open);});
const navLinks=document.querySelectorAll(".nav-link"); const sections=document.querySelectorAll(".page-section"); function showSection(id){sections.forEach(section=>section.classList.toggle("active-section",section.id===id));navLinks.forEach(link=>link.classList.toggle("active",link.dataset.section===id));history.replaceState(null,"",`#${id}`);window.scrollTo({top:0,behavior:"smooth"});} navLinks.forEach(link=>link.addEventListener("click",()=>showSection(link.dataset.section))); const initialSection=location.hash.replace("#",""); if([...sections].some(section=>section.id===initialSection))showSection(initialSection);
