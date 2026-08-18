import { useNavigate } from 'react-router-dom';
import { PointHistory } from '../components/PointHistory';
import { usePointStore } from '../stores/pointStore';

export default function PointHistoryPage() {
  const navigate = useNavigate();
  const { pointTransactions, userPoints } = usePointStore();

  return (
    <PointHistory
      onBack={() => navigate(-1)}
      transactions={pointTransactions}
      currentPoints={userPoints}
    />
  );
}
