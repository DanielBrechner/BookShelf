"use-strict";

const btnSearch = document.querySelector("#btn-search");
const inputSearch = document.querySelector("#input-search");
const divResults = document.querySelector("#search-results");
const savedBooks = document.querySelector("#saved-books");
let resultSet = null;

const clearBookshelf = document.getElementById("clear-bookshelf");

let bookItems = JSON.parse(localStorage.getItem("Book name")) || [];
console.log(bookItems);

clearBookshelf.addEventListener("click", function (e) {
  if (bookItems.length > 0) {
    bookItems = [];
    localStorage.removeItem("Book name");
    updateBookshelf();
  }
});

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
      resultSet = books;
      let resultHtml = ``;
      console.log(books);
      books.forEach((book) => {
        const bookInfo = book.volumeInfo;
        const id = book.id;
        const image = bookInfo.imageLinks
          ? bookInfo.imageLinks.smallThumbnail
          : "/";
        const title = bookInfo.title;
        const author = bookInfo.authors;
        const description = bookInfo.description
          ? cutDescription(bookInfo.description)
          : "Description not found...";
        const link = bookInfo.infoLink;

        resultHtml += showBook(id, image, title, author, description, link);
      });

      divResults.innerHTML = `<div class="html-results">${resultHtml}</div>`;
    });
}

function showBook(id, image, title, author, description, link) {
  return `
        <div class="card">
            <img src="${image}" class="card-img" alt="book cover">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-author">by ${author}</h6>
                <p class="card-text">${description}</p>
                <a href="${link}" class="btn" target="_blank">More info...</a>
                <br>
                <br>
                <button id="btn1" onclick='addBookToList("${id}")'> Add to bookshelf </button>
            </div>
        </div>`;
}
function updateBookshelf() {
  let resultHtml = ``;

  bookItems.forEach((book) => {
    const bookInfo = book.volumeInfo;
    const id = book.id;
    const image = bookInfo.imageLinks
      ? bookInfo.imageLinks.smallThumbnail
      : "/";
    const title = bookInfo.title;
    const author = bookInfo.authors;

    resultHtml += showBookInBookshelf(id, image, title, author);
  });

  savedBooks.innerHTML = `<div class="html-results">${resultHtml}</div>`;
}

function showBookInBookshelf(id, image, title, author) {
  return `<div class="card">
      <img src="${image}" class="card-img" alt="book cover">
      <h5 class="card-title">${title}</h5>
      <h6 class="card-author">by ${author}</h6>
      <button onclick='removeBook("${id}")'>Remove Book</button>
      </div>`;
}

function addBookToList(id) {
  let isBookAdded = false;
  const thisBook = resultSet.find((book) => book.id === id);

  if (bookItems.length > 0) {
    bookItems.forEach((book) => {
      if (book.id == thisBook.id) {
        isBookAdded = true;
      }
    });
  }
  console.log(isBookAdded);
  if (!isBookAdded) {
    bookItems.push(thisBook);
  }

  console.log(bookItems);
  localStorage.setItem("Book name", JSON.stringify(bookItems));
  updateBookshelf();
}

function removeBook(id) {
  const thisBook = bookItems.findIndex((book) => book.id === id);
  console.log(thisBook);
  bookItems.splice(thisBook, 1);
  localStorage.setItem("Book name", JSON.stringify(bookItems));
  updateBookshelf();
}

function cutDescription(description) {
  return description.slice(0, 100).concat("", "...");
}

updateBookshelf();
