import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Typography, Box, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { notificationService, Notification } from '../../Services/NotificationService';
import { useObservable } from './useObservable';

const NotificationList: React.FC = () => {
  const notifications = useObservable(notificationService.list(), []);

  const handleMarkAsRead = (notification: Notification) => {
    notificationService.markAsRead(notification);
  };

  const handleClearAllNotifications = () => {
    notificationService.clearAllNotifications();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleClearAllNotifications}>
          Clear All
        </Button>
      </Box>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index} sx={{ mb: 2, position: 'relative' }}>
            <Paper
              sx={{
                p: 2,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'background.paper',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'background.default',
                  color: 'text.primary',
                },
              }}
              onClick={() => handleMarkAsRead(notification)}
            >
              <ListItemText
                primary={<Typography variant="h6">{notification.title}</Typography>}
                secondary={`${notification.message} - ${formatDate(notification.date)}`}
              />
              <ListItemSecondaryAction
                sx={{
                  position: 'absolute',
                  right: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <IconButton edge="end" aria-label="mark as read" onClick={() => handleMarkAsRead(notification)}>
                  <CheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationList;
