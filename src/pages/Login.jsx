import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCont } from '../context/AuthCont';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login } = useContext(AuthCont);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/'); // Login ke baad home par bhej do
    } else {
      setLocalError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <div className="auth-header">
          <div className="auth-logo">
            <LogIn size={32} className="text-primary" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to stay connected with your community.</p>
        </div>

        <Alert message={localError} type="danger" />

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            icon={Mail}
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label small text-secondary" htmlFor="remember">
                Remember me
              </label>
            </div>
            <Link to="#" className="small text-primary text-decoration-none fw-semibold">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" loading={loading} fullWidth variant="primary">
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;