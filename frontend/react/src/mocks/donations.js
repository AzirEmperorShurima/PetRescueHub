export const donations = [
  {
    id: 1,
    donor: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    amount: 1000000,
    campaign: 'Cứu trợ động vật sau bão lụt',
    message: 'Mong các bé sớm bình phục và tìm được gia đình mới.',
    status: 'completed',
    date: new Date(Date.now() - 2 * 86400000)
  },
  {
    id: 2,
    donor: 'Trần Thị B',
    email: 'tranthib@example.com',
    amount: 500000,
    campaign: 'Xây dựng trung tâm cứu hộ',
    message: 'Ủng hộ cho công tác cứu hộ động vật.',
    status: 'completed',
    date: new Date(Date.now() - 5 * 86400000)
  },
  {
    id: 3,
    donor: 'Lê Văn C',
    email: 'levanc@example.com',
    amount: 2000000,
    campaign: 'Phẫu thuật cho thú cưng bị bỏ rơi',
    message: 'Mong các bác sĩ cứu được nhiều thú cưng hơn nữa.',
    status: 'completed',
    date: new Date(Date.now() - 10 * 86400000)
  }
];

export default donations;