

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthCont = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const storedUser = localStorage.getItem('userInfo');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
            } catch (err) {
                console.error("Auth initialization error:", err);
                localStorage.removeItem('userInfo');
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            localStorage.removeItem('userInfo'); 
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Login failed.";
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        setError(null);
        try {
            const { data } = await axiosInstance.post('/auth/signup', userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed.";
            setError(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.clear(); 
        setUser(null);
        window.location.href = '/login'; 
    };

    // UI aur LocalStorage Sync
    const updateLocalUser = (updatedData) => {
        if (!updatedData) return;

        setUser((prevUser) => {
            
            const newUser = updatedData._id ? updatedData : { ...prevUser, ...updatedData };
            localStorage.setItem('userInfo', JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthCont.Provider 
            value={{ 
                user, 
                loading, 
                error, 
                login, 
                register, 
                logout,
                updateLocalUser 
            }}
        >
            {!loading && children} 
        </AuthCont.Provider>
    );
};