(() => {
  const install = () => {
    const firstDiagram = document.querySelector('img[alt="Перша схема до положення 6.1203"]');
    if (!firstDiagram) return false;
    const propositionText = firstDiagram.closest('.text');
    if (!propositionText) return false;
    const figures = propositionText.querySelectorAll('.tractatus-figure');
    if (figures.length < 3) return false;

    figures[2].style.width = 'min(390px, 100%)';
    figures[2].innerHTML = '<img src="assets/tractatus6/diagram-3-final.png?v=20261005-final-150" alt="Третя схема до положення 6.1203" style="display:block;width:150%;max-width:none;height:auto;margin:0.65rem auto;transform:translateX(-16.6667%);">';
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