function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      // Check active sessions and sets the user
      const session = supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      reportError(error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await api.auth.signIn(credentials.email, credentials.password);
      if (error) throw error;
      setUser(data.user);
      return data.user;
    } catch (error) {
      reportError(error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await api.auth.signUp(userData.email, userData.password, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        accountType: userData.accountType,
        companyName: userData.companyName,
        siret: userData.siret
      });
      if (error) throw error;
      return data;
    } catch (error) {
      reportError(error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.auth.signOut();
      setUser(null);
    } catch (error) {
      reportError(error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
}

const AuthContext = React.createContext(null);

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
