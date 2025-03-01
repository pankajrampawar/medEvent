'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkCred } from '@/lib/api';

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
    const login = async (email, password) => {
        // Check if the user is an admin
        if (email === 'admin@example.com' && password === 'adminpassword') {
            const userData = { email, role: 'admin' };
            const expiration = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiration', expiration);
            return; // Exit the function after handling admin login
        }

        // If not an admin, check credentials for a regular user/doctor
        try {
            const cred = { email, password };
            const userData = await checkCred(cred); // Call the checkCred function
            const doctorData = { email: userData.doctor.email, role: 'doctor' }
            // If credentials are valid, set user data
            const expiration = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours

            setUser(doctorData);
            localStorage.setItem('user', JSON.stringify(doctorData));
            localStorage.setItem('expiration', expiration);

        } catch (error) {
            throw new Error(error.message || 'Invalid email or password');
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-2xl font-semibold text-gray-700">
                    Authenticating...
                </div>
            </div>
        </div>
    )

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