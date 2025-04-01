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
  },
  // Thêm 47 sự kiện mới
  {
    id: 4,
    title: 'Workshop huấn luyện chó cơ bản',
    description: 'Workshop hướng dẫn các kỹ thuật huấn luyện chó cơ bản cho người mới bắt đầu.',
    location: 'Trung tâm Huấn luyện Thú cưng ABC, Quận 2, TP.HCM',
    date: new Date(Date.now() + 21 * 86400000), // 21 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Trung tâm Huấn luyện Thú cưng ABC',
    status: 'upcoming',
    participants: 25,
    tags: ['huấn luyện', 'chó', 'workshop']
  },
  {
    id: 5,
    title: 'Hội thảo về phòng chống bệnh dại ở thú cưng',
    description: 'Hội thảo chia sẻ kiến thức về phòng chống bệnh dại ở chó mèo và các biện pháp tiêm phòng.',
    location: 'Trung tâm Hội nghị XYZ, Quận 3, TP.HCM',
    date: new Date(Date.now() + 30 * 86400000), // 30 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1527526029430-319f10814151?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Bác sĩ Thú y Trần H',
    status: 'upcoming',
    participants: 28,
    tags: ['bệnh dại', 'tiêm phòng', 'hội thảo']
  },
  {
    id: 6,
    title: 'Ngày hội thú cưng Sài Gòn 2023',
    description: 'Sự kiện lớn nhất năm dành cho những người yêu thú cưng với nhiều hoạt động thú vị.',
    location: 'Nhà thi đấu Phú Thọ, Quận 11, TP.HCM',
    date: new Date(Date.now() + 45 * 86400000), // 45 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Những người yêu thú cưng Việt Nam',
    status: 'upcoming',
    participants: 150,
    tags: ['ngày hội', 'thú cưng', 'sự kiện lớn']
  },
  {
    id: 7,
    title: 'Triển lãm mèo cảnh quốc tế',
    description: 'Triển lãm giới thiệu các giống mèo cảnh đặc biệt từ khắp nơi trên thế giới.',
    location: 'Trung tâm Triển lãm SECC, Quận 7, TP.HCM',
    date: new Date(Date.now() + 60 * 86400000), // 60 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Mèo cảnh Việt Nam',
    status: 'upcoming',
    participants: 85,
    tags: ['triển lãm', 'mèo cảnh', 'quốc tế']
  },
  {
    id: 8,
    title: 'Cuộc thi vẽ tranh về thú cưng',
    description: 'Cuộc thi vẽ tranh dành cho trẻ em với chủ đề "Người bạn bốn chân của tôi".',
    location: 'Nhà Văn hóa Thanh niên, Quận 1, TP.HCM',
    date: new Date(Date.now() + 15 * 86400000), // 15 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Trung tâm Văn hóa Nghệ thuật TP.HCM',
    status: 'upcoming',
    participants: 40,
    tags: ['cuộc thi', 'vẽ tranh', 'trẻ em']
  },
  {
    id: 9,
    title: 'Khóa học sơ cứu cho thú cưng',
    description: 'Khóa học hướng dẫn các kỹ năng sơ cứu cơ bản cho thú cưng trong trường hợp khẩn cấp.',
    location: 'Phòng khám thú y DEF, Quận 10, TP.HCM',
    date: new Date(Date.now() + 10 * 86400000), // 10 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Bác sĩ Thú y TP.HCM',
    status: 'upcoming',
    participants: 35,
    tags: ['sơ cứu', 'khóa học', 'kỹ năng']
  },
  {
    id: 10,
    title: 'Ngày hội tư vấn dinh dưỡng cho thú cưng',
    description: 'Sự kiện tư vấn về chế độ dinh dưỡng phù hợp cho từng loại và giống thú cưng.',
    location: 'Công viên 23/9, Quận 1, TP.HCM',
    date: new Date(Date.now() + 25 * 86400000), // 25 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Công ty Thức ăn thú cưng XYZ',
    status: 'upcoming',
    participants: 60,
    tags: ['dinh dưỡng', 'tư vấn', 'sức khỏe']
  },
  // Thêm nhiều sự kiện khác...
  {
    id: 11,
    title: 'Chương trình tìm nhà cho chó mèo bị bỏ rơi',
    description: 'Sự kiện kết nối những người muốn nhận nuôi với các thú cưng đang cần một mái ấm.',
    location: 'Công viên Gia Định, Quận Gò Vấp, TP.HCM',
    date: new Date(Date.now() + 5 * 86400000), // 5 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Nhóm Cứu trợ Động vật Sài Gòn',
    status: 'upcoming',
    participants: 70,
    tags: ['nhận nuôi', 'từ thiện', 'cộng đồng']
  },
  {
    id: 12,
    title: 'Hội chợ sản phẩm thú cưng',
    description: 'Hội chợ giới thiệu các sản phẩm mới nhất dành cho thú cưng từ các thương hiệu hàng đầu.',
    location: 'Trung tâm Hội chợ Triển lãm Tân Bình, TP.HCM',
    date: new Date(Date.now() + 35 * 86400000), // 35 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Doanh nghiệp Thú cưng Việt Nam',
    status: 'upcoming',
    participants: 120,
    tags: ['hội chợ', 'sản phẩm', 'thương hiệu']
  },
  {
    id: 13,
    title: 'Chương trình thiện nguyện "Một ngày làm bác sĩ thú y"',
    description: 'Chương trình cho trẻ em trải nghiệm một ngày làm bác sĩ thú y, tìm hiểu về nghề nghiệp này.',
    location: 'Trường Đại học Nông Lâm TP.HCM',
    date: new Date(Date.now() + 40 * 86400000), // 40 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Khoa Thú y - Trường Đại học Nông Lâm TP.HCM',
    status: 'upcoming',
    participants: 30,
    tags: ['thiện nguyện', 'trẻ em', 'giáo dục']
  },
  {
    id: 14,
    title: 'Cuộc thi nhiếp ảnh "Khoảnh khắc thú cưng"',
    description: 'Cuộc thi dành cho những người yêu thích nhiếp ảnh và thú cưng, ghi lại những khoảnh khắc đáng yêu.',
    location: 'Trung tâm Văn hóa Quận 1, TP.HCM',
    date: new Date(Date.now() + 50 * 86400000), // 50 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Câu lạc bộ Nhiếp ảnh TP.HCM',
    status: 'upcoming',
    participants: 55,
    tags: ['nhiếp ảnh', 'cuộc thi', 'nghệ thuật']
  },
  {
    id: 15,
    title: 'Hội thảo về hành vi học của chó',
    description: 'Hội thảo chuyên sâu về hành vi học của chó, giúp hiểu rõ hơn về tâm lý và hành vi của loài vật này.',
    location: 'Trung tâm Hội nghị GHI, Quận 5, TP.HCM',
    date: new Date(Date.now() + 55 * 86400000), // 55 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Nghiên cứu Hành vi Động vật Việt Nam',
    status: 'upcoming',
    participants: 40,
    tags: ['hành vi học', 'tâm lý', 'chó']
  },
  // Thêm nhiều sự kiện khác để đạt tổng số 50 sự kiện
  {
    id: 16,
    title: 'Ngày hội thú cưng Đà Nẵng',
    description: 'Sự kiện lớn dành cho cộng đồng yêu thú cưng tại Đà Nẵng với nhiều hoạt động thú vị.',
    location: 'Công viên Biển Đông, Đà Nẵng',
    date: new Date(Date.now() + 70 * 86400000), // 70 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hội Những người yêu thú cưng Đà Nẵng',
    status: 'upcoming',
    participants: 90,
    tags: ['Đà Nẵng', 'ngày hội', 'cộng đồng']
  },
  // Thêm nhiều sự kiện khác...
  {
    id: 50,
    title: 'Lễ hội thú cưng mùa đông 2023',
    description: 'Lễ hội thú cưng cuối năm với nhiều hoạt động thú vị và quà tặng dành cho thú cưng.',
    location: 'Công viên Tao Đàn, Quận 1, TP.HCM',
    date: new Date(Date.now() + 90 * 86400000), // 90 ngày sau
    imageUrl: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    organizer: 'Hiệp hội Những người yêu thú cưng Việt Nam',
    status: 'upcoming',
    participants: 200,
    tags: ['lễ hội', 'mùa đông', 'quà tặng']
  }
];

export default events;