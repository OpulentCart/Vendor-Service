const Vendor = require('../models/vendor');
const { uploadDocument }  = require("../services/multerService");
const uploadToCloudinary = require("../services/cloudinaryService");
const { where } = require('sequelize');
const { generateVendorCertificate } = require('../utils/certificateUtils');
const { sendEmail } = require('../services/mailService');

// creating a new vendor
exports.createVendor = async (req, res) => {
    try{
        //const user_id = req.user.id;
        //console.log("User_id", user_id);
        const { user_id, store_name, category_id, business_email, business_phone, store_description, street_address, city, state, country, pincode } = req.body;
        console.log(req.body);
        // upload file to cloudinary
        let documentUrl = null;
        if(req.file){
            const uploadedDoc = await uploadToCloudinary(req.file.buffer, "vendors/documents");
            documentUrl = uploadedDoc.secure_url;
        }
        if(documentUrl){
            console.log("Document URL: ", documentUrl);
        }else{
            console.error("Document upload failed");
        }

        const newVendor = await Vendor.create({
            user_id,
            store_name,
            category_id,
            business_email,
            business_phone,
            store_description,
            street_address,
            city,
            state,
            country,
            pincode,
            date: new Date(),
            business_document: documentUrl,
            certificate: null,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: "Vendor is created successfully",
            newVendor
        });
    }catch(error){
        console.error("Error in registering store: ", error);
        res.status(500).json({
            success: false,
            message: "Vendor registration failed"
        });
    }
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
        const user_id = req.user.id;
        const vendor = await Vendor.findAll({
            where: {
                user_id: user_id
            }
        });

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
exports.updateStoreStatus = async (req, res) => {
    try{
        const { vendor_id, status } = req.body;

        const vendorRows = await Vendor.update(
            { status: status },
            { where: { vendor_id: vendor_id } }
        );

        if(status === 'approved'){
            const vendor = await Vendor.findOne({ where: { vendor_id: vendor_id } });
            console.log("Vendorrrr", vendor);
            const certificate = await generateVendorCertificate(vendor);
            const certificateUrl = await uploadToCloudinary(certificate);
            console.log("Generated Certificate:", certificate);
            console.log("Uploaded Certificate URL:", certificateUrl.secure_url);
            await Vendor.update(
                { certificate: certificateUrl?.secure_url },
                { where: {vendor_id: vendor_id }}
            );
            await sendEmail({to: vendor?.business_email, file: certificateUrl.secure_url });
        }
        return res.status(200).json({
            success: true,
            message: "Vendor's Status updated successfully"
        })
    }catch(error){
        console.error("Error in changing the vendor's atatus", error);
        return res.status(500).json({
            success: false,
            message: "Internal Servier error"
        }); 
    }
}; 