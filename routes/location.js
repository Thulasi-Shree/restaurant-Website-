const express = require('express');
const locationController = require('../controllers/location/location');

const router = express.Router();

// Update Location by ID: PUT /api/locations/:id
router.put('/locations/:id', locationController.updateLocation);

// Delete Location by ID: DELETE /api/locations/:id
router.delete('/locations/:id', locationController.deleteLocation);

// Save User Location: POST /api/user-location
router.post('/user-location', locationController.saveUserLocation);

// Get Nearby Restaurants by Latitude and Longitude: GET /api/restaurants/:latitude/:longitude
router.get('/restaurants/:latitude/:longitude', locationController.getNearbyRestaurants);


module.exports = router;
