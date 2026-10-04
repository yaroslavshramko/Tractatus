(() => {
  const install = () => {
    const img = document.querySelector('img[alt="Перша схема до положення 6.1203"]');
    if (!img) return false;
    img.style.width = '228px';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0.65rem auto';
    return true;
  };
  if (!install()) {
    const root = document.getElementById('tractatus-tree');
    if (!root) return;
    const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });
    observer.observe(root, {childList:true, subtree:true});
  }
})();