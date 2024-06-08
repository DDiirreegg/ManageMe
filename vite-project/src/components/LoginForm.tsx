import React, { useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginFormProps {
  onLoginSuccess: (token: string, refreshToken: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      onLoginSuccess(response.data.accessToken, response.data.refreshToken);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleGoogleLoginSuccess = async (token: string) => {
    try {
      const response = await axios.post('http://localhost:3000/google-login', { token });
      onLoginSuccess(response.data.accessToken, response.data.refreshToken);
    } catch (err) {
      setError('Google login failed');
    }
  };

  const handleGoogleLoginFailure = (error: any) => {
    setError('Google login failed');
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} onLoginFailure={handleGoogleLoginFailure} />
    </div>
  );
};

export default LoginForm;
