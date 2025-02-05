// Configuration de l'application
const config = {
  // API endpoints
  api: {
    baseUrl: 'https://api.immogestion.com',
    version: 'v1'
  },
  
  // Supabase config
  supabase: {
    url: 'https://qhacidrzsmrbhqczsrqv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYWNpZHJ6c21yYmhxY3pzcnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNDMzNTgsImV4cCI6MjA1MTgxOTM1OH0.BDjI7lzNsuKtxMTWFEMIXAmaVPLAqFJbWFBMAfg3piM'
  }
};

// Validate Supabase config
const validateSupabaseConfig = () => {
  if (!config.supabase.url || !config.supabase.anonKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Configuration Supabase incomplète');
  }
};

try {
  validateSupabaseConfig();
  // Export the config
  window.appConfig = config;
} catch (error) {
  console.error('Configuration error:', error);
  // Show error in UI
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a202c;
          color: white;
          padding: 20px;
          text-align: center;
        ">
          <div>
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">
              Erreur de configuration
            </h1>
            <p style="color: #e53e3e;">
              ${error.message}
            </p>
            <p style="color: #718096; margin-top: 8px;">
              Veuillez vérifier la configuration dans le fichier config.js
            </p>
          </div>
        </div>
      `;
    }
  });
}
