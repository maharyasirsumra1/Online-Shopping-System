import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, fetchBrands } from '../services/api';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({ category: '', brand: '', search: '' });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchBrands().then(setBrands).catch(() => setBrands([]));
    loadProducts();
  }, []);

  const loadProducts = (query = {}) => {
    fetchProducts({ ...filters, ...query, limit: 36 })
      .then((data) => setProducts(data.data))
      .catch(() => setProducts([]));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    loadProducts(nextFilters);
  };

  return (
    <section>
      <h2>All Products</h2>
      <div className="filter-row">
        <input
          type="text"
          name="search"
          placeholder="Search products"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.cat_id} value={category.cat_id}>
              {category.cat_title}
            </option>
          ))}
        </select>
        <select name="brand" value={filters.brand} onChange={handleFilterChange}>
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.brand_id} value={brand.brand_id}>
              {brand.brand_title}
            </option>
          ))}
        </select>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Products;
