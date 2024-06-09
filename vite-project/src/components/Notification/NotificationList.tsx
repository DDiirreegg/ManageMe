import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNotificationService, Notification } from '../../Services/NotificationService';

const NotificationList: React.FC = () => {
  const notificationService = useNotificationService();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    const subscription = notificationService.list().subscribe(setNotifications);
    return () => subscription.unsubscribe();
  }, [notificationService]);

  const markAsRead = (notification: Notification) => {
    notificationService.markAsRead(notification);
  };

  return (
    <div>
      <Typography variant="h6">Notifications</Typography>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={notification.title}
              secondary={`${notification.message} - ${notification.date}`}
            />
            {!notification.read && (
              <IconButton edge="end" onClick={() => markAsRead(notification)}>
                <CheckIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NotificationList;
