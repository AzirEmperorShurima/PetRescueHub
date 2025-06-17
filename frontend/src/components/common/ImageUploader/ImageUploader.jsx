import React from 'react';
import { 
  Box, 
  IconButton, 
  Text, 
  Button, 
  FormLabel,
  Flex,
  Image,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

/**
 * Component tải lên và hiển thị hình ảnh với chức năng xóa
 * 
 * @param {Object} props - Props của component
 * @param {Array} props.images - Mảng các đối tượng File hoặc URL string của ảnh
 * @param {Array} props.previews - Mảng các URL preview của ảnh
 * @param {Function} props.onUpload - Hàm xử lý khi tải ảnh lên
 * @param {Function} props.onRemove - Hàm xử lý khi xóa ảnh
 * @param {number} props.maxImages - Số lượng ảnh tối đa được phép tải lên (mặc định: 5)
 * @param {string} props.label - Nhãn hiển thị (mặc định: "Hình ảnh")
 * @param {boolean} props.required - Có bắt buộc tải ảnh lên không (mặc định: false)
 * @param {string} props.acceptTypes - Các loại file được chấp nhận (mặc định: "image/*")
 */
const ImageUploader = ({
  images = [],
  previews = [],
  onUpload,
  onRemove,
  maxImages = 5,
  label = "",
  required = false,
  acceptTypes = "image/*"
}) => {
  const toast = useToast();
  
  // Color mode values
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');
  const removeButtonBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.6)');
  const removeButtonHoverBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(0, 0, 0, 0.8)');

  const handleImageChange = (e) => {
    if (onUpload && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Kiểm tra số lượng ảnh tối đa
      if (images.length + files.length > maxImages) {
        toast({
          title: 'Vượt quá giới hạn',
          description: `Chỉ được tải lên tối đa ${maxImages} ảnh`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      onUpload(files);
    }
  };

  const handleRemoveImage = (index) => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <Box mb={5}>
      <FormLabel mb={3} fontSize="md" fontWeight="medium">
        {label} 
        {required && (
          <Text as="span" color="red.500" ml={1}>
            *
          </Text>
        )}
      </FormLabel>
      
      <Flex
        flexWrap="wrap"
        gap={3}
        mb={3}
      >
        {previews.map((preview, index) => (
          <Box
            key={index}
            position="relative"
            w="100px"
            h="100px"
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Image
              src={preview}
              alt={`Ảnh ${index + 1}`}
              w="full"
              h="full"
              objectFit="cover"
            />
            <IconButton
              icon={<DeleteIcon />}
              position="absolute"
              top={1}
              right={1}
              size="xs"
              bg={removeButtonBg}
              _hover={{ 
                bg: removeButtonHoverBg,
                color: 'red.500'
              }}
              onClick={() => handleRemoveImage(index)}
              borderRadius="sm"
            />
          </Box>
        ))}
        
        {images.length < maxImages && (
          <Button
            as="label"
            leftIcon={<AddIcon />}
            variant="outline"
            w="100px"
            h="100px"
            borderStyle="dashed"
            borderWidth="2px"
            borderColor={borderColor}
            bg={bgColor}
            _hover={{ 
              bg: hoverBgColor,
              borderColor: 'blue.300'
            }}
            cursor="pointer"
            display="flex"
            flexDirection="column"
            fontSize="sm"
            fontWeight="normal"
          >
            Tải lên
            <input
              type="file"
              hidden
              accept={acceptTypes}
              onChange={handleImageChange}
              multiple
            />
          </Button>
        )}
      </Flex>
      
      <Text fontSize="sm" color="gray.500">
        {`Tối đa ${maxImages} ảnh. ${previews.length}/${maxImages} đã tải lên.`}
      </Text>
    </Box>
  );
};

export default ImageUploader;