const Vendor = require('../models/vendor');
const { uploadDocument }  = require("../services/multerService");
const uploadToCloudinary = require("../services/cloudinaryService");
const { v4: uuidv4 } = require("uuid");

// creating a new vendor
exports.createVendor = async (req, res) => {

    // invoking multer middleware
    uploadDocument(req, res, async(err) => {
        if(err){
            console.error("Error in file uploading", error);
            return res.status(400).json({
                success: false,
                error: "File upload failed!"
            });
        }
        try{
            const { user_id, store_name, business_email, business_phone, store_description, store_address} = req.body;

            // generate vendor_id
            const vendor_id = uuidv4();

            // file upload
            let documentUrl = null;
            if(req.file) {
                const uploadedDoc = await uploadToCloudinary(req.file.buffer, "vendors/documents");
                documentUrl = uploadedDoc.secure_url;
            }
            if(documentUrl){
                console.log("Document url is ", documentUrl);
            }else{
                console.error("document is not uploaded");
            }

            // saving vendor in database
            const newVendor = await Vendor.create({
                vendor_id,
                user_id,
                store_name,
                business_email,
                business_phone,
                store_description,
                store_address,
                status: "pending",
                date: new Date(),
                document: documentUrl,
                certificate: null
            });

            res.status(201).json({
                success: true,
                message: "Store is registered successfully!"
            });
        }catch(error){
            console.error("Error in registering a store", error);
            res.status(500).json({
                error: "Registration of store failed"
            });
        }
    })
};

// get all vendors
exports.getAllVendors = async (req, res) => {
    try{
        const vendors = await Vendor.findAll();
        return res.status(200).json({
            success: true,
            vendors
        });
    }catch(error){
        console.log("Error in retriwving all Vendors: ", error.message);
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
    try{
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);

        if(!vendor){
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        return res.status(200).json({
            success: true,
            vendor
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a Vendor
exports.updateVendor = async (req, res) => {
    try{
        const { id } = req.params;
        const updatedData = req.body;

        const vendor = await Vendor.findByPk(id);
        if(!vendor){
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        await vendor.update(updatedData);
        return res.status(200).json({
            success: true,
            message: 'Vendor updated successfully'
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// delete a Vendor
exports.deleteVendor = async (req, res) => {
    try{
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);
        if(!vendor){
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        await vendor.destroy();
        return res.status(200).json({
            success: true,
            message: 'Vendor deleted successfully'
        });
    }catch(error){
        console.error('Error in deleting a vendor', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed in deleting a Vendor'
        });
    }
}
// update the store status
// exports.updateStoreStatus = async (req, res) => {
//     try{
//         const { vendor_id, status } = req.body;

//         const validStatuses = ["pending", "approved", "rejected"];
//         if(!validStat)
//     }catch(error){
        
//     }
// }; 