const Vendor = require('../models/vendor');
const { uploadDocument }  = require("../services/multerService");
const uploadToCloudinary = require("../services/cloudinaryService");
const { where } = require('sequelize');
const { generateVendorCertificate } = require('../utils/certificateUtils');
const { sendEmail } = require('../services/mailService');
const { getChannel } = require("../config/rabbitmqConfig");
const Address = require('../models/address');
const { sequelize } = require("../config/dbConfig");
const { Sequelize, QueryTypes } = require("sequelize");
// creating a new vendor
exports.createVendor = async (req, res) => {
    try{
        const user_id = req.user.user_id;
        //console.log("User_id", user_id);
        const { store_name, category_id, business_email, business_phone, store_description, street_address, city, state, country, pincode } = req.body;
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
        const address = await Address.create({
            street: street_address,
            city,
            state,
            country,
            pincode
        });

        const newVendor = await Vendor.create({
            user_id,
            store_name,
            category_id,
            business_email,
            business_phone,
            store_description,
            address_id: address.address_id,
            date: new Date(),
            business_document: documentUrl,
            certificate: null,
            status: 'pending'
        });
        
        // Send notifications to RabbitMQ
        const channel = getChannel();
        if (channel) {
            const notification = {
                user_id: 27,
                title: `New Vendor Store`,
                message: `A new vendor store '${store_name}' has been created and is pending for Approval.`,
            };

            channel.sendToQueue("notifications", Buffer.from(JSON.stringify(notification)), { persistent: true });
            console.log("📨 Sent notification to RabbitMQ:", notification);
        } else {
            console.error("❌ RabbitMQ channel not available");
        }

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
        const vendors = await Vendor.findAll({
            include: [{ model: Address, as: 'address', attributes: ['street', 'city', 'state', 'country', 'pincode'] }]
        });
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

// Get vendor-Stores by Vendor ID
exports.getVendorStoresByVendorId = async (req, res) => {
    try{
        const user_id = req.user.user_id;
        const vendor = await Vendor.findAll({
            where: {
                user_id: user_id
            },
            include: [{ model: Address, as: 'address', attributes: ['street', 'city', 'state', 'country', 'pincode']}]
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
        const user_id = req.user.user_id;
        const { status } = req.body;
        const { id } = req.params;
        const vendorRows = await Vendor.update(
            { status: status },
            { where: { vendor_id: id } }
        );

        if(status === 'approved'){
            const vendor = await Vendor.findOne({ where: { vendor_id: id } });
            console.log("Vendorrrr", vendor);
            const certificate = await generateVendorCertificate(vendor);
            const certificateUrl = await uploadToCloudinary(certificate);
            console.log("Generated Certificate:", certificate);
            console.log("Uploaded Certificate URL:", certificateUrl.secure_url);
            await Vendor.update(
                { certificate: certificateUrl?.secure_url },
                { where: {vendor_id: id }}
            );
            await sendEmail({to: vendor?.business_email, file: certificateUrl.secure_url });
        }
        const vendor = await Vendor.findByPk(id);  

        // Send notifications to RabbitMQ
        const channel = getChannel();
        if (channel) {
            const notification = {
                user_id: vendor.user_id,
                title: `Update: ${vendor.store_name}`,
                message: `Your Store '${vendor.store_name}' has been '${vendor.status}'.`,
            };

            channel.sendToQueue("notifications", Buffer.from(JSON.stringify(notification)), { persistent: true });
            console.log("📨 Sent notification to RabbitMQ:", notification);
        } else {
            console.error("❌ RabbitMQ channel not available");
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

// vendor Statistics board
exports.getVendorStats = async (req, res) => {
    try {
        const user_id = req.user.user_id; 

        // Fetch vendor statistics in one go
        const statsQuery = `
            SELECT 
                (SELECT COUNT(p.product_id) FROM product p JOIN vendors v ON p.vendor_id = v.vendor_id AND v.user_id = :user_id) AS totalProducts,
                (SELECT COUNT(p.product_id) FROM product p JOIN vendors v ON p.vendor_id = v.vendor_id AND v.user_id = :user_id AND p.status = 'approved') AS approvedProducts,
                (SELECT COUNT(p.product_id) FROM product p JOIN vendors v ON p.vendor_id = v.vendor_id AND v.user_id = :user_id AND p.status = 'pending') AS pendingProducts,
                (SELECT COUNT(v.vendor_id) FROM vendors v WHERE v.user_id = :user_id) AS totalStores,
                (SELECT COUNT(v.vendor_id) FROM vendors v WHERE v.user_id = :user_id AND v.status = 'approved') AS approvedStores,
                (SELECT COUNT(v.vendor_id) FROM vendors v WHERE v.user_id = :user_id AND v.status = 'pending') AS pendingStores
        `;

        const statsResult = await sequelize.query(statsQuery, {
            replacements: { user_id },
            type: QueryTypes.SELECT,
        });

        //const stats = statsResult[0];
        console.log(statsResult);
        const stats = statsResult[0]; 
        return res.status(200).json({
            success: true,
                totalProducts: stats.totalproducts,
                approvedProducts: stats.approvedproducts,
                pendingProducts: stats.pendingproducts,
                totalStores: stats.totalstores,
                approvedStores: stats.approvedstores,
                pendingStores: stats.pendingstores,
            
        });
    } catch (error) {
        console.error("Error fetching vendor stats:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSalesDashboard = async (req, res) => {
    try {
        const userId = req.user.user_id; 

        // Query 1: Monthly Profit
        const monthlyProfit = await sequelize.query(
            `SELECT 
                TO_CHAR(o.order_date, 'Month') AS month,
                EXTRACT(MONTH FROM o.order_date) AS month_num,
                SUM(oi.subtotal) AS profit
            FROM order_items oi
            JOIN "order" o ON oi.order_id = o.order_id
            JOIN product p ON oi.product_id = p.product_id
            JOIN vendors v ON p.vendor_id = v.vendor_id
            WHERE v.user_id = :userId
            GROUP BY month, month_num
            ORDER BY month_num;`,
            { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
        );

        // Query 2: Quantity by Category
        const quantityByCategory = await sequelize.query(
            `SELECT 
                c.name,
                SUM(oi.quantity) AS total_quantity
            FROM order_items oi
            JOIN product p ON oi.product_id = p.product_id
            JOIN sub_category sc ON p.sub_category_id = sc.sub_category_id
            JOIN category c ON sc.category_id = c.category_id
            JOIN "order" o ON oi.order_id = o.order_id
            JOIN vendors v ON p.vendor_id = v.vendor_id
            WHERE v.user_id = :userId
            GROUP BY c.name;`,
            { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
        );

        // Query 3: Top 5 Profitable Subcategories
        const topProfitableSubCategories = await sequelize.query(
            `SELECT 
                sc.name,
                SUM(oi.subtotal) AS sum_of_profit
            FROM order_items oi
            JOIN product p ON oi.product_id = p.product_id
            JOIN sub_category sc ON p.sub_category_id = sc.sub_category_id
            JOIN "order" o ON oi.order_id = o.order_id
            JOIN vendors v ON p.vendor_id = v.vendor_id
            WHERE v.user_id = :userId
            GROUP BY sc.name
            ORDER BY sum_of_profit DESC
            LIMIT 5;`,
            { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
        );

        // Query 4: Top 4 Customers by Amount Spent
        const topCustomers = await sequelize.query(
            `SELECT 
                c.name,
                SUM(oi.subtotal) AS sum_of_amount
            FROM order_items oi
            JOIN "order" o ON oi.order_id = o.order_id
            JOIN auth_app_customuser c ON o.user_id = c.id
            JOIN product p ON oi.product_id = p.product_id
            JOIN vendors v ON p.vendor_id = v.vendor_id
            WHERE v.user_id = :userId
            GROUP BY c.name
            ORDER BY sum_of_amount DESC
            LIMIT 4;`,
            { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
        );

        // Query 5: Vendor Sales Overview
        const vendorSalesOverview = await sequelize.query(
            `SELECT 
                p.vendor_id, 
                v.store_name,
                SUM(oi.subtotal) AS total_sales,
                SUM(oi.quantity) AS total_quantity,
                COUNT(DISTINCT o.order_id) AS total_orders
            FROM order_items oi
            JOIN product p ON oi.product_id = p.product_id
            JOIN "order" o ON oi.order_id = o.order_id
            JOIN vendors v ON p.vendor_id = v.vendor_id
            WHERE v.user_id = :userId
            GROUP BY p.vendor_id, v.store_name;`,
            { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
        );

        // Constructing Response
        return res.status(200).json({
            success: "true",
            monthlyProfit,
            quantityByCategory,
            topProfitableSubCategories,
            topCustomers,
            vendorSalesOverview
        });

    } catch (error) {
        console.error('Error fetching sales dashboard:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};