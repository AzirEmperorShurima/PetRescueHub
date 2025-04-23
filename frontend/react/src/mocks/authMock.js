export const usersMock = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    username: 'nguyenvana',
    email: 'user@example.com',
    password: 'userA123', // Trong thực tế, mật khẩu sẽ được mã hóa
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Tôi là một tình nguyện viên đam mê cứu hộ động vật. Đã tham gia nhiều hoạt động cứu trợ và nhận nuôi 3 thú cưng.',
    location: 'Quận 1, TP.HCM',
    joinDate: '2023-01-15',
    role: 'user',
    createdAt: '2023-10-01T08:30:00',
    rescuedPets: 3
  },
  {
    id: 2,
    name: 'Trần Thị B',
    username: 'tranthib',
    email: 'user2@example.com',
    password: 'userB123',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Yêu mèo và đam mê chăm sóc động vật hoang dã. Hiện đang nuôi 2 mèo và 1 chó được cứu hộ từ đường phố.',
    location: 'Quận 7, TP.HCM',
    joinDate: '2023-03-22',
    role: 'user',
    createdAt: '2023-10-05T10:15:00',
    rescuedPets: 1
  },
  {
    id: 3,
    name: 'Admin',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Quản trị viên của PetRescueHub. Chuyên gia về cứu hộ và chăm sóc động vật với hơn 5 năm kinh nghiệm.',
    location: 'Quận 3, TP.HCM',
    joinDate: '2022-09-10',
    role: 'admin',
    createdAt: '2023-09-15T09:00:00',
    rescuedPets: 15
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    username: 'phamthid',
    email: 'user3@example.com',
    password: 'userD123',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Bác sĩ thú y với niềm đam mê giúp đỡ các động vật bị bỏ rơi. Tình nguyện viên tại nhiều trung tâm cứu hộ.',
    location: 'Quận 2, TP.HCM',
    joinDate: '2023-05-18',
    role: 'volunteer',
    createdAt: '2023-10-12T14:30:00',
    rescuedPets: 8,
    achievements: [
      { id: 1, title: 'Tình nguyện viên xuất sắc 2023', content: 'Đã tham gia hơn 20 hoạt động cứu hộ trong năm 2023' },
      { id: 2, title: 'Chuyên gia y tế', content: 'Đã hỗ trợ điều trị cho hơn 50 thú cưng bị thương' }
    ]
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    username: 'hoangvane',
    email: 'user4@example.com',
    password: 'userE123',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Nhiếp ảnh gia chuyên chụp ảnh động vật. Đam mê tìm kiếm và giúp đỡ các thú cưng bị lạc.',
    location: 'Quận 5, TP.HCM',
    joinDate: '2023-02-28',
    role: 'user',
    createdAt: '2023-10-20T11:45:00',
    rescuedPets: 2
  },
  {
    id: 6,
    name: 'Lê Thị F',
    username: 'lethif',
    email: 'volunteer1@example.com',
    password: 'volunteer123',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1557495235-340eb888a9fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Tình nguyện viên chuyên cứu hộ động vật hoang dã. Đã tham gia nhiều chiến dịch bảo vệ động vật quý hiếm.',
    location: 'Quận 10, TP.HCM',
    joinDate: '2022-11-15',
    role: 'volunteer',
    createdAt: '2023-08-10T09:20:00',
    rescuedPets: 12,
    achievements: [
      { id: 1, title: 'Người hùng cứu hộ', content: 'Đã cứu hộ thành công 10 thú cưng trong trận lũ năm 2022' },
      { id: 2, title: 'Huấn luyện viên xuất sắc', content: 'Đã huấn luyện thành công 15 chó cứu hộ' },
      { id: 3, title: 'Nhà bảo vệ động vật', content: 'Đã tham gia 5 chiến dịch bảo vệ động vật hoang dã' }
    ]
  },
  {
    id: 7,
    name: 'Trần Văn G',
    username: 'tranvang',
    email: 'volunteer2@example.com',
    password: 'volunteer456',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Chuyên gia dinh dưỡng cho thú cưng. Tình nguyện viên tại nhiều trung tâm cứu hộ và phòng khám thú y.',
    location: 'Quận Bình Thạnh, TP.HCM',
    joinDate: '2023-01-05',
    role: 'volunteer',
    createdAt: '2023-07-15T14:30:00',
    rescuedPets: 6,
    achievements: [
      { id: 1, title: 'Chuyên gia dinh dưỡng', content: 'Đã tư vấn dinh dưỡng cho hơn 100 thú cưng' },
      { id: 2, title: 'Người truyền cảm hứng', content: 'Đã tổ chức 10 buổi hội thảo về chăm sóc thú cưng' }
    ]
  }
];

