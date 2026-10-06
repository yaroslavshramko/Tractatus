(() => {
  function placeNote4123() {
    const propositions = [...document.querySelectorAll('.proposition')];
    const proposition = propositions.find(p => p.querySelector(':scope > .proposition-row > .number')?.textContent.trim() === '4.123');
    if (!proposition) return false;

    const text = proposition.querySelector(':scope > .proposition-row > .text');
    const button = text?.querySelector('.note-button');
    if (!text || !button) return false;

    const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const index = node.nodeValue.indexOf('eo ipso');
      if (index === -1) continue;
      const after = node.splitText(index + 'eo ipso'.length);
      after.parentNode.insertBefore(document.createTextNode(' '), after);
      after.parentNode.insertBefore(button, after);
      return true;
    }
    return false;
  }

  if (!placeNote4123()) {
    const observer = new MutationObserver(() => {
      if (placeNote4123()) observer.disconnect();
    });
    observer.observe(document.getElementById('tractatus-tree') || document.body, { childList: true, subtree: true });
  }
})();
