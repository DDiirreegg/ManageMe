import React from 'react';
import { Box, Typography, Switch, Paper, useTheme } from '@mui/material';

interface SettingsProps {
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onToggleDarkMode, darkMode }) => {
  const theme = useTheme();
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Typography variant="body1">Dark Mode</Typography>
        <Switch checked={darkMode} onChange={onToggleDarkMode} />
      </Box>
    </Paper>
  );
};

export default Settings;
