import { useEffect, useState } from 'react';
import { fetchCart, updateCartItem, removeCartItem } from '../api/api';
import { Link } from 'react-router-dom';

function Cart() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const loadCart = () => {
    fetchCart().then(setItems).catch(() => setItems([]));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (productId, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(productId, { qty });
      loadCart();
    } catch (error) {
      setMessage(error.error || 'Could not update cart');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);
      loadCart();
    } catch (error) {
      setMessage(error.error || 'Could not remove item');
    }
  };

  const total = items.reduce((sum, item) => sum + item.product_price * item.qty, 0);

  return (
    <section>
      <h2>Your Cart</h2>
      {message && <p className="notice">{message}</p>}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-table">
          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <Link to={`/product/${item.product_id}`} className="cart-title">
                {item.product_title}
              </Link>
              <span>${item.product_price}</span>
              <input
                type="number"
                value={item.qty}
                min="1"
                onChange={(event) => handleQuantityChange(item.product_id, Number(event.target.value))}
              />
              <button onClick={() => handleRemove(item.product_id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <strong>${total}</strong>
          </div>
          <Link to="/checkout" className="btn-primary">
            Continue to Checkout
          </Link>
        </div>
      )}
    </section>
  );
}

export default Cart;
