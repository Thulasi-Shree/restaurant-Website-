const express = require('express');
const Location = require('../../model/Location'); 
const catchAsyncError = require('../../middlewares/catchAsyncError');
const successHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const router = express.Router();

// Create a new location
router.post('/locations', catchAsyncError(async (req, res) => {
    const location = await Location.create(req.body);
    successHandler(res, 201, location);
}));

// Get all locations
router.get('/locations', catchAsyncError(async (req, res) => {
    const locations = await Location.find();
    successHandler(res, 200, locations);
}));

// Get a specific location by ID
router.get('/locations/:id', catchAsyncError(async (req, res) => {
    const location = await Location.findById(req.params.id);
    if (!location) {
        return ErrorHandler(res, 404, { message: 'Location not found' });
    }
    successHandler(res, 200, location);
}));

// Update a location by ID
router.put('/locations/:id', catchAsyncError(async (req, res) => {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!location) {
        return ErrorHandler(res, 404, { message: 'Location not found' });
    }
    successHandler(res, 200, location);
}));

// Delete a location by ID
router.delete('/locations/:id', catchAsyncError(async (req, res) => {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
        return ErrorHandler(res, 404, { message: 'Location not found' });
    }
    successHandler(res, 200, { message: 'Location deleted successfully' });
}));

module.exports = router;
