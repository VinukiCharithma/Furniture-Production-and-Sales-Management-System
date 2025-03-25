// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Dashboard from './components/Dashboard';
import PendingOrders from './components/PendingOrders';
import OngoingOrders from './components/OngoingOrders';
import CompletedOrders from './components/CompletedOrders';
import OrderDetails from './components/OrderDetails';
import TaskPreview from './components/TaskPreview';
import Alerts from './components/Alerts';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pending" element={<PendingOrders />} />
                <Route path="/ongoing" element={<OngoingOrders />} />
                <Route path="/completed" element={<CompletedOrders />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/taskpreview" element={<TaskPreview />} />
                <Route path="/alerts" element={<Alerts />} />
            </Routes>
        </Router>
    );
}

export default App;