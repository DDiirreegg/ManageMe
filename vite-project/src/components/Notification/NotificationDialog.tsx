import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Notification } from '../../Services/NotificationService';
import NotificationService from '../../Services/NotificationService';

const NotificationDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const subscription = NotificationService.list().subscribe(notifications => {
      const latestNotification = notifications[notifications.length - 1];
      if (latestNotification && (latestNotification.priority === 'medium' || latestNotification.priority === 'high')) {
        setNotification(latestNotification);
        setOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{notification?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{notification?.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
