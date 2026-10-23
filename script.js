const tractatusGerman = {
  "1": "Die Welt ist alles, was der Fall ist.",
  "1.1": "Die Welt ist die Gesamtheit der Tatsachen, nicht der Dinge.",
  "1.11": "Die Welt ist durch die Tatsachen bestimmt und dadurch, dass es alle Tatsachen sind.",
  "1.12": "Denn, die Gesamtheit der Tatsachen bestimmt, was der Fall ist und auch, was alles nicht der Fall ist.",
  "1.13": "Die Tatsachen im logischen Raum sind die Welt.",
  "1.2": "Die Welt zerfällt in Tatsachen.",
  "1.21": "Eines kann der Fall sein oder nicht der Fall sein und alles übrige gleich bleiben."
};
function propositionElement(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "proposition";

  if (/^\d+\.0[1-9]$/.test(item.number)) wrapper.classList.add("tractatus-secondary-direct");
  if (/^\d+\.00[1-9]$/.test(item.number)) wrapper.classList.add("tractatus-tertiary-direct");

  if (Object.prototype.hasOwnProperty.call(tractatusGerman, item.number)) wrapper.dataset.hasGerman = "true";
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


  function addInfoButton(kind, label, content) {
    const button = document.createElement("button");
    button.className = kind === "note" ? "comment-button note-button" : "comment-button";
    button.textContent = kind === "note" ? "i" : "К";
    button.title = label;
    button.setAttribute("aria-label", `${label} до положення ${item.number}`);
    if (kind === "note" && item.number === "4.1272") {
      const alephSubscript = [...text.querySelectorAll("sub")].find(el => el.previousSibling && el.previousSibling.textContent.endsWith("ℵ") && el.textContent === "0");
      if (alephSubscript) {
        alephSubscript.after(button);
      } else {
        text.appendChild(button);
      }
    } else if (kind === "note" && item.number === "4.0031") {
      const first = text.firstChild;
      const marker = "(Щоправда, не в сенсі Маутнера.)";
      const pos = first && first.nodeType === Node.TEXT_NODE ? first.textContent.indexOf(marker) : -1;
      if (pos !== -1) {
        const rest = first.splitText(pos + marker.length);
        text.insertBefore(button, rest);
      } else {
        text.appendChild(button);
      }
    } else if (kind === "note" && item.number === "5.535") {
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      let node;
      let placed = false;
      while ((node = walker.nextNode())) {
        const match = "«Axiom of Infinity»,";
        const pos = node.textContent.indexOf(match);
        if (pos !== -1) {
          const rest = node.splitText(pos + match.length);
          text.insertBefore(button, rest);
          placed = true;
          break;
        }
      }
      if (!placed) text.appendChild(button);
    } else if (kind === "note" && item.number === "6.1232") {
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      let node;
      let placed = false;
      while ((node = walker.nextNode())) {
        const match = "«Axiom of Reducibility»,";
        const pos = node.textContent.indexOf(match);
        if (pos !== -1) {
          const rest = node.splitText(pos + match.length);
          text.insertBefore(button, rest);
          placed = true;
          break;
        }
      }
      if (!placed) text.appendChild(button);
    } else if (kind === "note" && item.number === "5.451") {
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      let node;
      let placed = false;
      while ((node = walker.nextNode())) {
        const match = "mutatis mutandis,";
        const pos = node.textContent.indexOf(match);
        if (pos !== -1) {
          const rest = node.splitText(pos + match.length);
          text.insertBefore(button, rest);
          placed = true;
          break;
        }
      }
      if (!placed) text.appendChild(button);
    } else {
      text.appendChild(document.createTextNode(" "));
      text.appendChild(button);
    }
    const panel = document.createElement("div");
    panel.className = kind === "note" ? "comment note" : "comment";
    panel.innerHTML = content;
    wrapper.appendChild(panel);
    button.addEventListener("click", event => { event.stopPropagation(); panel.classList.toggle("visible"); });
  }

  if (item.number === "4.0031" && !item.note) item.note = "Фріц Маутнер (1849–1923) — філософ, письменник і журналіст, автор тритомної праці <em>Beiträge zu einer Kritik der Sprache</em> («Нариси до критики мови», 1901–1902), у якій розвинув скептичну концепцію критики мови (<em>Sprachkritik</em>).";
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
  const germanText = document.createElement("span");
  germanText.className = "german-text";
  germanText.lang = "de";
  germanText.textContent = tractatusGerman[item.number] ?? "";
  if (item.number === "1.11") {
    const emphasized = document.createElement("em");
    emphasized.textContent = "alle";
    germanText.replaceChildren(
      document.createTextNode("Die Welt ist durch die Tatsachen bestimmt und dadurch, dass es "),
      emphasized,
      document.createTextNode(" Tatsachen sind.")
    );
  }
  if (item.comment && wrapper.dataset.hasGerman === "true") {
    const germanCommentButton = document.createElement("button");
    germanCommentButton.type = "button";
    germanCommentButton.className = "comment-button german-comment-button";
    germanCommentButton.textContent = "К";
    germanCommentButton.title = "Коментар";
    germanCommentButton.setAttribute("aria-label", `Коментар до положення ${item.number}`);
    germanCommentButton.addEventListener("click", event => {
      event.stopPropagation();
      wrapper.querySelector(".comment:not(.note)")?.classList.toggle("visible");
    });
    germanText.append(" ", germanCommentButton);
  }
  row.append(number, text, germanText, controls);
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
    const tractatus = await fetchJson("data/tractatus1-2.json");
    const branchFiles = [["3","data/tractatus3.json"],["4","data/tractatus4.json"],["5","data/tractatus5.json"],["6","data/tractatus6.json"],["7","data/tractatus7.json"]];
    for (const [number,path] of branchFiles) { try { const branch=await fetchBranch(path); const branchIndex=tractatus.findIndex(item=>item.number===number); if(branchIndex!==-1) tractatus[branchIndex]=branch; else tractatus.push(branch); } catch(error) { console.error(`Не вдалося завантажити ${path}:`,error); } }
    tractatus.sort((a,b)=>Number(a.number)-Number(b.number)); tree.replaceChildren(); tractatus.forEach(item=>tree.appendChild(propositionElement(item))); if (window.MathJax?.typesetPromise) await window.MathJax.typesetPromise([tree]);
  } catch(error) { console.error("Не вдалося завантажити основний текст Трактату:",error); tree.textContent="Не вдалося завантажити текст. Будь ласка, оновіть сторінку."; }
}
loadTractatus();
const prefaceToggle=document.getElementById("preface-toggle"); const prefaceText=document.getElementById("preface-text"); prefaceToggle.addEventListener("click",()=>{const open=prefaceToggle.getAttribute("aria-expanded")==="true";prefaceToggle.setAttribute("aria-expanded",String(!open));prefaceText.hidden=open;prefaceToggle.classList.toggle("open",!open);});
const navLinks=document.querySelectorAll(".nav-link"); const sections=document.querySelectorAll(".page-section"); function showSection(id){sections.forEach(section=>section.classList.toggle("active-section",section.id===id));navLinks.forEach(link=>link.classList.toggle("active",link.dataset.section===id));history.replaceState(null,"",`#${id}`);window.scrollTo({top:0,behavior:"smooth"});} navLinks.forEach(link=>link.addEventListener("click",()=>showSection(link.dataset.section))); const initialSection=location.hash.replace("#",""); if([...sections].some(section=>section.id===initialSection))showSection(initialSection);

