import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

export const useAdopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    breed: '',
    gender: '',
    age: '',
    reproductiveStatus: '',
    petState: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm,
        sort: sortBy
      };

      console.log('Calling API with params:', params); // Debug log

      const response = await apiService.pets.profile.getAll(params);
      
      console.log('API Response:', response); // Debug log

      if (!response || !response.data) {
        throw new Error('Không nhận được dữ liệu từ API');
      }

      // Map dữ liệu từ API để phù hợp với PetCard
      const mappedPets = response.data.map(pet => ({
        id: pet._id || pet.id,
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

      setPets(mappedPets);
      setError(null);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError(
        error.response?.data?.message || 
        error.message ||
        'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'
      );
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [searchTerm, filters, sortBy]);

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
    setFilters({
      breed: '',
      gender: '',
      age: '',
      reproductiveStatus: '',
      petState: ''
    });
    setSearchTerm('');
    setSortBy('newest');
  };

  return {
    pets,
    loading,
    error,
    searchTerm,
    filters,
    sortBy,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    resetFilters,
    refetch: fetchPets
  };
};