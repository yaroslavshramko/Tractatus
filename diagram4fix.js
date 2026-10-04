(() => {
  const install = () => {
    const first = document.querySelector('img[alt="Перша схема до положення 6.1203"]');
    if (!first) return false;
    const box = first.closest('.text');
    if (!box) return false;
    const figures = box.querySelectorAll('.tractatus-figure');
    if (figures.length < 4) return false;
    figures[3].innerHTML = '<img src="assets/t6-61203-4-correct.svg?v=20261004-1" alt="Четверта схема до положення 6.1203" style="display:block;width:140px;max-width:100%;height:auto;margin:0.65rem auto;">';
    if (!document.querySelector('script[data-diagram1-clean]')) {
      const s = document.createElement('script');
      s.src = 'diagram1.js?v=20261004-1';
      s.dataset.diagram1Clean = 'true';
      document.body.appendChild(s);
    }
    return true;
  };
  if (!install()) {
    const root = document.getElementById('tractatus-tree');
    if (!root) return;
    const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });
    observer.observe(root, {childList:true, subtree:true});
  }
})();