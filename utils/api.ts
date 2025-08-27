import { API_BASE_URL } from './config';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  type: 'send' | 'receive';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface CreateTransactionData {
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Authentication
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const users: User[] = await this.request<User[]>('/users');
      const user = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      );
      
      if (user) {
        // Don't return password in the response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      }
      
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  async register(data: RegisterData): Promise<User | null> {
    try {
      // Check if user already exists
      const users: User[] = await this.request<User[]>('/users');
      const existingUser = users.find(u => u.email === data.email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser: Omit<User, 'id' | 'createdAt'> = {
        email: data.email,
        password: data.password,
        name: data.name,
        balance: 0,
      };

      const createdUser = await this.request<User>('/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      // Don't return password in the response
      const { password, ...userWithoutPassword } = createdUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.request<User>(`/users/${id}`);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Get user failed:', error);
      return null;
    }
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<User | null> {
    try {
      const user = await this.request<User>(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ balance: newBalance }),
      });
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Update user balance failed:', error);
      return null;
    }
  }

  // Transactions
  async createTransaction(data: CreateTransactionData): Promise<Transaction | null> {
    try {
      const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
        senderId: data.senderId,
        receiverId: data.receiverId,
        amount: data.amount,
        type: 'send',
        status: 'pending',
        description: data.description,
      };

      const createdTransaction = await this.request<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });

      return createdTransaction;
    } catch (error) {
      console.error('Create transaction failed:', error);
      return null;
    }
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    try {
      const allTransactions: Transaction[] = await this.request<Transaction[]>('/transactions');
      return allTransactions.filter(t => 
        t.senderId === userId || t.receiverId === userId
      );
    } catch (error) {
      console.error('Get transactions failed:', error);
      return [];
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      return await this.request<Transaction[]>('/transactions');
    } catch (error) {
      console.error('Get all transactions failed:', error);
      return [];
    }
  }

  async updateTransactionStatus(transactionId: string, status: Transaction['status']): Promise<Transaction | null> {
    try {
      return await this.request<Transaction>(`/transactions/${transactionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Update transaction status failed:', error);
      return null;
    }
  }

  // Search users by email (for sending money)
  async searchUsersByEmail(email: string): Promise<User[]> {
    try {
      const users: User[] = await this.request<User[]>('/users');
      return users
        .filter(u => u.email.toLowerCase().includes(email.toLowerCase()))
        .map(u => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword as User;
        });
    } catch (error) {
      console.error('Search users failed:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();
