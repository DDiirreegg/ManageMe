import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import UserService, { User } from '../Models/User';

const ProfileContainer: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = UserService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <div>
      {currentUser ? (
        <Profile user={currentUser} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfileContainer;

// import React from 'react';
// import Profile from './Profile';
// import { CircularProgress, Box, Typography } from '@mui/material';
// import { useUser } from './UserContext';

// const ProfileContainer: React.FC = () => {
//   const { currentUser } = useUser();

//   return (
//     <Box sx={{ p: 2 }}>
//       {currentUser ? (
//         <Profile user={currentUser} />
//       ) : (
//         <Box sx={{ textAlign: 'center' }}>
//           <CircularProgress />
//           <Typography variant="body1" sx={{ mt: 2 }}>Loading...</Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };
