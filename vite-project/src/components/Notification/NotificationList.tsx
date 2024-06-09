import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { notificationService, Notification } from '../../Services/NotificationService';
import { useObservable } from './useObservable';

const NotificationList: React.FC = () => {
  const notifications = useObservable(notificationService.list(), []);

  const handleMarkAsRead = (notification: Notification) => {
    notificationService.markAsRead(notification);
  };

  return (
    <List>
      {notifications.map((notification, index) => (
        <ListItem key={index} button>
          <ListItemText
            primary={notification.title}
            secondary={`${notification.message} - ${notification.date}`}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="mark as read" onClick={() => handleMarkAsRead(notification)}>
              <CheckIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;
