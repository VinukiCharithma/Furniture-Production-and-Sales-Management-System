import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TaskPreview.css';

const TaskPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    
    console.log('Full location.state:', location.state);
    
    // Proper destructuring with defaults
    const { 
        tasks: responseData = {}, 
        orderId, 
        orderDetails = {} 
    } = state || {};

    // Initialize state properly
    const [tasks, setTasks] = useState(responseData.tasks?.tasks || []);
    const [totalEstimatedTime, setTotalEstimatedTime] = useState(responseData.totalEstimatedTime || 0);
    const [riskLevel] = useState(responseData.riskLevel || 'Medium');
    const [isSaving, setIsSaving] = useState(false);

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...tasks];
        newTasks[index][field] = value;
        setTasks(newTasks);
        
        if (field === 'estimatedTime') {
            // Fixed the reduce function syntax
            const newTotal = newTasks.reduce(
                (sum, task) => sum + (Number(task.estimatedTime) || 0,
                0
            ));
            setTotalEstimatedTime(newTotal);
        }
    };

    const handleSaveTasks = async () => {
        setIsSaving(true);
        try {
            const response = await axios.post('/tasks/schedule', {
                orderId,
                tasks: { tasks },
                totalEstimatedTime,
                riskLevel
            });

            if (response.status === 201) {
                navigate('/ongoing');
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to save tasks');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert(`Error saving tasks: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="task-preview-container">
            <h2>Task Preview for Order: {orderId}</h2>
            
            {/* Order Summary */}
            <div className="order-summary">
                <h3>Order Details</h3>
                <p><strong>Customer:</strong> {orderDetails.customer}</p>
                <p><strong>Items:</strong></p>
                <ul>
                    {orderDetails.items?.map((item, i) => (
                        <li key={i}>{item.quantity}x {item.name}</li>
                    ))}
                </ul>
                <p><strong>Shipping to:</strong> {orderDetails.address?.city}</p>
            </div>

            {/* Task Editing */}
            <div className="task-editor">
                <h3>Generated Tasks</h3>
                {tasks.map((task, index) => (
                    <div key={index} className="task-item">
                        <div className="form-group">
                            <label>Task Name</label>
                            <input
                                value={task.taskName || ''}
                                onChange={(e) => handleTaskChange(index, 'taskName', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estimated Time (hours)</label>
                            <input
                                type="number"
                                value={task.estimatedTime || ''}
                                onChange={(e) => handleTaskChange(index, 'estimatedTime', e.target.value)}
                            />
                        </div>
                        {/* Add other task fields as needed */}
                    </div>
                ))}
            </div>

            <div className="summary">
                <p><strong>Total Estimated Time:</strong> {totalEstimatedTime} hours</p>
                <p><strong>Risk Level:</strong> {riskLevel}</p>
            </div>

            <button 
                onClick={handleSaveTasks}
                disabled={isSaving}
            >
                {isSaving ? 'Saving...' : 'Confirm and Save'}
            </button>
        </div>
    );
};

export default TaskPreview;