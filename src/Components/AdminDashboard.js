import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://Localhost:5001/products") // Replace with your backend URL
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Category</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="text-center">
                            <td className="border px-4 py-2">{product._id}</td>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.category}</td>
                            <td className="border px-4 py-2">${product.price}</td>
                            <td className="border px-4 py-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;

