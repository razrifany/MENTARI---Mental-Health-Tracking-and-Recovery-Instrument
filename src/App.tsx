import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/auth/LoginView';
import { UserAppView } from './components/user/UserAppView';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainApp() {
  const { currentUser } = useApp();
  const [viewOverride, setViewOverride] = useState<'user' | 'admin' | null>(null);

  // If not logged in, show LoginView
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={(target) => {
          setViewOverride(target);
        }}
      />
    );
  }

  // Determine current active view:
  // If viewOverride is set, use it; otherwise infer from currentUser.role
  const currentView =
    viewOverride || (currentUser.role === 'ibu' ? 'user' : 'admin');

  return (
    <div>
      {currentView === 'user' ? (
        <UserAppView onSwitchToAdmin={() => setViewOverride('admin')} />
      ) : (
        <AdminDashboard onSwitchToUser={() => setViewOverride('user')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
