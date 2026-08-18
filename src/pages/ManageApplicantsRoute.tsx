import { useNavigate } from 'react-router-dom';
import { ManageApplicantsPage } from '../components/ManageApplicantsPage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useNotificationStore } from '../stores/notificationStore';
import type { ApplicationStatus, Notification } from '../types';
import { toast } from 'sonner';

export function ManageApplicantsRoute() {
  const navigate = useNavigate();
  const { userInfo, accessToken } = useAuthStore();
  const { selectedProduct, setSelectedProduct, decrementApplicants } = useProductStore();
  const { applications, updateApplicationStatus } = useApplicationStore();
  const { createNotification } = useNotificationStore();

  if (!userInfo || !selectedProduct) {
    navigate('/');
    return null;
  }

  const handleUpdateStatus = (applicationId: string, status: ApplicationStatus) => {
    const application = applications.find(app => app.id === applicationId);
    updateApplicationStatus(applicationId, status);

    if (status === "rejected" && application) {
      decrementApplicants(application.productId);
    }

    // Create notification
    if (application) {
      let notification: Notification;

      if (status === "accepted") {
        notification = {
          id: `notif-${Date.now()}`,
          type: "selection",
          title: "🎉 체험단에 선정되었습니다!",
          message: "축하합니다! 체험단으로 선정되셨습니다. 체험 후 솔직한 리뷰를 작성해주세요.",
          productId: application.productId,
          productName: application.productName,
          productImage: application.productImage,
          createdAt: new Date().toISOString(),
          read: false,
        };
        toast.success("체험단으로 선정했습니다");
      } else if (status === "rejected") {
        notification = {
          id: `notif-${Date.now()}`,
          type: "rejection",
          title: "체험단 선정 결과 안내",
          message: "아쉽지만 이번 체험단에 선정되지 못했습니다. 다음 기회에 꼭 만나요!",
          productId: application.productId,
          productName: application.productName,
          productImage: application.productImage,
          createdAt: new Date().toISOString(),
          read: false,
        };
        toast.success("미선정 처리했습니다");
      } else {
        return;
      }

      createNotification(notification, application.userId, accessToken);
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <ManageApplicantsPage
      onBack={() => navigate(-1)}
      applications={applications}
      onProductClick={handleProductClick}
      onUpdateStatus={handleUpdateStatus}
      selectedProduct={selectedProduct}
      product={selectedProduct}
    />
  );
}
