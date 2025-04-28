import React from "react";
import { ToastContainer } from "react-toastify";
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

import DeliveryTrackingPage from "./pages/banuka/DeliveryTrackingPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Resturant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/restaurant/:id" element={<ResturantDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/orderConfirmed" element={<OrderConfirmed />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/menu" element={<AdminMenu/>} />
        <Route path="/admin/orders" element={<AdminOrders/>} />
        <Route path="/admin/earnings" element={<AdminEarnings/>} />
        <Route path="/admin/settings" element={<AdminSettings/>} />
        <Route path="/admin/profile" element={<AdminProfile/>} />

        <Route path="/driver/map" element={<DeliveryTrackingPage userRole="driver" />} />
        <Route path="/customer/map" element={<DeliveryTrackingPage userRole="customer" />} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
};

export default App;
