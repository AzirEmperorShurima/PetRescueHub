import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
import { BiUpload, BiX, BiHeart, BiCheckCircle, BiCamera, BiUser, BiPlus } from 'react-icons/bi';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import { useAuth } from '../../components/contexts/AuthContext';

// Constants for pet types
const petTypes = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'bird', label: 'Chim' },
  { value: 'fish', label: 'Cá' },
  { value: 'hamster', label: 'Chuột Hamster' },
  { value: 'rabbit', label: 'Thỏ' },
  { value: 'turtle', label: 'Rùa' },
  { value: 'reptile', label: 'Bò sát' },
  { value: 'other', label: 'Khác' }
];

const petTypeMapping = {
  dog: 'Chó',
  cat: 'Mèo',
  bird: 'Chim',
  fish: 'Cá',
  hamster: 'Chuột Hamster',
  rabbit: 'Thỏ',
  turtle: 'Rùa',
  reptile: 'Bò sát',
  other: 'Khác'
};

// Pet Basic Info Component
const PetBasicInfo = React.memo(({ formData, setFormData, errors }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      petInfo: {
        ...prev.petInfo,
        [field]: value
      }
    }));
  }, [setFormData]);

  // Memoize pet types options
  const petTypeOptions = useMemo(() => 
    petTypes.map(type => (
      <option key={type.value} value={type.value}>{type.label}</option>
    )), 
  []);

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
            {/* Pet Name */}
            <FormControl isRequired>
              <FormLabel>Tên thú cưng</FormLabel>
              <Input
                placeholder="Nhập tên thú cưng"
                value={formData.petInfo.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isInvalid={errors.name}
              />
            </FormControl>

            {/* Pet Type (breed) */}
            <FormControl isRequired>
              <FormLabel>Loại thú cưng</FormLabel>
              <Select
                placeholder="Chọn loại thú cưng"
                value={formData.petInfo.breed || ''}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                isInvalid={errors.breed}
              >
                {petTypeOptions}
              </Select>
              {formData.petInfo.breed === 'other' && (
                <Input
                  mt={2}
                  placeholder="Nhập loại thú ng khác"
                  value={formData.petInfo.customBreed || ''}
                  onChange={(e) => handleInputChange('customBreed', e.target.value)}
                  isInvalid={errors.customBreed}
                />
              )}
            </FormControl>

            {/* Breed Name */}
            <FormControl isRequired>
              <FormLabel>Tên giống chi tiết</FormLabel>
              <Input
                placeholder="VD: Chó Cỏ, Persian, v.v."
                value={formData.petInfo.breedName || ''}
                onChange={(e) => handleInputChange('breedName', e.target.value)}
                isInvalid={errors.breedName}
              />
            </FormControl>

            {/* Gender */}
            <FormControl isRequired>
              <FormLabel>Giới tính</FormLabel>
              <RadioGroup
                value={formData.petInfo.gender || 'unknown'}
                onChange={(value) => handleInputChange('gender', value)}
              >
                <HStack spacing={6}>
                  <Radio value="male">Đực</Radio>
                  <Radio value="female">Cái</Radio>
                  <Radio value="unknown">Không rõ</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* Date of Birth */}
            <FormControl>
              <FormLabel>
                Ngày sinh
                <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                  (Không bắt buộc)
                </Text>
              </FormLabel>
              <Input
                type="date"
                value={formData.petInfo.petDob || ''}
                onChange={(e) => {
                  handleInputChange('petDob', e.target.value);
                  // Tự động tính tuổi khi chọn ngày sinh
                  if (e.target.value) {
                    const birthDate = new Date(e.target.value);
                    const today = new Date();
                    const ageInYears = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
                    handleInputChange('age', ageInYears);
                  } else {
                    // Reset tuổi về 0 nếu xóa ngày sinh
                    handleInputChange('age', 0);
                  }
                }}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormControl>

            {/* Age - Readonly, calculated from DOB */}
            <FormControl>
              <FormLabel>Tuổi (năm)</FormLabel>
              <Input
                type="number"
                min="0"
                value={formData.petInfo.age || 0}
                readOnly
                isDisabled
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Tuổi được tính tự động từ ngày sinh
              </Text>
            </FormControl>

            {/* Weight and Height */}
            <FormControl>
              <FormLabel>Cân nặng (kg)</FormLabel>
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="Nhập cân nặng"
                value={formData.petInfo.weight || ''}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Chiều cao (cm)</FormLabel>
              <Input
                type="number"
                min="0"
                placeholder="Nhập chiều cao"
                value={formData.petInfo.height || ''}
                onChange={(e) => handleInputChange('height', Number(e.target.value))}
              />
            </FormControl>

            {/* Microchip ID */}
            <FormControl>
              <FormLabel>Mã số chip (nếu có)</FormLabel>
              <Input
                placeholder="Nhập mã số chip"
                value={formData.petInfo.microchipId || ''}
                onChange={(e) => handleInputChange('microchipId', e.target.value)}
              />
            </FormControl>

            {/* Pet State */}
            <FormControl isRequired>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                value={formData.petInfo.petState || 'NotReadyToAdopt'}
                onChange={(e) => handleInputChange('petState', e.target.value)}
                isInvalid={errors.petState}
              >
                <option value="ReadyToAdopt">Sẵn sàng cho nhận nuôi</option>
                <option value="NotReadyToAdopt">Chưa sẵn sàng cho nhận nuôi</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          {/* Pet Details */}
          <FormControl isRequired>
            <FormLabel>Mô tả chi tiết</FormLabel>
            <Textarea
              placeholder="Mô tả tính cách, sở thích, tình trạng sức khỏe, hoàn cảnh tìm thấy..."
              value={formData.petInfo.petDetails || ''}
              onChange={(e) => handleInputChange('petDetails', e.target.value)}
              minH="120px"
              isInvalid={errors.petDetails}
            />
          </FormControl>

          {/* Health Info */}
          <FormControl>
            <VStack align="start" spacing={3}>
              {/* Reproductive Status */}
              <FormControl isRequired>
                <FormLabel>Tình trạng sinh sản</FormLabel>
                <RadioGroup
                  value={formData.petInfo.reproductiveStatus || 'not neutered'}
                  onChange={(value) => handleInputChange('reproductiveStatus', value)}
                >
                  <HStack spacing={6}>
                    <Radio value="neutered">Đã triệt sản</Radio>
                    <Radio value="not neutered">Chưa triệt sản</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              {/* Vaccination Status */}
              <Box w="full">
                <FormLabel>Thông tin tiêm chủng</FormLabel>
                <VStack align="start" w="full" spacing={4}>
                  {(formData.petInfo.vaccinationStatus || []).map((vaccine, index) => (
                    <HStack key={index} w="full" spacing={4}>
                      <Input
                        placeholder="Tên vaccine"
                        value={vaccine.vaccineName || ''}
                        onChange={(e) => {
                          const newVaccines = [...(formData.petInfo.vaccinationStatus || [])];
                          newVaccines[index] = { ...newVaccines[index], vaccineName: e.target.value };
                          handleInputChange('vaccinationStatus', newVaccines);
                        }}
                      />
                      <Input
                        type="date"
                        value={vaccine.vaccinationDate || ''}
                        onChange={(e) => {
                          const newVaccines = [...(formData.petInfo.vaccinationStatus || [])];
                          newVaccines[index] = { ...newVaccines[index], vaccinationDate: e.target.value };
                          handleInputChange('vaccinationStatus', newVaccines);
                        }}
                      />
                      <Input
                        placeholder="Mã vaccine"
                        value={vaccine.vaccinationCode || ''}
                        onChange={(e) => {
                          const newVaccines = [...(formData.petInfo.vaccinationStatus || [])];
                          newVaccines[index] = { ...newVaccines[index], vaccinationCode: e.target.value };
                          handleInputChange('vaccinationStatus', newVaccines);
                        }}
                      />
                      <IconButton
                        icon={<BiX />}
                        onClick={() => {
                          const newVaccines = formData.petInfo.vaccinationStatus.filter((_, i) => i !== index);
                          handleInputChange('vaccinationStatus', newVaccines);
                        }}
                      />
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<BiPlus />}
                    onClick={() => {
                      const newVaccines = [...(formData.petInfo.vaccinationStatus || []), {
                        vaccineName: '',
                        vaccinationDate: '',
                        vaccinationCode: ''
                      }];
                      handleInputChange('vaccinationStatus', newVaccines);
                    }}
                  >
                    Thêm thông tin vaccine
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </FormControl>
        </VStack>
      </CardBody>
    </Card>
  );
});

