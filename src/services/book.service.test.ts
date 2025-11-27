// src/services/book.service.test.ts

import { BookService } from './book.service';
import { BookRepository } from '../repositories/book.repository';
import { Book, CreateBookDTO } from '../models/book.model';

// Mocking the BookRepository to control the data for testing
jest.mock('../repositories/book.repository');

describe('BookService', () => {
    let bookService: BookService;
    let mockBookRepository: jest.Mocked<BookRepository>;

    // Define the sample data based on the requirement example
    const mockBooks: Book[] = [
        { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 50.00 },
        { id: 2, title: "1984", author: "George Orwell", genre: "Fiction", price: 75.00 },
        { id: 3, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", price: 40.00 },
        { id: 4, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", price: 65.00 },
    ];

    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks(); 
        
        // Instantiate the service, which will use the mocked repository
        bookService = new BookService();
        
        // Get the mocked instance for easy spying/controlling
        mockBookRepository = (BookRepository as jest.Mock).mock.instances[0] as jest.Mocked<BookRepository>;
        
        // Configure the mock findByGenre to return our controlled data
        mockBookRepository.findByGenre.mockImplementation((genre: string) => {
            return mockBooks.filter(book => 
                book.genre.toLowerCase() === genre.toLowerCase()
            );
        });
    });

    // Test Case 1: Example from the requirement (Fiction, 10% discount)
    it('should calculate the correct discounted price for a genre based on the example', () => {
        const genre = 'Fiction';
        const discount = 10; // 10%
        
        // Total Original Price for Fiction: 50.00 + 75.00 = 125.00 [cite: 52]
        // Total Discounted Price: 125.00 - (10% of 125.00) = 112.50 [cite: 53]
        const expectedResult = {
            genre: 'Fiction',
            discount_percentage: 10,
            total_discounted_price: 112.50,
        };

        const result = bookService.calculateDiscountedPriceForGenre(genre, discount);

        expect(result).toEqual(expectedResult);
        expect(mockBookRepository.findByGenre).toHaveBeenCalledWith(genre);
    });

    // Test Case 2: Zero discount (should return original price)
    it('should return the total original price when the discount is 0%', () => {
        const genre = 'Science Fiction';
        const discount = 0;
        
        // Total Original Price for Science Fiction: 40.00
        const expectedPrice = 40.00;

        const result = bookService.calculateDiscountedPriceForGenre(genre, discount);

        expect(result).toBeDefined();
        expect(result!.total_discounted_price).toBe(expectedPrice);
    });

    // Test Case 3: 100% discount (should return 0)
    it('should return a price of 0 when the discount is 100%', () => {
        const genre = 'Non-Fiction';
        const discount = 100;
        
        const expectedPrice = 0;

        const result = bookService.calculateDiscountedPriceForGenre(genre, discount);

        expect(result).toBeDefined();
        expect(result!.total_discounted_price).toBe(expectedPrice);
    });

    // Test Case 4: No books found for a genre
    it('should return null if no books are found for the specified genre', () => {
        const genre = 'Mystery';
        const discount = 15;
        
        // Mock the repository's response for a genre with no books
        mockBookRepository.findByGenre.mockReturnValueOnce([]); 

        const result = bookService.calculateDiscountedPriceForGenre(genre, discount);

        expect(result).toBeNull();
    });
});

