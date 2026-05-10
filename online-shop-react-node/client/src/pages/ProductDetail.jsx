import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchProduct,
  fetchReviews,
  addCartItem,
  addWishlistItem,
  submitReview,
} from '../api/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', review: '', rating: 5 });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct(id).then(setProduct).catch(() => setProduct(null));
    fetchReviews(id).then(setReviews).catch(() => setReviews([]));
  }, [id]);

  const addToCart = async () => {
    try {
      await addCartItem({ productId: id, qty: quantity });
      setMessage('Added to cart');
    } catch (error) {
      setMessage(error.error || 'Could not add to cart');
    }
  };

  const addToWishlist = async () => {
    try {
      await addWishlistItem({ productId: id });
      setMessage('Added to wishlist');
    } catch (error) {
      setMessage(error.error || 'Could not add to wishlist');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      await submitReview({
        productId: id,
        name: reviewForm.name,
        email: reviewForm.email,
        review: reviewForm.review,
        rating: reviewForm.rating,
      });
      setReviewForm({ name: '', email: '', review: '', rating: 5 });
      setMessage('Review submitted');
      fetchReviews(id).then(setReviews);
    } catch (error) {
      setMessage(error.error || 'Could not submit review');
    }
  };

  if (!product) {
    return <div className="page">Product not found.</div>;
  }

  const imageUrl = product.product_image?.startsWith('http') ? product.product_image : `/images/${product.product_image}`;

  return (
    <section className="product-detail-page">
      <div className="product-detail-card">
        <img src={imageUrl} alt={product.product_title} className="product-detail-image" />
        <div className="product-detail-info">
          <h1>{product.product_title}</h1>
          <p>{product.product_desc}</p>
          <div className="product-detail-meta">
            <span>${product.product_price}</span>
            <span>{product.brand_title}</span>
            <span>{product.cat_title}</span>
          </div>
          <div className="quantity-control">
            <label>Qty</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </div>
          <button onClick={addToCart}>Add to Cart</button>
          <button onClick={addToWishlist}>Add to Wishlist</button>
          {message && <p className="notice">{message}</p>}
        </div>
      </div>
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? <p>No reviews yet</p> : null}
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.review_id}>
              <strong>{review.name}</strong> ({review.rating}/5)
              <p>{review.review}</p>
              <small>{new Date(review.datetime).toLocaleString()}</small>
            </li>
          ))}
        </ul>
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Write a review</h3>
          <input
            value={reviewForm.name}
            onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })}
            placeholder="Your name"
          />
          <input
            type="email"
            value={reviewForm.email}
            onChange={(event) => setReviewForm({ ...reviewForm, email: event.target.value })}
            placeholder="Your email"
          />
          <textarea
            value={reviewForm.review}
            onChange={(event) => setReviewForm({ ...reviewForm, review: event.target.value })}
            placeholder="Your review"
          />
          <label>
            Rating
            <select
              value={reviewForm.rating}
              onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Submit review</button>
        </form>
      </div>
    </section>
  );
}

export default ProductDetail;
