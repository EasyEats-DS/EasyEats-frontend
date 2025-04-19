import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Resturant from "./pages/Restaurant";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Resturant />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
