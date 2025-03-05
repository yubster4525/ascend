import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const toggleMode = () => setIsRegister(!isRegister);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await registerUser(formData.username, formData.email, formData.password);
        alert('Registered successfully. Please log in.');
        setIsRegister(false);
      } else {
        const res = await loginUser(formData.email, formData.password);
        localStorage.setItem('token', res.token);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ margin: '50px' }}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <label>Username</label>
            <br />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <br />
          </>
        )}
        <label>Email</label>
        <br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <label>Password</label>
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>

      <p onClick={toggleMode} style={{ cursor: 'pointer', color: 'blue' }}>
        {isRegister ? 'Already have an account? Login' : 'No account? Register'}
      </p>
    </div>
  );
};

export default LoginPage;