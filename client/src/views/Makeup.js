import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar2';
import { useNavigate } from "react-router-dom"
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Makeup = () => {
  const navigate = useNavigate()
  const [Products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fav, setFav] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const token = JSON.parse(localStorage.getItem('token'));
  const username = localStorage.getItem('username');
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categories = ['All', ...response.data];
        setFilterOptions(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:8000/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFav(response.data);
      }
      catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
  
    fetchFavorites();
    fetchCategories();
  } ,[]);

  const handleFilterChange = (filter) => {
    setCurrentPage(1);
    setSelectedFilters(filter);
  };

  const favSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      theme: "dark",
    })
  }


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleFavorite = async (productId) => {
    try {
      const response = await axios.patch('http://localhost:8000/favorite', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { productId: productId }
      });
      favSuccess(response.data.message);

    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page: currentPage, filters: selectedFilters },
        });
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / 10));

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, selectedFilters]);

  return (
    <>
      <Navbar uname={username} />
      <div className="container flex min-h-screen bg-light-orange relative">
        <div className="w-1/3 flex justify-center">
          <div className="w-3/5 mt-24 mb-4 bg-zinc-300 p-4 rounded-lg shadow-lg">
            {/* Filter menu */}
            <h3 className="text-lg font-bold mb-4">Filter by Category</h3>
            <ul className="space-y-2">
              {filterOptions.map((filter) => (
                <li key={filter} className="cursor-pointer hover:rounded-lg hover:px-4 hover:bg-zinc-100">
                  <button
                    className="text-left font-semibold focus:outline-none w-full py-2"
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-3xl py-2 font-semibold mb-6 text-center">{selectedFilters} Catalog</h2>
          <div className="mb-6">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-3 gap-y-8 gap-x-2">
            {Products.map((Products) => (
              <div key={Products._id} className="w-52 h-[28rem] rounded-lg bg-white overflow-hidden shadow-lg relative">
                <button
                  className="mt-1 ml-1 p-1 bg-gradient-to-r from-yellow-400 to-red-600 text-white text-sm font-bold rounded-md"
                  onClick={() => navigate('/camera')}
                >
                  Try-On
                </button>
                {/* Favorite heart */}
                <div
                  className="absolute top-1 right-1 mr-2 cursor-pointer"
                  onClick={() => toggleFavorite(Products._id)}
                >
                  <FontAwesomeIcon icon={faHeart} size="lg" color={fav.includes(Products._id) ? 'red' : 'black'} />
                </div>
                {/* Product image */}
                <img className="p-4 w-full h-60 object-contain object-center" src={Products.img} alt={Products.name} />
                {/* Color options */}
                <div className="flex justify-center space-x-2 mt-2">
                  {Products.color && Products.color.length > 0 ? (
                    Products.color.map((color, index) => (
                      <div key={index} className="w-4 h-4 rounded-full bg-gray-400" style={{ backgroundColor: color }}></div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
                <h3 className="px-2 text-lg text-center font-semibold mt-4 mb-2">{Products.name}</h3>
                <button className="mt-2 absolute bottom-0 w-full justify-center bg-zinc-700 hover:bg-moonstone text-white text-center font-semibold py-2 rounded-b-lg">
                  Product Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Makeup;
