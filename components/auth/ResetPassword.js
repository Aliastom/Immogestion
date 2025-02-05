function ResetPassword() {
  const { resetPassword, error, setError } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-xl font-semibold mb-4">Email envoyé</h2>
          <p className="text-gray-400 mb-6">
            Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/login'}>
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Réinitialiser le mot de passe</h1>
          <p className="text-gray-400">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Entrez votre email"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            Envoyer le lien
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-purple-400 hover:text-purple-300">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
