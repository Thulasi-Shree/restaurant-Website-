const catchAsyncError = require('../../middlewares/catchAsyncError');
const TimeSlot = require('../../model/timeSlot'); 

const addAvailablePickupTimeSlots = catchAsyncError(async (req, res) => {
  try {
    const { newTimeSlot } = req.body;
    if (!newTimeSlot || typeof newTimeSlot !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid time slot format' });
    }

    const timeSlot = new TimeSlot({ slot: newTimeSlot });
    await timeSlot.save();

    res.status(200).json({ success: true, message: 'New pickup time slot added successfully', timeSlot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const getAllTimeSlots = catchAsyncError(async (req, res) => {
    try {
      const timeSlots = await TimeSlot.find();
      res.status(200).json({ success: true, timeSlots });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Update a time slot by ID
  const updateTimeSlotById = catchAsyncError(async (req, res) => {
    try {
      const { id } = req.params;
      const { updatedTimeSlot } = req.body;
  
      if (!updatedTimeSlot || typeof updatedTimeSlot !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid time slot format' });
      }
  
      const timeSlot = await TimeSlot.findByIdAndUpdate(id, { slot: updatedTimeSlot }, { new: true });
  
      if (!timeSlot) {
        return res.status(404).json({ success: false, error: 'Time slot not found' });
      }
  
      res.status(200).json({ success: true, message: 'Time slot updated successfully', timeSlot });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Delete a time slot by ID
  const deleteTimeSlotById = catchAsyncError(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTimeSlot = await TimeSlot.findByIdAndDelete(id);
  
      if (!deletedTimeSlot) {
        return res.status(404).json({ success: false, error: 'Time slot not found' });
      }
  
      res.status(200).json({ success: true, message: 'Time slot deleted successfully', timeSlot: deletedTimeSlot });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = {addAvailablePickupTimeSlots, deleteTimeSlotById, updateTimeSlotById, getAllTimeSlots}