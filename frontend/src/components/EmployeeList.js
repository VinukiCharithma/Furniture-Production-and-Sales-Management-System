import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/employees');
                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`/employees/${id}`);
                setEmployees(employees.filter(emp => emp._id !== id));
                alert('Employee deleted successfully!');
            } catch (err) {
                alert('Failed to delete employee');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="employee-list-container">
            <h2>Employee Management</h2>
            <Link to="/employees/add" className="add-employee-btn">
                Add New Employee
            </Link>
            
            <div className="employee-grid">
                {employees.map(employee => (
                    <div key={employee._id} className="employee-card">
                        <div className="employee-image">
                            {employee.image ? (
                                <img src={`http://localhost:5000${employee.image}`} alt={employee.name} />
                            ) : (
                                <div className="placeholder-image">{employee.name.charAt(0)}</div>
                            )}
                        </div>
                        <div className="employee-details">
                            <h3>{employee.name}</h3>
                            <p><strong>Role:</strong> {employee.role}</p>
                            <p><strong>Status:</strong> {employee.status}</p>
                            <p><strong>Phone:</strong> {employee.phone}</p>
                            <div className="employee-actions">
                                <Link 
                                    to={`/employees/edit/${employee._id}`} 
                                    className="edit-btn"
                                >
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(employee._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;