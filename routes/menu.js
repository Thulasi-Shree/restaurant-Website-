const express = require('express');
const newProduct = require('../controllers/menu/createMenu')
const getAdminProducts = require('../controllers/menu/getAdminMenus')
const updateProduct = require('../controllers/menu/updateMenu')
const getProducts = require('../controllers/menu/getMenus')
const  getSingleMenu = require('../controllers/menu/getSingleMenu');
const  deleteProduct = require('../controllers/menu/deleteMenu');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })


router.route('/products').get( getProducts);
router.route('/product/:id').get(getSingleMenu);
                      


//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser,  upload.array('images'), newProduct);
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'),upload.array('images'), updateProduct);

module.exports = router;