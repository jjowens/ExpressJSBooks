const { application } = require('express');
const { raw } = require('express');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const port = 3000;
const fs = require("fs");

let bodyParser = require('body-parser');

let booksData = [];
let authorData = [];
let genresData = [];

function checkIfAlreadyInList(obj, array) {
  let results = false;

  let idx = array.indexOf(obj);

  if (idx > -1) {
    results = true;
  }

  return results;
}

function cleanKeywords(val, replaceDash) {
  let results = val;

  results = val.toLowerCase();

  if (replaceDash === true) {
    results = results.replace(/-/g, ' ');
  }

  return results;
}

function cleanKeywordArrays(arr, replaceDash) {
  let results = [];

  if (arr !== undefined) {

    if (typeof(arr) === "string") {
      let obj = cleanKeywords(arr, replaceDash);
      results.push(obj);
    } else {
      for(var idx = 0; idx < arr.length; idx++) {
        let obj = cleanKeywords(arr[idx], replaceDash);
        results.push(obj);
      }
    }
    
  }

  return results;
}

function splitStringIntoArray(val) {
  let results = [];
  
  if (val === undefined) {
    return results;
  }
  
  results = val.split(",");

  return results;
}

function searchBooks(searchParameters) {
  let results = [];

  for(let bookIdx=0; bookIdx < booksData.length; bookIdx++) {
    var bookObj = booksData[bookIdx];

    // FIND BY TITLE
    if (searchParameters.title !== undefined) {
      if (searchParameters.title.toLowerCase() === bookObj.title) {
        if (checkIfAlreadyInList(bookObj, results) === false) {
          results.push(bookObj);
        }
      }  
    }

    // FIND BY GENRES
    if (searchParameters.genres !== undefined) {
      for(let searchGenreIdx=0; searchGenreIdx < searchParameters.genres.length; searchGenreIdx++ ) {
        let searchGenre = searchParameters.genres[searchGenreIdx];
        let currentGenre = "";

        for(let genreIdx = 0; genreIdx < bookObj.genres.length; genreIdx++) {
          currentGenre = bookObj.genres[genreIdx].genrename.toLowerCase();
  
          if (currentGenre === searchGenre) {
            if (checkIfAlreadyInList(bookObj, results) === false) {
              results.push(bookObj);
            }
            break;
          }
        } 
      }
    }

    // FIND BY AUTHORS
    if (searchParameters.authors !== undefined) {
      for(let searchAuthorIdx=0; searchAuthorIdx < searchParameters.authors.length; searchAuthorIdx++ ) {
        let searchAuthor = searchParameters.authors[searchAuthorIdx];
        let currentAuthor = "";

        for(let authorIdx = 0; authorIdx < bookObj.authors.length; authorIdx++) {
          currentAuthor = bookObj.authors[authorIdx].fullname.toLowerCase();

          if (currentAuthor === searchAuthor) {
            if (checkIfAlreadyInList(bookObj, results) === false) {
              results.push(bookObj);
            }
            break;
          }
        } 
      }
    }

  }

  return results;
}

function prepopulateData() {
  let rawData = JSON.parse(fs.readFileSync("books.json", {encoding: 'utf8', flag: 'r'} ));

  booksData = rawData.Books;
  
  authorData = rawData.Authors;

  genresData = rawData.Genres;
}

// SET UP APP TO CAPTURE BODY CONTENT
app.use(bodyParser.urlencoded({ extended: true }));

// SET UP METHODS
app.get('/', (req, res) => {
    res.json({'message': 'Welcome to Books API'});
});

app.get('/genres', (req, res) => {
    res.json({ "genres": genresData});
});

app.get('/authors', (req, res) => {
  res.json({ "authors": authorData});
});

app.get('/books', (req, res) => {
  res.json({ "books": booksData});
});

app.get('/genres/:genre/', (req, res) => {
  let searchParameters = new Object();
  let genres = splitStringIntoArray(req.params["genre"])
  searchParameters.genres = cleanKeywordArrays(genres, true);

  let searchResults = searchBooks(searchParameters);
  
  res.json({ "searchresults": searchResults});
});

app.get('/authors/:author/', (req, res) => {
  let searchParameters = new Object();
  let authors = splitStringIntoArray(req.params["author"])
  searchParameters.authors = cleanKeywordArrays(authors, true);

  let searchResults = searchBooks(searchParameters);

  res.json({ "searchresults": searchResults});
});

app.post('/books/search/', (req, res) => {
  let searchParameters = new Object();
  searchParameters.authors = cleanKeywordArrays(req.body["authors"], true);
  searchParameters.genres = cleanKeywordArrays(req.body["genres"], true);

  let searchResults = searchBooks(searchParameters);

  res.json({ 
    "searchresults": searchResults,
    "searchparams": req.body
  });
});

app.get('/stats', (req, res) => {
  let stats = {
    "TotalBooks": booksData.length,
    "TotalAuthors": authorData.length,
    "TotalGenres": genresData.length
  };

  res.json({ "stats": stats});
});

// LOAD DATA
prepopulateData();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});