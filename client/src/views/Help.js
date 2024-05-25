import React from 'react';
import Navbar from '../components/Navbar2';


export default function Help() {
    const username = localStorage.getItem('username');

    return (
        <>
            <Navbar uname={username} />
            <main>
                <img src="/help.png" alt="help" className="max-w-full max-h-full" />
            </main>
        </>
    );
}