import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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
// import useDriversSocket from "./components/banuka/hooks/useDriversSocket";
import Refund from "./pages/Refund";
import StripePayment from "./pages/Stripepayment";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminRestaurants from "./pages/SuperAdmin/SuperAdminRestaurants";
import SuperAdminUsers from "./pages/SuperAdmin/SuperAdminUsers";
import SuperAdminOrders from "./pages/SuperAdmin/SuperAdminOrders";
import SuperAdminPayments from "./pages/SuperAdmin/SuperAdminPayments";
import CreateResturant from "./pages/CreateResturant";
import { ToastContainer } from "react-toastify";
// import AdminRestaurantCreation from "./pages/Admin/AdminRestaurantCreation";

// import AdminRestaurantCreation from "./pages/Admin/AdminRestaurantCreation";
import { SocketProvider } from '../src/components/banuka/SocketContext.jsx' // Adjust the path as necessary


//banuka
import DeliveryTrackingPage from "./pages/banuka/DeliveryTrackingPage";

import StripePaymentInterface from "./pages/StripePaymentInterface";

// Initialize Stripe with options
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('Error: Stripe publishable key is missing. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file.');
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const stripeOptions = {
  locale: 'en',
  fonts: [{
    cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
  }],
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#FF7A00',
      colorBackground: '#ffffff',
      colorText: '#32325d',
      colorDanger: '#fa755a',
      fontFamily: 'Roboto, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  },
};

const App = () => {
  return (
    <SocketProvider>
    <BrowserRouter>
      <Elements stripe={stripePromise} options={stripeOptions}>
    <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />

          {/* Protected Routes */}
          <Route path="/driver/map" element={<ProtectedRoute><DeliveryTrackingPage userRole="driver" /> </ProtectedRoute>} />
          <Route path="/customer/map" element={<ProtectedRoute><DeliveryTrackingPage userRole="customer" /></ProtectedRoute>} />

          <Route path="/" element={<ProtectedRoute><Resturant /></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/restaurant" element={<ProtectedRoute><Resturant /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute><ResturantDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/orderConfirmed" element={<ProtectedRoute><OrderConfirmed /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/refund" element={<ProtectedRoute><Refund /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute><AdminMenu/></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders/></ProtectedRoute>} />
          <Route path="/admin/earnings" element={<ProtectedRoute><AdminEarnings/></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings/></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile/></ProtectedRoute>} />
          <Route path="/viewOrder" element={<ProtectedRoute><ViewOrders /></ProtectedRoute>} />
          <Route path="/stripepayment" element={<ProtectedRoute><StripePayment /></ProtectedRoute>} />
          <Route path="/stripe-payment-interface" element={<ProtectedRoute><StripePaymentInterface /></ProtectedRoute>} />
          <Route path="/create-restaurant" element={<ProtectedRoute><CreateResturant /></ProtectedRoute>} />


          {/* Super Admin Routes */}
          <Route path="/superadmin/dashboard" element={<ProtectedRoute><SuperAdminDashboard/></ProtectedRoute>} />
          <Route path="superadmin/restaurants" element={<ProtectedRoute><SuperAdminRestaurants /></ProtectedRoute>} />
          <Route path="superadmin/users" element={<ProtectedRoute><SuperAdminUsers /></ProtectedRoute>} />
          <Route path="superadmin/orders" element={<ProtectedRoute><SuperAdminOrders /></ProtectedRoute>} />
          <Route path="superadmin/payments" element={<ProtectedRoute><SuperAdminPayments /></ProtectedRoute>} />

          {/* Catch-all route */}

        </Routes>
      </Elements>
    </BrowserRouter>
    </SocketProvider>
  );
};

export default App;