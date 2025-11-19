// src/repositories/book.repository.ts

import { Book, CreateBookDTO } from '../models/book.model';

// In-memory array to simulate a database
let books: Book[] = [
    // Initial data for testing
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 50.00 },
    { id: 2, title: "1984", author: "George Orwell", genre: "Fiction", price: 75.00 },
    { id: 3, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", price: 40.00 },
    { id: 4, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", price: 65.00 },
];

let nextId = books.length + 1;

/**
 * Repository for managing Book data access operations.
 */
export class BookRepository {
    
    // --- CRUD Operations ---
    
    // Create a new book
    create(bookData: CreateBookDTO): Book {
        const newBook: Book = {
            id: nextId++,
            ...bookData,
        };
        books.push(newBook);
        return newBook;
    }

    // Read all books
    findAll(): Book[] {
        return books;
    }

    // Read a book by ID
    findById(id: number): Book | undefined {
        return books.find(book => book.id === id);
    }
    
    // Update an existing book
    update(id: number, updatedData: Partial<CreateBookDTO>): Book | undefined {
        const index = books.findIndex(book => book.id === id);
        if (index === -1) {
            return undefined;
        }
        
        books[index] = {
            ...books[index],
            ...updatedData
        };
        return books[index];
    }
    
    // Delete a book by ID
    delete(id: number): boolean {
        const initialLength = books.length;
        books = books.filter(book => book.id !== id);
        return books.length < initialLength; // Return true if a book was removed
    }

    // --- Logical Operation Support ---

    // Find books by genre (required for the discount calculation)
    findByGenre(genre: string): Book[] {
        // Case-insensitive filtering
        const normalizedGenre = genre.toLowerCase();
        return books.filter(book => book.genre.toLowerCase() === normalizedGenre);
    }
}