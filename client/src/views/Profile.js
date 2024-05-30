import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [favorites, setFavorites] = useState([]);
    const token = JSON.parse(localStorage.getItem('token'));
    const username = localStorage.getItem('username');
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:8000/favDetails', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFavorites(response.data.favorites.slice(0, 2));
            }
            catch (error) {
                console.error('Error fetching favorites:', error);
            }
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            }
            catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchUser();
        fetchFavorites();
    }, []);

    return (
        <>
            <Navbar uname={username} />
            <div className="container flex flex-col min-h-screen bg-light-orange relative justify-center items-center">
                <div className="w-full max-w-6xl p-4 flex flex-col md:flex-row">
                    {/* User Profile */}
                    <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md flex flex-col items-center  mb-4 md:mb-0">
                        <div>
                            <img className="w-64 h-64 rounded-full mx-auto" src={user.img} alt="User Avatar" />
                            <h2 className="text-center text-xl font-semibold mt-4">{user.firstName} {user.lastName}</h2>
                            <p className="text-center text-gray-600">@{user.username}</p>
                            <p className="text-center text-gray-600">{user.email}</p>
                        </div>
                        <div>
                            <button className="bg-zinc-700 hover:bg-moonstone text-white py-2 px-4 rounded mt-8">Edit Profile
                                <FontAwesomeIcon icon={faPencil} className='ml-2' /></button>
                        </div>
                    </div>

                    {/* Recommended Products */}
                    <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md  mb-4 md:mb-0 md:ml-4">
                        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                        <p className="text-center text-gray-600">Feature coming soon.</p>
                    </div>

                    {/* Favorites */}
                    <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md flex flex-col md:ml-4">
                        <h2 className="text-xl font-semibold mb-4">Favorites</h2>
                        {favorites.length > 0 ? (
                            <div className="grid grid-flow-row-2 gap-4">
                                {favorites.map(product => (
                                    <div key={product._id} className="w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <img className="w-24 h-24 object-contain" src={product.img} alt={product.name} />
                                    </div>
                                ))}
                                <button className="mt-4 bg-zinc-700 hover:bg-moonstone text-white py-2 px-4 rounded"
                                    onClick={() => navigate('/favorites')}
                                >See More</button>
                            </div>

                        ) : (
                            <p className="text-center text-gray-600">No favorite products available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
