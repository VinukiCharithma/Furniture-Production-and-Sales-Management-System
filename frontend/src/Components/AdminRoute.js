import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== "Admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;