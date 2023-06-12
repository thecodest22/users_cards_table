document.addEventListener('DOMContentLoaded', function() {
  const cardsApiLink = document.getElementById('cardsApiLink');
  const usersApiLink = document.getElementById('usersApiLink');
  const filterCardsInput = document.getElementById('filterCardNumber');
  const filterCardsApply = document.getElementById('filterApply');
  const filterCardsReset = document.getElementById('filterReset');

  cardsApiLink.addEventListener('click', function(event) {
    event.preventDefault();
    getDataFromApi('https://fakerapi.it/api/v1/credit_cards?_quantity=100', 'Credit cards data');
  });

  usersApiLink.addEventListener('click', function(event) {
    event.preventDefault();
    getDataFromApi('https://fakerapi.it/api/v1/users?_quantity=100', 'Users data');
  });
  
  filterCardsApply.addEventListener('click', function () {
    const filterCardsValue = filterCardsInput.value;
    filterApply(filterCardsValue);
  })
});

function getDataFromApi(url, tableName) {
  fetch(url)
    .then(response => response.json())
    .then(responseData => {
      if (responseData.status === 'OK') {
        const tableContainer = document.getElementById('data-table__container');
        tableContainer.innerHTML = '';
        
        const table = document.createElement('table');
        table.setAttribute('class', 'cards-table');
        
        const tableCaption = document.createElement('caption');
        tableCaption.setAttribute('class', 'cards-table__caption');
        tableCaption.innerText = tableName
        
        const tableHeader = document.createElement('thead');
        tableHeader.setAttribute('class', 'cards-table__header');
        
        const tableHeaderRow = document.createElement('tr');
        for (const tableColumnName in responseData.data[0]) {
          const tableData = document.createElement('td');
          tableData.innerText = tableColumnName;
          tableHeaderRow.appendChild(tableData);
        }
        tableHeader.appendChild(tableHeaderRow);
        
        const tableBody = document.createElement('tbody');
        tableBody.setAttribute('class', 'cards-table__body');
        
        responseData.data.forEach(cardData => {
          const tableRow = document.createElement('tr');
          const tableColumnValues = Object.values(cardData);
          tableColumnValues.forEach(value => {
            const tableData = document.createElement('td');
            tableData.innerText = value;
            tableRow.appendChild(tableData);
          });
          tableBody.appendChild(tableRow);
        });
        
        table.appendChild(tableCaption);
        table.appendChild(tableHeader);
        table.appendChild(tableBody);
        tableContainer.appendChild(table);
      } else {
        console.log('Ошибка при получении данных');
      }
    })
    .catch(error => console.log('Ошибка при получении данных:', error));
}
