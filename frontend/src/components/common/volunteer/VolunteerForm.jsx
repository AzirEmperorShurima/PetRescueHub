import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  CloseButton
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FormControl, FormLabel } from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';
import './VolunteerForm.css';

const VolunteerForm = ({ isOpen, onClose }) => {
  const { showSuccess } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [],
    availability: '',
    message: '',
    termsAccepted: false
  });

  // Danh sách kỹ năng
  const skillsList = [
    { id: 'skill1', value: 'chăm sóc thú cưng', label: 'Chăm sóc thú cưng' },
    { id: 'skill2', value: 'y tế', label: 'Y tế' },
    { id: 'skill3', value: 'lái xe', label: 'Lái xe' },
    { id: 'skill4', value: 'truyền thông', label: 'Truyền thông' },
    { id: 'skill5', value: 'tổ chức sự kiện', label: 'Tổ chức sự kiện' },
    { id: 'skill6', value: 'huấn luyện thú cưng', label: 'Huấn luyện thú cưng' },
    { id: 'skill7', value: 'nhiếp ảnh', label: 'Nhiếp ảnh' },
    { id: 'skill8', value: 'thiết kế đồ họa', label: 'Thiết kế đồ họa' },
    { id: 'skill9', value: 'kỹ năng IT', label: 'Kỹ năng IT' },
    { id: 'skill10', value: 'quản lý tình nguyện viên', label: 'Quản lý tình nguyện viên' },
    { id: 'skill11', value: 'kỹ năng mềm', label: 'Kỹ năng mềm & cộng tác' },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes for skills
  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        skills: [...formData.skills, value]
      });
    } else {
      setFormData({
        ...formData,
        skills: formData.skills.filter(skill => skill !== value)
      });
    }
  };

  // Handle terms checkbox
  const handleTermsChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked
    });
  };
  
  // Handle volunteer form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Volunteer form submitted:', formData);
    
    // Hiển thị thông báo thành công
    showSuccess('Cảm ơn bạn đã đăng ký làm tình nguyện viên! Chúng tôi sẽ liên hệ với bạn sớm.');
    
    // Đóng modal
    onClose();
    
    // Reset form
    setFormData({
      // Reset form data
      name: '',
      email: '',
      phone: '',
      skills: [],
      availability: '',
      message: '',
      termsAccepted: false
    });
  };

  return (
    <div className={`volunteer-modal ${isOpen ? 'active' : ''}`}>
      <Container className="volunteer-modal-content" maxW="700px">
        <Flex justifyContent="flex-end">
          <CloseButton size="lg" onClick={onClose} className="volunteer-modal-close" />
        </Flex>
        
        <VStack spacing={4} align="center" mb={6}>
          <Heading as="h3" size="xl" className="volunteer-form-title">
            Đăng ký làm tình nguyện viên
          </Heading>
          <Text className="volunteer-form-subtitle">
            Hãy tham gia cùng chúng tôi để giúp đỡ các thú cưng cần được cứu trợ
          </Text>
        </VStack>
        
        <Box as="form" onSubmit={handleSubmit} className="volunteer-form">
          {/* Phần name */}
          <FormControl>
            <FormLabel className="name-label">Họ và tên</FormLabel>
            <Input
              className="name-input"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          
          {/* Phần email */}
          <FormControl>
            <FormLabel className="email-label">Email</FormLabel>
            <Input
              className="email-input"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          
          {/* Phần phone */}
          <FormControl>
            <FormLabel className="phone-label">Số điện thoại</FormLabel>
            <Input
              className="phone-input"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          
          {/* Phần availability */}
          <FormControl>
            <FormLabel className="availability-label">Thời gian có thể tham gia</FormLabel>
            <Select
              className="availability-select"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              required
              variant="outline"
              iconSize="0" /* Ẩn icon mặc định của Chakra UI */
            >
              <option value="">Chọn thời gian</option>
              <option value="Cuối tuần">Cuối tuần</option>
              <option value="Buổi tối">Buổi tối</option>
              <option value="Cả ngày">Cả ngày</option>
              <option value="Linh hoạt">Linh hoạt</option>
            </Select>
          </FormControl>
          
          <FormControl mb={6}>
            <FormLabel className="form-label">Kỹ năng</FormLabel>
            <Box className="skills-container">
              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                {skillsList.map(skill => (
                  <GridItem key={skill.id}>
                    <Checkbox
                      id={skill.id}
                      value={skill.value}
                      isChecked={formData.skills.includes(skill.value)}
                      onChange={handleSkillChange}
                      className="skill-checkbox"
                    >
                      {skill.label}
                    </Checkbox>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </FormControl>
          
          {/* Phần message */}
          <FormControl>
            <FormLabel className="message-label">Lời nhắn</FormLabel>
            <Textarea
              className="message-textarea"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Chia sẻ lý do bạn muốn trở thành tình nguyện viên..."
            />
          </FormControl>

          <FormControl mb={6} required>
            <Checkbox
              id="terms"
              isChecked={formData.termsAccepted}
              onChange={handleTermsChange}
              className="terms-checkbox"
            >
              Tôi đồng ý với <a href="/terms" className="terms-link">điều khoản và điều kiện</a> của Pet Rescue Hub
            </Checkbox>
          </FormControl>
          
          <Button
            type="submit"
            rightIcon={<ChevronRightIcon />}
            colorScheme="pink"
            size="lg"
            width="100%"
            isDisabled={!formData.termsAccepted}
            className="form-submit"
          >
            Đăng ký ngay
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default VolunteerForm;