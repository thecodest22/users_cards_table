function fontsizeDynamic() {
  const column = document.querySelector('.table__column');
  const columns = document.querySelectorAll('.table__column');
  const size = column.offsetWidth;
  
  columns.forEach(col => {
    col.style.fontSize = size / 20 + "px";   
  });
}
window.onload = fontsizeDynamic;
window.onresize = fontsizeDynamic; 