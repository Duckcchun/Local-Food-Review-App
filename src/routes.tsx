import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard } from './components/layout/AuthGuard';
import { PageSkeleton } from './components/common/PageSkeleton';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const ReviewWritePage = lazy(() => import('./pages/ReviewWritePage'));
const EditReviewPage = lazy(() => import('./pages/EditReviewPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyApplicationsPage = lazy(() => import('./pages/MyApplicationsPage'));
const MyFavoritesPage = lazy(() => import('./pages/MyFavoritesPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const PointShopPage = lazy(() => import('./pages/PointShopPage'));
const PointHistoryPage = lazy(() => import('./pages/PointHistoryPage'));
const CreateProductPage = lazy(() => import('./pages/CreateProductPage'));
const ManageApplicantsPage = lazy(() => import('./pages/ManageApplicantsPage'));
const ReviewManagementPage = lazy(() => import('./pages/ReviewManagementPage'));
const BusinessDashboardPage = lazy(() => import('./pages/BusinessDashboardPage'));
const StoreRegistrationPage = lazy(() => import('./pages/StoreRegistrationPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ReviewerProfilePage = lazy(() => import('./pages/ReviewerProfilePage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Public routes (no auth required)
      {
        path: 'login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: 'signup',
        element: <SuspenseWrapper><SignupPage /></SuspenseWrapper>,
      },
      {
        path: 'auth/callback',
        element: <SuspenseWrapper><AuthCallbackPage /></SuspenseWrapper>,
      },

      // Protected routes (auth required)
      {
        element: <AuthGuard />,
        children: [
          {
            index: true,
            element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
          },
          {
            path: 'products/:productId',
            element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper>,
          },
          {
            path: 'review',
            element: <SuspenseWrapper><ReviewPage /></SuspenseWrapper>,
          },
          {
            path: 'review/write/:productId',
            element: <SuspenseWrapper><ReviewWritePage /></SuspenseWrapper>,
          },
          {
            path: 'review/edit/:reviewId',
            element: <SuspenseWrapper><EditReviewPage /></SuspenseWrapper>,
          },
          {
            path: 'profile',
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
          },
          {
            path: 'my-applications',
            element: <SuspenseWrapper><MyApplicationsPage /></SuspenseWrapper>,
          },
          {
            path: 'my-favorites',
            element: <SuspenseWrapper><MyFavoritesPage /></SuspenseWrapper>,
          },
          {
            path: 'notifications',
            element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper>,
          },
          {
            path: 'point-shop',
            element: <SuspenseWrapper><PointShopPage /></SuspenseWrapper>,
          },
          {
            path: 'point-history',
            element: <SuspenseWrapper><PointHistoryPage /></SuspenseWrapper>,
          },
          {
            path: 'create-product',
            element: <SuspenseWrapper><CreateProductPage /></SuspenseWrapper>,
          },
          {
            path: 'manage-applicants/:productId',
            element: <SuspenseWrapper><ManageApplicantsPage /></SuspenseWrapper>,
          },
          {
            path: 'review-management',
            element: <SuspenseWrapper><ReviewManagementPage /></SuspenseWrapper>,
          },
          {
            path: 'dashboard',
            element: <SuspenseWrapper><BusinessDashboardPage /></SuspenseWrapper>,
          },
          {
            path: 'store-registration',
            element: <SuspenseWrapper><StoreRegistrationPage /></SuspenseWrapper>,
          },
          {
            path: 'terms',
            element: <SuspenseWrapper><TermsPage /></SuspenseWrapper>,
          },
          {
            path: 'privacy',
            element: <SuspenseWrapper><PrivacyPage /></SuspenseWrapper>,
          },
          {
            path: 'reviewer/:userId?',
            element: <SuspenseWrapper><ReviewerProfilePage /></SuspenseWrapper>,
          },
        ],
      },

      // Catch-all redirect
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
