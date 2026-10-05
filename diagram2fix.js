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

    const oldFigure = figures[1];
    const box = document.createElement('div');
    box.setAttribute('aria-label', 'Друга схема до положення 6.1203');
    box.style.cssText = 'display:block;position:relative;width:140px;height:109px;min-width:140px;min-height:109px;max-width:none;max-height:none;overflow:visible;margin:20px auto 8px;padding:0;line-height:0;align-self:start;';

    const img = document.createElement('img');
    img.src = 'assets/tractatus6/diagram-2-user.png?v=20261005-8';
    img.alt = 'Друга схема до положення 6.1203';
    img.width = 140;
    img.height = 109;
    img.style.cssText = 'display:block;position:absolute;inset:0;width:140px;height:109px;min-width:140px;min-height:109px;max-width:none;max-height:none;object-fit:fill;margin:0;padding:0;border:0;clip:auto;clip-path:none;overflow:visible;';

    box.appendChild(img);
    oldFigure.replaceWith(box);
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