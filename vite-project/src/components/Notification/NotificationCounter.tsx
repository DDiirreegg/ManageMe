import React from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notificationService } from '../../Services/NotificationService';
import { useObservable } from './useObservable';

interface NotificationCounterProps {
  onClick: () => void;
}

const NotificationCounter: React.FC<NotificationCounterProps> = ({ onClick }) => {
  const unreadCount = useObservable(notificationService.unreadCount(), 0);

  return (
    <IconButton color="inherit" onClick={onClick}>
      <Badge badgeContent={unreadCount} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationCounter;
