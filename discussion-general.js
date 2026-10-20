(() => {
  const db = window.tractatusSupabaseClient;
  const root = document.getElementById('discussion-general');
  if (!db || !root) return;
  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const date = value => new Intl.DateTimeFormat('uk-UA',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value));
  let active = null;
  const field = (name, type='text', max=80) => `<label>${name}<input name="${type === 'email' ? 'email' : 'author'}" type="${type}" maxlength="${max}" required></label>`;
  const identity = () => `<label>Ваше ім’я<input name="author" maxlength="80" required value="${esc(localStorage.getItem('tractatus-discussion-name') || '')}"></label><label>E-mail<input name="email" type="email" maxlength="254" required value="${esc(localStorage.getItem('tractatus-discussion-email') || '')}"></label>`;
  const notice = 'Реєстрація не потрібна. E-mail не публікується.';
  const newForm = () => `<form id="general-new-form" class="discussion-comment-form"><label>Тема обговорення<input name="title" maxlength="200" required></label>${identity()}<label>Повідомлення<textarea name="body" rows="5" maxlength="10000" required></textarea></label><button type="submit">Опублікувати тему</button><p class="discussion-form-note">${notice}</p></form>`;
  const replyForm = parent => `<form class="discussion-comment-form general-reply-form" data-parent="${parent ?? ''}">${identity()}<label>Коментар<textarea name="body" rows="5" maxlength="10000" required></textarea></label><button type="submit">Надіслати</button><p class="discussion-form-note">${notice}</p></form>`;
  const remember = form => { localStorage.setItem('tractatus-discussion-name',form.elements.author.value.trim());localStorage.setItem('tractatus-discussion-email',form.elements.email.value.trim()); };
  const error = (form, message) => { form.querySelector('.discussion-form-note').textContent = 'Не вдалося зберегти: ' + message; };
  async function list() {
    root.innerHTML = '<p class="discussion-placeholder">Завантажую загальні обговорення…</p>';
    const {data, error: err} = await db.from('discussions').select('id,title,created_at').eq('kind','general').order('created_at',{ascending:false});
    if (err) {root.innerHTML = '<p class="discussion-placeholder">Не вдалося завантажити: '+esc(err.message)+'</p>';return;}
    root.innerHTML = '<p>Обговорення загальних питань перекладу «Трактату».</p><button id="general-add" type="button">Додати обговорення</button><div id="general-form-slot"></div><div id="general-topics"></div><div id="general-thread"></div>';
    const topics = root.querySelector('#general-topics');
    topics.innerHTML = data.length ? data.map(d => `<button class="discussion-recent-item" type="button" data-topic="${esc(d.id)}"><span class="discussion-recent-title"><strong>${esc(d.title)}</strong></span><span class="discussion-recent-meta">${date(d.created_at)}</span></button>`).join('') : '<p class="discussion-placeholder">Поки що загальних обговорень немає.</p>';
    root.querySelector('#general-add').onclick = () => {
      const slot = root.querySelector('#general-form-slot');
      if (slot.innerHTML) {slot.innerHTML='';return;}
      slot.innerHTML = newForm();
      slot.querySelector('form').onsubmit = async event => {
        event.preventDefault();const form = event.currentTarget;const title=form.elements.title.value.trim(),body=form.elements.body.value.trim();if(!title||!body)return;
        const btn=form.querySelector('button');btn.disabled=true;remember(form);
        try {
          const {data:d,error:de}=await db.from('discussions').insert({kind:'general',title}).select('id').single();
          if(de)throw de;
          const {error:pe}=await db.from('posts').insert({discussion_id:d.id,parent_id:null,author_name:form.elements.author.value.trim(),author_email:form.elements.email.value.trim(),body});
          if(pe)throw pe;
          await list();await open(d.id);
        } catch(e) {error(form,e.message);btn.disabled=false;}
      };
    };
    topics.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>open(b.dataset.topic));
    if(active && data.some(d=>String(d.id)===String(active))) await open(active);
  }
  async function open(id) {
    active=id;
    const slot=root.querySelector('#general-thread');
    if(!slot)return;
    slot.innerHTML='<p class="discussion-placeholder">Завантажую повідомлення…</p>';
    const [{data:d,error:de},{data:ps,error:pe}] = await Promise.all([
      db.from('discussions').select('id,title').eq('id',id).single(),
      db.from('posts').select('id,parent_id,author_name,body,created_at').eq('discussion_id',id).order('created_at',{ascending:true})
    ]);
    if(de||pe){slot.innerHTML='<p class="discussion-placeholder">Помилка: '+esc((de||pe).message)+'</p>';return;}
    const children=new Map();
    ps.forEach(p=>{const k=p.parent_id==null?'root':String(p.parent_id);if(!children.has(k))children.set(k,[]);children.get(k).push(p);});
    const render=(key,depth=0)=>depth>30?'':(children.get(key)||[]).map(p=>`<article class="discussion-post${depth?' discussion-reply':''}"><div class="discussion-post-meta"><strong>${esc(p.author_name)}</strong><span>${date(p.created_at)}</span></div><p>${esc(p.body).replaceAll('\n','<br>')}</p><button type="button" class="general-reply" data-parent="${esc(p.id)}">Відповісти</button><div class="general-reply-slot"></div>${render(String(p.id),depth+1)}</article>`).join('');
    slot.innerHTML = `<div class="discussion-proposition-card"><strong>${esc(d.title)}</strong></div><div class="discussion-thread">${render('root')}</div><button id="general-comment" type="button">Додати коментар</button><div id="general-comment-slot"></div>`;
    function bindForm(target,parent) {
      target.innerHTML=replyForm(parent);
      target.querySelector('form').onsubmit=async event=>{
        event.preventDefault();const form=event.currentTarget,btn=form.querySelector('button');btn.disabled=true;remember(form);
        const {error:err}=await db.from('posts').insert({discussion_id:id,parent_id:parent||null,author_name:form.elements.author.value.trim(),author_email:form.elements.email.value.trim(),body:form.elements.body.value.trim()});
        if(err){error(form,err.message);btn.disabled=false;}else await open(id);
      };
    }
    slot.querySelector('#general-comment').onclick=()=>{const s=slot.querySelector('#general-comment-slot');if(s.innerHTML)s.innerHTML='';else bindForm(s,null);};
    slot.querySelectorAll('.general-reply').forEach(b=>b.onclick=()=>{const s=b.nextElementSibling;if(s.innerHTML)s.innerHTML='';else bindForm(s,Number(b.dataset.parent));});
  }
  list();
})();