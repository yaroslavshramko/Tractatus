(() => {
  const tabs = Array.from(document.querySelectorAll(".discussion-tab"));
  const propositionPanel = document.getElementById("discussion-propositions");
  const generalPanel = document.getElementById("discussion-general");
  const form = document.getElementById("discussion-proposition-form");
  const input = document.getElementById("discussion-proposition-number");
  const result = document.getElementById("discussion-proposition-result");
  const recentList = document.getElementById("discussion-recent-list");

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
    const files = [
      "data/tractatus.json",
      "data/tractatus3.json",
      "data/tractatus4.json",
      "data/tractatus5.json",
      "data/tractatus6.json",
      "data/tractatus7.json"
    ];
    const responses = await Promise.all(files.map((file) => fetch(file)));
    if (responses.some((response) => !response.ok)) throw new Error("Не вдалося завантажити текст Трактату.");
    const data = await Promise.all(responses.map((response) => response.json()));
    data.forEach((part) => flatten(Array.isArray(part) ? part : [part], map));
    propositionIndex = map;
    return map;
  }

  function demoDiscussion() {
    return `<div class="discussion-demo-note">Демонстраційне обговорення</div>
      <div class="discussion-thread">
        <article class="discussion-post">
          <div class="discussion-post-meta"><strong>Олександр К.</strong><span>6 жовтня 2026</span></div>
          <p>Чи не варто тут додатково пояснити, в якому порядку читаються чотири істиннісні можливості в першому стовпчику таблиці?</p>
          <button class="discussion-reply-action" type="button">Відповісти</button>
          <article class="discussion-post discussion-reply">
            <div class="discussion-post-meta"><strong>Редактор</strong><span>6 жовтня 2026</span></div>
            <p>Це слушне питання. Таке пояснення, ймовірно, краще подати в коментарі до положення, не втручаючись у текст самого перекладу.</p>
            <button class="discussion-reply-action" type="button">Відповісти</button>
          </article>
        </article>
        <article class="discussion-post">
          <div class="discussion-post-meta"><strong>Марія П.</strong><span>6 жовтня 2026</span></div>
          <p>Мені здається вдалим, що формули в першому й останньому рядках таблиці винесені на окремий рядок: так схема читається значно легше.</p>
          <button class="discussion-reply-action" type="button">Відповісти</button>
        </article>
      </div>
      <form class="discussion-comment-form" onsubmit="return false;">
        <label for="discussion-demo-comment">Додати коментар</label>
        <textarea id="discussion-demo-comment" rows="5" placeholder="Ваш коментар"></textarea>
        <button type="submit" disabled>Надіслати</button>
        <p class="discussion-form-note">Демонстраційна форма: надсилання коментарів буде підключено на наступному етапі.</p>
      </form>`;
  }

  async function openProposition(number) {
    result.innerHTML = '<p class="discussion-placeholder">Відкриваю положення…</p>';
    try {
      const index = await loadIndex();
      const item = index.get(number);
      if (!item) {
        result.innerHTML = `<p class="discussion-placeholder">Положення ${number} не знайдено.</p>`;
        return;
      }
      const thread = number === "5.101"
        ? demoDiscussion()
        : '<div class="discussion-thread-placeholder"><p class="discussion-placeholder">Обговорення цього положення ще не розпочато.</p><button class="discussion-disabled-action" type="button" disabled>Додати коментар</button></div>';
      result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${item.number}</p><div class="discussion-proposition-text">${String(item.text ?? "")}</div></div>${thread}`;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      result.innerHTML = '<p class="discussion-placeholder">Не вдалося відкрити положення. Спробуйте ще раз.</p>';
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const number = input.value.trim().replace(",", ".");
    if (!number) {
      result.innerHTML = '<p class="discussion-placeholder">Введіть номер положення.</p>';
      return;
    }
    openProposition(number);
  });

  async function renderRecent() {
    if (!recentList) return;
    try {
      const index = await loadIndex();
      const item = index.get("5.101");
      if (!item) throw new Error("not found");
      const plainText = String(item.text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const excerpt = plainText.length > 105 ? `${plainText.slice(0, 105).trim()}…` : plainText;
      recentList.innerHTML = `<button class="discussion-recent-item" type="button" data-proposition="5.101"><span class="discussion-recent-title"><strong>5.101</strong> — ${excerpt}</span><span class="discussion-recent-meta">3 дописи · останній 6 жовтня 2026</span></button>`;
      recentList.querySelector(".discussion-recent-item").addEventListener("click", () => {
        input.value = "5.101";
        tabs[0].click();
        openProposition("5.101");
      });
    } catch (error) {
      recentList.innerHTML = '<p class="discussion-placeholder">Не вдалося завантажити останні обговорення.</p>';
    }
  }

  renderRecent();
})();
