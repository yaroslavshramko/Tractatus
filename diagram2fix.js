(() => {
  const install = () => {
    const root = document.getElementById('tractatus-tree');
    if (!root) return false;

    const proposition = Array.from(root.querySelectorAll('.proposition')).find((node) => {
      const number = node.querySelector(':scope > .proposition-row > .number');
      return number && number.textContent.trim() === '6.1203';
    });
    if (!proposition) return false;

    const text = proposition.querySelector(':scope > .proposition-row > .text');
    if (!text) return false;
    const figures = text.querySelectorAll('.tractatus-figure');
    if (figures.length < 2) return false;

    const figure = figures[1];
    figure.style.width = '100%';
    figure.style.maxWidth = '100%';
    figure.style.height = 'auto';
    figure.style.overflow = 'visible';
    figure.innerHTML = '<img src="assets/tractatus6/diagram-2-user.png?v=20261005-6" alt="Друга схема до положення 6.1203" style="display:block;width:auto;max-width:100%;height:auto;max-height:none;object-fit:contain;margin:0.65rem auto;">';
    return true;
  };

  if (!install()) {
    const root = document.getElementById('tractatus-tree');
    if (!root) return;
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
  }
})();