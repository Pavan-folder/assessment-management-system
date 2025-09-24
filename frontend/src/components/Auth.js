const { useState } = window.React;

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    onLogin(userData);
  };

  const handleSignup = (userData) => {
    localStorage.setItem('token', userData.token);
    onLogin(userData);
  };

  const switchToLogin = () => setIsLogin(true);
  const switchToSignup = () => setIsLogin(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-2xl font-bold">AS</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Assessment Management</h2>
          <p className="text-lg text-gray-300">
            {isLogin ? 'Welcome back to your account' : 'Create your account to get started'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          {isLogin ? (
            <window.LoginForm onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
          ) : (
            <window.SignupForm onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Secure authentication powered by JWT tokens
          </p>
        </div>
      </div>
    </div>
  );
}

// Make Auth globally available
window.Auth = Auth;
