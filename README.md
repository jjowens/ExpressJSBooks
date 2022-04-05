# ExpressJSBooks
API project. It uses Express.js to list books and search through authors and genres

## Available Methods

The API URL is http://localhost:3000/. You can change the port number in the app.js file.

### Get Methods

Get Books

http://localhost:3000/books

Get Authors

http://localhost:3000/authors

Get Genres

http://localhost:3000/genres

Get Books by genre - replace {genre name} with actual genre name

http://localhost:3000/genres/{genre name}

Get Books by Author - replace {author name} with actual author name

http://localhost:3000/authors/{author name}


### Post Method

http://localhost:3000/books/search

Parameters

authors

genres

## Postman

You can use a script inside the folder "postman-scripts" to test ypur API calls