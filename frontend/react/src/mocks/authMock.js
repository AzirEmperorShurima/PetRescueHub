export const usersMock = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    password: 'password123', // Trong thực tế, mật khẩu sẽ được mã hóa
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'user',
    createdAt: '2023-10-01T08:30:00'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'user2@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'user',
    createdAt: '2023-10-05T10:15:00'
  },
  {
    id: 3,
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'admin',
    createdAt: '2023-09-15T09:00:00'
  }
];

export const loginResponseMock = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ik5ndXnhu4VuIFbEg24gQSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  user: {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'user'
  }
};

export const adminLoginResponseMock = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  user: {
    id: 3,
    name: 'Admin',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'admin'
  }
};

export default {
  usersMock,
  loginResponseMock,
  adminLoginResponseMock
};