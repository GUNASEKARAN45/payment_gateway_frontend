import React from 'react';
import { Plus, Minus, Trash2, X } from 'lucide-react';

function Cart({ cart, updateQuantity, removeFromCart, total, onClose, onCheckout }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
  <div key={item._id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">

    {/* ✅ IMAGE */}
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 object-contain rounded"
    />

    <div className="flex-1">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-blue-600">₹{item.price}</p>
    </div>

    <div className="flex items-center gap-2">
      <button onClick={() => updateQuantity(item._id, -1)} className="p-1 hover:bg-gray-200 rounded">
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-semibold">{item.quantity}</span>
      <button onClick={() => updateQuantity(item._id, 1)} className="p-1 hover:bg-gray-200 rounded">
        <Plus className="w-4 h-4" />
      </button>
    </div>

    <button
      onClick={() => removeFromCart(item._id)}
      className="p-2 hover:bg-red-100 rounded text-red-600"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
))}

            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span className="text-blue-600">₹{total}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;