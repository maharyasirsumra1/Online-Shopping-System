import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { setToken } from '../utils/auth';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(form);
      setToken(data.token);
      onLogin(data.user);
      navigate('/');
    } catch (error) {
      setMessage(error.error || 'Login failed');
    }
  };

  return (
    <section>
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {message && <p className="notice">{message}</p>}
      </form>
    </section>
  );
}

export default Login;
