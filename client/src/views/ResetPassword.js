import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const validateForm = (password, confirmPassword) => {
        const errors = {};

        if (!password && !confirmPassword) {
            errors.password = "Password is required";
            errors.confirmPassword = "Confirm Password is required";
        } else if (!password) {
            errors.password = "Password is required";
        } else if (!confirmPassword) {
            errors.confirmPassword = "Confirm Password is required";
        } else if (password.length < 8 ||
            !/[a-z]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)) {
            errors.password = "Password should be at least 8 characters long and must contain at least one uppercase, one lowercase, and one number";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setFormErrors(validateForm(password, confirmPassword));
        setIsSubmit(true);
    }

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/reset-password/${token}`);
                toast.success(response.data.message, {
                    position: "top-right",
                    theme: "dark",
                });
            } catch (error) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    theme: "dark",
                });
            }
        };
        checkToken();
    }, [token]);

    useEffect(() => {
        const resetPassword = async () => {
            if (Object.keys(formErrors).length === 0 && isSubmit) {
                try {
                    const response = await axios.post(`http://localhost:8000/reset-password/${token}`, {
                        password,
                        confirmPassword
                    });

                    toast.success(response.data.message, {
                        position: "top-right",
                        theme: "dark",
                    });
                    navigate("/login");
                } catch (error) {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                        theme: "dark",
                    });
                }
            }
        }

        resetPassword();
    }, [formErrors, isSubmit, navigate, password, confirmPassword, token]);

    return (
        <>
            <main>
                <Navbar />
                <div className="flex h-screen">
                    <div className="w-1/2" style={{ backgroundImage: "url(/bg3.jpg)", backgroundSize: "cover" }}></div>
                    <div className="w-1/2 bg-light-orange flex justify-center items-center">
                        <form className="w-2/3 p-8 bg-light-orange" onSubmit={handleResetPassword}>
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800">Reset Password</h2>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-bold text-zinc-700">New Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.password}</p>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-zinc-700">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.confirmPassword}</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-moonstone text-white font-semibold rounded-md hover:bg-zinc-700 focus:outline-none focus:bg-zinc-700"
                                disabled={isSubmit && Object.keys(formErrors).length === 0}
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ResetPassword;
