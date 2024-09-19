// frontend/src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context for Authentication
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to log in
    const login = () => {
        setIsAuthenticated(true);
    };

    // Function to log out
    const logout = () => {
        setIsAuthenticated(false);
    };

    // You can use useEffect to check authentication status from localStorage or a token
    useEffect(() => {
        // Example: Check authentication status
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};
