import cron from 'node-cron';
import user from '../models/user';

async function cleanUnverifiedAccounts() {
    console.log('Running cron job to remove unverified accounts...');
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await user.deleteMany({
            isActive: false,
            createdAt: { $lt: sevenDaysAgo },
        });
        console.log(`Deleted ${result.deletedCount} unverified accounts.`);
    } catch (error) {
        console.error('Error during unverified account cleanup:', error);
    }
}

export function initCronJobs() {
    console.log('Initializing cron jobs...');

    // Job theo giờ mặc định (server)
    cron.schedule('0 0 * * *', cleanUnverifiedAccounts);

    // Job theo giờ UTC
    cron.schedule('0 0 * * *', cleanUnverifiedAccounts, {
        scheduled: true,
        timezone: 'UTC',
    });

    // Job theo giờ Việt Nam
    cron.schedule('0 0 * * *', cleanUnverifiedAccounts, {
        scheduled: true,
        timezone: 'Asia/Ho_Chi_Minh',
    });

    console.log('Cron jobs initialized!');
}
