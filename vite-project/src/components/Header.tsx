import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h1 style={{ fontSize: '24px' }}>ManageMe</h1>
      {isLoggedIn && (
        <button 
          className="rounded-button" 
          style={{ alignSelf: 'center', backgroundColor: 'red', color: 'white' }} 
          onClick={onLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
