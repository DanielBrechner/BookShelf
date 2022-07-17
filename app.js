"use-strict";

const btnSearch = document.querySelector("#btn-search");
const inputSearch = document.querySelector("#input-search");
const divResults = document.querySelector("#search-results");
const saveBooks = [];

btnSearch.addEventListener("click", fetchAPI);

inputSearch.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    fetchAPI();
  }
});

function addBookToList(title) {
  let isBookAdded = false;
  saveBooks.forEach((bookTitle) => {
    if (bookTitle === title) {
      isBookAdded = true;
    }
  });
  if (!isBookAdded) {
    saveBooks.push(title);
  }
  console.log(saveBooks);
}

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

      console.log(books);
      books.forEach((book) => {
        console.log(book);
        const bookInfo = book.volumeInfo;

        // books info displayed on the search page
        const image = bookInfo.imageLinks
          ? bookInfo.imageLinks.smallThumbnail
          : "/";
        const title = bookInfo.title;
        const author = bookInfo.authors;
        // const subtitle = bookInfo.subtitle ? bookInfo.subtitle : "";
        const description = bookInfo.description
          ? cutDescription(bookInfo.description)
          : "Description not found...";
        const link = bookInfo.infoLink;

        // add a book card to the html markup
        resultHtml += showBook(image, title, author, description, link);
      });

      // display created html markup
      divResults.innerHTML = `<div class="html-results">${resultHtml}</div>`;
    });
}

function showBook(image, title, author, description, link) {
  return `
        <div class="card">
            <img src="${image}" class="card-img" alt="book cover">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-author">by ${author}</h6>
                <p class="card-text">${description}</p>
                <a href="${link}" class="btn btn-primary">More info...</a>
                <br>
                <br>
                <button onclick='addBookToList("${title}")'> Add to bookshelf </button>
            </div>
        </div>`;
}

function cutDescription(description) {
  return description.slice(0, 100).concat("", "...");
}
// eventz
// document.getElementById("search-results").addEventListener("click", () => {
//   console.log("event clicked for search results!!");
// });

let searchResults = document.getElementById("search-results");
searchResults.onclick = () => {
  console.log("search button pressed");
  document.getElementById("myBookshelf").innerHTML += saveBooks;
};
