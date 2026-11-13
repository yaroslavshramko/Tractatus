(() => {
  const body = document.getElementById("comments-index-body");
  if (!body) return;

  const showMessage = message => {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 2;
    cell.className = "comments-index-empty";
    cell.textContent = message;
    row.appendChild(cell);
    body.replaceChildren(row);
  };

  fetch("data/comments-index.json")
    .then(response => {
      if (!response.ok) throw new Error("Could not load comments index");
      return response.json();
    })
    .then(entries => {
      if (!Array.isArray(entries)) throw new Error("Invalid comments index");
      if (!entries.length) {
        showMessage("Коментарів поки немає.");
        return;
      }
      const fragment = document.createDocumentFragment();
      entries.forEach(entry => {
        const row = document.createElement("tr");
        const number = document.createElement("td");
        number.textContent = entry.number;
        const title = document.createElement("td");
        const link = document.createElement("a");
        link.className = "comments-index-link";
        link.href = "#tractatus";
        link.innerHTML = entry.title;
        link.addEventListener("click", async event => {
          event.preventDefault();
          const opened = await window.openIndexedComment(entry.number, entry.commentIndex ?? 0);
          if (!opened) {
            console.warn("Comment not found:", entry.number, entry.commentIndex);
            alert("Не вдалося знайти цей коментар у тексті.");
          }
        });
        title.appendChild(link);
        row.append(number, title);
        fragment.appendChild(row);
      });
      body.replaceChildren(fragment);
    })
    .catch(error => {
      console.error("Comments index:", error);
      showMessage("Не вдалося завантажити перелік коментарів.");
    });
})();

(() => {
  const body = document.getElementById("section-comments-index-body");
  if (!body) return;
  fetch("data/section-commentaries.json")
    .then(response => { if (!response.ok) throw new Error("Could not load section commentaries"); return response.json(); })
    .then(entries => {
      if (!Array.isArray(entries)) throw new Error("Invalid section commentaries");
      if (!entries.length) { body.innerHTML = '<tr><td colspan="2" class="comments-index-empty">Коментарів поки немає.</td></tr>'; return; }
      const fragment = document.createDocumentFragment();
      entries.forEach(entry => {
        const row = document.createElement("tr");
        const section = document.createElement("td");
        section.textContent = entry.range ? `${entry.section} (${entry.range})` : entry.section;
        const topic = document.createElement("td");
        const link = document.createElement("a");
        link.className = "comments-index-link";
        link.href = "#commentary-" + entry.section;
        link.textContent = entry.title || "Коментар до розділу " + entry.section;
        link.addEventListener("click", async event => {
          event.preventDefault();
          if (!await window.openSectionCommentary(entry.section)) alert("Не вдалося знайти коментар до розділу.");
        });
        topic.appendChild(link);
        row.append(section, topic);
        fragment.appendChild(row);
      });
      const pendingRow = document.createElement("tr");
      const pendingSection = document.createElement("td");
      pendingSection.textContent = "2 (2–2.225)";
      const pendingTopic = document.createElement("td");
      pendingTopic.textContent = "Від онтології до пізнання: стани справ та образи";
      pendingRow.append(pendingSection, pendingTopic);
      fragment.appendChild(pendingRow);
      const thirdRow = document.createElement("tr");
      const thirdSection = document.createElement("td");
      thirdSection.textContent = "3 (3–3.5)";
      const thirdTopic = document.createElement("td");
      thirdTopic.textContent = "Епістемологія «Трактату»: думка і речення";
      thirdRow.append(thirdSection, thirdTopic);
      fragment.appendChild(thirdRow);
      body.replaceChildren(fragment);
    })
    .catch(error => {
      console.error("Section comments index:", error);
      body.innerHTML = '<tr><td colspan="2" class="comments-index-empty">Не вдалося завантажити покажчик.</td></tr>';
    });
})();
