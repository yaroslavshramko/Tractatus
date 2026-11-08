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
