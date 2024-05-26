import React from 'react';
import Navbar from '../components/Navbar2';


export default function Help() {
    const username = localStorage.getItem('username');

    return (
        <>
            <main className="h-screen overflow-hidden">
            <Navbar uname={username} />
                <img
                    src="/help2.png"
                    alt="Help"
                    className="object-cover w-full h-full"
                />
            </main>
        </>
    );
}