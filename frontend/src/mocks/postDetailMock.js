export const postDetailMock = {
  id: 1,
  title: 'Kinh nghiệm chăm sóc chó con mới sinh',
  content: 'Chia sẻ một số kinh nghiệm khi chăm sóc chó con mới sinh...\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
  author: 'Nguyễn Văn A',
  authorAvatar: 'https://i.pravatar.cc/150?img=1',
  authorId: 'user1',
  date: '2023-11-10T08:30:00',
  tags: ['chó', 'chăm sóc', 'kinh nghiệm'],
  image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
};

export const postCommentsMock = [
  {
    id: 1,
    author: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Cảm ơn bạn đã chia sẻ kinh nghiệm hữu ích!',
    createdAt: '2023-11-10T10:15:00',
    userId: 'user2'
  },
  {
    id: 2,
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Tôi cũng đang nuôi chó con, bài viết rất bổ ích.',
    createdAt: '2023-11-11T14:20:00',
    userId: 'user3'
  }
];

export default {
  postDetailMock,
  postCommentsMock
};