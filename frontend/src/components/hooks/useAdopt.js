import { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/api.service';

export const useAdopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    breed: '',
    gender: '',
    age: '',
    reproductiveStatus: '',
    petState: 'ReadyToAdopt' // Mặc định lấy pets sẵn sàng nhận nuôi
  });
  const [sortBy, setSortBy] = useState('newest');
  const ITEMS_PER_PAGE = 20; // Số lượng items mỗi lần fetch

  const fetchPets = async (pageNumber = 1, shouldAppend = false) => {
    setLoading(true);
    try {
      // Chỉ gửi các filters có giá trị
      const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Thêm params phân trang
      const params = {
        ...validFilters,
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
        sort: sortBy === 'newest' ? '-createdAt' : 'createdAt'
      };

      const response = await apiService.pets.profile.getAll(params);
      
      if (!response || !response.data) {
        throw new Error('Không nhận được dữ liệu từ API');
      }

      // Map dữ liệu từ API để phù hợp với PetCard
      const mappedPets = response.data.pets.data.map(pet => ({
        id: pet._id,
        name: pet.name || 'Chưa đặt tên',
        breed: pet.breed || 'Không xác định',
        breedName: pet.breedName,
        image: pet.avatar || '/images/default-pet.jpg',
        status: pet.petState === 'ReadyToAdopt' ? 'available' : 
               pet.petState === 'Adopted' ? 'adopted' : 'pending',
        gender: pet.gender || 'Không xác định',
        age: pet.age || 'Không xác định',
        weight: pet.weight || 'Không xác định',
        height: pet.height || 'Không xác định',
        description: pet.petDetails || 'Chưa có mô tả',
        reproductiveStatus: pet.reproductiveStatus || 'Không xác định',
        vaccinationStatus: pet.vaccinationStatus || [],
        microchipId: pet.microchipId || 'Không có',
        location: pet.location || 'Không xác định',
        specialNeeds: pet.specialNeeds || false
      }));

      // Cập nhật state dựa vào shouldAppend
      if (shouldAppend) {
        setPets(prev => [...prev, ...mappedPets]);
      } else {
        setPets(mappedPets);
      }

      // Cập nhật hasMore dựa vào số lượng data trả về
      setHasMore(mappedPets.length === ITEMS_PER_PAGE);
      setError(null);
      return mappedPets;
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError(
        error.response?.data?.message || 
        error.message ||
        'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'
      );
      if (!shouldAppend) {
        setPets([]);
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Thêm function để lấy chi tiết pet với useCallback
  const getPetById = useCallback(async (id) => {
    try {
      const response = await apiService.pets.profile.getById(id);
      
      if (!response || !response.data) {
        throw new Error('Không nhận được dữ liệu từ API');
      }

      // Map dữ liệu từ API
      const pet = response.data;
      return {
        id: pet._id,
        name: pet.name || 'Chưa đặt tên',
        breed: pet.breed || 'Không xác định',
        breedName: pet.breedName,
        image: pet.avatar,
        album: pet.petAlbum || [],
        status: pet.petState === 'ReadyToAdopt' ? 'available' : 
                pet.petState === 'Adopted' ? 'adopted' : 'pending',
        gender: pet.gender || 'unknown',
        age: pet.age,
        weight: pet.weight,
        height: pet.height,
        description: pet.petDetails,
        reproductiveStatus: pet.reproductiveStatus,
        vaccinationStatus: pet.vaccinationStatus || [],
        microchipId: pet.microchipId,
        location: pet.location,
        specialNeeds: pet.specialNeeds,
        contactInfo: pet.contactInfo || {}
      };
    } catch (error) {
      console.error('Error fetching pet details:', error);
      throw new Error(
        error.response?.data?.message || 
        'Có lỗi xảy ra khi tải thông tin thú cưng'
      );
    }
  }, []); // Empty dependency array vì không phụ thuộc vào state nào

  // Load more pets for infinite scroll
  const loadMorePets = useCallback(async () => {
    const nextPage = page + 1;
    const newPets = await fetchPets(nextPage, true);
    if (newPets.length > 0) {
      setPage(nextPage);
    }
    return newPets;
  }, [page]);

  // Refresh pets list
  const refreshPets = useCallback(async () => {
    setPage(1);
    await fetchPets(1, false);
  }, []);

  // Initial fetch and when filters change
  useEffect(() => {
    setPage(1);
    fetchPets(1, false);
  }, [filters, sortBy]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      breed: '',
      gender: '',
      age: '',
      reproductiveStatus: '',
      petState: 'ReadyToAdopt'
    });
    setSortBy('newest');
    setPage(1);
  };

  return {
    pets,
    loading,
    error,
    searchTerm,
    filters,
    sortBy,
    page,
    hasMore,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    resetFilters,
    refreshPets,
    loadMorePets,
    getPetById
  };
};