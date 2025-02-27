const amqp = require('amqplib');

const connectRabbitMQ = async () => {
    try{
        const connection = await amqp.connect(URL);
        const channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return { connection, channel };
    }catch(error){
        console.error("RabbitMQ Connection Error: ", error.message);
    }
};

module.exports = connectRabbitMQ;