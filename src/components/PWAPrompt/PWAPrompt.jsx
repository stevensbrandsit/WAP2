import { useEffect, useState } from 'react';

function PWAPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      });
    }
  };

  if (!showInstallPrompt && !updateAvailable) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white rounded-lg shadow-2xl border-2 border-brand-primary p-4 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.295 1.674 1.085 1.674.443 0 .866-.165 1.195-.468l.627-.627a1 1 0 111.414 1.414l-.627.627a3.989 3.989 0 01-2.609.98c-1.857 0-3.204-1.794-2.609-3.774L6.483 10.2a1 1 0 011.894-.68z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-brand-primary text-lg mb-1">
                Installeer IWA Osaka
              </h3>
              <p className="text-black text-sm mb-3">
                Installeer deze app op je telefoon voor snelle toegang en een betere ervaring.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 font-bold text-white rounded-lg transition-all hover:opacity-90 text-sm"
                  style={{ backgroundColor: '#2d287f' }}
                >
                  Installeer
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="px-4 py-2 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition-all text-sm"
                >
                  Niet nu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Available Notification */}
      {updateAvailable && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white rounded-lg shadow-2xl border-2 border-orange-500 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-600 mb-1">
                Update beschikbaar
              </h3>
              <p className="text-black text-sm mb-3">
                Er is een nieuwe versie beschikbaar. Klik op updaten om de laatste versie te laden.
              </p>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all text-sm"
              >
                Update nu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PWAPrompt;
