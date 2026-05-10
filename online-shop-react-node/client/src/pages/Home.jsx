import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../api/api';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts({ limit: 12 })
      .then((data) => setProducts(data.data))
      .catch(() => setProducts([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProducts({ search, limit: 12 })
      .then((data) => setProducts(data.data))
      .catch(() => setProducts([]));
  };

  return (
    <section>
      <div className="hero">
        <h1>Welcome to the React Online Shop</h1>
        <p>Browse products, add to cart, wishlist, and checkout using a Node/Express API.</p>
      </div>

      <div className="home-panel">
        <div className="filters-panel">
          <h2>Categories</h2>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.cat_id}>{category.cat_title}</li>
            ))}
          </ul>
        </div>
        <div className="products-panel">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
