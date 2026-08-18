import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useReviewStore } from '../stores/reviewStore';
import { usePointStore } from '../stores/pointStore';
import { toast } from 'sonner';
import type { Product } from '../data/mockData';
import type { Application, ApplicationStatus, Notification, Review } from '../types';
import type { PointTransaction } from '../data/pointShop';

/**
 * Custom hook that encapsulates all product-related business logic.
 * Replaces the massive handler functions from the old App.tsx.
 */
export function useProducts() {
  const navigate = useNavigate();
  const { accessToken, userInfo } = useAuthStore();
  const { allProducts, businessProducts, selectedProduct, setSelectedProduct, addBusinessProduct, deleteBusinessProduct, updateProductField } = useProductStore();
  const { applications, addApplication, removeApplication, updateStatus } = useApplicationStore();
  const { addNotification } = useNotificationStore();
  const { completedReviews, addReview } = useReviewStore();
  const { userPoints, earnPoints } = usePointStore();

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    navigate(`/products/${product.id}`);
  }, [navigate, setSelectedProduct]);

  const handleApply = useCallback(async (product: Product) => {
    if (!userInfo) return;

    // Check if already applied
    const existing = applications.find(
      app => app.productId === product.id && app.userEmail === userInfo.email
    );
    if (existing) {
      toast.error("이미 신청한 체험단입니다");
      return;
    }

    const newApplication: Application = {
      id: `application-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      userId: userInfo.email,
      userName: userInfo.name,
      userEmail: userInfo.email,
      userPhone: userInfo.phone,
      userLevel: 1,
      status: "pending",
      appliedAt: new Date().toISOString(),
    };

    addApplication(newApplication, accessToken || undefined);

    // Update product's currentApplicants count
    updateProductField(product.id, {
      currentApplicants: product.currentApplicants + 1,
    });

    toast.success("체험단 신청이 완료되었습니다!");

    // Go back after delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }, [userInfo, applications, addApplication, updateProductField, accessToken, navigate]);

  const handleCancelApplication = useCallback(async (productId: string) => {
    if (!userInfo) return;

    const app = applications.find(
      a => a.productId === productId && a.userEmail === userInfo.email
    );
    if (!app) {
      toast.error("신청 내역을 찾을 수 없습니다");
      return;
    }
    if (app.status !== "pending") {
      toast.error("대기 중 상태에서만 취소할 수 있습니다");
      return;
    }

    removeApplication(app.id, accessToken || undefined);

    // Decrement product applicants
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      updateProductField(productId, {
        currentApplicants: Math.max(0, (product.currentApplicants || 0) - 1),
      });
    }

    toast.success("신청이 취소되었습니다");
  }, [userInfo, applications, removeApplication, updateProductField, allProducts, accessToken]);

  const handleCreateProduct = useCallback(async (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `business-${Date.now()}`,
    };
    addBusinessProduct(newProduct, accessToken || undefined);
  }, [addBusinessProduct, accessToken]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    deleteBusinessProduct(productId, accessToken || undefined);
    toast.success("체험단이 삭제되었습니다");
  }, [deleteBusinessProduct, accessToken]);

  const handleUpdateApplicationStatus = useCallback(async (applicationId: string, status: ApplicationStatus) => {
    const application = applications.find(app => app.id === applicationId);
    updateStatus(applicationId, status, accessToken || undefined);

    // Update product count if rejected
    if (status === "rejected" && application) {
      const product = allProducts.find(p => p.id === application.productId);
      if (product && product.currentApplicants > 0) {
        updateProductField(application.productId, {
          currentApplicants: product.currentApplicants - 1,
        });
      }
    }

    // Create notification
    if (application) {
      let notification: Notification | null = null;

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
      }

      if (notification) {
        addNotification(notification, application.userId, accessToken || undefined);
      }
    }
  }, [applications, updateStatus, updateProductField, allProducts, addNotification, accessToken]);

  const handleSubmitReview = useCallback(async (reviewData: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    addReview(newReview, accessToken || undefined);

    // Update product reviewCount
    updateProductField(reviewData.productId, {
      reviewCount: (allProducts.find(p => p.id === reviewData.productId)?.reviewCount || 0) + 1,
    });

    // Earn points
    const earnedPoints = 500;
    earnPoints(earnedPoints, "리뷰 작성", "리뷰");

    toast.success(`리뷰가 등록되었습니다! +${earnedPoints}P 적립`);

    // Navigate back after delay
    setTimeout(() => {
      navigate('/review');
    }, 1500);
  }, [addReview, updateProductField, allProducts, earnPoints, accessToken, navigate]);

  return {
    allProducts,
    businessProducts,
    selectedProduct,
    setSelectedProduct,
    handleProductClick,
    handleApply,
    handleCancelApplication,
    handleCreateProduct,
    handleDeleteProduct,
    handleUpdateApplicationStatus,
    handleSubmitReview,
  };
}
