import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import LocationForm from './components/LocationForm';
import PaymentModal from './components/PaymentModal';
import OrderSuccess from './components/OrderSuccess';
import { ShoppingCart } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://payment-gateway-backend-2.onrender.com/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [step, setStep] = useState('shopping');
  const [location, setLocation] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item._id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const proceedToLocation = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setStep('location');
    setShowCart(false);
  };

  const handleLocationSubmit = async (locationData) => {
    setLocation(locationData);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        location: locationData,
        status: 'pending',
      };

      const response = await axios.post(`${API_URL}/orders`, orderData);
      setOrderId(response.data._id);
      setStep('payment');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, {
        paymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        status: 'paid',
      });

      setOrderDetails({
        orderId,
        cart,
        total,
        location,
      });

      setStep('success');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setLocation('');
    setOrderId(null);
    setOrderDetails(null);
    setStep('shopping');
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Tech Store</h1>
          {step === 'shopping' && (
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {step === 'shopping' && (
        <ProductList products={products} addToCart={addToCart} />
      )}

      {showCart && step === 'shopping' && (
        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          total={total}
          onClose={() => setShowCart(false)}
          onCheckout={proceedToLocation}
        />
      )}

      {step === 'location' && (
        <LocationForm
          onSubmit={handleLocationSubmit}
          total={total}
        />
      )}

      {step === 'payment' && (
        <PaymentModal
          amount={total}
          orderId={orderId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setStep('location')}
        />
      )}

      {step === 'success' && orderDetails && (
        <OrderSuccess
          orderDetails={orderDetails}
          onContinue={resetOrder}
        />
      )}
    </div>
  );
}

export default App;