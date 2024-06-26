import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Favorites = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const username = localStorage.getItem('username');
    const [fav, setFavorites] = useState([]);

    const serverSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            theme: "dark",
        });
    };

    const serverError = (message) => {
        toast.error(message, {
            position: "top-right",
            theme: "dark",
        });
    };

    const toggleFavorite = async (productId) => {
        try {
            const response = await axios.patch('http://localhost:8000/favorite', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { productId: productId }
            });
            serverSuccess(response.data.message);
        } catch (error) {
            serverError(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:8000/favDetails', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFavorites(response.data.favorites);
            }
            catch (error) {
                serverError(error.response.data.message);
            }
        }

        fetchFavorites();
    }, []);


    return (
        <>
            <Navbar uname={username} />
            <div className="container flex min-h-screen bg-light-orange relative justify-center">
                <div className='p-4'>
                    <h2 className="text-3xl py-2 font-semibold mb-6 text-center">Favorites</h2>
                    {/* Product grid */}
                    {fav.length > 0 ? (
                        <div className="grid grid-cols-4 gap-y-8 gap-x-8 justify-items-center">
                            {fav.map((product) => (
                                <div key={product._id} className="w-52 h-[26rem] rounded-lg bg-white overflow-hidden shadow-lg relative">
                                    {/* Favorite heart */}
                                    <div
                                        className="absolute top-1 right-1 mr-2 cursor-pointer"
                                        onClick={() => toggleFavorite(product._id)}
                                    >
                                        <FontAwesomeIcon icon={faHeart} size="lg" color="red" />
                                    </div>
                                    {/* Product image */}
                                    <img className="p-4 w-full h-60 object-contain object-center" src={product.img} alt={product.name} />
                                    {/* Color options */}
                                    <div className="flex justify-center space-x-2 mt-2">
                                        {product.color && product.color.length > 0 ? (
                                            product.color.map((color, index) => (
                                                <div key={index} className="w-4 h-4 rounded-full bg-gray-400" style={{ backgroundColor: color }}></div>
                                            ))
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                    <h3 className="px-2 text-lg text-center font-semibold mt-4 mb-2">{product.name}</h3>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No favorite products available.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Favorites;