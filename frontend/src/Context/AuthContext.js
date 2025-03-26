import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const navigate = useNavigate();

    // Check if the user is authenticated
    const isAuthenticated = !!token;
    
    // Check if the user is admin
    const isAdmin = user?.role === "Admin";

    // Initialize user data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:5000/auth/login", {
                email,
                password,
            });

            // Save token, user, and userId
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("userId", response.data.user._id); // Save userId

            // Redirect to dashboard or home page
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || "An error occurred");
            throw error;
        }
    };

    // Register function
    const register = async (name, email, password, role) => {
        try {
            const response = await axios.post("http://localhost:5000/auth/register", {
                name,
                email,
                password,
                role,
            });

            // Save token, user, and userId
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("userId", response.data.user._id); // Save userId

            // Redirect to dashboard or home page
            navigate("/dashboard");
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || "An error occurred");
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId"); // Remove userId

        // Redirect to home page
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated,
            isAdmin,  // Add this line
            login, 
            register, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => React.useContext(AuthContext);