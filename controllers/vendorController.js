const Vendor = require('../models/vendor');

// creating a new vendor
exports.createVendor = async (req, res) => {
    try{
        //const vendor = await Vendor.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Vendor is registered successfully',
            data: vendor
        });
    }catch(error){
        //console.error("")
    }
};