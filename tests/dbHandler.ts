import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function initializeDatabase() {
    const mongod = await MongoMemoryServer.create();

    const connect = async () => {
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    }

    const closeDatabase = async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    }

    const clearDatabase = async () => {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }

    return { connect, closeDatabase, clearDatabase };
}
