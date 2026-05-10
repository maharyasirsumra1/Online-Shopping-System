import { Link } from 'react-router-dom';

function NavBar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">Online Shop</Link>
      </div>
      <nav className="navbar-links">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/orders">Orders</Link>
        {user ? (
          <>
            <span className="navbar-user">Hi, {user.first_name}</span>
            <button className="btn-link" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
