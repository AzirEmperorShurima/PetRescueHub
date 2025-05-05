export const sendingNotification = async ({ io, userId }, { type, title, message, createdAt }) => {
    await io.sendNotification(userId, {
        type,
        title,
        message,
        createdAt
    });
};
