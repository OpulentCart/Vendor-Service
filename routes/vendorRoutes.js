const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const uploadDocument = require('../services/multerService');

// create vendor-store
// working
router.post('/create_store', authenticateUser, uploadDocument, vendorController.createVendor);
// get all vendors
// working
router.get('/', vendorController.getAllVendors);
// get vendor by id 
router.get('/:id', vendorController.getVendorById);
// update vendor by id
router.put('/:id', vendorController.updateStoreStatus);
// delete vendor by id
router.delete('/:id', authenticateUser, authorizeRole('admin' || 'vendor'), vendorController.deleteVendor);

module.exports = router;