import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { fetchProfiles, createProfile } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  profiles: User[];
  activeRole: UserRole;
  isLoggedIn: boolean;
  isLoading: boolean;
  selectProfile: (user: User) => void;
  switchRole: (role: UserRole) => void;
  addNewProfile: (profileData: Partial<User>) => Promise<User>;
  logout: () => void;
  loginAsRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// this function is used for providing authentication state and role switching context across the app for more info refer code-wiki.md line 90
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProfiles();
      setProfiles(data);
      
      // Default to student if available
      const defaultStudent = data.find(p => p.role === 'STUDENT') || data[0];
      if (defaultStudent) {
        setCurrentUser(defaultStudent);
        setActiveRole(defaultStudent.role);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error('Failed to load profiles', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const selectProfile = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsLoggedIn(true);
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    // Find matching profile for that role or keep current
    const matching = profiles.find(p => p.role === role);
    if (matching) {
      setCurrentUser(matching);
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const loginAsRole = (role: UserRole) => {
    switchRole(role);
    setIsLoggedIn(true);
  };

  const addNewProfile = async (profileData: Partial<User>): Promise<User> => {
    const newP = await createProfile(profileData);
    setProfiles(prev => [...prev, newP]);
    setCurrentUser(newP);
    setActiveRole(newP.role);
    setIsLoggedIn(true);
    return newP;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profiles,
        activeRole,
        isLoggedIn,
        isLoading,
        selectProfile,
        switchRole,
        addNewProfile,
        logout,
        loginAsRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// this function is used for consuming auth context in UI components for more info refer code-wiki.md line 92
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
