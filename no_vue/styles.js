let maxTextLength = 0;

window.addEventListener('resize', function(event) {
  const columns = document.querySelectorAll('.table__cell');
  if (columns.length !== 0) {
    const size = columns[0].offsetWidth;
    
    // Прикол в том, что событие "resize" у нас еще генерится вручную при создании таблицы скриптом.
    // Поэтому мы смотрим, если это так, значит, таблица новая, и надо пересчитать максимальную длину текста.
    // isTrusted - создано ли событие реальными действиями или же кодом.
    if (!event.isTrusted) {
      maxTextLength = event.detail;
    }
    fontSizeDynamic(columns, size, maxTextLength);
  }
});

function fontSizeDynamic(columnArray, columnSize, contentLength) {
  const adjustmentFactor = 1.7  /*Поправочный коэффициент. Зависит от стиля шрифта. Подбирается опытным путем*/
  const newFontSize = columnSize / contentLength * adjustmentFactor + "px";
  const root = document.documentElement;
  root.style.setProperty('--font-size-tcells', newFontSize);
}
