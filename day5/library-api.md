# Library Books REST API

## Resource

The resource is `books`. Each book has an ID, title, author, publication year and ISBN.

Base URL: `/api`

### 1. List all books

* **Method:** GET
* **Path:** `/api/books`
* **Description:** Returns a list of all books.
* **Success status:** `200 OK`
* **Example request body:** None.

### 2. Get one book

* **Method:** GET
* **Path:** `/api/books/{id}`
* **Description:** Returns the book with the specified ID.
* **Success status:** `200 OK`
* **Example request body:** None.

### 3. Create a book

* **Method:** POST
* **Path:** `/api/books`
* **Description:** Creates a new book.
* **Success status:** `201 Created`
* **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publicationYear": 1958,
  "isbn": "9780385474542"
}
```

### 4. Update a book

* **Method:** PUT
* **Path:** `/api/books/{id}`
* **Description:** Replaces the details of an existing book.
* **Success status:** `200 OK`
* **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publicationYear": 1958,
  "isbn": "9780385474542"
}
```

### 5. Delete a book

* **Method:** DELETE
* **Path:** `/api/books/{id}`
* **Description:** Deletes the book with the specified ID.
* **Success status:** `204 No Content`
* **Example request body:** None.

### 6. List books by author

* **Method:** GET
* **Path:** `/api/books?author=Chinua%20Achebe`
* **Description:** Returns books written by the specified author.
* **Success status:** `200 OK`
* **Example request body:** None. The author is supplied as a query parameter.

## Error responses

### 400 Bad Request

The request contains invalid data, such as creating a book without a title or with an invalid publication year.

### 404 Not Found

The requested book ID does not exist, or the requested resource cannot be found.