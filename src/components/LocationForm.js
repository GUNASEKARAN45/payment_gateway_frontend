import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

function LocationForm({ onSubmit, total }) {
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert('Please enter your location!');
      return;
    }
    onSubmit(location);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Delivery Location</h2>
        </div>
        <p className="text-gray-600 mb-6">Please enter your delivery address</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your complete address..."
            className="w-full border-2 border-gray-300 rounded-lg p-4 mb-6 h-32 focus:border-blue-500 focus:outline-none"
            required
          />
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Order Total:</span>
              <span className="text-blue-600">₹{total}</span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default LocationForm;