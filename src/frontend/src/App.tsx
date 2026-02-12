import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import Header from './components/Header';
import Footer from './components/Footer';
import PublicHome from './pages/PublicHome';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import AccessDeniedScreen from './components/AccessDeniedScreen';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [showAdmin, setShowAdmin] = useState(false);

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAdmin(false);
    }
  }, [isAuthenticated]);

  const handleAdminToggle = () => {
    setShowAdmin(!showAdmin);
  };

  if (isAuthenticated && isAdmin && showAdmin) {
    if (adminLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <Header onAdminToggle={handleAdminToggle} showAdminToggle={true} isAdminView={true} />
        <AdminDashboard />
        <Footer />
        {showProfileSetup && <ProfileSetupModal />}
      </>
    );
  }

  if (isAuthenticated && !isAdmin && !adminLoading) {
    return <AccessDeniedScreen />;
  }

  return (
    <>
      <Header onAdminToggle={handleAdminToggle} showAdminToggle={isAuthenticated && isAdmin} isAdminView={false} />
      <PublicHome />
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
