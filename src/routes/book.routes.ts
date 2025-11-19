// src/routes/book.routes.ts

import { Router } from 'express';
import { 
    calculateDiscountedPrice, 
    createBook, 
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} from '../controllers/book.controller';

const router = Router();

// 1. SPECIFIC ROUTE FIRST:
// GET /books/discounted-price?genre={genre_name}&discount={discount_percentage}
router.get('/discounted-price', calculateDiscountedPrice);

// 2. GENERIC ROUTE LAST:
// All routes that use a dynamic ID must come AFTER the specific routes.
router.route('/:id')
    .get(getBookById)
    .put(updateBook)
    .delete(deleteBook);

// 3. CRUD CREATE/READ ALL
router.post('/', createBook);
router.get('/', getAllBooks);


export default router;