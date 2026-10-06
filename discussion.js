(() => {
  const tabs = Array.from(document.querySelectorAll(".discussion-tab"));
  const propositionPanel = document.getElementById("discussion-propositions");
  const generalPanel = document.getElementById("discussion-general");
  const form = document.getElementById("discussion-proposition-form");
  const input = document.getElementById("discussion-proposition-number");
  const result = document.getElementById("discussion-proposition-result");
  const recentList = document.getElementById("discussion-recent-list");

  if (!tabs.length || !form || !input || !result) return;

  const discussions = {
    "5.101": {
      number: "5.101",
      title: "Обговорення положення 5.101",
      count: 3,
      lastDate: "6 жовтня 2026"
    }
  };

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

  function openProposition(number) {
    const discussion = discussions[number];
    if (discussion) {
      result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${discussion.number}</p><div class="discussion-proposition-text">${discussion.title}</div></div>${demoDiscussion()}`;
    } else {
      result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${number}</p></div><div class="discussion-thread-placeholder"><p class="discussion-placeholder">Обговорення цього положення ще не розпочато.</p><button class="discussion-disabled-action" type="button" disabled>Розпочати обговорення</button></div>`;
    }
    result.scrollIntoView({ behavior: "smooth", block: "start" });
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

  function renderRecent() {
    if (!recentList) return;
    const items = Object.values(discussions);
    if (!items.length) {
      recentList.innerHTML = '<p class="discussion-placeholder">Поки що обговорень немає.</p>';
      return;
    }
    recentList.innerHTML = items.map((discussion) => `<button class="discussion-recent-item" type="button" data-proposition="${discussion.number}"><span class="discussion-recent-title"><strong>${discussion.number}</strong> — ${discussion.title}</span><span class="discussion-recent-meta">${discussion.count} дописи · останній ${discussion.lastDate}</span></button>`).join("");
    recentList.querySelectorAll(".discussion-recent-item").forEach((button) => {
      button.addEventListener("click", () => {
        const number = button.dataset.proposition;
        input.value = number;
        tabs[0].click();
        openProposition(number);
      });
    });
  }

  renderRecent();
})();
