const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/dbConfig");
const { connectRabbitMQ } = require("./config/rabbitmqConfig");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

app.use("/vendors", require("./routes/vendorRoutes"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Product Service running on port ${PORT}`));
