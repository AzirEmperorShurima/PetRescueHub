export const volunteers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    skills: ['chăm sóc thú cưng', 'lái xe'],
    availability: 'Cuối tuần',
    status: 'active',
    joinDate: new Date(Date.now() - 30 * 86400000)
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0901234568',
    skills: ['y tế', 'huấn luyện'],
    availability: 'Tối các ngày trong tuần',
    status: 'active',
    joinDate: new Date(Date.now() - 60 * 86400000)
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0901234569',
    skills: ['truyền thông', 'tổ chức sự kiện'],
    availability: 'Linh hoạt',
    status: 'inactive',
    joinDate: new Date(Date.now() - 90 * 86400000)
  }
];

export default volunteers;