// src/services/book.service.ts

import { Book, CreateBookDTO } from '../models/book.model';
import { BookRepository } from '../repositories/book.repository';

// Define the structure for the complex logical operation's output
export interface DiscountResult {
    genre: string;
    discount_percentage: number;
    total_discounted_price: number;
}

export class BookService {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository();
    }

    // --- CRUD Service Methods ---

    createBook(bookData: CreateBookDTO): Book {
        return this.bookRepository.create(bookData);
    }

    getAllBooks(): Book[] {
        return this.bookRepository.findAll();
    }

    getBookById(id: number): Book | undefined {
        return this.bookRepository.findById(id);
    }
    
    updateBook(id: number, updatedData: Partial<CreateBookDTO>): Book | undefined {
        return this.bookRepository.update(id, updatedData);
    }

    deleteBook(id: number): boolean {
        return this.bookRepository.delete(id);
    }

    // --- Complex Logical Operation Method ---

    /**
     * Calculates the total discounted price for all books in a specific genre.
     * * @param genre The genre name (e.g., 'Fiction').
     * @param discountPercentage The discount percentage (e.g., 10).
     * @returns The calculation result or null if the genre has no books.
     */
    calculateDiscountedPriceForGenre(
        genre: string,
        discountPercentage: number
    ): DiscountResult | null {
        
        // 1. Fetch books by genre using the Repository
        const books = this.bookRepository.findByGenre(genre);

        if (books.length === 0) {
            return null; // No books found for the genre
        }

        // 2. Calculate the Total Original Price
        // Suppose there are two books in the "Fiction" genre priced at $50 and $75[cite: 50].
        // Total original price: $50 + $75 = $125 [cite: 52]
        const totalOriginalPrice = books.reduce((sum, book) => sum + book.price, 0);

        // 3. Calculate the Total Discounted Price
        // Total discounted price: $125 - (10% of $125) = $112.50[cite: 53].
        const discountFactor = discountPercentage / 100;
        const totalDiscountedPrice = totalOriginalPrice * (1 - discountFactor);
        
        // Round to two decimal places for currency format
        const roundedDiscountedPrice = parseFloat(totalDiscountedPrice.toFixed(2));
        
        // 4. Return the structured result
        return {
            genre: genre,
            discount_percentage: discountPercentage,
            total_discounted_price: roundedDiscountedPrice, // Example: 112.50 [cite: 46, 53]
        };
    }
}