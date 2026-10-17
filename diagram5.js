(() => {
  const install = () => {
    const first = document.querySelector('img[alt="Перша схема до положення 6.1203"]');
    if (!first) return false;
    const text = first.closest('.text');
    if (!text) return false;
    const figures = text.querySelectorAll('.tractatus-figure');
    if (figures.length < 5) return false;
    const img = document.createElement('img');
    img.src = 'assets/t6-61203-5-new.svg?v=20261017-1';
    img.alt = 'П’ята схема до положення 6.1203';
    img.style.cssText = 'display:block;width:420px;max-width:100%;height:auto;margin:0.65rem auto;';
    figures[4].replaceWith(img);
    return true;
  };
  if (!install()) {
    const root = document.getElementById('tractatus-tree');
    if (!root) return;
    const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });
    observer.observe(root, {childList:true, subtree:true});
  }
})();