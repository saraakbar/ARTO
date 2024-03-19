import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: "",
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...user,
            [name]: value,
        });
    };

    const validateForm = (values) => {
        const error = {};
        const emailRegex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.firstName) {
            error.firstName = "First Name is required";
        }
        if (!values.lastName) {
            error.lastName = "Last Name is required";
        }
        if (!values.email) {
            error.email = "Email is required";
        } else if (!emailRegex.test(values.email)) {
            error.email = "Invalid email";
        }
        if (!values.password) {
            error.password = "Password is required";
        } else if (values.password.length < 8 ||              // Minimum length of 8 characters
            !/[a-z]/.test(values.password) ||         // At least one lowercase letter
            !/[A-Z]/.test(values.password) ||         // At least one uppercase letter
            !/[0-9]/.test(values.password)) {
            error.password = "Password should be atleast 8 characters long and must contain atleast one uppercase, one lowercase and one number";
        }

        const usernameRegex = /^(?=.{4})[a-z][a-z\d]*_?[a-z\d]+$/i;
        if (!values.username) {
            error.username = "Username is required";
        } else if (!usernameRegex.test(values.username)) {
            error.username = "Invalid username";
        }
        return error;
    };

    const signupHandler = (e) => {
        e.preventDefault();
        setFormErrors(validateForm(user));
        setIsSubmit(true);
    };

    useEffect(() => {

        const registerSuccess = () => {
            toast.success("Registration Successful. Please Login.", {
                position: "top-right",
                theme: "dark",
            });
        }

        const registerError = (message) => {
            toast.error(message, {
                position: "top-right",
                theme: "dark",
            })
        }

        if (Object.keys(formErrors).length === 0 && isSubmit) {
            axios.post("http://localhost:8000/register", user).then((res) => {
                if (res.status === 201) {
                    registerSuccess();
                    navigate("/login", { replace: true });
                }
            })
                .catch((error) => {
                    if (error.response.status === 409 && error.response.data === "Username taken.") {
                        registerError("Username taken. Please try another.");
                    } else if (error.response.status === 409 && error.response.data === "User already exists. Please login") {
                        registerError("Email already registered. Please Login.");
                    } else {
                        registerError("Server Error.");
                    }
                })
        }
    }, [formErrors]);

    return (
        <>
            <Navbar />
            <main>
                <div className="flex h-screen">
                    <div className="w-1/2 bg-light-orange flex justify-center items-center">
                        <form className="w-2/3 p-8 bg-light-orange">
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800">Create your account</h2>
                            <div className="mb-4 flex">
                                <div className="w-1/2 pr-2">
                                    <label htmlFor="firstName" className="block text-sm font-bold text-zinc-700">First Name</label>
                                    <input type="text" id="firstName" name="firstName" className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" onChange={onChange} />
                                    <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.firstName}</p>
                                </div>
                                <div className="w-1/2 pl-2">
                                    <label htmlFor="lastName" className="block text-sm font-bold text-zinc-700">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" onChange={onChange} />
                                    <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.lastName}</p>
                                </div>
                            </div>
                            <label htmlFor="username" className="mt-4 block text-sm font-bold text-zinc-700">Username</label>
                            <input type="text" id="username" name="username" className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" onChange={onChange} />
                            <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.username}</p>
                            <label htmlFor="email" className="mt-4 block text-sm font-bold text-zinc-700">Email</label>
                            <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" onChange={onChange} />
                            <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.email}</p>
                            <label htmlFor="password" className="mt-4 block text-sm font-bold text-zinc-700">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" onChange={onChange} />
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility} />
                            </div>
                            <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.password}</p>
                            <button type="submit" className="mt-4 w-full py-2 px-4 bg-moonstone text-white font-semibold rounded-md hover:bg-zinc-700 focus:outline-none focus:bg-zinc-700" onClick={signupHandler}>Register</button>
                            <p className="text-sm text-gray-600 font-bold text-center mt-2">Already a member? <a href="/login" className="text-blue-600 font-bold">Login</a></p>
                        </form>
                    </div>
                    <div className="w-1/2" style={{ backgroundImage: "url(/bg3c.jpg)", backgroundSize: "cover" }}></div>
                </div>
            </main>
        </>
    );
}

export default Register;