import mongoose from 'mongoose';

async function clearDatabase() {
    const mongoURI = "mongodb://mongo:OstLDytMFfNSdkRPXkLBSkkSfUnLnLEC@caboose.proxy.rlwy.net:33837"
    try {
        await mongoose.connect(mongoURI, {
        });

        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            console.log(`Dropping collection: ${collection.collectionName}`);
            await collection.drop();
        }

        console.log('✅ Đã xóa toàn bộ collection trong database.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Lỗi khi xóa database:', error);
    }
}

clearDatabase();
