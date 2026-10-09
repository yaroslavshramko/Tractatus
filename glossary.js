(() => {
  const body = document.getElementById('glossary-body');
  const filter = document.getElementById('glossary-filter');
  if (!body || !filter) return;

  let entries = [];

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const ukrainianTerms = (item) => Array.isArray(item.uk)
    ? item.uk
    : [{ term: item.uk, occurrences: item.occurrences || [] }];

  const renderUkrainian = (item) => {
    const terms = ukrainianTerms(item);
    return terms.map((entry, index) => {
      const occurrences = Array.isArray(entry.occurrences) ? entry.occurrences : [];
      return `<button type="button" class="glossary-uk-term" data-occurrences="${escapeHtml(JSON.stringify(occurrences))}">${escapeHtml(entry.term)}${index < terms.length - 1 ? ',' : ''}</button>${index < terms.length - 1 ? ' ' : ''}`;
    }).join('');
  };

  const render = (items) => {
    body.innerHTML = '';
    for (const item of items) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><i>${item.de === "sinnlich wahrnehmbar" ? "sinnlich<br>wahrnehmbar" : escapeHtml(item.de)}</i></td>
        <td>${renderUkrainian(item)}<div class="glossary-occurrences" hidden></div></td>
        <td>${escapeHtml(item.ogden || '—')}</td>
        <td>${escapeHtml(item.pears || '—')}</td>`;
      body.appendChild(row);
    }
  };

  body.addEventListener('click', (event) => {
    const term = event.target.closest('.glossary-uk-term');
    if (!term) return;

    const panel = term.closest('td').querySelector('.glossary-occurrences');
    const occurrences = JSON.parse(term.dataset.occurrences || '[]');

    if (!panel.hidden && panel.dataset.activeTerm === term.textContent) {
      panel.hidden = true;
      panel.dataset.activeTerm = '';
      return;
    }

    panel.dataset.activeTerm = term.textContent;
    panel.innerHTML = occurrences.length
      ? occurrences.map(number => `<span class="glossary-occurrence">${escapeHtml(number)}</span>`).join(' · ')
      : '<span class="glossary-no-occurrences">Положення ще не вказані.</span>';
    panel.hidden = false;
  });

  filter.addEventListener('input', () => {
    const q = filter.value.trim().toLocaleLowerCase('uk');
    if (!q) return render(entries);
    render(entries.filter(item => [
      item.de,
      ukrainianTerms(item).map(entry => entry.term).join(', '),
      item.ogden,
      item.pears
    ].some(value => String(value || '').toLocaleLowerCase('uk').includes(q))));
  });

  fetch('data/glossary.json?v=20261007-2')
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