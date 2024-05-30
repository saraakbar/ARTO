import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar2';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Makeup = () => {
  const navigate = useNavigate();
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
        const categories = ['All', 'Lip Color', ...response.data.filter(category => category !== 'Lip Color')];
        setFilterOptions(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:8000/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFav(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const handleFilterChange = (filter) => {
    setCurrentPage(1);
    setSelectedFilters(filter);
  };

  const favSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      theme: "dark",
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleFavorite = async (productId) => {
    try {
      const response = await axios.patch('http://localhost:8000/favorite', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { productId: productId },
      });
      favSuccess(response.data.message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page: currentPage, filters: selectedFilters },
        });
        const productsWithDefaultColor = response.data.products.map(product => ({
          ...product,
          selectedColor: product.color && product.color.length > 0 ? product.color[0] : null,
        }));
        setProducts(productsWithDefaultColor);
        setTotalPages(Math.ceil(response.data.total / 10));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, selectedFilters]);

  const handleColorSelection = (productId, color) => {
    setProducts(products => products.map(product =>
      product._id === productId ? { ...product, selectedColor: color } : product
    ));
  };

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
            {Products.map((product) => {
              const isColorSelected = product.color && product.color.includes(product.selectedColor);
              return (
                <div key={product._id} className="w-52 h-[26rem] rounded-lg bg-white overflow-hidden shadow-lg relative">
                  <button
                    className={`mt-1 ml-1 p-1 ${isColorSelected ? 'bg-gradient-to-r from-yellow-400 to-amber-600' : 'bg-gray-400 cursor-not-allowed'} text-white text-sm font-bold rounded-md`}
                    onClick={() => isColorSelected && navigate('/camera', { state: { color: product.selectedColor } })}
                    disabled={!isColorSelected} // Disable the button if no color is selected
                  >
                    Try-On
                  </button>
                  {/* Favorite heart */}
                  <div
                    className="absolute top-1 right-1 mr-2 cursor-pointer"
                    onClick={() => toggleFavorite(product._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} size="lg" color={fav.includes(product._id) ? 'red' : 'black'} />
                  </div>
                  {/* Product image */}
                  <img className="p-4 w-full h-60 object-contain object-center" src={product.img} alt={product.name} />
                  {/* Color options */}
                  <div className="flex justify-center space-x-2 mt-2">
                    {product.color && product.color.length > 0 ? (
                      product.color.map((color, index) => (
                        <div
                          key={index}
                          className={`w-5 h-5 rounded-full cursor-pointer flex items-center justify-center  ${product.selectedColor === color ? 'border-2 border-black' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelection(product._id, color)} // Set selected color
                        >
                          <FontAwesomeIcon icon={faCheck} size="xs" color={product.selectedColor === color ? 'black' : color} />
                        </div>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <h3 className="px-2 text-lg text-center font-semibold mt-4 mb-2">{product.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Makeup;
