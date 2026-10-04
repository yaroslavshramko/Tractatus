(() => {
  function applyParagraphSpacing(root) {
    root.querySelectorAll('.text').forEach((text) => {
      const breaks = Array.from(text.querySelectorAll('br'));
      breaks.forEach((br) => {
        const next = br.nextSibling;
        if (next && next.nodeType === Node.ELEMENT_NODE && next.tagName === 'BR') {
          const spacer = document.createElement('span');
          spacer.className = 'paragraph-gap';
          br.replaceWith(spacer);
          next.remove();
        }
      });
    });
  }

  const root = document.getElementById('tractatus-tree');
  if (!root) return;

  const run = () => applyParagraphSpacing(root);
  run();
  const observer = new MutationObserver(run);
  observer.observe(root, { childList: true, subtree: true });
})();
