import { useState, useEffect } from 'react';
import { petsMock } from '../../mocks';

export const useAdopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    age: '',
    gender: '',
    size: '',
    breed: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let isMounted = true;
    
    const fetchPets = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await api.get('/pets', { params: { ...filters, search: searchTerm } });
        // setPets(response.data);
        
        // Sử dụng mock data
        setTimeout(() => {
          if (isMounted) {
            setPets(petsMock);
            setLoading(false);
          }
        }, 1000);
      } catch (error) {
        console.error('Error fetching pets:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPets();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    filterPets();
  }, [searchTerm, filters, sortBy]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const filterPets = () => {
    let filteredPets = [...petsMock];
    
    // Áp dụng bộ lọc
    if (filters.type) {
      filteredPets = filteredPets.filter(pet => pet.type === filters.type);
    }
    
    if (filters.age) {
      filteredPets = filteredPets.filter(pet => pet.age === filters.age);
    }
    
    if (filters.gender) {
      filteredPets = filteredPets.filter(pet => pet.gender === filters.gender);
    }
    
    if (filters.size) {
      filteredPets = filteredPets.filter(pet => pet.size === filters.size);
    }
    
    if (filters.breed) {
      filteredPets = filteredPets.filter(pet => pet.breed === filters.breed);
    }
    
    // Áp dụng tìm kiếm
    if (searchTerm) {
      filteredPets = filteredPets.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Áp dụng sắp xếp
    if (sortBy === 'newest') {
      filteredPets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filteredPets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'nameAsc') {
      filteredPets.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'nameDesc') {
      filteredPets.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setPets(filteredPets);
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      age: '',
      gender: '',
      size: '',
      breed: ''
    });
    setSearchTerm('');
    setSortBy('newest');
  };

  return {
    pets,
    loading,
    searchTerm,
    filters,
    sortBy,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    resetFilters
  };
};