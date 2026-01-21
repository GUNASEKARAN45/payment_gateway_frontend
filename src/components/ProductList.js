import React from 'react';

function ProductList({ products, addToCart }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >

            {/* ✅ IMAGE RENDERING */}
            <img
              src={product.image}
              alt={product.name}
              className="w-32 h-32 object-contain mx-auto mb-4"
            />

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              {product.description}
            </p>

            <p className="text-2xl font-bold text-blue-600 mb-4">
              ₹{product.price}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
