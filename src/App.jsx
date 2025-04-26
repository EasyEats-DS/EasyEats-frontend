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
        <Route path="/payment" element={<Payment/>} />
        <Route path="/forgot-password" element={<ForgetPassword/>} />
        <Route path="/restaurant/:id" element={<ResturantDetails/>}/>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/search" element={<Search/>} />  





      </Routes>
    </BrowserRouter>
  );
};

export default App;
