(() => {
  const SUPABASE_URL = "https://yyscgdoaplbtdjgeopzl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_WemnUl62SnJlwpwH6FQb2A_nw3vB3Oc";
  const SITE_URL = "https://yaroslavshramko.github.io/Tractatus/";
  const client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

  const tabs = Array.from(document.querySelectorAll(".discussion-tab"));
  const propositionPanel = document.getElementById("discussion-propositions");
  const generalPanel = document.getElementById("discussion-general");
  const form = document.getElementById("discussion-proposition-form");
  const input = document.getElementById("discussion-proposition-number");
  const result = document.getElementById("discussion-proposition-result");
  const recentList = document.getElementById("discussion-recent-list");
  const authBox = document.getElementById("discussion-auth");

  if (!client || !tabs.length || !form || !input || !result || !authBox) return;

  let currentUser = null;
  let currentNumber = null;
  let currentDiscussion = null;

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
  }

  function authorName() {
    return localStorage.getItem("tractatus-discussion-name")?.trim() || "";
  }

  async function renderAuth() {
    const { data } = await client.auth.getUser();
    currentUser = data.user || null;
    if (currentUser) {
      authBox.innerHTML = `<div class="discussion-auth-status"><span>Ви увійшли як <strong>${escapeHtml(currentUser.email)}</strong>.</span><button id="discussion-signout" type="button">Вийти</button></div>`;
      document.getElementById("discussion-signout").addEventListener("click", async () => {
        await client.auth.signOut();
        currentUser = null;
        await renderAuth();
        if (currentNumber) await openProposition(currentNumber, false);
      });
      return;
    }
    authBox.innerHTML = `<form id="discussion-login-form" class="discussion-login-form"><div><label for="discussion-email">E-mail</label><input id="discussion-email" type="email" required autocomplete="email" placeholder="name@example.com"></div><button type="submit">Увійти через e-mail</button><p id="discussion-login-message" class="discussion-form-note">Для дописів потрібне підтвердження e-mail. Пароль не потрібен.</p></form>`;
    document.getElementById("discussion-login-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("discussion-email").value.trim();
      const message = document.getElementById("discussion-login-message");
      message.textContent = "Надсилаю лист…";
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: `${SITE_URL}#discussion`, shouldCreateUser: true } });
      message.textContent = error ? `Не вдалося надіслати лист: ${error.message}` : "Лист надіслано. Відкрийте посилання в ньому, щоб увійти.";
    });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    const target = tab.dataset.discussionTab;
    tabs.forEach((item) => { const active = item === tab; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
    const propositions = target === "propositions";
    propositionPanel.hidden = !propositions;
    generalPanel.hidden = propositions;
    propositionPanel.classList.toggle("active", propositions);
    generalPanel.classList.toggle("active", !propositions);
  }));

  function renderPosts(posts) {
    const byParent = new Map();
    posts.forEach((post) => {
      const key = post.parent_id == null ? "root" : String(post.parent_id);
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(post);
    });
    const level = (key, reply = false) => (byParent.get(key) || []).map((post) => `<article class="discussion-post${reply ? " discussion-reply" : ""}"><div class="discussion-post-meta"><strong>${escapeHtml(post.author_name)}</strong><span>${escapeHtml(formatDate(post.created_at))}</span></div><p>${escapeHtml(post.body).replaceAll("\n", "<br>")}</p>${currentUser ? `<button class="discussion-reply-action" type="button" data-reply-id="${post.id}">Відповісти</button>` : ""}${level(String(post.id), true)}</article>`).join("");
    return level("root");
  }

  function postingForm(parentId = "") {
    if (!currentUser) return '<p class="discussion-form-note">Щоб додати допис, увійдіть через e-mail вище.</p>';
    const saved = authorName();
    return `<form class="discussion-comment-form" data-parent-id="${escapeHtml(parentId)}"><label>Ваше ім’я</label><input class="discussion-author-name" type="text" required maxlength="80" value="${escapeHtml(saved)}" placeholder="Ім’я, яке буде видно в обговоренні"><label>Коментар</label><textarea class="discussion-comment-body" rows="5" required maxlength="10000" placeholder="Ваш коментар"></textarea><button type="submit">Надіслати</button><p class="discussion-form-note"></p></form>`;
  }

  async function getDiscussion(number) {
    const { data, error } = await client.from("discussions").select("id,kind,proposition_number,title,created_at").eq("kind", "proposition").eq("proposition_number", number).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function openProposition(number, scroll = true) {
    currentNumber = number;
    currentDiscussion = null;
    result.innerHTML = '<p class="discussion-placeholder">Відкриваю обговорення…</p>';
    try {
      const discussion = await getDiscussion(number);
      currentDiscussion = discussion;
      if (!discussion) {
        result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${escapeHtml(number)}</p></div><div class="discussion-thread-placeholder"><p class="discussion-placeholder">Обговорення цього положення ще не розпочато.</p>${currentUser ? postingForm() : '<p class="discussion-form-note">Увійдіть через e-mail, щоб розпочати обговорення.</p>'}</div>`;
      } else {
        const { data: posts, error } = await client.from("posts").select("id,discussion_id,parent_id,author_name,body,created_at").eq("discussion_id", discussion.id).order("created_at", { ascending: true });
        if (error) throw error;
        const thread = posts.length ? `<div class="discussion-thread">${renderPosts(posts)}</div>` : '<p class="discussion-placeholder">У цьому обговоренні ще немає дописів.</p>';
        result.innerHTML = `<div class="discussion-proposition-card"><p class="discussion-proposition-number">${escapeHtml(number)}</p><div class="discussion-proposition-text">${escapeHtml(discussion.title || `Обговорення положення ${number}`)}</div></div>${thread}${postingForm()}`;
      }
      bindPostingForms();
      bindReplyButtons();
      if (scroll) result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      result.innerHTML = `<p class="discussion-placeholder">Не вдалося завантажити обговорення: ${escapeHtml(error.message)}</p>`;
    }
  }

  async function ensureDiscussion(number) {
    let discussion = await getDiscussion(number);
    if (discussion) return discussion;
    const { data, error } = await client.from("discussions").insert({ kind: "proposition", proposition_number: number, title: `Обговорення положення ${number}` }).select("id,kind,proposition_number,title,created_at").single();
    if (!error) return data;
    discussion = await getDiscussion(number);
    if (discussion) return discussion;
    throw error;
  }

  function bindPostingForms() {
    result.querySelectorAll(".discussion-comment-form").forEach((postForm) => postForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = postForm.querySelector(".discussion-author-name").value.trim();
      const body = postForm.querySelector(".discussion-comment-body").value.trim();
      const note = postForm.querySelector(".discussion-form-note");
      if (!currentUser || !name || !body) return;
      note.textContent = "Надсилаю…";
      localStorage.setItem("tractatus-discussion-name", name);
      try {
        const discussion = currentDiscussion || await ensureDiscussion(currentNumber);
        const parentRaw = postForm.dataset.parentId;
        const { error } = await client.from("posts").insert({ discussion_id: discussion.id, parent_id: parentRaw ? Number(parentRaw) : null, author_id: currentUser.id, author_name: name, body });
        if (error) throw error;
        await openProposition(currentNumber, false);
        await renderRecent();
      } catch (error) {
        note.textContent = `Не вдалося додати допис: ${error.message}`;
      }
    }));
  }

  function bindReplyButtons() {
    result.querySelectorAll(".discussion-reply-action[data-reply-id]").forEach((button) => button.addEventListener("click", () => {
      result.querySelectorAll(".discussion-inline-reply").forEach((node) => node.remove());
      const holder = document.createElement("div");
      holder.className = "discussion-inline-reply";
      holder.innerHTML = postingForm(button.dataset.replyId);
      button.insertAdjacentElement("afterend", holder);
      bindPostingForms();
      holder.querySelector("textarea")?.focus();
    }));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const number = input.value.trim().replace(",", ".");
    if (!number) { result.innerHTML = '<p class="discussion-placeholder">Введіть номер положення.</p>'; return; }
    openProposition(number);
  });

  async function renderRecent() {
    try {
      const { data: discussions, error } = await client.from("discussions").select("id,proposition_number,title,created_at").eq("kind", "proposition").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      if (!discussions.length) { recentList.innerHTML = '<p class="discussion-placeholder">Поки що обговорень немає.</p>'; return; }
      const enriched = await Promise.all(discussions.map(async (discussion) => {
        const { data: posts, error: postError } = await client.from("posts").select("id,created_at").eq("discussion_id", discussion.id).order("created_at", { ascending: false });
        if (postError) throw postError;
        return { ...discussion, count: posts.length, lastDate: posts[0]?.created_at || discussion.created_at };
      }));
      enriched.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
      recentList.innerHTML = enriched.map((d) => `<button class="discussion-recent-item" type="button" data-proposition="${escapeHtml(d.proposition_number)}"><span class="discussion-recent-title"><strong>${escapeHtml(d.proposition_number)}</strong> — ${escapeHtml(d.title || `Обговорення положення ${d.proposition_number}`)}</span><span class="discussion-recent-meta">${d.count} ${d.count === 1 ? "допис" : "дописів"} · останній ${escapeHtml(formatDate(d.lastDate))}</span></button>`).join("");
      recentList.querySelectorAll(".discussion-recent-item").forEach((button) => button.addEventListener("click", () => { input.value = button.dataset.proposition; tabs[0].click(); openProposition(button.dataset.proposition); }));
    } catch (error) {
      recentList.innerHTML = `<p class="discussion-placeholder">Не вдалося завантажити останні обговорення: ${escapeHtml(error.message)}</p>`;
    }
  }

  client.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    await renderAuth();
  });

  (async () => {
    await renderAuth();
    await renderRecent();
  })();
})();
