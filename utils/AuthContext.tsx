import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for demo purposes
const DEMO_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User'
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Loading stored auth...');
    let mounted = true;
    
    const loadAuth = async () => {
      try {
        console.log('AuthProvider: loadStoredAuth called');
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUserStr = await AsyncStorage.getItem('auth_user');
        
        if (mounted && storedToken && storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            console.log('AuthProvider: Found stored auth, setting user');
            setToken(storedToken);
            setUser(storedUser);
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
            // Clear corrupted data
            await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
          }
        } else {
          console.log('AuthProvider: No stored auth found');
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Login attempt for', email);
      
      // Mock login - accept demo credentials or any valid email/password
      if (email === 'demo@example.com' && password === 'password') {
        const mockToken = `mock_token_${Date.now()}`;
        const mockUser = DEMO_USER;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('auth_token', mockToken);
        await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
        console.log('AuthProvider: Login successful, user set');
        return true;
      } else if (email && password) {
        // Accept any valid email/password for demo purposes
        const mockToken = `mock_token_${Date.now()}`;
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0] // Use email prefix as name
        };
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('auth_token', mockToken);
        await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
        console.log('AuthProvider: Login successful, user set');
        return true;
      }
      
      console.log('AuthProvider: Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Registration attempt for', email);
      
      // Mock registration - always succeed for demo purposes
      const mockToken = `mock_token_${Date.now()}`;
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name
      };
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setToken(mockToken);
      console.log('AuthProvider: Registration successful, user set');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('AuthProvider: Logout called');
      // Clear state first
      setUser(null);
      setToken(null);
      
      // Clear storage
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    login,
    register,
    logout
  }), [user, token, isLoading, login, register, logout]);

  console.log('AuthProvider: Rendering with user:', user ? 'logged in' : 'not logged in', 'isLoading:', isLoading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
