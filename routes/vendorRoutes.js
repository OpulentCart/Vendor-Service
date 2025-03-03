const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const uploadDocument = require('../services/multerService');

// create vendor-store
// working
router.post('/create_store', authenticateUser, authorizeRole('vendor'), uploadDocument, vendorController.createVendor);
// get all vendors
// working
router.get('/', authenticateUser, authorizeRole('admin'), vendorController.getAllVendors);
// get vendor by id 
router.get('/stores/', authenticateUser, authorizeRole('vendor'), vendorController.getVendorStoresByVendorId);

// update vendor store status by id
router.put('/:id', authenticateUser, authorizeRole('admin'), vendorController.updateStoreStatus);
// delete vendor by id
router.delete('/:id', authenticateUser, authorizeRole('admin' || 'vendor'), vendorController.deleteVendor);

module.exports = router;