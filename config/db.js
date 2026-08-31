const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (err) {
    // Ignore DNS override errors in restricted environments
}

let isConnected = false;


const dbConnection = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = dbConnection;

