const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Vendor = sequelize.define('Vendor', {
    vendor_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'auth_app_customuser',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    store_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    business_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        },
    },
    business_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isNumeric: true
        },
    },
    store_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    street_address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    city: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    state:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    country:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false
    },
    certificate: {
        type: DataTypes.STRING,
        allowNull: true
    }
},  {
        tableName: 'vendors',
        timestamps: true
    }
);

module.exports = Vendor;