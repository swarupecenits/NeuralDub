import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, databases, appwriteConfig } from '../lib/appwrite';
import { ID, Models } from 'appwrite';

interface User extends Models.User<Models.Preferences> {
  name: string;
  email: string;
}

interface UserProfile {
  $id?: string;
  userId?: string;
  name: string;
  phone?: string;
  country?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser as User);
      await fetchProfile(currentUser.$id);
    } catch (error) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      // Get document by user ID (document ID = user ID)
      const document = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId
      );
      
      setProfile(document as unknown as UserProfile);
    } catch (error) {
      // Profile doesn't exist yet, that's ok
      console.log('No profile found for user');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create account
      const newUser = await account.create(ID.unique(), email, password, name);
      
      // Create session (auto login)
      await account.createEmailPasswordSession(email, password);
      
      // Create user profile document (use user ID as document ID)
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        newUser.$id, // Use user ID as document ID
        {
          name,
          phone: '',
          country: '',
          bio: '',
        }
      );
      
      await checkAuth();
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await checkAuth();
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  const updateProfile = async (data: UserProfile) => {
    try {
      if (!profile?.$id) throw new Error('No profile found');
      
      const updatedProfile = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        profile.$id,
        data
      );
      
      setProfile(updatedProfile as unknown as UserProfile);
    } catch (error: any) {
      throw new Error(error.message || 'Update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
