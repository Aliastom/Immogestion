function UpdatePassword() {
  const { updatePassword, error, setError } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      setLoading(true);
      setError(null);
      await updatePassword(formData.password);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-xl font-semibold mb-4">Mot de passe mis à jour</h2>
          <p className="text-gray-400 mb-6">
            Votre mot de passe a été modifié avec succès.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
            Aller au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-400">
            Choisissez un nouveau mot de passe pour votre compte
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
            label="Nouveau mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Entrez votre nouveau mot de passe"
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="Confirmez votre nouveau mot de passe"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            Mettre à jour le mot de passe
          </Button>
        </form>
      </div>
    </div>
  );
}
