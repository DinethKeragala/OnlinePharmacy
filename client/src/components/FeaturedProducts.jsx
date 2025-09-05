import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Get only first 4 products for featured section
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
        <p className="text-gray-600">Top-rated health products for your everyday needs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image_url}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
