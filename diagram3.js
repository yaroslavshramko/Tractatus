(() => {
  const install = () => {
    const firstDiagram = document.querySelector('img[alt="Перша схема до положення 6.1203"]');
    if (!firstDiagram) return false;

    const propositionText = firstDiagram.closest('.text');
    if (!propositionText) return false;

    const figures = propositionText.querySelectorAll('.tractatus-figure');
    if (figures.length < 4) return false;

    figures[2].innerHTML = '<img src="assets/t6-61203-3.png" alt="Третя схема до положення 6.1203" style="display:block;width:60px;max-width:100%;height:auto;margin:0.65rem auto;">';
    figures[3].innerHTML = '<img src="assets/t6-61203-4.svg" alt="Четверта схема до положення 6.1203" style="display:block;width:140px;max-width:100%;height:auto;margin:0.65rem auto;">';
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