export const users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', role: 'user', createdAt: new Date() },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0901234568', role: 'user', createdAt: new Date(Date.now() - 86400000) },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0901234569', role: 'admin', createdAt: new Date(Date.now() - 172800000) },
];

export default users;