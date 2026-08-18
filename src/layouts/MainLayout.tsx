import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { useAuthStore } from '../stores/authStore';

/**
 * Main layout for authenticated pages that show the bottom navigation bar.
 * Only shows BottomNav on the three main tabs: home, review, profile.
 */
export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuthStore();

  // Determine active tab from current route
  const getActiveTab = (): "home" | "review" | "profile" => {
    const path = location.pathname;
    if (path.startsWith('/review')) return 'review';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  // Only show bottom nav on main tab pages
  const showBottomNav = ['/', '/review', '/profile'].includes(location.pathname);

  const handleTabChange = (tab: "home" | "review" | "profile") => {
    switch (tab) {
      case 'home': navigate('/'); break;
      case 'review': navigate('/review'); break;
      case 'profile': navigate('/profile'); break;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Outlet />
      {showBottomNav && userInfo && (
        <BottomNav
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
          userType={userInfo.userType}
        />
      )}
    </div>
  );
}
