import React from 'react';
import {
  signIn as signInService,
  signUp as signUpService,
  confirmSignUp as confirmSignUpService,
  signOut as signOutService,
  getSession,
  getAccessToken,
} from '../services/auth';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);

  const bootstrap = React.useCallback(async () => {
    try {
      const session = await getSession();
      setUser(session?.user || null);
      setToken(session?.session?.getAccessToken().getJwtToken() || null);
    } catch (err) {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const signIn = async (email, password) => {
    const result = await signInService(email, password);
    const accessToken = result.session.getAccessToken().getJwtToken();
    setUser(result.user);
    setToken(accessToken);
    return accessToken;
  };

  const signUp = async (email, password) => {
    return signUpService(email, password);
  };

  const confirmSignUp = async (email, code) => {
    return confirmSignUpService(email, code);
  };

  const signOut = async () => {
    signOutService();
    setUser(null);
    setToken(null);
  };

  const refreshToken = async () => {
    const accessToken = await getAccessToken();
    setToken(accessToken);
    return accessToken;
  };

  const value = {
    loading,
    user,
    token,
    isAuthenticated: Boolean(user && token),
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
