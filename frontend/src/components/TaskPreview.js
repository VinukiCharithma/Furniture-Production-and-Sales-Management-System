// src/components/TaskPreview.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tasks, totalEstimatedTime, riskLevel, suggestedNewDeadline } = location.state.tasks;
    const orderId = "order" + Date.now();

    const handleSaveTasks = async () => {
        try {
            await axios.post('/tasks/schedule', { orderId, priorityLevel: "Medium", tasks: tasks.tasks, totalEstimatedTime, riskLevel, suggestedNewDeadline });
            navigate('/ongoing');
        } catch (error) {
            console.error("Error saving tasks:", error);
        }
    };

    return (
        <div>
            <h2>Task Preview</h2>
            {tasks.tasks.map((task, index) => (
                <div key={index}>
                    <p>Task: {task.taskName}</p>
                    <p>Assigned To: {task.assignedTo}</p>
                    <p>Estimated Time: {task.estimatedTime}</p>
                </div>
            ))}
            <p>Total Estimated Time: {totalEstimatedTime}</p>
            <p>Risk Level: {riskLevel}</p>
            {suggestedNewDeadline && <p>Suggested New Deadline: {suggestedNewDeadline}</p>}
            <button onClick={handleSaveTasks}>Confirm and Save</button>
        </div>
    );
};

export default TaskPreview;