import { useEffect, useState } from 'react';
import { fetchWishlist, removeWishlistItem } from '../services/api';
import { Link } from 'react-router-dom';

function Wishlist() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const loadItems = () => {
    fetchWishlist().then(setItems).catch(() => setItems([]));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeWishlistItem(productId);
      loadItems();
    } catch (error) {
      setMessage(error.error || 'Could not remove item');
    }
  };

  return (
    <section>
      <h2>Your Wishlist</h2>
      {message && <p className="notice">{message}</p>}
      {items.length === 0 ? (
        <p>Your wishlist is currently empty.</p>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <article key={item.id} className="wishlist-card">
              <Link to={`/product/${item.product_id}`}>{item.product_title}</Link>
              <span>${item.product_price}</span>
              <button onClick={() => handleRemove(item.product_id)}>Remove</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
