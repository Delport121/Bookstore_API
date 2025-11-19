// src/services/book.service.test.ts

import { BookService } from './book.service';
import { BookRepository } from '../repositories/book.repository'; // Import the repository to mock/inspect data

// Mocking the BookRepository to control the data for testing
jest.mock('../repositories/book.repository');

describe('BookService - Discount Calculation', () => {
    let bookService: BookService;
    let mockBookRepository: jest.Mocked<BookRepository>;

    // Define the sample data based on the requirement example
    const mockBooks = [
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