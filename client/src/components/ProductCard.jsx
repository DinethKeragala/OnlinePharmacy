import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ id, name, price, image, description }) => {
  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_id: id,
          quantity: 1
        })
      });

      if (response.ok) {
        // You can add a toast notification here
        console.log('Product added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/product/${id}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-bold">${price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            aria-label="Add to cart"
          >
            <AddShoppingCartIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