export const loginResponseMock = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ik5ndXnhu4VuIFbEg24gQSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  user: {
    id: 1,
    name: 'Nguyễn Văn A',
    username: 'nguyenvana',
    email: 'user@example.com',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Tôi là một tình nguyện viên đam mê cứu hộ động vật. Đã tham gia nhiều hoạt động cứu trợ và nhận nuôi 3 thú cưng.',
    location: 'Quận 1, TP.HCM',
    joinDate: '2023-01-15',
    role: 'user',
    rescuedPets: 3
  }
};

export const adminLoginResponseMock = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  user: {
    id: 3,
    name: 'Admin',
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Quản trị viên của PetRescueHub. Chuyên gia về cứu hộ và chăm sóc động vật với hơn 5 năm kinh nghiệm.',
    location: 'Quận 3, TP.HCM',
    joinDate: '2022-09-10',
    role: 'admin',
    rescuedPets: 15
  }
};

// Thêm mock response cho volunteer
export const volunteerLoginResponseMock = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6IlBo4bqhbSBUaOG7iyBEIiwicm9sZSI6InZvbHVudGVlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  user: {
    id: 4,
    name: 'Phạm Thị D',
    username: 'phamthid',
    email: 'user3@example.com',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Bác sĩ thú y với niềm đam mê giúp đỡ các động vật bị bỏ rơi. Tình nguyện viên tại nhiều trung tâm cứu hộ.',
    location: 'Quận 2, TP.HCM',
    joinDate: '2023-05-18',
    role: 'volunteer',
    rescuedPets: 8,
    achievements: [
      { id: 1, title: 'Tình nguyện viên xuất sắc 2023', content: 'Đã tham gia hơn 20 hoạt động cứu hộ trong năm 2023' },
      { id: 2, title: 'Chuyên gia y tế', content: 'Đã hỗ trợ điều trị cho hơn 50 thú cưng bị thương' }
    ]
  }
};

// Thêm mock response cho volunteer khác
export const volunteerLoginResponseMock2 = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6IkzDqiBUaOG7iyBGIiwicm9sZSI6InZvbHVudGVlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  user: {
    id: 6,
    name: 'Lê Thị F',
    username: 'lethif',
    email: 'volunteer1@example.com',
    avatar: 'https://cdn.eva.vn/upload/1-2023/images/2023-02-25/img-social-uploadbtv-1-1677308970-973-width1200height628-1677308970-211-width1200height628-watermark.jpg',
    coverImage: 'https://images.unsplash.com/photo-1557495235-340eb888a9fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Tình nguyện viên chuyên cứu hộ động vật hoang dã. Đã tham gia nhiều chiến dịch bảo vệ động vật quý hiếm.',
    location: 'Quận 10, TP.HCM',
    joinDate: '2022-11-15',
    role: 'volunteer',
    rescuedPets: 12,
    achievements: [
      { id: 1, title: 'Người hùng cứu hộ', content: 'Đã cứu hộ thành công 10 thú cưng trong trận lũ năm 2022' },
      { id: 2, title: 'Huấn luyện viên xuất sắc', content: 'Đã huấn luyện thành công 15 chó cứu hộ' },
      { id: 3, title: 'Nhà bảo vệ động vật', content: 'Đã tham gia 5 chiến dịch bảo vệ động vật hoang dã' }
    ]
  }
};

// Hàm giả lập đăng nhập với các vai trọ̀ọ khác nhau
export const mockLogin = (role) => {
  switch (role) {
    case 'admin':
      return adminLoginResponseMock;
    case 'volunteer':
      return volunteerLoginResponseMock;
    case 'volunteer2':
      return volunteerLoginResponseMock2;
    case 'user':
    default:
      return loginResponseMock;
  }
};

// Hàm giả lập đăng nhập với email và password
export const mockLoginWithCredentials = (email, password) => {
  const user = usersMock.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }
  
  // Tạo response tương ứng với user tìm thấy
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9IiwibmFtZSI6IiR7dXNlci5uYW1lfSIsInJvbGUiOiIke3VzZXIucm9sZX0iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    user: userWithoutPassword
  };
};

export default {
  usersMock,
  loginResponseMock,
  adminLoginResponseMock,
  volunteerLoginResponseMock,
  volunteerLoginResponseMock2,
  mockLogin,
  mockLoginWithCredentials
};