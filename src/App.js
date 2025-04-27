import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
import AddProduct from "./Components/Add/AddProduct";
import EditProduct from "./Components/Update/EditProduct";
import DiscountManager from "./Components/Discounts/DiscountManager";
import AdminProductView from "./Components/Admin/AdminProductView";
import Analytics from "./Components/Analytics";


import CustomerDashboard from "./Components/Customer/CustomerDashboard";
import ProductDetails from "./Components/Customer/ProductDetails";

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/view-product/:id" element={<AdminProductView />} />
        <Route path="/analytics" element={<Analytics />} />

        {/*Discounts*/}
        <Route path="/manage-discounts" element={<DiscountManager />} /> 
        

        {/* Customer Routes */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
    </Routes>
  );
}

export default App;
