import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from '../ui/sonner';
import { BottomNav } from '../BottomNav';
import { useAuthStore } from '../../stores/authStore';

/** Pages where BottomNav should be hidden */
const PAGES_WITHOUT_NAV = [
  '/login', '/signup', '/products/', '/review/write', '/review/edit',
  '/my-applications', '/my-favorites', '/create-product', '/manage-applicants',
  '/notifications', '/review-management', '/point-shop', '/point-history',
  '/dashboard', '/terms', '/privacy', '/store-registration',
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut",
  duration: 0.3,
};

export function AppLayout() {
  const location = useLocation();
  const userInfo = useAuthStore(s => s.userInfo);

  const shouldHideNav = PAGES_WITHOUT_NAV.some(path => location.pathname.startsWith(path))
    || location.pathname.includes('/products/');

  const showBottomNav = userInfo && !shouldHideNav;

  // Determine active tab from path
  const getActiveTab = (): "home" | "review" | "profile" => {
    if (location.pathname.startsWith('/review')) return 'review';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-[#fffef5]">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {showBottomNav && (
        <BottomNav
          activeTab={getActiveTab()}
          onTabChange={() => {}} // Now handled by Link navigation
          userType={userInfo.userType}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
