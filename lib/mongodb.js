import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Databse URI enviorment variable not defined");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabse() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.conn) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });

        cached.conn = await cached.promise;
        return cached.conn;
    }
}

export default connectToDatabse;