import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import UserService, { User } from '../Models/User';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProfileContainer: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = UserService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {currentUser ? (
        <Profile user={currentUser} />
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProfileContainer;
