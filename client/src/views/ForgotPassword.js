import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar";
import { TailSpin } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values) {
            errors.email = "Email is required";
        } else if (!regex.test(values)) {
            errors.email = "Please enter a valid email address";
        }

        return errors;
    };

    const sendSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            theme: "dark",
        })
    }

    const sendError = (message) => {
        toast.error(message, {
            position: "top-right",
            theme: "dark",
        });
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setFormErrors(validateForm(email));
        setIsSubmit(true);
    };

    useEffect(() => {
        const sendForgotPasswordEmail = async () => {
            if (Object.keys(formErrors).length === 0 && isSubmit) {
                setIsLoading(true);
                try {
                    const response = await axios.post("http://localhost:8000/forgotPassword", { email });
                    sendSuccess(response.data.message);
                    setIsLoading(false);
                } catch (error) {
                    console.error(error);
                    sendError(error.response.data.message);
                    setIsLoading(false);
                }
            }
        };

        sendForgotPasswordEmail();
    }, [formErrors]);

    return (
        <>
            <main>
                <Navbar />
                <div className="flex h-screen">
                    <div className="w-1/2" style={{ backgroundImage: "url(/bg3.jpg)", backgroundSize: "cover" }}></div>
                    <div className="w-1/2 bg-light-orange flex justify-center items-center">
                        <form className="w-2/3 p-8 bg-light-orange" onSubmit={handleForgotPassword}>
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800">Forgot Password</h2>
                            <p className="text-sm text-gray-700 mb-4">
                                Enter your email below, and we’ll send you a message with your username and a link to reset your password.
                            </p>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-bold text-zinc-700">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <p className="text-red-600 m-auto text-left text-sm/[14px]">{formErrors.email}</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-moonstone text-white font-semibold rounded-md hover:bg-zinc-700 focus:outline-none focus:bg-zinc-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex justify-center">
                                        <TailSpin
                                            height="24"
                                            width="24"
                                            color="#FFFFFF"
                                            ariaLabel="loading"
                                        />
                                    </div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ForgotPassword;
