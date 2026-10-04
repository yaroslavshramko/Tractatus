const tractatus = [
  {
    number: "1",
    text: "Світ є все, що має місце.",
    children: [
      {
        number: "1.1",
        text: "Світ – це сукупність фактів, а не речей.",
        children: [
          {
            number: "1.11",
            text: "Світ визначається фактами і тим, що це всі факти.",
            comment: "Це - новий коментар, він дуже чудовий і розʼяснює читачу суть цього положення."
          },
          {
            number: "1.12",
            text: "Адже сукупність фактів визначає, що має місце, а також усе, що не має місця.",
            comment: ""
          },
          {
            number: "1.13",
            text: "Факти в логічному просторі є світ.",
            comment: ""
          }
        ]
      }
    ]
  },
  { number: "2", text: "[Друге основне положення]", children: [] },
  { number: "3", text: "[Третє основне положення]", children: [] },
  { number: "4", text: "[Четверте основне положення]", children: [] },
  { number: "5", text: "[П’яте основне положення]", children: [] },
  { number: "6", text: "[Шосте основне положення]", children: [] },
  { number: "7", text: "[Сьоме основне положення]", children: [] }
];

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
  text.textContent = item.text;

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
    commentButton.textContent = "коментар";
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

const tree = document.getElementById("tractatus-tree");
tractatus.forEach(item => tree.appendChild(propositionElement(item)));

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
