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

  const controls = document.createElement("span");
  if (hasChildren) {
    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "▶";
    chevron.setAttribute("aria-hidden", "true");
    controls.appendChild(chevron);
  }

  row.append(number, text, controls);
  wrapper.appendChild(row);

  if (item.comment) {
    const commentButton = document.createElement("button");
    commentButton.className = "comment-button";
    commentButton.textContent = "К";
    commentButton.title = "Коментар";
    commentButton.setAttribute("aria-label", `Коментар до положення ${item.number}`);
    text.appendChild(document.createTextNode(" "));
    text.appendChild(commentButton);

    const comment = document.createElement("div");
    comment.className = "comment";
    comment.textContent = item.comment;
    wrapper.appendChild(comment);

    commentButton.addEventListener("click", event => {
      event.stopPropagation();
      comment.classList.toggle("visible");
    });
  }

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
    const [mainResponse, proposition3Response] = await Promise.all([
      fetch("data/tractatus.json"),
      fetch("data/tractatus3.json")
    ]);

    if (!mainResponse.ok) throw new Error(`HTTP ${mainResponse.status}`);
    if (!proposition3Response.ok) throw new Error(`HTTP ${proposition3Response.status}`);

    const tractatus = await mainResponse.json();
    const proposition3 = await proposition3Response.json();
    const index3 = tractatus.findIndex(item => item.number === "3");
    if (index3 !== -1) tractatus[index3] = proposition3;

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

navLinks.forEach(link => {
  link.addEventListener("click", () => showSection(link.dataset.section));
});

const initialSection = location.hash.replace("#", "");
if ([...sections].some(section => section.id === initialSection)) {
  showSection(initialSection);
}
