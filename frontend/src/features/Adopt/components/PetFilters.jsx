import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  Checkbox,
  CheckboxGroup,
  Stack,
  Badge,
  Divider,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Heading,
  SimpleGrid,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  Switch,
  Flex
} from "@chakra-ui/react";
import { BiSearch, BiRefresh } from "react-icons/bi";

const PetFilters = ({
  filters,
  searchTerm,
  sortBy,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters
}) => {
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Filter options
  const petTypes = [
    { value: 'dog', label: 'Chó', emoji: '🐕' },
    { value: 'cat', label: 'Mèo', emoji: '🐱' },
    { value: 'bird', label: 'Chim', emoji: '🐦' },
    { value: 'rabbit', label: 'Thỏ', emoji: '🐰' },
    { value: 'other', label: 'Khác', emoji: '🐾' }
  ];

  const genders = [
    { value: 'male', label: 'Đực' },
    { value: 'female', label: 'Cái' },
    { value: 'unknown', label: 'Chưa xác định' }
  ];

  const ages = [
    { value: 'puppy', label: 'Con non (0-1 tuổi)' },
    { value: 'young', label: 'Trẻ (1-3 tuổi)' },
    { value: 'adult', label: 'Trưởng thành (3-7 tuổi)' },
    { value: 'senior', label: 'Già (7+ tuổi)' }
  ];

  const sizes = [
    { value: 'small', label: 'Nhỏ (< 10kg)' },
    { value: 'medium', label: 'Trung bình (10-25kg)' },
    { value: 'large', label: 'Lớn (25-40kg)' },
    { value: 'extra-large', label: 'Rất lớn (> 40kg)' }
  ];

  const vaccineStatus = [
    { value: 'vaccinated', label: 'Đã tiêm phòng' },
    { value: 'partial', label: 'Tiêm phòng một phần' },
    { value: 'none', label: 'Chưa tiêm phòng' }
  ];

  const handleFilterChangeWrapper = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count += 1;
    if (filters.type?.length > 0) count += 1;
    if (filters.gender) count += 1;
    if (filters.age?.length > 0) count += 1;
    if (filters.size?.length > 0) count += 1;
    if (filters.vaccinated?.length > 0) count += 1;
    if (filters.specialNeeds) count += 1;
    if (filters.goodWithKids) count += 1;
    if (filters.goodWithPets) count += 1;
    return count;
  };

  return (
    <Card bg={bgColor} shadow="md" borderRadius="xl" position="sticky" top="4">
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <Heading size="md">Bộ lọc</Heading>
            {getActiveFiltersCount() > 0 && (
              <Badge colorScheme="blue" borderRadius="full">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<BiRefresh />}
            onClick={onResetFilters}
            colorScheme="gray"
          >
            Xóa tất cả
          </Button>
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={6} align="stretch">
          {/* Search */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={2}>
              Tìm kiếm
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <BiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Tên thú cưng, mô tả..."
                value={searchTerm}
                onChange={onSearchChange}
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px"
                borderColor={borderColor}
                _focus={{
                  borderColor: 'blue.400',
                  bg: useColorModeValue('white', 'gray.600')
                }}
              />
            </InputGroup>
          </Box>

          <Divider />

          {/* Pet Type */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
              Loại thú cưng
            </FormLabel>
            <CheckboxGroup
              value={filters.type || []}
              onChange={(value) => handleFilterChangeWrapper('type', value)}
            >
              <SimpleGrid columns={1} spacing={2}>
                {petTypes.map((type) => (
                  <Checkbox
                    key={type.value}
                    value={type.value}
                    colorScheme="blue"
                    size="md"
                  >
                    <HStack spacing={2}>
                      <Text>{type.emoji}</Text>
                      <Text>{type.label}</Text>
                    </HStack>
                  </Checkbox>
                ))}
              </SimpleGrid>
            </CheckboxGroup>
          </Box>

          <Divider />

          {/* Gender */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={2}>
              Giới tính
            </FormLabel>
            <Select
              placeholder="Chọn giới tính"
              value={filters.gender || ''}
              onChange={(e) => handleFilterChangeWrapper('gender', e.target.value)}
              bg={useColorModeValue('gray.50', 'gray.700')}
              border="1px"
              borderColor={borderColor}
            >
              {genders.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </Select>
          </Box>

          <Divider />

          {/* Age */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
              Độ tuổi
            </FormLabel>
            <CheckboxGroup
              value={filters.age || []}
              onChange={(value) => handleFilterChangeWrapper('age', value)}
            >
              <Stack spacing={2}>
                {ages.map((age) => (
                  <Checkbox
                    key={age.value}
                    value={age.value}
                    colorScheme="purple"
                    size="md"
                  >
                    {age.label}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Box>

          <Divider />

          {/* Size */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
              Kích thước
            </FormLabel>
            <CheckboxGroup
              value={filters.size || []}
              onChange={(value) => handleFilterChangeWrapper('size', value)}
            >
              <Stack spacing={2}>
                {sizes.map((size) => (
                  <Checkbox
                    key={size.value}
                    value={size.value}
                    colorScheme="green"
                    size="md"
                  >
                    {size.label}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Box>

          <Divider />

          {/* Vaccination Status */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
              Tình trạng tiêm phòng
            </FormLabel>
            <CheckboxGroup
              value={filters.vaccinated || []}
              onChange={(value) => handleFilterChangeWrapper('vaccinated', value)}
            >
              <Stack spacing={2}>
                {vaccineStatus.map((status) => (
                  <Checkbox
                    key={status.value}
                    value={status.value}
                    colorScheme="teal"
                    size="md"
                  >
                    {status.label}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Box>

          <Divider />

          {/* Special Characteristics */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
              Đặc điểm đặc biệt
            </FormLabel>
            <VStack spacing={3} align="stretch">
              <FormControl display="flex" alignItems="center">
                <Switch
                  id="special-needs"
                  colorScheme="orange"
                  isChecked={filters.specialNeeds || false}
                  onChange={(e) => handleFilterChangeWrapper('specialNeeds', e.target.checked)}
                />
                <FormLabel htmlFor="special-needs" ml={3} mb={0} fontSize="sm">
                  Cần chăm sóc đặc biệt
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch
                  id="good-with-kids"
                  colorScheme="pink"
                  isChecked={filters.goodWithKids || false}
                  onChange={(e) => handleFilterChangeWrapper('goodWithKids', e.target.checked)}
                />
                <FormLabel htmlFor="good-with-kids" ml={3} mb={0} fontSize="sm">
                  Thân thiện với trẻ em
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch
                  id="good-with-pets"
                  colorScheme="cyan"
                  isChecked={filters.goodWithPets || false}
                  onChange={(e) => handleFilterChangeWrapper('goodWithPets', e.target.checked)}
                />
                <FormLabel htmlFor="good-with-pets" ml={3} mb={0} fontSize="sm">
                  Thân thiện với thú cưng khác
                </FormLabel>
              </FormControl>
            </VStack>
          </Box>

          <Divider />

          {/* Sort By */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={2}>
              Sắp xếp theo
            </FormLabel>
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              bg={useColorModeValue('gray.50', 'gray.700')}
              border="1px"
              borderColor={borderColor}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="age-young">Trẻ nhất</option>
              <option value="age-old">Lớn tuổi nhất</option>
            </Select>
          </Box>

          {/* Active Filters Summary */}
          {getActiveFiltersCount() > 0 && (
            <>
              <Divider />
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={2} color={textSecondary}>
                  Bộ lọc đang áp dụng ({getActiveFiltersCount()})
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {searchTerm && (
                    <Badge colorScheme="blue" variant="subtle">
                      Tìm kiếm: "{searchTerm}"
                    </Badge>
                  )}
                  {filters.type?.length > 0 && (
                    <Badge colorScheme="blue" variant="subtle">
                      Loại: {filters.type.length}
                    </Badge>
                  )}
                  {filters.gender && (
                    <Badge colorScheme="purple" variant="subtle">
                      Giới tính
                    </Badge>
                  )}
                  {filters.age?.length > 0 && (
                    <Badge colorScheme="purple" variant="subtle">
                      Tuổi: {filters.age.length}
                    </Badge>
                  )}
                  {filters.size?.length > 0 && (
                    <Badge colorScheme="green" variant="subtle">
                      Kích thước: {filters.size.length}
                    </Badge>
                  )}
                  {filters.specialNeeds && (
                    <Badge colorScheme="orange" variant="subtle">
                      Chăm sóc đặc biệt
                    </Badge>
                  )}
                  {filters.goodWithKids && (
                    <Badge colorScheme="pink" variant="subtle">
                      Thân thiện trẻ em
                    </Badge>
                  )}
                  {filters.goodWithPets && (
                    <Badge colorScheme="cyan" variant="subtle">
                      Thân thiện thú cưng
                    </Badge>
                  )}
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default PetFilters;