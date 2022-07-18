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
                <a href="${link}" class="btn">More info...</a>
                <br>
                <br>
                <button onclick='addBookToList("${title}")'> Add to bookshelf </button>
            </div>
        </div>`;
}

function cutDescription(description) {
  return description.slice(0, 100).concat("", "...");
}

let searchResults = document.getElementById("search-results");

searchResults.onclick = () => {
  saveBooksDisplay = saveBooks.shift();
  document.getElementById(
    "myBookshelf"
  ).innerHTML += `-${saveBooksDisplay} <form>
  <input type="radio" id="currently-reading" name="checkbox-book" value="currently-reading"><label for="currently-reading"> Currently reading</label><br> <input type="radio" id="have-read" name="checkbox-book" value="have-read">
  <label for="have-read"> I have read this book</label><br><button id="submit1">Submit</button><br></form><br>`;

  document.querySelector("form").addEventListener("submit1", (e) => {
    e.preventDefault();
    addSavedBooks();

    function addSavedBooks() {
      const radioButtonBook = document.querySelector(
        'input[name="checkbox-book"]:checked'
      );
      if (radioButtonBook) {
        localStorage.setItem(
          "radioButton",
          JSON.stringify([...JSON.parse(localStorage.getItem("radioButton"))])
        );
      }
    }
  });
};
