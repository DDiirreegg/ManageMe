import { User, Role } from '../Models/User';

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


// import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
// import { User } from '../Models/User';

// const db = getFirestore();

// class UserService {
//   private userCollection = collection(db, 'users');
//   private currentUser: User | null = null;

//   async getAllUsers(): Promise<User[]> {
//     const snapshot = await getDocs(this.userCollection);
//     const users: User[] = [];
//     snapshot.forEach(doc => {
//       users.push({ id: doc.id, ...doc.data() } as User);
//     });
//     return users;
//   }

//   async createUser(user: User): Promise<void> {
//     await addDoc(this.userCollection, { ...user });
//   }

//   async getCurrentUser(userId: string): Promise<User | null> {
//     const userDoc = await getDoc(doc(this.userCollection, userId));
//     if (userDoc.exists()) {
//       this.currentUser = { id: userDoc.id, ...userDoc.data() } as User;
//       return this.currentUser;
//     }
//     return null;
//   }

//   async setCurrentUser(user: User): Promise<void> {
//     if (user.id) {
//       const userDocRef = doc(this.userCollection, user.id);
//       await updateDoc(userDocRef, { ...user });
//       this.currentUser = user;
//     } else {
//       throw new Error('User ID is required to set the current user.');
//     }
//   }
// }

// export default new UserService();
