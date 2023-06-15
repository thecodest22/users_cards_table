let tableContentMaxLen = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Получаем элементы запуска загрузки по api
  const cardsApiButton = document.getElementById('load-cards-list');
  const usersApiButton = document.getElementById('load-users-list');
  const entriesNumber = document.getElementById('load-entries-number');
  
  // Получаем элемент контейнера секции, куда добавляем элемент контролов таблицы и самой таблицы
  const sectionContainer = document.getElementById('section-container');
  
  const controlsContainer = document.createElement('div');
  controlsContainer.setAttribute('class', 'table-controls section-container__table-controls');
  
  const tableContainer = document.createElement('div');
  tableContainer.setAttribute('class', 'table-container section-container__table-container');
  
  // Объявим переменные для хранения готовых таблиц - оригинальной и сортированной. Пригодится для кеширования,
  // чтобы не перезапрашивать и не перестраивать все заново при сбросе фильтрации или сортировки
  let tableElement = null;
  let usersSortedByName = null;
  
  cardsApiButton.addEventListener('click', function(event) {
    event.preventDefault();  /*Глушим дефолтное действие элемента*/
    
    // Очищаем все содержимое - и контролы, и саму таблицу. Обнуляем максимальную длину контента в таблице
    sectionContainer.innerHTML = '';
    tableContentMaxLen = 0;
    
    // Создаем элементы управления - кнопки, инпуты, вешаем атрибуты, потом добавляем все элементы в контейнер
    const errorOutputBlock = document.createElement('p');
    errorOutputBlock.setAttribute('class', 'error-message table-controls__error-message');
    errorOutputBlock.hidden = true;
    
    const filterInputField = document.createElement('input');
    filterInputField.setAttribute('class', 'input input_size_s table-controls__input');
    filterInputField.setAttribute('type', 'number');
    filterInputField.setAttribute('placeholder', 'Номер или его часть');
    
    const filterApplyButton = document.createElement('button');
    filterApplyButton.setAttribute('class', 'button button_size_s table-controls__button');
    filterApplyButton.innerText = 'Применить';
    
    const filterResetButton = document.createElement('button');
    filterResetButton.setAttribute('class', 'button button_size_s table-controls__button');
    filterResetButton.innerText = 'Сбросить фильтр';
    
    // Вешаем на контролы слушатели для запуска фильтрации или сброса фильтров
    filterInputField.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        performFiltering(tableContainer, filterInputField, errorOutputBlock);
      }
    });
    
    filterApplyButton.addEventListener('click', function () {
      performFiltering(tableContainer, filterInputField, errorOutputBlock);
    });
    
    filterResetButton.addEventListener('click', function () {
      if (tableElement) {
        addTableToHtml(tableElement, tableContainer, true);
        filterInputField.focus();
        filterInputField.select();
      }
    })
    
    controlsContainer.innerHTML = '';
    controlsContainer.append(errorOutputBlock, filterInputField, filterApplyButton, filterResetButton);
    
    // Добавляем блок контролов и контейнер таблицы в основной контейнер
    sectionContainer.append(controlsContainer, tableContainer);
    // Работаем с контентом таблицы - получаем ответ от АПИ, строим таблицу, помещаем таблицу в контейнер
    getDataFromApi(`https://fakerapi.it/api/v1/credit_cards?_quantity=${entriesNumber.value}`)
        .then(responseJson => buildTable(responseJson, 'Cards data table'))
        .then(table => {
          tableElement = table;
          addTableToHtml(tableElement, tableContainer, true);
        });
  });

  usersApiButton.addEventListener('click', function(event) {
    event.preventDefault();  /*Глушим дефолтное действие элемента*/
    
    // Очищаем все содержимое - и контролы, и саму таблицу. Обнуляем максимальную длину контента в таблице
    sectionContainer.innerHTML = '';
    tableContentMaxLen = 0;
    
    // Создаем элементы управления - кнопки, инпуты, вешаем атрибуты, потом добавляем все элементы в контейнер
    const sortApplyButton = document.createElement('button');
    sortApplyButton.setAttribute('class', 'button button_size_s table-controls__button');
    sortApplyButton.innerText = 'Сортировать по имени';
    
    const sortResetButton = document.createElement('button');
    sortResetButton.setAttribute('class', 'button button_size_s table-controls__button');
    sortResetButton.innerText = 'Сбросить сортировку';
    
    // Вешаем слушатели для сортировки юзеров по имени и для сброса сортировки
    sortApplyButton.addEventListener('click', function () {
      if (usersSortedByName) {
        addTableToHtml(usersSortedByName, tableContainer);
      } else {
        usersSortedByName = tableElement.cloneNode(true);
        sortUsersByName(usersSortedByName);
      }
      addTableToHtml(usersSortedByName, tableContainer);
    });
    
    sortResetButton.addEventListener('click', function () {
      addTableToHtml(tableElement, tableContainer);
    });
    
    controlsContainer.innerHTML = '';
    controlsContainer.append(sortApplyButton, sortResetButton);
    
    // Добавляем блок контролов и контейнер таблицы в основной контейнер
    sectionContainer.append(controlsContainer, tableContainer);
    // Работаем с контентом таблицы - получаем ответ от АПИ, строим таблицу, помещаем таблицу в контейнер
    getDataFromApi(`https://fakerapi.it/api/v1/users?_quantity=${entriesNumber.value}`)
        .then(responseJson => buildTable(responseJson, 'Users data table'))
        .then(table => {
          tableElement = table.cloneNode(true);
          usersSortedByName = null;
          addTableToHtml(table, tableContainer);
        });
  });
});

