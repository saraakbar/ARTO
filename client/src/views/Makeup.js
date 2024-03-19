import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar2';

const Makeup = () => {
  const [Products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [stream, setStream] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const token = JSON.parse(localStorage.getItem('token'));
  const username = localStorage.getItem('username');

  const handleFilterChange = (filter) => {
    setSelectedFilters(filter === 'All' ? [] : [filter]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
  
        const categories = [...new Set(response.data.map(product => product.category))];
        setFilterOptions(['All', ...categories]);
  
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleCamera = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userMediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const filteredProducts = Products.filter((product) => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.includes(product.category);
  });

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
          {/* Product grid */}
          <h2 className="text-3xl py-2 font-semibold mb-6 text-center">{selectedFilters} Catalog</h2>
          <div className="grid grid-cols-3 gap-y-8 gap-x-2">
            {filteredProducts.map((Products) => (
              <div key={Products._id} className="w-52 h-[26rem] rounded-lg bg-white overflow-hidden shadow-lg relative">
                <button
                  className="mt-1 ml-1 p-1 bg-gradient-to-r from-yellow-400 to-red-600 text-white text-sm font-bold rounded-md"
                  onClick={handleCamera}
                >
                  Try-On
                </button>
                {/* Product image */}
                <img className="p-4 w-full h-60 object-contain object-center" src={Products.img} alt={Products.name} />
                <h3 className="px-2 text-lg text-center font-semibold mt-4 mb-2">{Products.name}</h3>
                <button className="mt-2 absolute bottom-0 w-full justify-center bg-zinc-700 hover:bg-moonstone text-white text-center font-semibold py-2 rounded-b-lg">
                  Product Details
                </button>
                </div>
            ))}
          </div>
        </div>
      </div>
      {/* Video stream */}
      {stream && (
        <div className="fixed inset-0 flex justify-center items-center bg-black">
          <div className="relative">
            <button
              className="absolute top-4 right-4 px-3 py-2 bg-white text-black font-bold rounded-full"
              onClick={handleClose}
            >
              Close
            </button>
            <video className="max-h-full max-w-full" autoPlay muted playsInline ref={(video) => { if (video) video.srcObject = stream; }} />
          </div>
        </div>
      )}
    </>
  );
};

export default Makeup;
