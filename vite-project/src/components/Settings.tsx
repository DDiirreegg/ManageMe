import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

interface SettingsProps {
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onToggleDarkMode, darkMode }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="body1">Dark Mode</Typography>
        <Switch checked={darkMode} onChange={onToggleDarkMode} />
      </Box>
    </Box>
  );
};

export default Settings;
