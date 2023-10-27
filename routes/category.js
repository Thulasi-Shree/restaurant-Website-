const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category/category');

router.post('/category/new', categoryController.createCategory);
router.get('/categorys', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategoryById);
router.put('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory); 

module.exports = router;
