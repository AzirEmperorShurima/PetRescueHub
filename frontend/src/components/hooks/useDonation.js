import { useState, useEffect } from 'react';

// Custom hook để quản lý logic quyên góp
export const useDonation = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // QR code từ các dịch vụ thanh toán
  const qrCodes = {
    bank: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/bank',
    momo: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/momo',
    vnpay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/vnpay',
    zalopay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/zalopay'
  };
  
  // Thông tin tài khoản ngân hàng
  const accountDetails = {
    bank: "Vietcombank",
    accountNumber: "9984268233",
    accountName: "PetRescueHub",
    content: "Ủng hộ [Tên của bạn]"
  };

  // Hình ảnh động vật cần giúp đỡ
  const rescueImages = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ];
  
  // Xử lý sao chép thông tin
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Xử lý chuyển tab
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Hiệu ứng chuyển đổi hình ảnh
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % rescueImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [rescueImages.length]);
  
  return {
    copySuccess,
    activeTab,
    currentImageIndex,
    qrCodes,
    accountDetails,
    rescueImages,
    // rescueStats,
    handleCopy,
    handleChangeTab,
    setCopySuccess,
    setCurrentImageIndex
  };
};