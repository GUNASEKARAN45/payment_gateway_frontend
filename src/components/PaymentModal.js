import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function PaymentModal({ amount, orderId, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');

  useEffect(() => {
    fetchRazorpayKey();
    loadRazorpayScript();
  }, []);

  const fetchRazorpayKey = async () => {
    try {
      const response = await axios.get(`${API_URL}/payment/key`);
      setRazorpayKey(response.data.key);
    } catch (error) {
      console.error('Error fetching Razorpay key:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create Razorpay order
      const orderResponse = await axios.post(`${API_URL}/payment/create-order`, {
        amount: amount,
      });

      const options = {
        key: razorpayKey,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'TechStore',
        description: 'Order Payment',
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              onSuccess(response);
            } else {
              alert('Payment verification failed!');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          order_id: orderId,
        },
        theme: {
          color: '#2563eb',
        },
        method: {
          upi: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        alert('Payment failed! Please try again.');
        console.error('Payment failed:', response.error);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Payment</h2>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Pay via UPI</h3>
          <div className="space-y-3 text-gray-700">
            <p>✓ Secure Razorpay payment gateway</p>
            <p>✓ Support for all UPI apps (GPay, PhonePe, Paytm)</p>
            <p>✓ Instant payment confirmation</p>
            <p>✓ Multiple payment options available</p>
          </div>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between text-xl font-bold mb-2">
            <span>Amount to Pay:</span>
            <span className="text-blue-600">₹{amount}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay Now with Razorpay'}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Location
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;