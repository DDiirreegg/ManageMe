import React from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationService } from '../../Services/NotificationService';

interface NotificationCounterProps {
  onClick: () => void;
}

const NotificationCounter: React.FC<NotificationCounterProps> = ({ onClick }) => {
  const notificationService = useNotificationService();
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  React.useEffect(() => {
    const subscription = notificationService.unreadCount().subscribe(setUnreadCount);
    return () => subscription.unsubscribe();
  }, [notificationService]);

  return (
    <IconButton color="inherit" onClick={onClick}>
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationCounter;
