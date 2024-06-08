import React from 'react';

interface ProfileProps {
  username: string;
}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  return (
    <div>
      <h2>Your Profile</h2>
      <p>Username: {username}</p>
      {/* Дополнительная информация о профиле */}
    </div>
  );
};

export default Profile;
