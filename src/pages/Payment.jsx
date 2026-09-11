import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import ResponsiveTable from '../components/ResponsiveTable';
import Footer from '../components/Footer';
import { getUserFromToken } from '../lib/auth';
import { paymentService } from '../lib/api/payments';

const Payment = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizePaymentStatus = (status) => {
    return status === 'requires_payment_method' ? 'SUCCESS' : status;
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const user = getUserFromToken();
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const paymentData = await paymentService.getPaymentHistory(user.id);
      setPayments(paymentData);
      setLoading(false);
    } catch (err) {
      console.error('Payment fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch payment history');
      setLoading(false);
    }
  };

  return (
    <UserLayout title="EasyEats">
      <div className="py-2">
        {loading && (
          <div className="flex justify-center items-center h-screen">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-500 text-center p-4">{error}</div>
        )}

        {!loading && !error && (
          <>
            <h2 className="mb-6 text-xl font-bold sm:text-2xl">Payment History</h2>
            <ResponsiveTable
              rows={payments}
              rowKey={(payment) => payment.id}
              empty="No payment history found"
              columns={[
                {
                  key: 'orderId',
                  header: 'Order ID',
                  primary: true,
                  cell: (payment) => `Order ${payment.orderId}`,
                },
                {
                  key: 'date',
                  header: 'Date',
                  cell: (payment) =>
                    payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A',
                },
                {
                  key: 'time',
                  header: 'Time',
                  cell: (payment) =>
                    payment.createdAt
                      ? new Date(payment.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A',
                },
                {
                  key: 'amount',
                  header: 'Amount',
                  cell: (payment) => `$${(payment.amount / 100).toFixed(2)}`,
                },
                {
                  key: 'status',
                  header: 'Status',
                  cell: (payment) => (
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        normalizePaymentStatus(payment.status) === 'SUCCESS'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {normalizePaymentStatus(payment.status)}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  cell: (payment) =>
                    normalizePaymentStatus(payment.status) === 'SUCCESS' ? (
                      <button
                        onClick={() =>
                          navigate('/refund', {
                            state: { orderId: payment.orderId, amount: payment.amount },
                          })
                        }
                        className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold leading-5 text-orange-800 transition-colors hover:bg-orange-200"
                      >
                        Request Refund
                      </button>
                    ) : null,
                },
              ]}
            />
          </>
        )}
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Payment;