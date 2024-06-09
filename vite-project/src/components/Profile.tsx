import React from 'react';
import { User } from '../Models/User';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Box,
  Container,
  Divider,
} from '@mui/material';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <Container>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" component="div" gutterBottom>
                Profile Information
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="textPrimary">
                Name
              </Typography>
              <TextField
                fullWidth
                value={`${user.firstName} ${user.lastName}`}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="textPrimary">
                Role
              </Typography>
              <TextField
                fullWidth
                value={user.role}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
