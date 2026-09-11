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
import { CUSTOMER_ONLY, OWNER_ONLY, SUPER_ADMIN_ONLY, DRIVER_ONLY } from "./lib/access";
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
import DeliveryOfferModal from './components/banuka/DeliveryOfferModal.jsx'
import DeliveryStatusBanner from './components/banuka/DeliveryStatusBanner.jsx'
import DriverAvailabilityBanner from './components/banuka/DriverAvailabilityBanner.jsx'


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
  fonts: [{
    cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
  }],
  locale: 'en',
  appearance: {
    theme: 'flat',
    variables: {
      fontFamily: 'Roboto, sans-serif',
      borderRadius: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #E4E4E4',
        boxShadow: 'none',
        fontSize: '16px',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid #FF7A00',
        boxShadow: '0 1px 3px 0 #FF7A00',
      },
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

        {/* Mounted above the routes so a driver's offer and a customer's order
            status follow them across pages instead of living on one screen. */}
        <DeliveryOfferModal />
        <DeliveryStatusBanner />
        <DriverAvailabilityBanner />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />

          {/* Protected Routes */}
          <Route path="/driver/map" element={<ProtectedRoute allowedRoles={DRIVER_ONLY}><DeliveryTrackingPage userRole="driver" /> </ProtectedRoute>} />
          <Route path="/customer/map" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><DeliveryTrackingPage userRole="customer" /></ProtectedRoute>} />

          <Route path="/" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Resturant /></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Home/></ProtectedRoute>} />
          <Route path="/restaurant" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Resturant /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Cart /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Order /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Payment /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><ResturantDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Search /></ProtectedRoute>} />
          <Route path="/orderConfirmed" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><OrderConfirmed /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/refund" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><Refund /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><AdminDashboard/></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><AdminMenu/></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><AdminOrders/></ProtectedRoute>} />
          <Route path="/admin/earnings" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><AdminEarnings/></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><AdminSettings/></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><AdminProfile/></ProtectedRoute>} />
          <Route path="/viewOrder" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><ViewOrders /></ProtectedRoute>} />
          <Route path="/stripepayment" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><StripePayment /></ProtectedRoute>} />
          <Route path="/stripe-payment-interface" element={<ProtectedRoute allowedRoles={CUSTOMER_ONLY}><StripePaymentInterface /></ProtectedRoute>} />
          <Route path="/create-restaurant" element={<ProtectedRoute allowedRoles={OWNER_ONLY}><CreateResturant /></ProtectedRoute>} />


          {/* Super Admin Routes */}
          <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={SUPER_ADMIN_ONLY}><SuperAdminDashboard/></ProtectedRoute>} />
          <Route path="superadmin/restaurants" element={<ProtectedRoute allowedRoles={SUPER_ADMIN_ONLY}><SuperAdminRestaurants /></ProtectedRoute>} />
          <Route path="superadmin/users" element={<ProtectedRoute allowedRoles={SUPER_ADMIN_ONLY}><SuperAdminUsers /></ProtectedRoute>} />
          <Route path="superadmin/orders" element={<ProtectedRoute allowedRoles={SUPER_ADMIN_ONLY}><SuperAdminOrders /></ProtectedRoute>} />
          <Route path="superadmin/payments" element={<ProtectedRoute allowedRoles={SUPER_ADMIN_ONLY}><SuperAdminPayments /></ProtectedRoute>} />

          {/* Catch-all route */}

        </Routes>
      </Elements>
    </BrowserRouter>
    </SocketProvider>
  );
};

export default App;