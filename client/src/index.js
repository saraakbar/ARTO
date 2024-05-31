import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import LandingPage from './views/LandingPage';
import Login from './views/Login';
import Register from './views/Register';
import Makeup from './views/Makeup';
import CameraCapture from './views/CameraCapture';
import Favorites from './views/Favorites';
import Help from './views/Help';
import Profile from './views/Profile';
import Settings from './views/Settings';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/makeup" element={<Makeup />} />
      <Route path="/camera" element={<CameraCapture />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  </BrowserRouter>
);