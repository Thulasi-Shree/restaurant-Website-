const express = require('express');
const createRestaurant = require('../controllers/restaurant/createRestaurant');
const  getRestaurant = require('../controllers/restaurant/getRestaurants') 
const  deleteRestaurant = require('../controllers/restaurant/deleteRestaurant')
const updateRestaurant = require('../controllers/restaurant/updateRestaurant')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

            
        

router.route('/restaurant/create/:id').post(isAuthenticatedUser,authorizeRoles('admin'), createRestaurant)
                      

router.route('/restaurant/delete/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteRestaurant)
router.route('/restaurant/get').get(isAuthenticatedUser, getRestaurant)
router.route('/restaurant/edit/:id').put(isAuthenticatedUser, updateRestaurant);
module.exports = router;