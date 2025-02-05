function AuthCallback() {
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          throw new Error("No session found");
        }

        // Redirect to dashboard or home page
        window.location.href = '/dashboard';
      } catch (error) {
        reportError(error);
        setError(error.message);
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-xl font-semibold mb-2">Erreur d'authentification</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.href = '/login'}>
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <Loading />
        <p className="mt-4 text-gray-400">Redirection en cours...</p>
      </div>
    </div>
  );
}
