import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import UserLayout from '../components/UserLayout';
import Footer from '../components/Footer';
import FoodieInput from '../components/FoodieInput';
import FoodieButton from '../components/FoodieButton';

const Refund = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    reason: ''
  });

  // Initialize form data from location state
  useEffect(() => {
    if (location.state?.orderId && location.state?.amount) {
      setFormData(prev => ({
        ...prev,
        orderId: location.state.orderId,
        amount: (location.state.amount / 100).toString()
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        orderId: formData.orderId,
        amount: parseFloat(formData.amount) * 100, // Convert to cents
        reason: formData.reason
      };

      const response = await axios.post('http://localhost:5003/payments/refund', payload);
      console.log('Refund response:', response.data);
      setSuccess(true);
      setFormData({ orderId: '', amount: '', reason: '' });
    } catch (err) {
      console.error('Refund error:', err);
      setError(err.response?.data?.message || 'Failed to process refund request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout title="Request Refund">
      <div className="max-w-2xl mx-auto p-6">
        {success ? (
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Refund Request Submitted</h2>
            <p className="text-green-600 mb-6">Your refund request has been successfully submitted and is being processed.</p>
            <FoodieButton onClick={() => navigate('/orders')}>View Orders</FoodieButton>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Request a Refund</h2>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <FoodieInput
                label="Order ID"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="Enter your order ID"
                required
                readOnly
                className="bg-gray-50"
              />

              <div>
                <FoodieInput
                  label="Refund Amount (LKR)"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  icon={<DollarSign className="w-5 h-5" />}
                  required
                  readOnly
                  className="bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">This amount is from your original payment</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Reason for Refund
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 focus:border-[#FF7A00] transition-all"
                  rows={4}
                  placeholder="Please explain why you're requesting a refund"
                  required
                />
              </div>

              <FoodieButton
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit Refund Request'}
              </FoodieButton>
            </form>
          </>
        )}
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Refund;