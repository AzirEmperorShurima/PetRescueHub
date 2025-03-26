export const events = [
  {
    id: 1,
    title: 'Ngày hội nhận nuôi thú cưng',
    description: 'Sự kiện nhận nuôi thú cưng lớn nhất năm, với hơn 50 chú chó và mèo đang tìm kiếm gia đình mới.',
    location: 'Công viên Lê Văn Tám, Quận 1, TP.HCM',
    date: new Date(Date.now() + 7 * 86400000), // 7 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Pet Rescue Hub',
    status: 'upcoming',
    participants: 45,
    tags: ['nhận nuôi', 'chó', 'mèo', 'sự kiện']
  },
  {
    id: 2,
    title: 'Hội thảo chăm sóc thú cưng',
    description: 'Hội thảo chia sẻ kiến thức về cách chăm sóc thú cưng đúng cách, với sự tham gia của các bác sĩ thú y hàng đầu.',
    location: 'Trung tâm hội nghị XYZ, Quận 3, TP.HCM',
    date: new Date(Date.now() + 14 * 86400000), // 14 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Bác sĩ Thú y Việt Nam',
    status: 'upcoming',
    participants: 30,
    tags: ['hội thảo', 'chăm sóc', 'thú y']
  },
  {
    id: 3,
    title: 'Chương trình tiêm phòng miễn phí',
    description: 'Chương trình tiêm phòng miễn phí cho chó mèo, bao gồm vắc-xin dại và các bệnh truyền nhiễm phổ biến.',
    location: 'Phòng khám thú y ABC, Quận 7, TP.HCM',
    date: new Date(Date.now() - 14 * 86400000), // 14 ngày trước
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Phòng khám thú y ABC',
    status: 'completed',
    participants: 120,
    tags: ['tiêm phòng', 'miễn phí', 'sức khỏe']
  }
];

export default events;