import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeForm.css';

const EmployeeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: '',
        address: '',
        phone: '',
        role: 'Carpenter',
        status: 'Active',
        image: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchEmployee = async () => {
                try {
                    const response = await axios.get(`/employees/${id}`);
                    setEmployee(response.data);
                    if (response.data.image) {
                        setPreviewImage(response.data.image);
                    }
                } catch (err) {
                    console.error('Error fetching employee:', err);
                }
            };
            fetchEmployee();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEmployee(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', employee.name);
        formData.append('address', employee.address);
        formData.append('phone', employee.phone);
        formData.append('role', employee.role);
        formData.append('status', employee.status);
        if (employee.image instanceof File) {
            formData.append('image', employee.image);
        }

        try {
            if (id) {
                await axios.put(`/employees/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Employee updated successfully!');
            } else {
                await axios.post('/employees', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Employee added successfully!');
            }
            navigate('/employees');
        } catch (err) {
            console.error('Error saving employee:', err);
            alert('Failed to save employee');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="employee-form-container">
            <h2>{id ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={employee.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={employee.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Role:</label>
                    <select
                        name="role"
                        value={employee.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="Carpenter">Carpenter</option>
                        <option value="Assembler">Assembler</option>
                        <option value="Polisher">Polisher</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="Supervisor">Supervisor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select
                        name="status"
                        value={employee.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Preview" />
                        </div>
                    )}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Employee'}
                </button>
            </form>
        </div>
    );
};

export default EmployeeForm;