(() => {
  const tabs = Array.from(document.querySelectorAll(".discussion-tab"));
  const propositionPanel = document.getElementById("discussion-propositions");
  const generalPanel = document.getElementById("discussion-general");
  const form = document.getElementById("discussion-proposition-form");
  const input = document.getElementById("discussion-proposition-number");
  const result = document.getElementById("discussion-proposition-result");

  if (!tabs.length || !form || !input || !result) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.discussionTab;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      const showPropositions = target === "propositions";
      propositionPanel.hidden = !showPropositions;
      generalPanel.hidden = showPropositions;
      propositionPanel.classList.toggle("active", showPropositions);
      generalPanel.classList.toggle("active", !showPropositions);
    });
  });

  let propositionIndex = null;

  function flatten(items, map) {
    (items || []).forEach((item) => {
      if (item && item.number) map.set(String(item.number), item);
      if (item && Array.isArray(item.children)) flatten(item.children, map);
    });
  }

  async function loadIndex() {
    if (propositionIndex) return propositionIndex;
    const map = new Map();
    const files = Array.from({ length: 7 }, (_, index) => `data/tractatus${index + 1}.json`);
    const responses = await Promise.all(files.map((file) => fetch(file)));
    if (responses.some((response) => !response.ok)) throw new Error("Не вдалося завантажити текст Трактату.");
    const data = await Promise.all(responses.map((response) => response.json()));
    data.forEach((part) => flatten(Array.isArray(part) ? part : [part], map));
    propositionIndex = map;
    return map;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const number = input.value.trim().replace(",", ".");
    if (!number) {
      result.innerHTML = '<p class="discussion-placeholder">Введіть номер положення.</p>';
      return;
    }

    result.innerHTML = '<p class="discussion-placeholder">Шукаю положення…</p>';

    try {
      const index = await loadIndex();
      const item = index.get(number);
      if (!item) {
        result.innerHTML = `<p class="discussion-placeholder">Положення ${number} не знайдено.</p>`;
        return;
      }
      result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${item.number}</p><div class="discussion-proposition-text">${String(item.text ?? "")}</div></div><div class="discussion-thread-placeholder"><p class="discussion-placeholder">Обговорення цього положення ще не розпочато.</p><button class="discussion-disabled-action" type="button" disabled>Додати коментар</button></div>`;
    } catch (error) {
      result.innerHTML = '<p class="discussion-placeholder">Не вдалося відкрити положення. Спробуйте ще раз.</p>';
    }
  });
})();
