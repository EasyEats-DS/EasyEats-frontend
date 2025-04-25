import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Resturant from "./pages/Restaurant";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Order from "./pages/Order"; 
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Resturant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/order" element={<Order/>} />
        <Route path="/dashboard" element={<AdminDashboard/>} />
        <Route path="/payment" element={<Payment/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
