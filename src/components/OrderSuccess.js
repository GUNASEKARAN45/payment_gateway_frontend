import React from 'react';

function OrderSuccess({ orderDetails, onContinue }) {
  const { orderId, cart, total, location } = orderDetails;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-8xl mb-6">✅</div>
        <h2 className="text-4xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-2">Thank you for your purchase</p>
        <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold mb-3 text-lg">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mb-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid:</span>
              <span className="text-green-600">₹{total}</span>
            </div>
          </div>
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600"><strong>Delivery Address:</strong></p>
            <p className="text-sm text-gray-700 mt-1">{location}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Your order will be delivered within 3-5 business days. You will receive a confirmation email shortly.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;