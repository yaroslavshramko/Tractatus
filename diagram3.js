(() => {
  const install = () => {
    const figures = document.querySelectorAll('.tractatus-figure');
    if (figures.length < 3) return false;
    figures[2].innerHTML = '<img src="assets/t6-61203-3.png" alt="Третя схема до положення 6.1203" style="display:block;width:60px;max-width:100%;height:auto;margin:0.65rem auto;">';
    return true;
  };
  if (!install()) {
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.getElementById('tractatus-tree'), { childList: true, subtree: true });
  }
})();