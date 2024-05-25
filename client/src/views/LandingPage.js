import React from 'react';
import Navbar from '../components/Navbar'

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
            <img src="/About.png" alt="About" className="max-w-full max-h-full" />
            </main>
        </>
    );
}