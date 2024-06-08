import React, { useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from './GoogleLoginButton';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';

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
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Welcome to ManageMe
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
          />
          <TextField
            margin="dense"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Register
          </Button>
        </Box>
        <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} onLoginFailure={handleGoogleLoginFailure} />
      </Box>
    </Container>
  );
};

export default LoginForm;
