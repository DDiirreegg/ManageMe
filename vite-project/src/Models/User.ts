export type Role = 'admin' | 'devops' | 'developer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
}

class UserService {
  private users: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', role: 'admin' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', role: 'developer' },
    { id: '3', firstName: 'Alice', lastName: 'Johnson', role: 'devops' },
  ];

  private currentUser: User | null = this.users.find(user => user.role === 'admin') || null;

  getAllUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }
}

export default new UserService();


// export interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   password: string;
//   role: 'admin' | 'devops' | 'developer';
// }
