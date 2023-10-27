const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin/index');


router.get('/admin/users', adminController.getAllUsers);
router.get('/admin/user/:id', adminController.getUser);
router.put('/admin/user/:id', adminController.updateUser);
router.delete('/admin/user/:id', adminController.deleteUser);

module.exports = router;
