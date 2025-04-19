import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home Works</h1>
      <Link to="/restaurant">
        <button>Restaurant</button>
      </Link>
      <Link to="/cart">
        <button>Cart</button>
      </Link>
    </div>
  );
};

export default Home;
