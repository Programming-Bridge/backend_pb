const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (err) {
    // Ignore DNS override errors in restricted environments
}

let cachedConn = null;
let cachedPromise = null;

const dbConnection = async () => {
    if (cachedConn && mongoose.connection.readyState === 1) {
        return cachedConn;
    }

    if (!cachedPromise) {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI is missing in environment variables!');
            throw new Error('MONGO_URI is missing in environment variables');
        }

        const opts = {
            serverSelectionTimeoutMS: 8000,
        };

        cachedPromise = mongoose.connect(uri, opts).then((mongooseInstance) => {
            console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
            return mongooseInstance;
        }).catch((err) => {
            console.error('❌ MongoDB Connection Error:', err.message);
            cachedPromise = null;
            throw err;
        });
    }

    try {
        cachedConn = await cachedPromise;
    } catch (e) {
        cachedPromise = null;
        throw e;
    }

    return cachedConn;
};

module.exports = dbConnection;
