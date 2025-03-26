export const pets = [
  { 
    id: 1, 
    name: 'Buddy', 
    type: 'dog', 
    breed: 'Golden Retriever', 
    age: '2 tuổi', 
    description: 'Chó đực, thân thiện với trẻ em, đã được tiêm phòng đầy đủ.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'available',
    createdAt: new Date()
  },
  { 
    id: 2, 
    name: 'Luna', 
    type: 'cat', 
    breed: 'Mèo ta', 
    age: '1 tuổi', 
    description: 'Mèo cái, rất ngoan và sạch sẽ, thích chơi đùa.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'adopted',
    createdAt: new Date(Date.now() - 86400000)
  },
  { 
    id: 3, 
    name: 'Max', 
    type: 'dog', 
    breed: 'Poodle', 
    age: '3 tuổi', 
    description: 'Chó đực, rất thông minh và dễ huấn luyện.',
    imageUrl: 'https://images.unsplash.com/photo-1575859431774-2e57ed632664?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    status: 'available',
    createdAt: new Date(Date.now() - 172800000)
  },
];

export default pets;