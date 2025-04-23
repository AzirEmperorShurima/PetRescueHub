export const questionDetailMock = {
  id: 1,
  title: 'Làm thế nào để huấn luyện mèo đi vệ sinh đúng chỗ?',
  content: 'Mèo nhà mình mới 3 tháng tuổi, làm thế nào để huấn luyện bé đi vệ sinh đúng chỗ?\n\nMình đã thử đặt khay cát ở nhiều vị trí khác nhau nhưng bé vẫn không sử dụng. Mong mọi người chia sẻ kinh nghiệm.',
  author: 'Trần Thị B',
  authorAvatar: 'https://i.pravatar.cc/150?img=5',
  authorId: 'user2',
  date: '2023-11-09T14:20:00',
  tags: ['mèo', 'huấn luyện', 'vệ sinh'],
  solved: false
};

export const answersMock = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Bạn nên đặt khay cát ở nơi yên tĩnh, tránh xa khu vực ăn uống của mèo. Mỗi khi thấy mèo có dấu hiệu muốn đi vệ sinh (như đào đào, quay quay), hãy nhẹ nhàng đặt bé vào khay cát.',
    createdAt: '2023-11-10T08:30:00',
    likes: 5,
    isLiked: false,
    isAccepted: false
  },
  {
    id: 2,
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Mình đã từng gặp vấn đề tương tự. Bạn có thể thử các loại cát khác nhau, vì có thể mèo không thích loại cát hiện tại. Ngoài ra, hãy đảm bảo khay cát luôn sạch sẽ, vì mèo rất sạch sẽ và sẽ không sử dụng khay bẩn.',
    createdAt: '2023-11-10T10:15:00',
    likes: 8,
    isLiked: true,
    isAccepted: true
  }
];

export default {
  questionDetailMock,
  answersMock
};