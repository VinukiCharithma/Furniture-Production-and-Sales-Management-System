import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserProfile from "./Pages/UserProfile";
import Wishlist from "./Pages/Wishlist";
import TrackOrder from "./Pages/TrackOrder";
import OrderDetails from "./Pages/OrderDetails";
import OrderHistory from "./Pages/OrderHistory";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Checkout from "./Pages/Checkout";
import Cart from "./Pages/Cart";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import ProductCatalog from "./Pages/ProductCatalog";
import ProductDetails from "./Pages/ProductDetails";
import AdminOrders from "./Pages/AdminOrders";
import AdminOrderDetails from "./Pages/AdminOrderDetails";
import AdminOrderStats from "./Pages/AdminOrderStats";
import AdminUsers from "./Pages/AdminUsers";
import AdminProduct from "./Pages/AdminProduct";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import AdminProductView from "./Pages/AdminProductView";
import DiscountManager from "./Pages/DiscountManager";
import "./App.css";

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

          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetails />} />

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
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/history"
            element={
              <ProtectedRoute>
                <OrderHistory />
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
            path="/orders/:orderId/tracking"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Authenticated Admins) */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders/:orderId"
            element={<AdminOrderDetails />}
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
            path="/admin/stats"
            element={
              <AdminRoute>
                <AdminOrderStats />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/view-product/:id"
            element={
              <AdminRoute>
                <AdminProductView />
              </AdminRoute>
            }
          />
          <Route
            path="/manage-discounts"
            element={
              <AdminRoute>
                <DiscountManager/>
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
