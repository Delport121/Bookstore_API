// src/controllers/book.controller.ts

import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { CreateBookDTO } from '../models/book.model';
// We will also add CRUD controllers here later

const bookService = new BookService();

// --- CRUD Controller Methods ---

// POST /books
export const createBook = (req: Request, res: Response): Response => {
    // Basic input validation: check if required fields are present
    const { title, author, genre, price } = req.body as CreateBookDTO;

    if (!title || !author || !genre || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'Invalid input. Required fields: title, author, genre, price (> 0).' });
    }

    try {
        const newBook = bookService.createBook(req.body as CreateBookDTO);
        return res.status(201).json(newBook);
    } catch (error) {
        // Handle potential errors from the service layer, though unlikely here
        return res.status(500).json({ message: 'Failed to create book.' });
    }
};

// GET /books
// Supports query parameters: ?genre=Fiction&author=Harper Lee&title=Mockingbird&minPrice=10&maxPrice=100
export const getAllBooks = (req: Request, res: Response): Response => {
    const { genre, author, title, minPrice, maxPrice } = req.query;
    
    // Parse price filters if provided
    const filters = {
        genre: genre as string | undefined,
        author: author as string | undefined,
        title: title as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    };
    
    // Validate price filters
    if (filters.minPrice !== undefined && isNaN(filters.minPrice)) {
        return res.status(400).json({ message: 'Invalid minPrice parameter.' });
    }
    if (filters.maxPrice !== undefined && isNaN(filters.maxPrice)) {
        return res.status(400).json({ message: 'Invalid maxPrice parameter.' });
    }
    
    const books = bookService.getAllBooks(filters);
    return res.status(200).json(books);
};

// GET /books/:id
export const getBookById = (req: Request, res: Response): Response => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid book ID.' });
    }

    const book = bookService.getBookById(id);

    if (!book) {
        return res.status(404).json({ message: `Book with ID ${id} not found.` });
    }

    return res.status(200).json(book);
};

// PUT /books/:id
export const updateBook = (req: Request, res: Response): Response => {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid book ID.' });
    }
    
    // Basic validation for price if it exists in the update
    if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price <= 0)) {
        return res.status(400).json({ message: 'Price must be a number greater than 0.' });
    }

    const updatedBook = bookService.updateBook(id, updateData);

    if (!updatedBook) {
        return res.status(404).json({ message: `Book with ID ${id} not found.` });
    }

    return res.status(200).json(updatedBook);
};

// DELETE /books/:id
export const deleteBook = (req: Request, res: Response): Response => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid book ID.' });
    }

    const wasDeleted = bookService.deleteBook(id);

    if (!wasDeleted) {
        return res.status(404).json({ message: `Book with ID ${id} not found.` });
    }

    return res.status(204).send(); // No Content on successful deletion
};

/**
 * Endpoint: GET /books/discounted-price?genre={genre_name}&discount={discount_percentage}
 * Description: Calculate the total discounted price for all books in a specific genre.
 */
export const calculateDiscountedPrice = (req: Request, res: Response): Response => {
    // 1. Input Validation and Error Handling 
    const { genre, discount } = req.query;

    if (!genre || typeof genre !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid "genre" query parameter.' });
    }

    const discountPercentage = parseFloat(discount as string);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
        return res.status(400).json({ message: 'Missing or invalid "discount" percentage (must be between 0 and 100).' });
    }

    // 2. Call the Service Layer
    const result = bookService.calculateDiscountedPriceForGenre(
        genre,
        discountPercentage
    );

    // 3. Handle Service Result
    if (!result) {
        return res.status(404).json({ message: `No books found for genre: ${genre}` });
    }

    // 4. Send Success Response
    // Example Response shows genre, discount_percentage, and total_discounted_price
    return res.status(200).json(result);
};