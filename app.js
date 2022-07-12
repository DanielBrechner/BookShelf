"use-strict";

const btnSearch = document.querySelector("#btn-search");
const inputSearch = document.querySelector("#input-search");
const divResults = document.querySelector("#search-results");

btnSearch.addEventListener("click", fetchAPI);

inputSearch.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    fetchAPI();
  }
});

function fetchAPI() {
  const searchPhrase = inputSearch.value;
  const apiKey = "AIzaSyB8fcAyf3t4-OA-UVRQr5lI5pDcecw9vT4";

  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchPhrase}&maxResults=10&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => data.items)
    .then((books) => {
      let resultHtml = ``;

      books.forEach((book) => {
        const bookInfo = book.volumeInfo;

        // books info displayed on the search page
        const image = bookInfo.imageLinks
          ? bookInfo.imageLinks.smallThumbnail
          : "/";
        const title = bookInfo.title;
        const subtitle = bookInfo.subtitle ? bookInfo.subtitle : "";
        const description = bookInfo.description
          ? cutDescription(bookInfo.description)
          : "Description not found...";
        const link = bookInfo.infoLink;

        // add a book card to the html markup
        resultHtml += showBook(image, title, subtitle, description, link);
      });

      // display created html markup
      divResults.innerHTML = `<div class="html-results">${resultHtml}</div>`;
    });
}

function showBook(image, title, subtitle, description, link) {
  return `
        <div class="card" style="width: 17rem;">
            <img src="${image}" class="card-img" alt="book cover">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-title">${subtitle}</h6>
                <p class="card-text">${description}</p>
                <a href="${link}" class="btn btn-primary">More info...</a>
            </div>
        </div>`;
}

function cutDescription(description) {
  return description.slice(0, 100).concat("", "...");
}
