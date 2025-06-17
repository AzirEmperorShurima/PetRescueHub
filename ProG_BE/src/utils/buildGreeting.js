export const buildGreeting = (user) => {
    const isFirstLogin = !user.lastLoginAt;
    const hour = new Date().getHours();

    if (isFirstLogin) {
        return {
            greetingTitle: 'Chào mừng bạn đến với PetRescueHub! 🎉',
            greetingMessage: `Chào mừng ${user.username} đã tham gia cộng đồng của chúng tôi.`,
            priority: 'high',
            metadata: {
                isFirstLogin: true,
                userJoinedAt: new Date()
            }
        };
    }

    const timeOfDay =
        hour >= 5 && hour < 12 ? 'morning' :
            hour >= 12 && hour < 18 ? 'afternoon' : 'evening';

    const messages = {
        morning: ['Chào buổi sáng! ☀️', `Chào buổi sáng ${user.username}! Chúc bạn một ngày tốt lành.`],
        afternoon: ['Chào buổi chiều! 🌤️', `Chào buổi chiều ${user.username}! Hy vọng bạn đang có một ngày tuyệt vời.`],
        evening: ['Chào buổi tối! 🌙', `Chào buổi tối ${user.username}! Cảm ơn bạn đã quay trở lại.`]
    };

    const [title, message] = messages[timeOfDay];

    return {
        greetingTitle: title,
        greetingMessage: message,
        priority: 'low',
        metadata: {
            loginTime: new Date(),
            timeOfDay
        }
    };
}
