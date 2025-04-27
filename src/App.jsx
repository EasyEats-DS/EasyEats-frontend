import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Resturant from "./pages/Restaurant";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import ForgetPassword from "./pages/ForgetPassword";
import ResturantDetails from "./pages/ResturantDetails";
import Profile from "./pages/Profile";
import Search from "./pages/SearchDishes";
import OrderConfirmed from "./pages/OrderConfirmed";
import Notification from "./pages/Notification";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminMenu from "./pages/Admin/AdminMenu";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminEarnings from "./pages/Admin/AdminEarnings";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminProfile from "./pages/Admin/AdminProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewOrders from "./pages/viewOrders";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/restaurant" element={<ProtectedRoute><Resturant /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute><ResturantDetails /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/orderConfirmed" element={<ProtectedRoute><OrderConfirmed /></ProtectedRoute>} />
        <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        <Route path="/admin/menu" element={<ProtectedRoute><AdminMenu/></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders/></ProtectedRoute>} />
        <Route path="/admin/earnings" element={<ProtectedRoute><AdminEarnings/></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings/></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile/></ProtectedRoute>} />
        <Route path="/viewOrder" element={<ProtectedRoute><ViewOrders /></ProtectedRoute>} />
        <Route path="/viewOrder" element={<ProtectedRoute><ViewOrders /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
