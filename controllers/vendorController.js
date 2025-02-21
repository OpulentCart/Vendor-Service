const Vendor = require('../models/vendor');
const { uploadDocument }  = require("../middleware/multerUpload");
const uploadToCloudinary = require("../middleware/cloudinaryUpload");
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