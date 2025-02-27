const amqp = require('amqplib');
require('dotenv').config();

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('notifications', { durable: true });
        console.log('✅ Connected to RabbitMQ');
        return { connection, channel };
    } catch (error) {
        console.error('❌ RabbitMQ Connection Error:', error.message);
    }
};

module.exports = connectRabbitMQ;