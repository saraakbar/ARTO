import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ }) => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const validateForm = (values) => {
        const errors = {};
        const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!values.password) {
            errors.password = "Password is required";
        }

        return errors;
    };

    const loginHandler = (e) => {
        e.preventDefault();
        setFormErrors(validateForm(user));
        setIsSubmit(true);
    };
    useEffect(() => {

        const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
            navigate("/makeup")
            return
        }

        const loginError = (message) => {
            toast.error(message, {
                position: "top-right",
                theme: "dark",
            })
        }

        if (Object.keys(formErrors).length === 0 && isSubmit) {
            axios
                .post("http://localhost:8000/login", user)
                .then((res) => {
                    if (res.status === 201) {
                        toast.success("Login Successful!", {
                            position: "top-right",
                            theme: "dark",
                        });
                        localStorage.setItem("token", JSON.stringify(res.data.accessToken));
                        localStorage.setItem("username", res.data.username);
                        navigate("/makeup")
                    }
                })
                .catch((error) => {
                    if (error.response.status === 404) {
                        loginError("User not found.");
                    } else if (error.response.status === 400) {
                        loginError("Invalid credentials.");
                    } else if (error.response.status === 403) {
                        loginError("Your account was suspended.");
                    } else {
                        loginError("Server Error.");
                    }
                });
        }
    }, [formErrors]);
    return (
        <>
            <Navbar />
            <main>
                <div className="flex h-screen">
                    <div className="w-1/2" style={{ backgroundImage: "url(/bg3.jpg)", backgroundSize: "cover" }}></div>
                    <div className="w-1/2 bg-light-orange flex justify-center items-center">
                        <form className="w-2/3 p-8 bg-light-orange">
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800">Login to your account</h2>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-bold text-zinc-700">Email</label>
                                <input type="text" id="email" name="email" onChange={onChange} value={user.email} className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.email}</p>
                            </div>
                            <label htmlFor="password" className="block text-sm font-bold text-zinc-700">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" onChange={onChange} value={user.password} className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility} />
                            </div>
                            <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.password}</p>
                            <p className="text-sm text-gray-600 mb-4 text-right"><a href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</a></p>
                            <button type="submit" className="w-full py-2 px-4 bg-moonstone text-white font-semibold rounded-md hover:bg-zinc-700 focus:outline-none focus:bg-zinc-700" onClick={loginHandler}>Login</button>
                            <p className="text-sm text-gray-600 font-bold text-center mt-2">Not a member? <a href="/register" className="text-blue-600 font-bold">Register</a></p>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;
