import React from 'react';
import Navbar from '../components/Navbar'

export default function LandingPage() {
    return (
        <>
            <main className="h-screen overflow-hidden">
                <Navbar />
                <img
                    src="/landing.png"
                    alt="About"
                    className="object-cover w-full h-full"
                />
            </main>
        </>
    );
}