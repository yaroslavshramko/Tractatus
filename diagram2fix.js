(() => {
  const install = () => {
    const root = document.getElementById('tractatus-tree');
    if (!root) return false;
    const figures = root.querySelectorAll('.tractatus-figure');
    if (figures.length < 2) return false;

    figures[1].innerHTML = '<img src="assets/t6-61203-2-new.svg?v=20261005-1" alt="Друга схема до положення 6.1203" style="display:block;width:140px;max-width:100%;height:auto;margin:0.65rem auto;">';
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