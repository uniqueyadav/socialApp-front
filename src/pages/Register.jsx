import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCont } from '../context/AuthCont';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { User, Mail, Lock, Camera, UserPlus, Upload } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const fileInputRef = useRef(null); 
  const { register } = useContext(AuthCont);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    
    if (selectedFile) {
      data.append('profilePic', selectedFile); 
    }

    const result = await register(data);
    
    if (result.success) {
      navigate('/');
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
            <UserPlus size={32} className="text-primary" />
          </div>
          <h2>Create Account</h2>
          <p>Join our community and start sharing.</p>
        </div>

        <Alert message={localError} type="danger" />

        <form onSubmit={handleSubmit}>
          
          <div className="text-center mb-4">
            <div 
              className="position-relative d-inline-block cursor-pointer" 
              onClick={() => fileInputRef.current.click()}
              style={{ width: '100px', height: '100px' }}
            >
              <div className="rounded-circle border border-2 d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm" style={{ width: '100%', height: '100%' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={30} className="text-secondary" />
                )}
              </div>
              <div className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-1 shadow">
                <Upload size={14} color="white" />
              </div>
            </div>
            <input 
              type="file" 
              name="profilePic" 
              ref={fileInputRef} 
              hidden 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p className="small text-muted mt-2">Upload Profile Photo (Optional)</p>
          </div>

          <Input
            label="Username"
            icon={User}
            type="text"
            name="username"
            placeholder="johndoe123"
            value={formData.username}
            onChange={handleChange}
            required
          />

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
            placeholder="Min. 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading} fullWidth variant="primary" className="mt-2">
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;