// src/server.ts

import express, { Application } from 'express';
import dotenv from 'dotenv';
import bookRoutes from './routes/book.routes'; // Import the new router

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // Allows the API to parse JSON payloads
app.use('/books', bookRoutes); // Use the book routes for /books endpoints

// Basic root route for testing
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Bookstore API is running!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    console.log(`Books API: http://localhost:${PORT}/books`);
});