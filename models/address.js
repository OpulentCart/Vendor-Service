const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Address = sequelize.define('Address', {
    address_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    street: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    city: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    state:{
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
    }
}, {
    tableName: "address",
    timestamps: true
});

sequelize.sync({ alter: true})
    .then(() => {
        console.log("Address table created")
    })
    .catch(err => console.error("❌ Error creating Address table:", err));

    Address.hasOne(Vendor, { foreignKey: 'address_id' });

module.exports = Address;