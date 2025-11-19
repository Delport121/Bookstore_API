# Bookstore RESTful API

## 🎯 Objective
This project implements a RESTful API for a bookstore inventory system using **Node.js**, the **Express** framework, and **TypeScript**. [cite_start]The API supports standard **CRUD** (Create, Read, Update, Delete) operations for managing books [cite: 7] [cite_start]and a complex logical operation for calculating genre-specific discounts[cite: 8].

---

## 🏗️ Architecture
[cite_start]The API is built using an **n-layered architecture** [cite: 5] to ensure separation of concerns and maintainability:
* **Controller Layer:** Handles incoming HTTP requests, performs basic input validation, and sends responses.
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
    git clone [Your Repository URL Here]
    cd bookstore-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    This installs Express, TypeScript, and necessary development tools like `ts-node`, `nodemon`, and `jest`.

3.  **Create Environment File (.env):**
    Create a file named **`.env`** in the root directory for configuration.
    ```
    PORT=3000
    ```

4.  **Run the API in Development Mode:**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:3000` (or your configured port) and will automatically restart on code changes.

### Running Tests
[cite_start]Unit tests are included to ensure the correctness of the implemented logical operation (discount calculation)[cite: 56].

To run the tests:
```bash
npm test

Book Management (CRUD)

Method,Endpoint,Description,Request Body,Success Response
POST,/books,Adds a new book to the inventory. ,"{""title"": ""..."", ""author"": ""..."", ""genre"": ""..."", ""price"": 99.99}",201 Created
GET,/books,Retrieves a list of all books. ,None,200 OK (Array of Book objects)
GET,/books/:id,Retrieves details of a book by its ID. ,None,200 OK (Single Book object)
PUT,/books/:id,Updates details of an existing book. ,"{""price"": 89.99, ""genre"": ""...""}",200 OK (Updated Book object)
DELETE,/books/:id,Deletes a book from the inventory. ,None,204 No Content

Complex Logical Operation (Discount Calculation)

Method,Endpoint,Description,Example Request,Example Response
GET,/books/discounted-price,Calculates the total discounted price for all books in a specific genre based on a given discount percentage. ,/books/discounted-price?genre=Fiction&discount=10 ,"{""genre"": ""Fiction"", ""discount_percentage"": 10, ""total_discounted_price"": 112.50} "