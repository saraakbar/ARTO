import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Settings.css';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const supabaseUrl = 'https://ebjmopyrebgvqlrkcmpj.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViam1vcHlyZWJndnFscmtjbXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyODEyODcsImV4cCI6MjAyNzg1NzI4N30.qa-6cTywFTao77adQgydvTN7u4aet-31z3icJPWNVUA'
    const supabase = createClient(supabaseUrl, supabaseKey);
    const [activeTab, setActiveTab] = useState('profile');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const token = JSON.parse(localStorage.getItem('token'));
    const username = localStorage.getItem('username');
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [submit, setSubmit] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const validateForm = (values) => {
        const errors = {};
        if (!values.firstName.trim()) errors.firstName = 'First Name is required';
        if (!values.lastName.trim()) errors.lastName = 'Last Name is required';
        if (!values.username.trim()) errors.username = 'Username is required';
        if (!values.email.trim()) errors.email = 'Email is required';
        if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Email is invalid';
        return errors;
    };

    const validatePassword = (passwordData) => {
        const errors = {};
        if (!passwordData.currentPassword.trim()) errors.currentPassword = 'Current Password is required';
        if (!passwordData.newPassword.trim()) errors.newPassword = 'New Password is required';
        if (passwordData.newPassword.trim() && (
            passwordData.newPassword.trim().length < 8 ||
            !/[a-z]/.test(passwordData.newPassword) ||
            !/[A-Z]/.test(passwordData.newPassword) ||
            !/[0-9]/.test(passwordData.newPassword)
        )) {
            errors.newPassword = 'Password should be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        if (!passwordData.confirmPassword.trim()) errors.confirmPassword = 'Confirm New Password is required';
        if (passwordData.newPassword.trim() !== passwordData.confirmPassword.trim()) {
            errors.confirmPassword = 'New Password and Confirm New Password do not match';
        }
        return errors;
    };

    const SettingsError = (message) => {
        toast.error(message, {
            position: "top-right",
            theme: "dark",
        });
    };

    const SettingsSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            theme: "dark",
        });
    };

    const deleteAccount = async () => {
        try {
            const response = await axios.delete('http://localhost:8000/delete', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            SettingsSuccess("Account deleted successfully.");
        } catch (error) {
            SettingsError(error.response.data.message);
        }
    };

    const handleDeleteAccount = () => {
        setShowModal(false);
        deleteAccount();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    useEffect(() => {
        const getSettings = async () => {
            try {
                const response = await axios.get('http://localhost:8000/settings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error) {
                SettingsError(error.response.data.message);
            }
        };

        getSettings();
    }, []);

    const handleSave = () => {
        setFormErrors(validateForm(user));
        setSubmit(true);
    };

    useEffect(() => {
        const updateSettings = async () => {
            if (Object.keys(formErrors).length === 0 && submit) {
                try {
                    await axios.patch('http://localhost:8000/settings', {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    SettingsSuccess('Settings updated successfully.');
                } catch (error) {
                    SettingsError(error.response.data.message);
                }
            }
        };
        updateSettings();
    }, [formErrors]);

    const handlePasswordChange = () => {
        const errors = validatePassword(passwordData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        } else {
            changePassword();
        }
    };

    const changePassword = async () => {
        try {
            await axios.patch('http://localhost:8000/settings/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmNewPassword: passwordData.confirmPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            SettingsSuccess('Password changed successfully.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            SettingsError(error.response.data.message);
        }
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        setSelectedFile(e.target.files[0]);
    };

    const renameFile = (file, newName) => {
        const fileExtension = file.name.split('.').pop();
        return new File([file], `${newName}.${fileExtension}`, {
            type: file.type,
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            SettingsError('Please select a file to upload.');
            return;
        }

        const renamedFile = renameFile(selectedFile, username);
        setLoading(true); // Set loading to true when the upload starts

        try {
            const { data, error } = await supabase.storage
                .from('images') // Your Supabase bucket name
                .upload(`public/${renamedFile.name}`, renamedFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) {
                throw error;
            }

            const avatarUrl = `${supabaseUrl}/storage/v1/object/public/images/${data.path}`;
            await updateUserAvatar(avatarUrl);
            SettingsSuccess('Avatar uploaded successfully.');
            setLoading(false); // Set loading to false when the upload is successful

        } catch (error) {
            SettingsError(`Error uploading avatar: ${error.message}`);
        }
    };

    const updateUserAvatar = async (avatarUrl) => {
        try {
            const cacheBustedAvatarUrl = `${avatarUrl}?t=${new Date().getTime()}`;
            await axios.patch('http://localhost:8000/avatar', {
                avatarUrl: cacheBustedAvatarUrl,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            SettingsError(error.response.data.message);
        }
    };

    return (
        <>
            <Navbar uname={username} />
            <div className="flex flex-col min-h-screen bg-light-orange relative items-center">
                <div className="w-full max-w-4xl p-4 rounded-lg">
                    <h1 className="text-2xl mt-8 font-semibold mb-4">Account Settings</h1>
                    <div className="flex mb-4">
                        <button
                            className={`flex-1 rounded-s-lg p-2 ${activeTab === 'profile' ? 'bg-moonstone text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            Profile
                        </button>
                        <button
                            className={`flex-1 p-2 ${activeTab === 'auth' ? 'bg-moonstone text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setActiveTab('auth')}
                        >
                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                            Auth
                        </button>
                        <button
                            className={`flex-1 p-2 ${activeTab === 'avatar' ? 'bg-moonstone text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setActiveTab('avatar')}
                        >
                            <FontAwesomeIcon icon={faImage} className="mr-2" />
                            Avatar
                        </button>
                        <button
                            className={`flex-1 rtl p-2 ${activeTab === 'delete' ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setActiveTab('delete')}
                        >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Deactivate
                        </button>
                    </div>

                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Profile</h2>
                            <form>
                                <div className="mb-4 flex">
                                    <div className="w-1/2 pr-2">
                                        <label className="block text-md font-bold text-zinc-700">First Name</label>
                                        <input
                                            type="text"
                                            value={user.firstName}
                                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                        <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.firstName}</p>
                                    </div>
                                    <div className="w-1/2 pr-2">
                                        <label className="block text-md font-bold text-zinc-700">Last Name</label>
                                        <input
                                            type="text"
                                            value={user.lastName}
                                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                        <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.lastName}</p>

                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md font-bold text-zinc-700">Username</label>
                                    <input
                                        type="text"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                    <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.username}</p>

                                </div>
                                <div className="mb-4">
                                    <label className="block text-md font-bold text-zinc-700">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                    <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.email}</p>

                                </div>
                                <button type="button" onClick={handleSave} className="mt-2 bg-zinc-700 block text-sm font-bold text-white py-2 px-10 rounded">SAVE CHANGES</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'auth' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-md font-bold text-zinc-700">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                    <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.currentPassword}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md font-bold text-zinc-700">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                    <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.newPassword}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md font-bold text-zinc-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
                                    <p className="mt-1 text-red-600 m-auto text-left text-sm/[14px]">{formErrors.confirmPassword}</p>
                                </div>
                                <button type="button" onClick={handlePasswordChange} className="mt-2 bg-zinc-700 block text-sm font-bold text-white py-2 px-10 rounded">CHANGE</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'avatar' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Upload Avatar</h2>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded" />
                            </div>
                            <button type="button" onClick={handleUpload} className="mt-2 bg-zinc-700 block text-sm font-bold text-white py-2 px-10 rounded">UPLOAD AVATAR</button>
                            {loading && (
                                <div className="absolute top-4 right-4">
                                    <TailSpin
                                        height="40"
                                        width="40"
                                        color="#0ea5e9"
                                        ariaLabel="tail-spin-loading"
                                        radius="1"
                                        visible={true}
                                    />
                                </div>
                            )}
                        </div>
                    )}


                    {activeTab === 'delete' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
                            <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                            <button
                                className="bg-red-400 block text-sm font-bold text-white py-2 px-4 rounded"
                                onClick={() => setShowModal(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
                            <h2 className="text-xl font-semibold mb-4">Confirm Delete Account</h2>
                            <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                            <div className="flex justify-end">
                                <button
                                    className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded"
                                    onClick={handleDeleteAccount}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Settings;
