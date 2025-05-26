import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  SimpleGrid,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  Badge,
  useToast,
  useColorModeValue,
  Image,
  IconButton,
  Progress,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react';
import { BiUpload, BiX, BiHeart, BiCheckCircle, BiCamera, BiUser } from 'react-icons/bi';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
// Pet Basic Info Component
const PetBasicInfo = ({ formData, setFormData, errors }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const petTypes = [
    'Chó', 'Mèo', 'Chim', 'Cá', 'Hamster', 'Thỏ', 
    'Rùa', 'Bò sát', 'Khác'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      petInfo: {
        ...prev.petInfo,
        [field]: value
      }
    }));
  };

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
      <CardHeader pb={4}>
        <HStack spacing={3}>
          <BiHeart style={{ width: '24px', height: '24px', color: '#ed64a6' }} />
          <Heading size="lg">Thông tin cơ bản về thú cưng</Heading>
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        <VStack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            {/* Pet Name - Optional */}
            <FormControl>
              <FormLabel>
                Tên thú cưng 
                <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                  (Không bắt buộc)
                </Text>
              </FormLabel>
              <Input
                placeholder="Chưa có tên hoặc để trống nếu chưa đặt tên"
                value={formData.petInfo.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Nhiều thú cưng bị bỏ rơi chưa có tên, bạn có thể để trống
              </Text>
            </FormControl>

            {/* Pet Type */}
            <FormControl isRequired>
              <FormLabel>Loại thú cưng</FormLabel>
              <Select
                placeholder="Chọn loại thú cưng"
                value={formData.petInfo.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                isInvalid={errors.type}
              >
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
              {formData.petInfo.type === 'Khác' && (
                <Input
                  mt={2}
                  placeholder="Nhập loại thú cưng khác"
                  value={formData.petInfo.customType || ''}
                  onChange={(e) => handleInputChange('customType', e.target.value)}
                />
              )}
            </FormControl>

            {/* Breed */}
            <FormControl>
              <FormLabel>Giống</FormLabel>
              <Input
                placeholder="VD: Golden Retriever, Persian, v.v."
                value={formData.petInfo.breed || ''}
                onChange={(e) => handleInputChange('breed', e.target.value)}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Để trống nếu không rõ giống cụ thể
              </Text>
            </FormControl>

            {/* Gender */}
            <FormControl>
              <FormLabel>Giới tính</FormLabel>
              <RadioGroup
                value={formData.petInfo.gender || ''}
                onChange={(value) => handleInputChange('gender', value)}
              >
                <HStack spacing={6}>
                  <Radio value="male">Đực</Radio>
                  <Radio value="female">Cái</Radio>
                  <Radio value="unknown">Không rõ</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* Age */}
            <FormControl>
              <FormLabel>Tuổi (ước tính)</FormLabel>
              <Select
                placeholder="Chọn độ tuổi"
                value={formData.petInfo.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
              >
                <option value="puppy">Con non (dưới 1 tuổi)</option>
                <option value="young">Trẻ (1-3 tuổi)</option>
                <option value="adult">Trưởng thành (3-7 tuổi)</option>
                <option value="senior">Già (trên 7 tuổi)</option>
                <option value="unknown">Không rõ</option>
              </Select>
            </FormControl>

            {/* Size */}
            <FormControl>
              <FormLabel>Kích thước</FormLabel>
              <RadioGroup
                value={formData.petInfo.size || ''}
                onChange={(value) => handleInputChange('size', value)}
              >
                <HStack spacing={4} flexWrap="wrap">
                  <Radio value="small">Nhỏ</Radio>
                  <Radio value="medium">Trung bình</Radio>
                  <Radio value="large">Lớn</Radio>
                  <Radio value="extra-large">Rất lớn</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </SimpleGrid>

          {/* Description */}
          <FormControl>
            <FormLabel>Mô tả chi tiết</FormLabel>
            <Textarea
              placeholder="Mô tả tính cách, sở thích, tình trạng sức khỏe, hoàn cảnh tìm thấy..."
              value={formData.petInfo.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              minH="120px"
            />
          </FormControl>

          {/* Health Info */}
          <FormControl>
            <FormLabel>Tình trạng sức khỏe</FormLabel>
            <VStack align="start" spacing={3}>
              <Checkbox
                isChecked={formData.petInfo.isVaccinated || false}
                onChange={(e) => handleInputChange('isVaccinated', e.target.checked)}
              >
                Đã tiêm phòng
              </Checkbox>
              <Checkbox
                isChecked={formData.petInfo.isNeutered || false}
                onChange={(e) => handleInputChange('isNeutered', e.target.checked)}
              >
                Đã triệt sản
              </Checkbox>
              <Checkbox
                isChecked={formData.petInfo.hasHealthIssues || false}
                onChange={(e) => handleInputChange('hasHealthIssues', e.target.checked)}
              >
                Có vấn đề sức khỏe đặc biệt
              </Checkbox>
              {formData.petInfo.hasHealthIssues && (
                <Textarea
                  placeholder="Mô tả vấn đề sức khỏe cụ thể..."
                  value={formData.petInfo.healthDetails || ''}
                  onChange={(e) => handleInputChange('healthDetails', e.target.value)}
                  size="sm"
                />
              )}
            </VStack>
          </FormControl>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Photo Upload Component
const PhotoUpload = ({ formData, setFormData }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      photos: [...(prev.photos || []), ...newImages].slice(0, 6)
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(img => img.id !== imageId)
    }));
  };

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
      <CardHeader pb={4}>
        <HStack spacing={3}>
          <BiCamera style={{ width: '24px', height: '24px', color: '#3182ce' }} />
          <Heading size="lg">Hình ảnh thú cưng</Heading>
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        <VStack spacing={6}>
          {/* Upload Area */}
          <Box
            w="full"
            h="200px"
            border="2px dashed"
            borderColor={borderColor}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            cursor="pointer"
            _hover={{ bg: bgHover }}
            transition="all 0.2s"
          >
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              opacity={0}
              cursor="pointer"
            />
            <VStack spacing={3}>
              <BiUpload style={{ width: '48px', height: '48px', color: '#a0aec0' }} />
              <VStack spacing={1}>
                <Text fontWeight="medium">Tải lên hình ảnh</Text>
                <Text fontSize="sm" color="gray.500">
                  Kéo thả hoặc click để chọn ảnh (tối đa 6 ảnh)
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Photo Preview */}
          {formData.photos && formData.photos.length > 0 && (
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} w="full">
              {formData.photos.map((image, index) => (
                <Box key={image.id} position="relative">
                  <Image
                    src={image.url}
                    alt={`Pet photo ${index + 1}`}
                    w="full"
                    h="120px"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  {index === 0 && (
                    <Badge
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme="blue"
                      variant="solid"
                      fontSize="xs"
                    >
                      Ảnh chính
                    </Badge>
                  )}
                  <IconButton
                    icon={<BiX />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => removeImage(image.id)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}

          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Text fontSize="sm">
              Ảnh đầu tiên sẽ được sử dụng làm ảnh đại diện. 
              Hãy chọn những bức ảnh rõ nét và thể hiện được vẻ đáng yêu của thú cưng.
            </Text>
          </Alert>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Contact Information Component
const ContactInfo = ({ formData, setFormData, errors }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
      <CardHeader pb={4}>
        <HStack spacing={3}>
          <BiUser style={{ width: '24px', height: '24px', color: '#38a169' }} />
          <Heading size="lg">Thông tin liên hệ</Heading>
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        <VStack spacing={6}>
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Text fontSize="sm">
              Thông tin này sẽ được hiển thị cho những người quan tâm muốn nhận nuôi thú cưng.
            </Text>
          </Alert>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            {/* Contact Name */}
            <FormControl isRequired>
              <FormLabel>Tên người liên hệ</FormLabel>
              <Input
                placeholder="Nhập tên đầy đủ"
                value={formData.contactInfo?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isInvalid={errors.contactName}
              />
            </FormControl>

            {/* Phone */}
            <FormControl isRequired>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                placeholder="VD: 0912345678"
                value={formData.contactInfo?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                isInvalid={errors.contactPhone}
              />
            </FormControl>

            {/* Email */}
            <FormControl>
              <FormLabel>
                Email 
                <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                  (Không bắt buộc)
                </Text>
              </FormLabel>
              <Input
                type="email"
                placeholder="example@email.com"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </FormControl>

            {/* Location */}
            <FormControl isRequired>
              <FormLabel>Khu vực</FormLabel>
              <Select
                placeholder="Chọn tỉnh/thành phố"
                value={formData.contactInfo?.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                isInvalid={errors.contactLocation}
              >
                <option value="hanoi">Hà Nội</option>
                <option value="hcmc">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="cantho">Cần Thơ</option>
                <option value="other">Tỉnh thành khác</option>
              </Select>
              {formData.contactInfo?.location === 'other' && (
                <Input
                  mt={2}
                  placeholder="Nhập tỉnh/thành phố"
                  value={formData.contactInfo?.customLocation || ''}
                  onChange={(e) => handleInputChange('customLocation', e.target.value)}
                />
              )}
            </FormControl>
          </SimpleGrid>

          {/* Address */}
          <FormControl>
            <FormLabel>
              Địa chỉ cụ thể 
              <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                (Không bắt buộc)
              </Text>
            </FormLabel>
            <Input
              placeholder="Địa chỉ chi tiết (không hiển thị công khai)"
              value={formData.contactInfo?.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Thông tin này chỉ chia sẻ với người có ý định nhận nuôi nghiêm túc
            </Text>
          </FormControl>

          {/* Additional Notes */}
          <FormControl>
            <FormLabel>Ghi chú thêm</FormLabel>
            <Textarea
              placeholder="Thời gian có thể liên hệ, yêu cầu đặc biệt với người nhận nuôi..."
              value={formData.contactInfo?.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </FormControl>

          {/* Contact Preferences */}
          <FormControl>
            <FormLabel>Cách thức liên hệ ưu tiên</FormLabel>
            <VStack align="start" spacing={2}>
              <Checkbox
                isChecked={formData.contactInfo?.preferPhone || false}
                onChange={(e) => handleInputChange('preferPhone', e.target.checked)}
              >
                Gọi điện thoại
              </Checkbox>
              <Checkbox
                isChecked={formData.contactInfo?.preferSMS || false}
                onChange={(e) => handleInputChange('preferSMS', e.target.checked)}
              >
                Nhắn tin SMS
              </Checkbox>
              <Checkbox
                isChecked={formData.contactInfo?.preferEmail || false}
                onChange={(e) => handleInputChange('preferEmail', e.target.checked)}
              >
                Email
              </Checkbox>
            </VStack>
          </FormControl>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Main Form Component
const FindHome = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const [formData, setFormData] = useState({
    petInfo: {},
    photos: [],
    contactInfo: {}
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: 'Thông tin thú cưng', description: 'Chi tiết cơ bản' },
    { title: 'Hình ảnh', description: 'Tải lên ảnh' },
    { title: 'Thông tin liên hệ', description: 'Cách liên lạc' },
    { title: 'Xác nhận', description: 'Hoàn tất' }
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const validateForm = () => {
    const newErrors = {};

    // Validate pet info
    if (!formData.petInfo?.type) {
      newErrors.type = true;
    }

    // Validate contact info
    if (!formData.contactInfo?.name?.trim()) {
      newErrors.contactName = true;
    }
    if (!formData.contactInfo?.phone?.trim()) {
      newErrors.contactPhone = true;
    }
    if (!formData.contactInfo?.location) {
      newErrors.contactLocation = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate basic info
      const hasRequiredInfo = formData.petInfo?.type;
      if (!hasRequiredInfo) {
        toast({
          title: "Vui lòng nhập thông tin bắt buộc",
          description: "Loại thú cưng là thông tin cần thiết",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    if (activeStep === 2) {
      // Validate contact info
      if (!validateForm()) {
        toast({
          title: "Vui lòng nhập đầy đủ thông tin liên hệ",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Vui lòng kiểm tra lại thông tin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Đăng tin thành công!",
        description: "Thông tin thú cưng đã được đăng tải và đang chờ duyệt",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        petInfo: {},
        photos: [],
        contactInfo: {}
      });
      setActiveStep(0);
      
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <PetBasicInfo formData={formData} setFormData={setFormData} errors={errors} />;
      case 1:
        return <PhotoUpload formData={formData} setFormData={setFormData} />;
      case 2:
        return <ContactInfo formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return (
          <Card shadow="lg" borderRadius="xl">
            <CardBody>
              <VStack spacing={6} textAlign="center">
                <BiCheckCircle style={{ width: '64px', height: '64px', color: '#38a169' }} />
                <Heading size="lg">Xác nhận thông tin</Heading>
                <Text color="gray.600">
                  Vui lòng kiểm tra lại thông tin trước khi đăng tin
                </Text>
                
                <VStack spacing={4} align="start" w="full" maxW="md">
                  <Text><strong>Thú cưng:</strong> {formData.petInfo?.name || 'Chưa có tên'} - {formData.petInfo?.type}</Text>
                  <Text><strong>Người liên hệ:</strong> {formData.contactInfo?.name}</Text>
                  <Text><strong>Điện thoại:</strong> {formData.contactInfo?.phone}</Text>
                  <Text><strong>Số ảnh:</strong> {formData.photos?.length || 0} ảnh</Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
              Đăng tin tìm nhà cho thú cưng
            </Heading>
            <Text color="gray.600" maxW="600px">
              Giúp những bé thú cưng tìm được ngôi nhà ấm áp và yêu thương
            </Text>
          </VStack>

          {/* Progress Stepper */}
          <Box w="full" maxW="2xl">
            <Stepper index={activeStep} colorScheme="blue">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            
            <Progress 
              value={(activeStep / (steps.length - 1)) * 100} 
              colorScheme="blue" 
              size="sm" 
              borderRadius="full"
              mt={4}
            />
          </Box>

          {/* Form Content */}
          <Box w="full">
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <HStack spacing={4} justify="center">
            <Button
              onClick={handlePrevious}
              isDisabled={activeStep === 0}
              variant="outline"
              size="lg"
            >
              Quay lại
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                colorScheme="blue"
                size="lg"
                minW="120px"
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                colorScheme="green"
                size="lg"
                minW="120px"
                isLoading={isSubmitting}
                loadingText="Đang đăng tin..."
              >
                Đăng tin
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
      <ScrollToTopButton />
    </Box>
  );
};

export default FindHome;