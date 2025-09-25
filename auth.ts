// Local authentication system that works immediately
interface User {
  email: string;
  password: string;
  id: string;
  cashAppHandle?: string;
  squareAccessToken?: string;
  balance: number;
  totalEarnings: number;
}

// Store users in localStorage for persistence
const USERS_KEY = 'ai_wealth_users';
const SESSION_KEY = 'ai_wealth_session';

// Initialize with demo user
const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: 'demo-user',
        email: 'demo@example.com',
        password: 'demo123',
        cashAppHandle: '$demo',
        balance: 1000,
        totalEarnings: 0
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

initializeUsers();

export const authService = {
  signUp: async (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      balance: 100, // Start with $100 bonus
      totalEarnings: 0
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto sign in after signup
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return { user: newUser };
  },
  
  signIn: async (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { user };
  },
  
  signOut: async () => {
    localStorage.removeItem(SESSION_KEY);
  },
  
  getSession: () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? { user: JSON.parse(session) } : null;
  },
  
  updateUser: (updates: Partial<User>) => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    
    const currentUser = JSON.parse(session);
    const updatedUser = { ...currentUser, ...updates };
    
    // Update in users list
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    // Update session
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },
  
  addEarnings: (amount: number) => {
    const session = authService.getSession();
    if (!session) return null;
    
    return authService.updateUser({
      balance: session.user.balance + amount,
      totalEarnings: session.user.totalEarnings + amount
    });
  }
};