// Photo Upload Component
const PhotoUpload = React.memo(({ formData, setFormData }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  const handleImageUpload = useCallback((e) => {
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
  }, [setFormData]);

  const removeImage = useCallback((imageId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(img => img.id !== imageId)
    }));
  }, [setFormData]);

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
});

// Contact Information Component
const ContactInfo = React.memo(({ formData, setFormData, errors }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  }, [setFormData]);

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
});

// Main Form Component
const FindHome = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const formRef = React.useRef(null);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    petInfo: {},
    photos: [],
    contactInfo: {}
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize steps array
  const steps = useMemo(() => [
    { title: 'Thông tin thú cưng', description: 'Chi tiết cơ bản' },
    { title: 'Hình ảnh', description: 'Tải lên ảnh' },
    { title: 'Thông tin liên hệ', description: 'Cách liên lạc' },
    { title: 'Xác nhận', description: 'Hoàn tất' }
  ], []);

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Xử lý cuộn trang khi chuyển bước
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [activeStep]);

  // Memoize validation function
  const validateForm = useCallback(() => {
    const requiredFields = {
      petInfo: {
        name: (val) => !val?.trim(),
        breed: (val) => !val,
        customBreed: (val, data) => data.breed === 'other' && !val?.trim(),
        breedName: (val) => !val?.trim(),
        gender: (val) => !val,
        petDetails: (val) => !val?.trim(),
        petState: (val) => !val
      },
      contactInfo: {
        name: (val) => !val?.trim(),
        phone: (val) => !val?.trim(),
        location: (val) => !val
      }
    };

    const newErrors = Object.entries(requiredFields).reduce((errors, [section, fields]) => {
      Object.entries(fields).forEach(([field, validator]) => {
        const value = formData[section]?.[field];
        const isInvalid = validator(value, formData[section]);
        if (isInvalid) {
          errors[section === 'petInfo' ? field : `contact${field.charAt(0).toUpperCase() + field.slice(1)}`] = true;
        }
      });
      return errors;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  // Memoize handlers
  const handleNext = useCallback(() => {
    if (activeStep === 0) {
      const hasRequiredInfo = formData.petInfo?.name && 
                            formData.petInfo?.breed && 
                            formData.petInfo?.breedName &&
                            formData.petInfo?.gender &&
                            formData.petInfo?.petDetails &&
                            formData.petInfo?.petState;
                            
      if (!hasRequiredInfo) {
        toast({
          title: "Vui lòng nhập đầy đủ thông tin",
          description: "Các trường có dấu * là bắt buộc",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (formData.petInfo?.breed === 'Khác' && !formData.petInfo?.customBreed?.trim()) {
        toast({
          title: "Vui lòng nhập loại thú cưng khác",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    if (activeStep === 2 && !validateForm()) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin liên hệ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [activeStep, formData, steps.length, validateForm, toast]);

  const handlePrevious = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
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
      const petData = new FormData();
      // Thêm các trường cơ bản
      petData.append('name', formData.petInfo.name);
      petData.append('breed', formData.petInfo.breed);
      petData.append('breedName', formData.petInfo.breedName);
      petData.append('gender', formData.petInfo.gender);
      petData.append('petDetails', formData.petInfo.petDetails);
      petData.append('reproductiveStatus', formData.petInfo.reproductiveStatus || 'not neutered');
      
      // Xử lý petState
      const petState = formData.petInfo.petState === 'ReadyToAdopt' ? 'ReadyToAdopt' : 'NotReadyToAdopt';
      petData.append('petState', petState);

      // Thêm các trường tùy chọn nếu có giá trị
      if (formData.petInfo.petDob) {
        petData.append('petDob', formData.petInfo.petDob);
      }
      if (formData.petInfo.age) {
        petData.append('age', Number(formData.petInfo.age));
      }
      if (formData.petInfo.weight) {
        petData.append('weight', Number(formData.petInfo.weight));
      }
      if (formData.petInfo.height) {
        petData.append('height', Number(formData.petInfo.height));
      }
      if (formData.petInfo.microchipId) {
        petData.append('microchipId', formData.petInfo.microchipId);
      }

      // Xử lý vaccination status
      const vaccinationStatus = formData.petInfo.vaccinationStatus || [];
      vaccinationStatus.forEach((vaccine, index) => {
        if (vaccine.vaccineName) {
          petData.append(`vaccinationStatus[${index}][vaccineName]`, vaccine.vaccineName);
        }
        if (vaccine.vaccinationDate) {
          petData.append(`vaccinationStatus[${index}][vaccinationDate]`, vaccine.vaccinationDate);
        }
        if (vaccine.vaccinationCode) {
          petData.append(`vaccinationStatus[${index}][vaccinationCode]`, vaccine.vaccinationCode);
        }
      });

      // Thêm các hình ảnh
      if (formData.photos && formData.photos.length > 0) {
        petData.append('avatar', formData.photos[0].file);
        
        formData.photos.slice(1).forEach((photo) => {
          petData.append('petAlbum', photo.file);
        });
      }

      const response = await apiService.pets.profile.create(petData);
      
      toast({
        title: "Đăng tin thành công!",
        description: "Thông tin thú cưng đã được đăng tải và đang chờ duyệt",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData({
        petInfo: {},
        photos: [],
        contactInfo: {}
      });
      setActiveStep(0);

      navigate('/adopt', { 
        state: { 
          newPetCreated: true,
          petId: response.data._id 
        }
      });
      
    } catch (error) {
      console.error('Error submitting pet profile:', error);
      toast({
        title: "Có lỗi xảy ra",
        description: error.response?.data?.message || "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData, toast, navigate, setActiveStep]);

  // Thay đổi từ useMemo thành useCallback
  const renderStepContent = useCallback(() => {
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
                  <Text>
                    <strong>Thú cưng:</strong> {formData.petInfo?.name || 'Chưa có tên'} - {petTypeMapping[formData.petInfo?.breed] || ''}
                  </Text>
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
  }, [activeStep, formData, errors]);

  return (
    <Box bg={bgColor} minH="100vh" py={8} ref={formRef}>
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
                disabled={!user}
              >
                {user ? 'Đăng tin' : 'Đăng nhập để đăng tin'}
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