import { MongoClient } from 'mongodb';

export const getData_From_MongoDB = async (url, dbName, collectionName) => {
    const mongoClient = await MongoClient.connect(url);
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    const data_fetched = await collection.find({}).toArray();
    await mongoClient.close();
    return data_fetched;
}

export const collection_NumberOfUser = async (url, dbName, collectionName) => {
    const data = await getData_From_MongoDB(url, dbName, collectionName);
    return data.length;
}
