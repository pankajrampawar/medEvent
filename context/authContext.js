'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const router = useRouter();
    const pathname = usePathname();

    // Check if the user is logged in on initial load or when pathname changes
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedExpiration = localStorage.getItem('expiration');

        // Login enforcement logic
        if (
            pathname.startsWith('/dashboard') || // Pages under /dashboard
            pathname === '/' // Home page
        ) {
            if (storedUser && storedExpiration && new Date().getTime() < storedExpiration) {
                setUser(JSON.parse(storedUser));
            } else {
                logout(); // Redirect to login if not authenticated
            }
        }

        // No login required for pages under /user
        setLoading(false); // Set loading to false after checking auth status
    }, [pathname]);

    // Login function
    const login = (email, password) => {
        // Replace this with your actual authentication logic
        if (email === 'user@example.com' && password === 'password') {
            const userData = { email };
            const expiration = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiration', expiration);
        } else {
            throw new Error('Invalid email or password');
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('expiration');

        // Redirect to login if on protected pages
        if (pathname.startsWith('/dashboard') || pathname === '/') {
            router.push('/login');
        }
    };

    // Check if the user is authenticated
    const isAuthenticated = () => {
        return user !== null;
    };

    // Redirect to login if not authenticated
    const redirectToLogin = () => {
        if (
            !isAuthenticated() &&
            (pathname.startsWith('/dashboard') || pathname === '/')
        ) {
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, redirectToLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};