function getDataFromApi(apiUrl) {
  return fetch(apiUrl)
      .then(response => response.json())
      .then(responseJsonData => {
        if (responseJsonData.status === 'OK') {
          return responseJsonData;
        } else {
          throw new Error('Не удалось получить данные по API');
        }
      })
      .catch(error => console.log(error));
}

function buildTable(jsonData, tableName) {
  
  const table = document.createElement('table');
  table.setAttribute('class', 'table table-container__table');
  
  // const tableCaption = document.createElement('caption');
  // tableCaption.setAttribute('class', 't-caption table__caption');
  // tableCaption.innerText = tableName;
  
  const tableHeader = document.createElement('thead');
  tableHeader.setAttribute('class', 't-header table__header');
  
  const tableHeaderRow = document.createElement('tr');
  tableHeaderRow.setAttribute('class', 't-header-row table__row');
  for (const tableColumnName in jsonData.data[0]) {
    const tableHeaderData = document.createElement('th');
    tableHeaderData.setAttribute('class', 't-header-cell table__cell');
    tableHeaderData.innerText = tableColumnName;
    tableHeaderRow.appendChild(tableHeaderData);
  }
  tableHeader.appendChild(tableHeaderRow);
  
  const tableBody = document.createElement('tbody');
  tableBody.setAttribute('class', 't-body table__body');
  
  jsonData.data.forEach(cardData => {
    const tableRow = document.createElement('tr');
    tableRow.setAttribute('class', 't-body-row table__row');
    
    const tableColumnValues = Object.values(cardData);
    tableColumnValues.forEach(value => {
      const tableData = document.createElement('td');
      tableData.setAttribute('class', 't-body-cell table__cell')
      tableData.innerText = value;
      tableRow.appendChild(tableData);
      
      const contentLength = tableData.textContent.length;
      if (contentLength > tableContentMaxLen) {
        tableContentMaxLen = contentLength;
      }
    });
    tableBody.appendChild(tableRow);
  });
  
  // table.append(tableCaption, tableHeader, tableBody);
  table.append(tableHeader, tableBody);
  
  return table;
}

function addTableToHtml(tableElem, htmlTableContainer, clone = false) {
  const myEvent = new CustomEvent('resize', {bubbles: true, detail: tableContentMaxLen})
  htmlTableContainer.innerHTML = '';
  
  if (clone) {
    const clonedTable = tableElem.cloneNode(true);
    htmlTableContainer.appendChild(clonedTable);
  } else {
    htmlTableContainer.appendChild(tableElem);
  }
  
  htmlTableContainer.dispatchEvent(myEvent);
}

function performFiltering(tableContainer, filterValueInput, errorOutput) {
  const filterValue = filterValueInput.value;
  if (filterValue && validateInput(filterValue, errorOutput)) {
    applyFiltering(tableContainer, filterValue);
  } else {
    filterValueInput.focus();
    filterValueInput.select();
  }
}

function validateInput(testValue, errorOutput) {
  let isValid = true
  
  if (testValue.length === 1) {
    errorOutput.innerText = 'Одна цифра?.. Чувак, ты серьезно?'
    isValid = false;
  } else {
    if (!/^\d+$/.test(testValue)) {
      errorOutput.innerText = 'Поиск номера карты возможен только по цифрам';
      isValid = false;
    }
  }
  
  if (!isValid) {
    errorOutput.removeAttribute('hidden');
  } else {
    errorOutput.innerText = '';
    errorOutput.hidden = true;
  }
  
  return isValid;
}

function applyFiltering(tableContainer, filterValue) {
  const currentTable = tableContainer.querySelector('table');
  const tableRows = currentTable.querySelectorAll('tbody tr');
  
  tableRows.forEach(row => {
    const cardNumber = row.cells[1].innerText;
    if (!cardNumber.includes(filterValue)) {
      row.style.display = 'none';
    } else {
      row.style.display = 'table-row';
    }
  });
}

function sortUsersByName(usersTable) {
  const tableBody = usersTable.querySelector('tbody');
  const tableRows = Array.from(tableBody.getElementsByTagName('tr'));
  tableBody.innerHTML = '';
  
  tableRows.sort((userA, userB) => {
    const firstNameA = userA.cells[2].innerText.toLowerCase();
    const lastNameA = userA.cells[3].innerText.toLowerCase();
    const fullNameA = `${firstNameA}${lastNameA}`;
    
    const firstNameB = userB.cells[2].innerText.toLowerCase();
    const lastNameB = userB.cells[3].innerText.toLowerCase();
    const fullNameB = `${firstNameB}${lastNameB}`;
    
    return fullNameA.localeCompare(fullNameB);
  });
  
  tableRows.forEach(row => {
    tableBody.appendChild(row);
  });
}
