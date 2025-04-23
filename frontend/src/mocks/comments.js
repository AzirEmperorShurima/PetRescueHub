export const comments = [
  {
    id: 1,
    content: 'Cảm ơn bạn đã chia sẻ thông tin hữu ích!',
    author: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date(Date.now() - 2 * 3600000),
    userId: 1,
    postId: 1
  },
  {
    id: 2,
    content: 'Tôi đã áp dụng phương pháp này và thấy hiệu quả ngay.',
    author: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date(Date.now() - 5 * 3600000),
    userId: 2,
    postId: 1
  },
  {
    id: 3,
    content: 'Có ai biết địa chỉ phòng khám thú y tốt ở quận 7 không?',
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date(Date.now() - 1 * 86400000),
    userId: 3,
    postId: 2
  }
];

export default comments;