import React from 'react';
import { User } from '../Models/User';
import { Card, CardContent, Typography } from '@mui/material';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Your Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Username: {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role: {user.role}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Profile;
