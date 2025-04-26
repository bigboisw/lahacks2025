import mongoose from 'mongoose';
import 'dotenv/config'

export async function connectDB() {
    try {
        const uri = process.env.MONGO_URI
        if (!uri) throw new Error('MONGO_URI is not defined in .env');

        await mongoose.connect(uri, {});
        console.log('✅ Successfully connected to MongoDB with Mongoose');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1); // exit if cannot connect
    }
};