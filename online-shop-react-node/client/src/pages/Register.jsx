import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { setToken } from '../utils/auth';

function Register({ onRegister }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    address1: '',
    address2: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await register(form);
      setToken(data.token);
      onRegister(data.user);
      navigate('/');
    } catch (error) {
      setMessage(error.error || 'Registration failed');
    }
  };

  return (
    <section>
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          value={form.firstName}
          onChange={(event) => setForm({ ...form, firstName: event.target.value })}
          placeholder="First name"
          required
        />
        <input
          value={form.lastName}
          onChange={(event) => setForm({ ...form, lastName: event.target.value })}
          placeholder="Last name"
          required
        />
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
        <input
          value={form.mobile}
          onChange={(event) => setForm({ ...form, mobile: event.target.value })}
          placeholder="Mobile"
        />
        <input
          value={form.address1}
          onChange={(event) => setForm({ ...form, address1: event.target.value })}
          placeholder="Address line 1"
        />
        <input
          value={form.address2}
          onChange={(event) => setForm({ ...form, address2: event.target.value })}
          placeholder="Address line 2"
        />
        <button type="submit">Register</button>
        {message && <p className="notice">{message}</p>}
      </form>
    </section>
  );
}

export default Register;
