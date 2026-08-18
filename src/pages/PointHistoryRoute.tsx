import { useNavigate } from 'react-router-dom';
import { PointHistory } from '../components/PointHistory';
import { usePointStore } from '../stores/pointStore';

export function PointHistoryRoute() {
  const navigate = useNavigate();
  const { pointTransactions, userPoints } = usePointStore();

  return (
    <PointHistory
      onBack={() => navigate('/profile')}
      transactions={pointTransactions}
      currentPoints={userPoints}
    />
  );
}
