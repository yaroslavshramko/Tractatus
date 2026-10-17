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

    const img = document.createElement('img');
    img.src = 'assets/t6-61203-2-new.svg?v=20261017-3';
    img.alt = 'Друга схема до положення 6.1203';
    img.style.cssText = 'display:block;width:320px;max-width:100%;height:auto;margin:20px auto 8px;border:0;';

    figures[1].replaceWith(img);
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