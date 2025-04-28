import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../components/UserLayout';
import Footer from '../components/Footer';

const Payment = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {

      console.log('Fetching payment history...');
      const response = await axios.get('http://localhost:5003/payments/user/USER123/history');
      
      console.log('Payment data received:', response.data);
      setPayments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Payment fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch payment history');

      setLoading(false);
    }
  };


  return (
    <UserLayout title="Payment History">
      <div className="p-6">
        {loading && (
          <div className="flex justify-center items-center h-screen">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-500 text-center p-4">{error}</div>
        )}

        {!loading && !error && (
          <>
            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No payment history found</td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.status === 'SUCCESS' && (
                            <button
                              onClick={() => navigate('/refund', { 
                                state: { 
                                  orderId: payment.orderId, 
                                  amount: payment.amount 
                                }
                              })}
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                            >
                              Request Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Footer />
    </UserLayout>

  );
};

export default Payment;