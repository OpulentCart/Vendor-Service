const Vendor = require('../models/vendor');
const { uploadDocument }  = require("../middleware/multerUpload");
const uploadToCloudinary = require("../middleware/cloudinaryUpload");
const { v4: uuidv4 } = require("uuid");

// creating a new vendor
exports.createVendor = async (req, res) => {
    try{
        const { user_id, store_name, business_email, business_phone, store_description}
    }catch(error){
        //console.error("")
    }
};