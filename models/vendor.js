const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Vendor = sequelize.define('Vendor', {
    vendor_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'auth_app_customuser', // Refers to the Auth Service table
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    store_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category', // Refers to the categories table in Product Service
            key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    store_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    business_phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'address',
            key: 'address_id'
        },
        onDelete: 'CASCADE'
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    business_document: {
        type: DataTypes.STRING, // URL or file path
        allowNull: true
    },
    certificate: {
        type: DataTypes.STRING, // URL or file path
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    tableName: "vendors",
    timestamps: true
});

sequelize.sync({ alter: true})
    .then(() => {
        console.log("Vendors table created")
    })
    .catch(err => console.error("❌ Error creating Vendor table:", err));

Vendor.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });


module.exports = Vendor;
