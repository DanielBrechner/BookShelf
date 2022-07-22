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
let resultSet = null;
const lsOutput = document.getElementById("lsOutput");
const updateBookshelf = document.getElementById("updateBookshelf");
const removeBookshelf = document.getElementById("removeBookshelf");

let bookItems = JSON.parse(localStorage.getItem("Book name")) || [];
console.log(bookItems);

//bookshelf events
updateBookshelf.addEventListener("click", function (e) {
  location.reload();
});

removeBookshelf.addEventListener("click", function (e) {
  if (localStorage.length > 0) {
    console.log("length is greater than 0");
    localStorage.removeItem("Book name", JSON.stringify(bookItems));
  }
});

btnSearch.addEventListener("click", fetchAPI);

inputSearch.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    fetchAPI();
  }
});

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

      resultSet = books;
      console.log(books);
      books.forEach((book) => {
        const bookInfo = book.volumeInfo;
        const id = book.id;
        // books info displayed on the search page
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
