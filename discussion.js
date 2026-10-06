(() => {
  const SUPABASE_URL = "https://yyscgdoaplbtdjgeopzl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_WemnUl62SnJlwpwH6FQb2A_nw3vB3Oc";
  const API = `${SUPABASE_URL}/rest/v1`;

  const tabs = Array.from(document.querySelectorAll(".discussion-tab"));
  const propositionPanel = document.getElementById("discussion-propositions");
  const generalPanel = document.getElementById("discussion-general");
  const form = document.getElementById("discussion-proposition-form");
  const input = document.getElementById("discussion-proposition-number");
  const result = document.getElementById("discussion-proposition-result");
  const recentList = document.getElementById("discussion-recent-list");

  if (!tabs.length || !form || !input || !result) return;

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    Accept: "application/json"
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
  }

  async function apiGet(path) {
    const response = await fetch(`${API}/${path}`, { headers });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    return response.json();
  }

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

  function renderPosts(posts) {
    const byParent = new Map();
    posts.forEach((post) => {
      const key = post.parent_id == null ? "root" : String(post.parent_id);
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(post);
    });

    const renderLevel = (parentKey, reply = false) => (byParent.get(parentKey) || []).map((post) => {
      const children = renderLevel(String(post.id), true);
      return `<article class="discussion-post${reply ? " discussion-reply" : ""}">
        <div class="discussion-post-meta"><strong>${escapeHtml(post.author_name)}</strong><span>${escapeHtml(formatDate(post.created_at))}</span></div>
        <p>${escapeHtml(post.body).replaceAll("\n", "<br>")}</p>
        <button class="discussion-reply-action" type="button" disabled>Відповісти</button>
        ${children}
      </article>`;
    }).join("");

    return renderLevel("root");
  }

  async function openProposition(number) {
    result.innerHTML = '<p class="discussion-placeholder">Відкриваю обговорення…</p>';
    try {
      const discussions = await apiGet(`discussions?select=id,kind,proposition_number,title,created_at&kind=eq.proposition&proposition_number=eq.${encodeURIComponent(number)}&limit=1`);
      if (!discussions.length) {
        result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${escapeHtml(number)}</p></div><div class="discussion-thread-placeholder"><p class="discussion-placeholder">Обговорення цього положення ще не розпочато.</p><button class="discussion-disabled-action" type="button" disabled>Розпочати обговорення</button></div>`;
        result.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const discussion = discussions[0];
      const posts = await apiGet(`posts?select=id,discussion_id,parent_id,author_name,body,created_at&discussion_id=eq.${discussion.id}&order=created_at.asc`);
      const thread = posts.length
        ? `<div class="discussion-thread">${renderPosts(posts)}</div>`
        : '<div class="discussion-thread-placeholder"><p class="discussion-placeholder">У цьому обговоренні ще немає дописів.</p></div>';

      result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${escapeHtml(discussion.proposition_number)}</p><div class="discussion-proposition-text">${escapeHtml(discussion.title || `Обговорення положення ${discussion.proposition_number}`)}</div></div>${thread}<div class="discussion-comment-form"><p class="discussion-form-note">Додавання нових дописів буде підключено після налаштування входу через e-mail.</p></div>`;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      result.innerHTML = '<p class="discussion-placeholder">Не вдалося завантажити обговорення.</p>';
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
      const discussions = await apiGet("discussions?select=id,kind,proposition_number,title,created_at&kind=eq.proposition&order=created_at.desc&limit=20");
      if (!discussions.length) {
        recentList.innerHTML = '<p class="discussion-placeholder">Поки що обговорень немає.</p>';
        return;
      }

      const enriched = await Promise.all(discussions.map(async (discussion) => {
        const posts = await apiGet(`posts?select=id,created_at&discussion_id=eq.${discussion.id}&order=created_at.desc`);
        return {
          ...discussion,
          count: posts.length,
          lastDate: posts[0]?.created_at || discussion.created_at
        };
      }));

      enriched.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
      recentList.innerHTML = enriched.map((discussion) => `<button class="discussion-recent-item" type="button" data-proposition="${escapeHtml(discussion.proposition_number)}"><span class="discussion-recent-title"><strong>${escapeHtml(discussion.proposition_number)}</strong> — ${escapeHtml(discussion.title || `Обговорення положення ${discussion.proposition_number}`)}</span><span class="discussion-recent-meta">${discussion.count} ${discussion.count === 1 ? "допис" : "дописів"} · останній ${escapeHtml(formatDate(discussion.lastDate))}</span></button>`).join("");

      recentList.querySelectorAll(".discussion-recent-item").forEach((button) => {
        button.addEventListener("click", () => {
          const number = button.dataset.proposition;
          input.value = number;
          tabs[0].click();
          openProposition(number);
        });
      });
    } catch (error) {
      recentList.innerHTML = '<p class="discussion-placeholder">Не вдалося завантажити останні обговорення.</p>';
    }
  }

  renderRecent();
})();
