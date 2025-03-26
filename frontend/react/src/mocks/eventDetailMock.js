export const eventDetailMock = {
  id: 1,
  title: 'Ngày hội nhận nuôi thú cưng lần thứ 5',
  date: '2023-11-15',
  startTime: '09:00',
  endTime: '17:00',
  location: 'Công viên Lê Văn Tám, Quận 1, TP.HCM',
  description: 'Gặp gỡ và nhận nuôi các thú cưng đáng yêu từ các trung tâm cứu hộ. Sự kiện này là cơ hội tuyệt vời để tìm kiếm người bạn đồng hành mới cho gia đình bạn. Ngoài ra, còn có các hoạt động tư vấn chăm sóc thú cưng, khám sức khỏe miễn phí và nhiều phần quà hấp dẫn.',
  organizer: 'Trung tâm Bảo trợ Động vật TP.HCM',
  contact: '0123456789',
  email: 'contact@example.com',
  image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  tags: ['nhận nuôi', 'chó', 'mèo']
};

export const eventCommentsMock = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Sự kiện rất ý nghĩa, tôi sẽ tham gia!',
    createdAt: '2023-11-10T08:30:00',
    userId: 'user1'
  },
  {
    id: 2,
    author: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Tôi đã tham gia sự kiện năm ngoái, rất tuyệt vời!',
    createdAt: '2023-11-09T14:20:00',
    userId: 'user2'
  }
];

export default {
  eventDetailMock,
  eventCommentsMock
};