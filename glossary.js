(() => {
  const body = document.getElementById('glossary-body');
  const filter = document.getElementById('glossary-filter');
  if (!body || !filter) return;

  let entries = [];

  const render = (items) => {
    body.innerHTML = '';
    for (const item of items) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="glossary-term" data-term="${escapeHtml(item.de)}"><i>${escapeHtml(item.de)}</i></span></td>
        <td>${escapeHtml(item.uk)}</td>
        <td>${escapeHtml(item.ogden || '—')}</td>
        <td>${escapeHtml(item.pears || '—')}</td>`;
      body.appendChild(row);
    }
  };

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  filter.addEventListener('input', () => {
    const q = filter.value.trim().toLocaleLowerCase('uk');
    if (!q) return render(entries);
    render(entries.filter(item => [item.de, item.uk, item.ogden, item.pears]
      .some(value => String(value || '').toLocaleLowerCase('uk').includes(q))));
  });

  fetch('data/glossary.json?v=20261004-1')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      entries = data;
      render(entries);
    })
    .catch(error => {
      console.error('Не вдалося завантажити глосарій:', error);
      body.innerHTML = '<tr><td colspan="4">Не вдалося завантажити глосарій.</td></tr>';
    });
})();