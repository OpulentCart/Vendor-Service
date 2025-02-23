const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

// create vendor-store
router.post('/create_store', authenticateUser, authorizeRole('vendor'), uploadDocument, vendorController.createVendor);
// get all vendors
router.get('/', authenticateUser, authorizeRole('admin'), vendorController.getAllVendors);
// get vendor by id 
router.get('/:id', authenticateUser, authorizeRole('vendor'), vendorController.getVendorById);
// update vendor by id
router.put('/:id', authenticateUser, authorizeRole('admin'), vendorController.updateVendorStatus);
// delete vendor by id
router.delete('/:id', authenticateUser, authorizeRole('admin' || 'vendor'), vendorController.deleteVendor);

module.exports = router;