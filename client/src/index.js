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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer/>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/makeup" element={<Makeup />} />
      <Route path="/camera" element={<CameraCapture />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);