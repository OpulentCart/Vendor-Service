const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

// create vendor-store
router.post('/vendors/create_store', authenticateUser, authorizeRole('vendor'), vendorController.createVendor);
// get all vendors
router.get('/vendors', authenticateUser, authorizeRole('admin'), vendorController.getAllVendors);
// get vendor by id 
router.get('/vendors/:id', authenticateUser, authorizeRole('admin'), vendorController.getVendorById);
// update vendor by id
router.put('/vendors/:id', authenticateUser, authorizeRole('admin'), vendorController.updateVendor);
// delete vendor by id
router.delete('/vendors/:id', authenticateUser, authorizeRole('admin' || 'vendor'), vendorController.deleteVendor);

module.exports = router;