// The original Ukrainian text remains the default. German is currently available for proposition 1 only.
(function () {
  const buttons = [...document.querySelectorAll(".language-button")];
  buttons.forEach(button => button.addEventListener("click", () => {
    const mode = button.dataset.language;
    document.body.classList.remove("language-mode-de", "language-mode-both");
    if (mode !== "uk") document.body.classList.add("language-mode-" + mode);
    buttons.forEach(other => {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
  }));
})();

/* Parallel German preface; Ukrainian paragraphs are preserved verbatim. */
(function () {
  const container = document.getElementById("preface-text");
  const paragraphs = [...container.querySelectorAll(":scope > p")];
  const originals = paragraphs.filter(p => !p.classList.contains("preface-place-date"));
  const translations = ["Dieses Buch wird vielleicht nur der verstehen, der die Gedanken, die darin ausgedrückt sind – oder doch ähnliche Gedanken – schon selbst einmal gedacht hat. – Es ist also kein Lehrbuch. – Sein Zweck wäre erreicht, wenn es Einem, der es mit Verständnis liest Vergnügen bereitete.","Das Buch behandelt die philosophischen Probleme und zeigt – wie ich glaube – dass die Fragestellung dieser Probleme auf dem Mißverständnis der Logik unserer Sprache beruht. Man könnte den ganzen Sinn des Buches etwa in die Worte fassen: Was sich überhaupt sagen lässt, lässt sich klar sagen; und wovon man nicht reden kann, darüber muss man schweigen.","Das Buch will also dem Denken eine Grenze ziehen, oder vielmehr – nicht dem Denken, sondern dem Ausdruck der Gedanken: Denn um dem Denken eine Grenze zu ziehen, müssten wir beide Seiten dieser Grenze denken können (wir müssten also denken können, was sich nicht denken lässt).","Die Grenze wird also nur in der Sprache gezogen werden können und was jenseits der Grenze liegt, wird einfach Unsinn sein.","Wieweit meine Bestrebungen mit denen anderer Philosophen zusammenfallen, will ich nicht beurteilen. Ja, was ich hier geschrieben habe macht im Einzelnen überhaupt nicht den Anspruch auf Neuheit; und darum gebe ich auch keine Quellen an, weil es mir gleichgültig ist, ob das was ich gedacht habe, vor mir schon ein anderer gedacht hat.","Nur das will ich erwähnen, dass ich den großartigen Werken Freges und den Arbeiten meines Freundes Herrn Bertrand Russell einen großen Teil der Anregung zu meinen Gedanken schulde.","Wenn diese Arbeit einen Wert hat, so besteht er in Zweierlei. Erstens darin, dass in ihr Gedanken ausgedrückt sind, und dieser Wert wird umso größer sein, je besser die Gedanken ausgedrückt sind. Je mehr der Nagel auf den Kopf getroffen ist. – Hier bin ich mir bewusst, weit hinter dem Möglichen zurückgeblieben zu sein. Einfach darum, weil meine Kraft zur Bewältigung der Aufgabe zu gering ist. – Mögen andere kommen und es besser machen.","Dagegen scheint mir die Wahrheit der hier mitgeteilten Gedanken unantastbar und definitiv. Ich bin also der Meinung, die Probleme im Wesentlichen endgültig gelöst zu haben. Und wenn ich mich hierin nicht irre, so besteht nun der Wert dieser Arbeit zweitens darin, dass sie zeigt, wie wenig damit getan ist, dass diese Probleme gelöst sind."];
  if (originals.length !== translations.length) {
    console.error("Preface paragraph count mismatch");
    return;
  }
  originals.forEach((uk, index) => {
    const pair = document.createElement("div");
    pair.className = "preface-pair";
    const de = document.createElement("p");
    de.className = "preface-german";
    de.lang = "de";
    if (index === 7) {
      const full = translations[index];
      const marker = "Wahrheit";
      const position = full.indexOf(marker);
      de.append(document.createTextNode(full.slice(0, position)));
      const italic = document.createElement("em");
      italic.textContent = marker;
      de.append(italic, document.createTextNode(full.slice(position + marker.length)));
    } else {
      de.textContent = translations[index];
    }
    uk.classList.add("preface-ukrainian");
    uk.before(pair);
    pair.append(uk, de);
  });
  const date = container.querySelector(".preface-place-date");
  if (date) {
    const pair = document.createElement("div");
    pair.className = "preface-pair preface-signature-pair";
    date.before(pair);
    const germanDate = document.createElement("p");
    germanDate.className = "preface-german preface-place-date";
    germanDate.lang = "de";
    germanDate.textContent = "Wien, 1918";
    pair.append(date, germanDate);
  }
  const label = document.querySelector("#preface-toggle > span:first-child");
  document.querySelectorAll(".language-button").forEach(button => {
    button.addEventListener("click", () => {
      label.textContent = button.dataset.language === "de" ? "Vorwort" :
        button.dataset.language === "both" ? "Передмова / Vorwort" : "Передмова";
    });
  });
})();
