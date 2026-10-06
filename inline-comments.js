(() => {
  const comments = [
    {
      proposition: "4.1252",
      after: "формальними рядами.",
      html: "Німецький термін <em>Formenreihe</em> буквально означає «ряд форм». Зі стилістичних міркувань у цьому перекладі його передано як «формальний ряд»."
    }
  ];

  const notes = [
    {
      proposition: "4.123",
      after: "eo ipso"
    }
  ];

  function findTextNode(root, needle) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes(needle)) return node;
    }
    return null;
  }

  function findRow(proposition) {
    const rows = document.querySelectorAll(".proposition-row");
    for (const row of rows) {
      const number = row.querySelector(".number");
      if (number?.textContent.trim() === proposition) return row;
    }
    return null;
  }

  function applyComment(spec) {
    const row = findRow(spec.proposition);
    if (!row) return;
    const text = row.querySelector(".text");
    if (!text || text.querySelector(`[data-inline-comment="${spec.proposition}"]`)) return;

    const node = findTextNode(text, spec.after);
    if (!node) return;
    const pos = node.nodeValue.indexOf(spec.after) + spec.after.length;
    const tail = node.splitText(pos);

    const button = document.createElement("button");
    button.className = "comment-button";
    button.type = "button";
    button.textContent = "К";
    button.title = "Коментар";
    button.setAttribute("aria-label", `Коментар до положення ${spec.proposition}`);
    button.dataset.inlineComment = spec.proposition;
    button.style.marginLeft = "0.12em";
    tail.parentNode.insertBefore(button, tail);

    const panel = document.createElement("div");
    panel.className = "comment inline-comment";
    panel.innerHTML = spec.html;
    row.after(panel);

    button.addEventListener("click", event => {
      event.stopPropagation();
      panel.classList.toggle("visible");
    });
  }

  function applyNote(spec) {
    const row = findRow(spec.proposition);
    if (!row) return;
    const text = row.querySelector(".text");
    const button = text?.querySelector(".note-button");
    if (!text || !button || button.dataset.inlinePlaced === "true") return;

    const node = findTextNode(text, spec.after);
    if (!node) return;
    const pos = node.nodeValue.indexOf(spec.after) + spec.after.length;
    const tail = node.splitText(pos);
    tail.parentNode.insertBefore(button, tail);
    button.style.marginLeft = "0.12em";
    button.dataset.inlinePlaced = "true";
  }

  function applyAll() {
    comments.forEach(applyComment);
    notes.forEach(applyNote);
  }

  applyAll();
  const observer = new MutationObserver(applyAll);
  observer.observe(document.getElementById("tractatus-tree") || document.body, { childList: true, subtree: true });
})();
