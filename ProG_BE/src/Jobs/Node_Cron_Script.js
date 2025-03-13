import cron from 'node-cron';
import user from '../models/user';


// Lên lịch công việc chạy hàng ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job to remove unverified accounts...');
    try {

        const SevenDayAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await user.deleteMany({
            isActive: false,
            createdAt: { $lt: SevenDayAgo },
        });

        console.log(`Deleted ${result.deletedCount} unverified accounts.`);
    } catch (error) {
        console.error('Error during unverified account cleanup:', error);
    }
});
export function initCronJobs() {
    console.log('Initializing cron jobs...');

    // Lên lịch công việc chạy hàng ngày lúc 00:00
    cron.schedule('0 0 * * *', async () => {
        console.log('Running cron job to remove unverified accounts...');
        try {
            const SevenDayAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const result = await user.deleteMany({
                isActive: false,
                createdAt: { $lt: SevenDayAgo },
            });

            console.log(`Deleted ${result.deletedCount} unverified accounts.`);
        } catch (error) {
            console.error('Error during unverified account cleanup:', error);
        }
    });

    console.log('Cron jobs initialized!');
}

export function initCronJobs1() {
    console.log('Initializing cron jobs...');

    // Cron job theo giờ UTC
    cron.schedule('0 0 * * *', async () => {
        console.log('Running cron job (UTC) to remove unverified accounts...');
        try {
            const SevenDayAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const result = await user.deleteMany({
                isActive: false,
                createdAt: { $lt: SevenDayAgo },
            });

            console.log(`[UTC] Deleted ${result.deletedCount} unverified accounts.`);
        } catch (error) {
            console.error('[UTC] Error during unverified account cleanup:', error);
        }
    }, {
        scheduled: true,
        timezone: 'UTC', // Thiết lập múi giờ là UTC
    });

    // Cron job theo giờ Việt Nam
    cron.schedule('0 0 * * *', async () => {
        console.log('Running cron job (Vietnam time) to remove unverified accounts...');
        try {
            const SevenDayAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const result = await user.deleteMany({
                isActive: false,
                createdAt: { $lt: SevenDayAgo },
            });

            console.log(`[Vietnam] Deleted ${result.deletedCount} unverified accounts.`);
        } catch (error) {
            console.error('[Vietnam] Error during unverified account cleanup:', error);
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Ho_Chi_Minh', // Thiết lập múi giờ là Việt Nam
    });

    console.log('Cron jobs initialized!');
}