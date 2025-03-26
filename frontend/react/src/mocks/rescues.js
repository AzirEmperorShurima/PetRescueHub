export const rescues = [
  {
    id: 1,
    title: 'Cứu hộ chó bị bỏ rơi tại Quận 1',
    location: 'Quận 1, TP.HCM',
    reportedBy: 'Nguyễn Văn A',
    reportedAt: new Date(Date.now() - 2 * 86400000),
    status: 'in_progress',
    description: 'Phát hiện 3 chú chó con bị bỏ rơi trong hẻm, cần người đến cứu hộ gấp.',
    images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    assignedTo: 'Trần Thị B',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Mèo bị thương cần cứu hộ',
    location: 'Quận 7, TP.HCM',
    reportedBy: 'Lê Văn C',
    reportedAt: new Date(Date.now() - 5 * 86400000),
    status: 'completed',
    description: 'Mèo bị thương ở chân sau, đang ẩn nấp dưới gầm xe trong bãi đỗ xe.',
    images: ['https://images.unsplash.com/photo-1548681528-6a5c45b66b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    assignedTo: 'Phạm Văn D',
    priority: 'medium',
    resolution: 'Đã cứu hộ thành công, mèo đang được điều trị tại phòng khám.'
  },
  {
    id: 3,
    title: 'Chim bồ câu bị mắc kẹt trên mái nhà',
    location: 'Quận 3, TP.HCM',
    reportedBy: 'Hoàng Thị E',
    reportedAt: new Date(Date.now() - 1 * 86400000),
    status: 'pending',
    description: 'Chim bồ câu bị mắc kẹt trong dây điện trên mái nhà, không thể tự bay đi.',
    images: ['https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    priority: 'low'
  }
];

export default rescues;