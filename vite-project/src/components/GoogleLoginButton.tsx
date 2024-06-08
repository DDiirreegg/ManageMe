import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onLoginSuccess: (token: string) => void;
  onLoginFailure: (error: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLoginSuccess, onLoginFailure }) => {
  const clientId = '59481472193-doc97ilgbanabgdjtv15th31gcdo8iiv.apps.googleusercontent.com'; // Ваш клиентский ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onLoginSuccess(credentialResponse.credential);
          }
        }}
        onError={() => {
          onLoginFailure('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
