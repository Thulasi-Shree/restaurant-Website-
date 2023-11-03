const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category/category');

// Create a New Category: POST /api/category/new
router.post('/category/new', categoryController.createCategory);

// Get All Categories: GET /api/categorys
router.get('/categorys', categoryController.getAllCategories);

// Get Category by ID: GET /api/category/:id
router.get('/category/:id', categoryController.getCategoryById);

// Update Category by ID: PUT /api/category/:id
router.put('/category/:id', categoryController.updateCategory);

// Delete Category by ID: DELETE /api/category/:id
router.delete('/category/:id', categoryController.deleteCategory);


module.exports = router;
