"use-strict";
// if (localStorage.getItem("name") === null) {
//   document.write("need name");
// } else {
//   document.write("hello name");
// }
//local storage for name
// const input = document.querySelector("#name");
// const form = document.querySelector("form");
// const submit = document.querySelector("#submitName");
// const remove = document.querySelector("#clear");

// var storage = localStorage;

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
// });

// submit.addEventListener("click", () => {
//   storage.setItem("name", input.value);
//   updateNameTitle();
// });

// remove.addEventListener("click", () => {
//   storage.removeItem("name");
//   updateNameTitle();
// });

// function updateNameTitle() {
//   const name = storage.getItem("name");

//   const h1 = document.querySelector("#nameTitle");

//   name
//     ? (h1.textContent = `Welcome ${name}! Let's start tracking your books!`)
//     : (h1.textContent = "");
// }

const btnSearch = document.querySelector("#btn-search");
const inputSearch = document.querySelector("#input-search");
const divResults = document.querySelector("#search-results");
const lsOutput = document.getElementById("lsOutput");
const resultSet = null;
let bookItems = JSON.parse(localStorage.getItem("Book name"));

btnSearch.addEventListener("click", fetchAPI);

inputSearch.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    fetchAPI();
  }
});

function addBookToList(title) {
  let isBookAdded = false;
  bookItems.forEach((bookTitle) => {
    if (bookTitle === title) {
      isBookAdded = true;
      console.log(title);
    }
  });
  if (!isBookAdded) {
    bookItems.push(title);
  }

  localStorage.setItem("Book name", JSON.stringify(bookItems));
}

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  lsOutput.innerHTML += `${value}`;
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
      resultSet = books;
      let resultHtml = ``;

      console.log(books);
      books.forEach((book) => {
        const bookInfo = book.volumeInfo;

        const image = bookInfo.imageLinks
          ? bookInfo.imageLinks.smallThumbnail
          : "/";
        const title = bookInfo.title;
        const author = bookInfo.authors;
        const description = bookInfo.description
          ? cutDescription(bookInfo.description)
          : "Description not found...";
        const link = bookInfo.infoLink;

        resultHtml += showBook(image, title, author, description, link);
      });

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
                <a href="${link}" class="btn" target="_blank">More info...</a>
                <br>
                <br>
                <button id="btn1" onclick='addBookToList("${title}")'> Add to bookshelf </button>
            </div>
        </div>`;
}

function cutDescription(description) {
  return description.slice(0, 100).concat("", "...");
}

// let searchResults = document.getElementById("search-results");

// searchResults.onclick = () => {
//   bookItemsDisplay = bookItems.shift();

// document.getElementById(
//   "myBookshelf"
// ).innerHTML += `-${bookItemsDisplay} <form>
// <input type="radio" id="currently-reading" name="checkbox-book" value="currently-reading"><label for="currently-reading"> Currently reading</label><br> <input type="radio" id="have-read" name="checkbox-book" value="have-read">
// <label for="have-read"> I have read this book</label><br><button id="submit">Submit</button><br></form><br>`;

//   document.querySelector("form").addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log(e);
//     addSavedBooks();

//     function addSavedBooks() {
//       //   let selectedItem = document.querySelectorAll("input:checked");
//       const radioButtonBook = document.querySelector(
//         'input[name="checkbox-book"]:checked'
//       );

//       if (radioButtonBook) {
//         localStorage.setItem(
//           "radioButton",
//           JSON.stringify([...JSON.parse(localStorage.getItem("radioButton"))])
//         );
//       }
//     }
//   });
// };
