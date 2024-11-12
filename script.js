resultsPerPage = 10;
let currentPage = 1;

function searchPublications() {
  authorName = document.getElementById('authorName').value;
  apiUrl = `https://dblp.org/search/publ/api?q=author%3A${encodeURIComponent(authorName)}%3A&format=json&h=${resultsPerPage}&f=${(currentPage - 1) * resultsPerPage}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      showResults(data.result.hits.hit);
      makePagination(data.result.hits["@total"]);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function showResults(publications) {
  resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  let tableHtml = `
      <tr>
        <th>Title</th>
        <th>Authors</th>
        <th>Venue</th>
        <th>Year</th>
      </tr>
   `;

  for (let i = 0; i < publications.length; i++) {
  const { title, authors, venue, year } = publications[i].info;

    tableHtml += `
      <tr>
        <td>${title}</td>
        <td>${authors.author.map(a => a.text).join(', ')}</td>
        <td>${venue}</td>
        <td>${year}</td>
      </tr>
    `;
  }

  resultsContainer.innerHTML = `<table>${tableHtml}</table>`;
}

function makePagination(totalResults) {
  totalPages = Math.ceil(totalResults / resultsPerPage);
  paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      button = document.createElement('button');
      button.textContent = i;
      button.className = 'pagination-button';
      button.onclick = () => {
        currentPage = i;
        searchPublications();
      };

      paginationContainer.appendChild(button);
    }
  }
}