const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const VendorSalesDiscount = sequelize.define('VendorSalesDiscount', {
    sales_discount_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    vendor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'vendors',
            key: 'vendor_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'flat', 'buy_x_get_y'),
        allowNull: false
    },
    discount_value: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    buy_x: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    get_y: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'expired', 'upcoming'),
        defaultValue: 'upcoming'
    }
}, {
    tableName: 'vendor_sales_discount',
    timestamps: true
});

module.exports = VendorSalesDiscount;
