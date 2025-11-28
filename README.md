# Bookstore RESTful API

## 🎯 Objective
This project implements a RESTful API for a bookstore inventory system using **Node.js**, the **Express** framework, and **TypeScript**. The API supports standard **CRUD** (Create, Read, Update, Delete) operations for managing books and includes advanced filtering capabilities and a complex logical operation for calculating genre-specific discounts.

---

## 🏗️ Architecture
The API is built using an **n-layered architecture** to ensure separation of concerns and maintainability:
* **Controller Layer:** Handles incoming HTTP requests, performs input validation, and sends responses.
* **Service Layer:** Contains the business logic, including the core logic for the discount calculation.
* **Repository Layer:** Manages data access, currently utilizing an in-memory array as a mock database.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16 or higher recommended)
* npm

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Delport121/Bookstore_API.git
    cd Bookstore_API
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    This installs Express, TypeScript, and necessary development tools like `ts-node`, `nodemon`, and `jest`.

3.  **Create Environment File (.env) (Optional):**
    Create a file named **`.env`** in the root directory for custom configuration. Use `.env.example` as a template:
    ```bash
    cp .env.example .env
    ```
    Or on Windows PowerShell:
    ```powershell
    Copy-Item .env.example .env
    ```
    
    Example `.env` contents:
    ```
    PORT=3000
    NODE_ENV=development
    ```

4.  **Run the API in Development Mode:**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:3000` (or your configured port) and will automatically restart on code changes.

5.  **Run the API in Production Mode:**
    ```bash
    npm start
    ```

### Running Tests
Unit tests are included to ensure the correctness of all CRUD operations and the discount calculation logic.

To run the tests:
```bash
npm test
```

---

## 📚 API Endpoints

### Book Management (CRUD)

| Method | Endpoint | Description | Request Body | Success Response |
|--------|----------|-------------|--------------|------------------|
| POST | `/books` | Adds a new book to the inventory | `{"title": "...", "author": "...", "genre": "...", "price": 99.99}` | 201 Created |
| GET | `/books` | Retrieves a list of all books (supports filtering) | None | 200 OK (Array of Book objects) |
| GET | `/books/:id` | Retrieves details of a book by its ID | None | 200 OK (Single Book object) |
| PUT | `/books/:id` | Updates details of an existing book | `{"price": 89.99, "genre": "..."}` | 200 OK (Updated Book object) |
| DELETE | `/books/:id` | Deletes a book from the inventory | None | 204 No Content |

### Book Filtering (GET /books)

The `GET /books` endpoint supports the following query parameters for filtering:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `genre` | string | Filter by exact genre (case-insensitive) | `?genre=Fiction` |
| `author` | string | Filter by author name (partial match) | `?author=Harper Lee` |
| `title` | string | Filter by book title (partial match) | `?title=Mockingbird` |
| `minPrice` | number | Filter books with price >= minPrice | `?minPrice=50` |
| `maxPrice` | number | Filter books with price <= maxPrice | `?maxPrice=100` |

**Examples:**
```
GET /books?genre=Fiction
GET /books?author=Harper&maxPrice=60
GET /books?minPrice=40&maxPrice=80
```

### Complex Logical Operation (Discount Calculation)

| Method | Endpoint | Description | Example Request | Example Response |
|--------|----------|-------------|-----------------|------------------|
| GET | `/books/discounted-price` | Calculates the total discounted price for all books in a specific genre based on a given discount percentage | `/books/discounted-price?genre=Fiction&discount=10` | `{"genre": "Fiction", "discount_percentage": 10, "total_discounted_price": 112.50}` |

---

## 📝 Example Requests

### Create a Book
```bash
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "price": 60.00
}
```

### Get All Books
```bash
GET http://localhost:3000/books
```

### Get Books by Genre
```bash
GET http://localhost:3000/books?genre=Fiction
```

### Get Book by ID
```bash
GET http://localhost:3000/books/1
```

### Update a Book
```bash
PUT http://localhost:3000/books/1
Content-Type: application/json

{
  "price": 55.00
}
```

### Delete a Book
```bash
DELETE http://localhost:3000/books/1
```

### Calculate Discounted Price
```bash
GET http://localhost:3000/books/discounted-price?genre=Fiction&discount=10
```

---

## 🧪 Testing

The project includes comprehensive unit tests for:
- All CRUD operations (Create, Read, Update, Delete)
- Filtering functionality
- Discount calculation logic
- Edge cases and error handling

Tests are written using Jest and cover both the service layer logic and repository interactions.

---

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Jest** - Testing framework
- **ts-node** - TypeScript execution
- **nodemon** - Development auto-reload

---

## 📂 Project Structure

```
bookstore-api/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access
│   ├── models/          # Data types
│   ├── routes/          # API routes
│   └── server.ts        # Application entry point
├── jest.config.js       # Test configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

---
