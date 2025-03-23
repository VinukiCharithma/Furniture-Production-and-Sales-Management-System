import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext"; // Use "Context" (uppercase)
import Home from "./Pages/Home"; // Use "Pages" (uppercase)
import Admin from "./Pages/Admin";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserProfile from "./Pages/UserProfile";
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import CreateOrder from "./Pages/CreateOrder";
import OrderDetails from "./Pages/OrderDetails";
import UserOrders from "./Pages/UserOrders";
import UpdateOrder from "./Pages/UpdateOrder";
import AdminOrders from "./Pages/AdminOrders";
import UpdateOrderStatus from "./Pages/UpdateOrderStatus";
import OrderReports from "./Pages/OrderReports";
import Navbar from "./Components/Navbar"; // Use "Components" (uppercase)
import ProtectedRoute from "./Components/ProtectedRoute"; // Use "Components" (uppercase)
import AdminRoute from "./Components/AdminRoute"; // Use "Components" (uppercase)
import Dashboard from "./Pages/Dashboard"; // Import Dashboard
import AdminDashboard from "./Pages/AdminDashboard"; // Import AdminDashboard

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Authenticated Users) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-order"
            element={
              <ProtectedRoute>
                <CreateOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-orders/:userId"
            element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-order/:orderId"
            element={
              <ProtectedRoute>
                <UpdateOrder />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Authenticated Admins) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/update-status/:orderId"
            element={
              <AdminRoute>
                <UpdateOrderStatus />
              </AdminRoute>
            }
          />
          <Route
            path="/order-reports"
            element={
              <AdminRoute>
                <OrderReports />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;