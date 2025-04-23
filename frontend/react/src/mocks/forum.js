export const forumPosts = [
  {
    id: 1,
    title: 'Kinh nghiệm chăm sóc chó Golden Retriever',
    content: 'Chia sẻ kinh nghiệm chăm sóc chó Golden Retriever từ khi còn nhỏ...',
    author: 'Nguyễn Văn A',
    authorId: 1,
    authorAvatar: 'https://i.pravatar.cc/300?img=1',
    category: 'dog',
    tags: ['golden retriever', 'chăm sóc', 'kinh nghiệm'],
    createdAt: '2023-10-15T08:30:00',
    updatedAt: '2023-10-15T08:30:00',
    likes: 24,
    comments: 8,
    views: 156,
    isFavorited: false,
    isLiked: true,
    image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 2,
    title: 'Cách huấn luyện mèo đi vệ sinh đúng chỗ',
    content: 'Hướng dẫn chi tiết cách huấn luyện mèo đi vệ sinh đúng chỗ từ khi còn nhỏ...',
    author: 'Trần Thị B',
    authorId: 2,
    authorAvatar: 'https://i.pravatar.cc/300?img=5',
    category: 'cat',
    tags: ['mèo', 'huấn luyện', 'vệ sinh'],
    createdAt: '2023-10-14T10:15:00',
    updatedAt: '2023-10-14T10:15:00',
    likes: 18,
    comments: 12,
    views: 203,
    isFavorited: true,
    isLiked: false,
    image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 3,
    title: 'Chia sẻ kinh nghiệm cứu hộ chó mèo bị bỏ rơi',
    content: 'Những kinh nghiệm quý báu khi cứu hộ chó mèo bị bỏ rơi trên đường...',
    author: 'Admin',
    authorId: 3,
    authorAvatar: 'https://i.pravatar.cc/300?img=8',
    category: 'rescue',
    tags: ['cứu hộ', 'bỏ rơi', 'kinh nghiệm'],
    createdAt: '2023-10-13T14:45:00',
    updatedAt: '2023-10-13T14:45:00',
    likes: 35,
    comments: 15,
    views: 278,
    isFavorited: false,
    isLiked: false,
    image: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 4,
    title: 'Những điều cần biết khi nuôi chó Corgi',
    content: 'Chia sẻ kinh nghiệm và những lưu ý quan trọng khi nuôi chó Corgi...',
    author: 'Phạm Thị D',
    authorId: 4,
    authorAvatar: 'https://i.pravatar.cc/300?img=9',
    category: 'dog',
    tags: ['corgi', 'chăm sóc', 'kinh nghiệm'],
    createdAt: '2023-10-12T09:30:00',
    updatedAt: '2023-10-12T09:30:00',
    likes: 19,
    comments: 7,
    views: 142,
    isFavorited: false,
    isLiked: true,
    image: 'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 5,
    title: 'Kinh nghiệm chụp ảnh thú cưng đẹp',
    content: 'Chia sẻ các kỹ thuật và bí quyết để chụp được những bức ảnh thú cưng đẹp...',
    author: 'Hoàng Văn E',
    authorId: 5,
    authorAvatar: 'https://i.pravatar.cc/300?img=12',
    category: 'photography',
    tags: ['nhiếp ảnh', 'thú cưng', 'kỹ thuật'],
    createdAt: '2023-10-11T15:45:00',
    updatedAt: '2023-10-11T15:45:00',
    likes: 27,
    comments: 10,
    views: 198,
    isFavorited: true,
    isLiked: false,
    image: 'https://images.pexels.com/photos/1183434/pexels-photo-1183434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Keep the existing forumQuestions and forumEvents exports

export const forumQuestions = [
  // Your existing forumQuestions data
];

export const forumEvents = [
  // Your existing forumEvents data
];

export const forumCategories = [
  { id: 'dog', name: 'Chó', icon: 'pets' },
  { id: 'cat', name: 'Mèo', icon: 'pets' },
  { id: 'rescue', name: 'Cứu hộ', icon: 'emergency' },
  { id: 'health', name: 'Sức khỏe', icon: 'local_hospital' },
  { id: 'adoption', name: 'Nhận nuôi', icon: 'favorite' },
  { id: 'photography', name: 'Nhiếp ảnh', icon: 'photo_camera' }
];