import React from 'react';
import { Button, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
    <Box sx={{ width: '250px', backgroundColor: '#1a202c', color: '#fff', height: '100vh', padding: '20px' }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: '#fff' }}>ManageMe</Typography>
      <Divider sx={{ bgcolor: '#2d3748' }} />
      <List component="nav" sx={{ mt: 2 }}>
        <ListItem button onClick={() => onTabChange('profile')}>
          <ListItemIcon>
            <HomeIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary={`Your profile, ${username}!`} />
        </ListItem>
        <ListItem button onClick={() => onTabChange('projects')}>
          <ListItemIcon>
            <AssessmentIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button onClick={() => onTabChange('settings')}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={() => onTabChange('notifications')}>
          <ListItemIcon>
          <NotificationCounter onClick={() => onTabChange('notifications')}/>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            
          </ListItemIcon>
        </ListItem>
      </List>
      <Divider sx={{ bgcolor: '#2d3748', my: 2 }} />
      {isLoggedIn && (
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onLogout}
          sx={{ mt: 2, bgcolor: '#e53e3e' }}
        >
          Logout
        </Button>
      )}
    </Box>
  );
};

export default Header;
