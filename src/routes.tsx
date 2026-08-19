import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { useAuthStore } from './stores/authStore';

// Page route components
import { HomeRoute } from './pages/HomeRoute';
import { ProductDetailRoute } from './pages/ProductDetailRoute';
import { ReviewRoute } from './pages/ReviewRoute';
import { ReviewWriteRoute } from './pages/ReviewWriteRoute';
import { EditReviewRoute } from './pages/EditReviewRoute';
import { ProfileRoute } from './pages/ProfileRoute';
import { PointShopRoute } from './pages/PointShopRoute';
import { PointHistoryRoute } from './pages/PointHistoryRoute';
import { MyApplicationsRoute } from './pages/MyApplicationsRoute';
import { MyFavoritesRoute } from './pages/MyFavoritesRoute';
import { CreateProductRoute } from './pages/CreateProductRoute';
import { ManageApplicantsRoute } from './pages/ManageApplicantsRoute';
import { NotificationsRoute } from './pages/NotificationsRoute';
import { ReviewManagementRoute } from './pages/ReviewManagementRoute';
import { BusinessDashboardRoute } from './pages/BusinessDashboardRoute';
import { SignupRoute } from './pages/SignupRoute';
import { LoginRoute } from './pages/LoginRoute';
import { ForgotPasswordRoute } from './pages/ForgotPasswordRoute';
import { EditProfileRoute } from './pages/EditProfileRoute';
import { StoreRegistrationRoute } from './pages/StoreRegistrationRoute';
import { TermsRoute } from './pages/TermsRoute';
import { PrivacyRoute } from './pages/PrivacyRoute';
import { MyItemsRoute } from './pages/MyItemsRoute';
import { AuthCallbackRoute } from './pages/AuthCallbackRoute';
import { MessagesRoute } from './pages/MessagesRoute';
import { NoticeRoute } from './pages/NoticeRoute';

/**
 * Auth guard component: redirects unauthenticated users to signup.
 */
function RequireAuth({ children }: { children: ReactNode }) {
  const { userInfo, accessToken, isSessionRestoring } = useAuthStore();

  // If session is restoring, show loader
  if (isSessionRestoring || (!userInfo && accessToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
}

/**
 * Guest-only guard: redirects authenticated users to home.
 */
function GuestOnly({ children }: { children: ReactNode }) {
  const { userInfo } = useAuthStore();

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  // Guest routes (signup, login, forgot-password)
  {
    path: '/signup',
    element: <GuestOnly><SignupRoute /></GuestOnly>,
  },
  {
    path: '/login',
    element: <GuestOnly><LoginRoute /></GuestOnly>,
  },
  {
    path: '/forgot-password',
    element: <GuestOnly><ForgotPasswordRoute /></GuestOnly>,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackRoute />,
  },

  // Authenticated routes with MainLayout
  {
    path: '/',
    element: <RequireAuth><MainLayout /></RequireAuth>,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'review', element: <ReviewRoute /> },
      { path: 'profile', element: <ProfileRoute /> },
      { path: 'product/:id', element: <ProductDetailRoute /> },
      { path: 'review-write', element: <ReviewWriteRoute /> },
      { path: 'edit-review', element: <EditReviewRoute /> },
      { path: 'point-shop', element: <PointShopRoute /> },
      { path: 'point-history', element: <PointHistoryRoute /> },
      { path: 'my-applications', element: <MyApplicationsRoute /> },
      { path: 'my-favorites', element: <MyFavoritesRoute /> },
      { path: 'create-product', element: <CreateProductRoute /> },
      { path: 'manage-applicants', element: <ManageApplicantsRoute /> },
      { path: 'notifications', element: <NotificationsRoute /> },
      { path: 'review-management', element: <ReviewManagementRoute /> },
      { path: 'business-dashboard', element: <BusinessDashboardRoute /> },
      { path: 'store-registration', element: <StoreRegistrationRoute /> },
      { path: 'edit-profile', element: <EditProfileRoute /> },
      { path: 'terms', element: <TermsRoute /> },
      { path: 'privacy', element: <PrivacyRoute /> },
      { path: 'my-items', element: <MyItemsRoute /> },
      { path: 'messages', element: <MessagesRoute /> },
      { path: 'notice', element: <NoticeRoute /> },
    ],
  },

  // Catch-all: redirect to home
  { path: '*', element: <Navigate to="/" replace /> },
]);
