// Initialize the React application
function initializeApp() {
  try {
    // Check if all required components are loaded
    if (typeof window.Auth !== 'undefined' &&
        typeof window.Dashboard !== 'undefined' &&
        typeof window.App !== 'undefined' &&
        typeof window.React !== 'undefined' &&
        typeof window.ReactDOM !== 'undefined') {

      const root = window.ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        window.React.createElement(window.React.StrictMode, null,
          window.React.createElement(window.App, null)
        )
      );
    } else {
      // Retry after a short delay if components aren't loaded yet
      setTimeout(initializeApp, 50);
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    // Retry after error
    setTimeout(initializeApp, 100);
  }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
