// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '../Models/User';
// import UserService from '../Services/UserService';

// interface UserContextType {
//   currentUser: User | null;
//   setCurrentUser: (user: User | null) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userId = 'someUserId'; // Здесь должен быть реальный userId
//       const user = await UserService.getCurrentUser(userId);
//       setCurrentUser(user);
//     };

//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ currentUser, setCurrentUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
