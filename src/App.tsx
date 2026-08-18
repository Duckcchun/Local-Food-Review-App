import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/common/ErrorBoundary';

/**
 * Root App component.
 *
 * After the architecture refactoring, this file is intentionally minimal:
 * - ErrorBoundary wraps the entire app for unhandled errors
 * - RouterProvider handles all routing via react-router-dom v6
 * - State management lives in Zustand stores (src/stores/)
 * - Business logic lives in custom hooks (src/hooks/)
 * - Page-level components live in src/pages/ (thin wrappers connecting stores to components)
 * - UI components remain in src/components/
 */
export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
