import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import NotificationCounter from './Notification/NotificationCounter';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  username: string;
  onTabChange: (tab: 'profile' | 'projects' | 'settings' | 'notifications') => void;
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, username, onTabChange }) => {
  return (
    <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h5" align="center" gutterBottom>ManageMe</Typography>
        <Button fullWidth variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => onTabChange('profile')}>
          Your profile, {username}!
        </Button>
        <Button fullWidth variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => onTabChange('projects')}>
          Projects
        </Button>
        <Button fullWidth variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => onTabChange('settings')}>
          Settings
        </Button>
        <Button fullWidth variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => onTabChange('notifications')}>
          Notifications          
        </Button>
        <NotificationCounter onClick={() => onTabChange('notifications')} />
      </Box>
      {isLoggedIn && (
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      )}
    </Box>
  );
};

export default Header;