// CRUD Operations Tests
describe('BookService - CRUD Operations', () => {
    let bookService: BookService;
    let mockBookRepository: jest.Mocked<BookRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        bookService = new BookService();
        mockBookRepository = (BookRepository as jest.Mock).mock.instances[0] as jest.Mocked<BookRepository>;
    });

    describe('createBook', () => {
        it('should create a new book and return it with an ID', () => {
            const newBookData: CreateBookDTO = {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                genre: "Fantasy",
                price: 45.00
            };

            const expectedBook: Book = {
                id: 5,
                ...newBookData
            };

            mockBookRepository.create.mockReturnValue(expectedBook);

            const result = bookService.createBook(newBookData);

            expect(result).toEqual(expectedBook);
            expect(mockBookRepository.create).toHaveBeenCalledWith(newBookData);
            expect(mockBookRepository.create).toHaveBeenCalledTimes(1);
        });

        it('should handle creating multiple books with unique IDs', () => {
            const book1: CreateBookDTO = { title: "Book 1", author: "Author 1", genre: "Genre 1", price: 10 };
            const book2: CreateBookDTO = { title: "Book 2", author: "Author 2", genre: "Genre 2", price: 20 };

            mockBookRepository.create
                .mockReturnValueOnce({ id: 1, ...book1 })
                .mockReturnValueOnce({ id: 2, ...book2 });

            const result1 = bookService.createBook(book1);
            const result2 = bookService.createBook(book2);

            expect(result1.id).toBe(1);
            expect(result2.id).toBe(2);
            expect(mockBookRepository.create).toHaveBeenCalledTimes(2);
        });
    });

    describe('getAllBooks', () => {
        const mockBooksData: Book[] = [
            { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 50.00 },
            { id: 2, title: "1984", author: "George Orwell", genre: "Fiction", price: 75.00 },
            { id: 3, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", price: 40.00 },
        ];

        it('should return all books when no filters are provided', () => {
            mockBookRepository.findAll.mockReturnValue(mockBooksData);

            const result = bookService.getAllBooks();

            expect(result).toEqual(mockBooksData);
            expect(mockBookRepository.findAll).toHaveBeenCalledWith(undefined);
            expect(result.length).toBe(3);
        });

        it('should return filtered books by genre', () => {
            const filteredBooks = mockBooksData.filter(b => b.genre === 'Fiction');
            mockBookRepository.findAll.mockReturnValue(filteredBooks);

            const result = bookService.getAllBooks({ genre: 'Fiction' });

            expect(result).toEqual(filteredBooks);
            expect(result.length).toBe(2);
            expect(mockBookRepository.findAll).toHaveBeenCalledWith({ genre: 'Fiction' });
        });

        it('should return filtered books by author', () => {
            const filteredBooks = [mockBooksData[0]];
            mockBookRepository.findAll.mockReturnValue(filteredBooks);

            const result = bookService.getAllBooks({ author: 'Harper Lee' });

            expect(result).toEqual(filteredBooks);
            expect(result.length).toBe(1);
            expect(result[0].author).toBe('Harper Lee');
        });

        it('should return filtered books by price range', () => {
            const filteredBooks = mockBooksData.filter(b => b.price >= 40 && b.price <= 50);
            mockBookRepository.findAll.mockReturnValue(filteredBooks);

            const result = bookService.getAllBooks({ minPrice: 40, maxPrice: 50 });

            expect(result).toEqual(filteredBooks);
            expect(result.length).toBe(2);
        });

        it('should return filtered books with multiple filters', () => {
            const filteredBooks = [mockBooksData[0]];
            mockBookRepository.findAll.mockReturnValue(filteredBooks);

            const result = bookService.getAllBooks({ 
                genre: 'Fiction', 
                maxPrice: 60 
            });

            expect(result).toEqual(filteredBooks);
            expect(mockBookRepository.findAll).toHaveBeenCalledWith({ 
                genre: 'Fiction', 
                maxPrice: 60 
            });
        });

        it('should return empty array when no books match filters', () => {
            mockBookRepository.findAll.mockReturnValue([]);

            const result = bookService.getAllBooks({ genre: 'Mystery' });

            expect(result).toEqual([]);
            expect(result.length).toBe(0);
        });
    });

    describe('getBookById', () => {
        it('should return a book when a valid ID is provided', () => {
            const expectedBook: Book = {
                id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: "Fiction",
                price: 50.00
            };

            mockBookRepository.findById.mockReturnValue(expectedBook);

            const result = bookService.getBookById(1);

            expect(result).toEqual(expectedBook);
            expect(mockBookRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return undefined when book is not found', () => {
            mockBookRepository.findById.mockReturnValue(undefined);

            const result = bookService.getBookById(999);

            expect(result).toBeUndefined();
            expect(mockBookRepository.findById).toHaveBeenCalledWith(999);
        });
    });

    describe('updateBook', () => {
        it('should update a book and return the updated book', () => {
            const updateData: Partial<CreateBookDTO> = {
                price: 55.00,
                title: "To Kill a Mockingbird - Special Edition"
            };

            const updatedBook: Book = {
                id: 1,
                title: "To Kill a Mockingbird - Special Edition",
                author: "Harper Lee",
                genre: "Fiction",
                price: 55.00
            };

            mockBookRepository.update.mockReturnValue(updatedBook);

            const result = bookService.updateBook(1, updateData);

            expect(result).toEqual(updatedBook);
            expect(mockBookRepository.update).toHaveBeenCalledWith(1, updateData);
        });

        it('should return undefined when updating a non-existent book', () => {
            mockBookRepository.update.mockReturnValue(undefined);

            const result = bookService.updateBook(999, { price: 100 });

            expect(result).toBeUndefined();
            expect(mockBookRepository.update).toHaveBeenCalledWith(999, { price: 100 });
        });

        it('should handle partial updates', () => {
            const updatedBook: Book = {
                id: 2,
                title: "1984",
                author: "George Orwell",
                genre: "Fiction",
                price: 80.00
            };

            mockBookRepository.update.mockReturnValue(updatedBook);

            const result = bookService.updateBook(2, { price: 80.00 });

            expect(result).toEqual(updatedBook);
            expect(result?.price).toBe(80.00);
        });
    });

    describe('deleteBook', () => {
        it('should delete a book and return true when successful', () => {
            mockBookRepository.delete.mockReturnValue(true);

            const result = bookService.deleteBook(1);

            expect(result).toBe(true);
            expect(mockBookRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should return false when trying to delete a non-existent book', () => {
            mockBookRepository.delete.mockReturnValue(false);

            const result = bookService.deleteBook(999);

            expect(result).toBe(false);
            expect(mockBookRepository.delete).toHaveBeenCalledWith(999);
        });
    });
});