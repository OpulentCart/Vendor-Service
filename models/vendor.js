const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Vendor = sequelize.define('Vendor', {
    vendor_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'category', // Refers to the categories table in Product Service
            key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    store_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    business_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    business_phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    business_document: {
        type: DataTypes.STRING, // URL or file path
        allowNull: false
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

module.exports = Vendor;
