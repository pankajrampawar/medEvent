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
        console.log("reusing existing connections")
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
        console.log("connected to db")
        return cached.conn;
    }
}

export default connectToDatabse;