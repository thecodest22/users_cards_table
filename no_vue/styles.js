let maxTextLength = 0;

window.addEventListener('resize', function(event) {
  const root = document.documentElement;
  const column = document.querySelector('.table__cell');
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  
  if (column) {
    const size = column.offsetWidth;
    
    // Прикол в том, что событие "resize" у нас еще генерится вручную при создании таблицы скриптом.
    // Поэтому мы смотрим, если это так, значит, таблица новая, и надо переприсвоить максимальную длину текста.
    // isTrusted - создано ли событие реальными действиями или же кодом.
    if (!event.isTrusted) {
      maxTextLength = event.detail;
    }
    
    const adjustmentFactor = 1.7  /*Поправочный коэффициент. Зависит от шрифта. Подбирается опытным путем*/
    const newFontSize = size / maxTextLength * adjustmentFactor + "px";
    root.style.setProperty('--font-size-tcells', newFontSize);
  }
  
  const rem = parseFloat(getComputedStyle(root).getPropertyValue('font-size'));
  // 3 - это просто коэффициент. Это вместо "margin-bottom". То есть, будет расстояние 3 REMа. Как улучшить?
  const newPaddingTop = header.offsetHeight + rem * 3;
  const newPaddingBottom = footer.offsetHeight + rem * 3;
  
  root.style.setProperty('--padding-top-main', newPaddingTop + "px");
  root.style.setProperty('--padding-bottom-main', newPaddingBottom + "px");
});

window.addEventListener('DOMContentLoaded', () => {
  const scrollToTopButton = document.getElementById('button-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      scrollToTopButton.classList.remove('button-to-top_hidden');    
    } else {
      scrollToTopButton.classList.add('button-to-top_hidden');
    }
  });
  
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

