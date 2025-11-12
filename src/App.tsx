import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { HomePage } from "./components/HomePage";
import { BusinessHomePage } from "./components/BusinessHomePage";
import { BusinessDashboard } from "./components/BusinessDashboard";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { ReviewPage } from "./components/ReviewPage";
import { ReviewWritePage } from "./components/ReviewWritePage";
import { EditReviewPage } from "./components/EditReviewPage";
import { ProfilePage } from "./components/ProfilePage";
import { PointShop } from "./components/PointShop";
import { PointHistory } from "./components/PointHistory";
import { SignupPage } from "./components/SignupPage";
import { LoginPage } from "./components/LoginPage";
import { StoreRegistrationPage } from "./components/StoreRegistrationPage";
import { MyApplicationsPage } from "./components/MyApplicationsPage";
import { MyFavoritesPage } from "./components/MyFavoritesPage";
import { CreateProductPage } from "./components/CreateProductPage";
import { ManageApplicantsPage } from "./components/ManageApplicantsPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { ReviewManagementPage } from "./components/ReviewManagementPage";
import { BottomNav } from "./components/BottomNav";
import type { Product } from "./data/mockData";
import type { PointProduct, PointTransaction } from "./data/pointShop";
import { mockProducts } from "./data/mockData";
import { toast } from "sonner";

type Page = "home" | "product-detail" | "review" | "review-write" | "edit-review" | "profile" | "signup" | "login" | "store-registration" | "my-applications" | "my-favorites" | "create-product" | "manage-applicants" | "notifications" | "review-management" | "point-shop" | "point-history" | "business-dashboard";

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  userType: "reviewer" | "business";
  businessName?: string;
  businessNumber?: string;
  businessAddress?: string;
}

export type NotificationType = "selection" | "rejection" | "review-request" | "review-received" | "application";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  createdAt: string;
  read: boolean;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "review-completed";

export interface Application {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userLevel: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  pros: string;
  cons: string;
  improvements: string;
  photos: string[];
  createdAt: string;
  userId?: string;
  userName?: string;
  status: "published" | "hidden";
  reported: boolean;
  reportReason?: string;
  reportedAt?: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const pageTransition: any = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("signup");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [businessProducts, setBusinessProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [completedReviews, setCompletedReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pointProducts, setPointProducts] = useState<PointProduct[]>([]);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("product-detail");
  };

  const handleApply = () => {
    if (selectedProduct) {
      // Add to applications if not already applied
      if (!applications.find(app => app.id === selectedProduct.id)) {
        setApplications(prev => [...prev, {
          id: `application-${Date.now()}`,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productImage: selectedProduct.image,
          userId: userInfo?.email || "",
          userName: userInfo?.name || "",
          userEmail: userInfo?.email || "",
          userPhone: userInfo?.phone || "",
          userLevel: 1, // Default user level
          status: "pending",
          appliedAt: new Date().toISOString(),
        }]);
        toast.success("체험단 신청이 완료되었습니다!");
        
        // Go back to home after short delay
        setTimeout(() => {
          setSelectedProduct(null);
          setCurrentPage("home");
        }, 1500);
      } else {
        toast.error("이미 신청한 체험단입니다");
      }
    }
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        toast.success("찜 목록에서 제거되었습니다");
        return prev.filter(id => id !== productId);
      } else {
        toast.success("찜 목록에 추가되었습니다");
        return [...prev, productId];
      }
    });
  };

  const handleCreateProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `business-${Date.now()}`
    };
    
    setBusinessProducts(prev => [...prev, newProduct]);
    setAllProducts(prev => [newProduct, ...prev]);
  };

  const handleLogout = () => {
    setUserInfo(null);
    setCurrentPage("signup");
    setApplications([]);
    setFavorites([]);
    setBusinessProducts([]);
    setSelectedProduct(null);
    toast.success("로그아웃 되었습니다");
  };

  const handleTabChange = (tab: "home" | "review" | "profile") => {
    setCurrentPage(tab);
    setSelectedProduct(null);
  };

  const handleBack = () => {
    if (currentPage === "product-detail") {
      setCurrentPage("home");
      setSelectedProduct(null);
    } else if (currentPage === "review-write") {
      setCurrentPage("review");
      setSelectedProduct(null);
    } else if (currentPage === "edit-review") {
      setCurrentPage("profile");
      setSelectedProduct(null);
    } else if (currentPage === "my-applications" || currentPage === "my-favorites") {
      setCurrentPage("profile");
    } else if (currentPage === "create-product" || currentPage === "manage-applicants" || currentPage === "review-management") {
      setCurrentPage("home");
      setSelectedProduct(null);
    } else if (currentPage === "notifications") {
      setCurrentPage("home");
    }
  };

  const handleSignupComplete = (userData: UserInfo) => {
    setUserInfo(userData);
    setCurrentPage("home");
  };

  const handleSelectProductForReview = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("review-write");
  };

  const handleEditReview = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("edit-review");
  };

  const handleSubmitReview = (reviewData: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setCompletedReviews(prev => [...prev, newReview]);
    toast.success("리뷰가 등록되었습니다! +500P 적립");
    
    // Go back to review page
    setTimeout(() => {
      setSelectedProduct(null);
      setCurrentPage("review");
    }, 1500);
  };

  const handleUpdateApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    const application = applications.find(app => app.id === applicationId);
    
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status, reviewedAt: new Date().toISOString() }
          : app
      )
    );

    // Create notification for the user
    if (application) {
      if (status === "accepted") {
        const notification: Notification = {
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
        setNotifications(prev => [notification, ...prev]);
        toast.success("체험단으로 선정했습니다");
      } else if (status === "rejected") {
        const notification: Notification = {
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
        setNotifications(prev => [notification, ...prev]);
        toast.success("미선정 처리했습니다");
      }
    }
  };

  const handleManageApplicants = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("manage-applicants");
  };

  const handleReportReview = (reviewId: string, reason: string) => {
    setCompletedReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, reported: true, reportReason: reason, reportedAt: new Date().toISOString() }
          : review
      )
    );
    toast.success("리뷰가 신고되었습니다. 검토 후 조치하겠습니다");
  };

  const handleToggleReviewVisibility = (reviewId: string) => {
    setCompletedReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, status: review.status === "published" ? "hidden" : "published" }
          : review
      )
    );
    
    const review = completedReviews.find(r => r.id === reviewId);
    if (review) {
      if (review.status === "published") {
        toast.success("리뷰가 비공개 처리되었습니다");
      } else {
        toast.success("리뷰가 공개 처리되었습니다");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5]">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentPage === "signup" && (
          <motion.div
            key="signup"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <SignupPage 
              onBack={() => setCurrentPage("home")} 
              onSignupComplete={handleSignupComplete}
              onSwitchToLogin={() => setCurrentPage("login")}
            />
          </motion.div>
        )}

        {currentPage === "login" && (
          <motion.div
            key="login"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <LoginPage 
              onBack={() => setCurrentPage("home")} 
              onLoginComplete={handleSignupComplete}
              onSwitchToSignup={() => setCurrentPage("signup")}
            />
          </motion.div>
        )}

        {currentPage === "store-registration" && userInfo && (
          <motion.div
            key="store-registration"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <StoreRegistrationPage 
              onBack={() => setCurrentPage("home")} 
              onComplete={() => setCurrentPage("home")}
              userId={userInfo.email}
              accessToken={accessToken}
            />
          </motion.div>
        )}

        {currentPage === "home" && userInfo && (
          userInfo.userType === "business" ? (
            <motion.div
              key="business-home"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <BusinessHomePage 
                userInfo={userInfo} 
                onProductClick={handleProductClick}
                myProducts={businessProducts}
                onCreateProduct={() => setCurrentPage("create-product")}
                onManageApplicants={handleManageApplicants}
                onManageReviews={() => setCurrentPage("review-management")}
                onViewDashboard={() => setCurrentPage("business-dashboard")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HomePage 
                onProductClick={handleProductClick} 
                userName={userInfo.name}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                products={allProducts}
                onNotificationsClick={() => setCurrentPage("notifications")}
                unreadNotifications={notifications.filter(n => !n.read).length}
              />
            </motion.div>
          )
        )}

        {currentPage === "create-product" && userInfo && userInfo.userType === "business" && (
          <motion.div
            key="create-product"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CreateProductPage
              onBack={handleBack}
              onCreateProduct={handleCreateProduct}
              userInfo={userInfo}
            />
          </motion.div>
        )}

        {currentPage === "product-detail" && selectedProduct && (
          <motion.div
            key="product-detail"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProductDetailPage
              product={selectedProduct}
              onBack={handleBack}
              onApply={handleApply}
              isFavorite={favorites.includes(selectedProduct.id)}
              onToggleFavorite={() => handleToggleFavorite(selectedProduct.id)}
            />
          </motion.div>
        )}

        {currentPage === "review" && userInfo && userInfo.userType === "reviewer" && (
          <motion.div
            key="review"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ReviewPage
              applications={applications}
              completedReviews={completedReviews}
              onSelectProduct={handleSelectProductForReview}
              userName={userInfo.name}
            />
          </motion.div>
        )}

        {currentPage === "review-write" && selectedProduct && userInfo && (
          <motion.div
            key="review-write"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ReviewWritePage
              product={selectedProduct}
              onBack={handleBack}
              userName={userInfo.name}
              onSubmit={handleSubmitReview}
            />
          </motion.div>
        )}

        {currentPage === "edit-review" && selectedProduct && userInfo && (
          <motion.div
            key="edit-review"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <EditReviewPage
              review={{
                id: selectedProduct.id,
                productName: selectedProduct.name,
                productImage: selectedProduct.image,
                comment: selectedProduct.description,
                date: "2025.11.08"
              }}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {currentPage === "my-applications" && userInfo && (
          <motion.div
            key="my-applications"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <MyApplicationsPage
              onBack={handleBack}
              applications={applications}
              onProductClick={handleProductClick}
            />
          </motion.div>
        )}

        {currentPage === "my-favorites" && userInfo && (
          <motion.div
            key="my-favorites"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <MyFavoritesPage
              onBack={handleBack}
              favorites={favorites.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[]}
              onProductClick={handleProductClick}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}

        {currentPage === "profile" && userInfo && (
          <motion.div
            key="profile"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProfilePage 
              userInfo={userInfo}
              completedReviews={completedReviews}
              onNavigateToApplications={() => setCurrentPage("my-applications")}
              onNavigateToFavorites={() => setCurrentPage("my-favorites")}
              onNavigateToPointShop={() => setCurrentPage("point-shop")}
              onNavigateToPointHistory={() => setCurrentPage("point-history")}
              onEditReview={handleEditReview}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {currentPage === "manage-applicants" && userInfo && selectedProduct && (
          <motion.div
            key="manage-applicants"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ManageApplicantsPage
              onBack={handleBack}
              applications={applications}
              onProductClick={handleProductClick}
              onUpdateStatus={handleUpdateApplicationStatus}
              selectedProduct={selectedProduct}
              product={selectedProduct}
            />
          </motion.div>
        )}

        {currentPage === "notifications" && userInfo && (
          <motion.div
            key="notifications"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <NotificationsPage
              onBack={handleBack}
              notifications={notifications}
              onMarkAsRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
            />
          </motion.div>
        )}

        {currentPage === "review-management" && userInfo && (
          <motion.div
            key="review-management"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ReviewManagementPage
              onBack={handleBack}
              reviews={completedReviews}
              onToggleVisibility={handleToggleReviewVisibility}
            />
          </motion.div>
        )}

        {currentPage === "point-shop" && userInfo && (
          <motion.div
            key="point-shop"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <PointShop
              onBack={() => {
                setCurrentPage("profile");
              }}
              userPoints={1250}
              userLevel={3}
              onPurchase={(product) => {
                const transaction: PointTransaction = {
                  id: `trans-${Date.now()}`,
                  type: "spend",
                  amount: product.price,
                  description: product.name,
                  date: new Date().toLocaleString('ko-KR'),
                  category: product.category,
                };
                setPointTransactions(prev => [transaction, ...prev]);
                toast.success(`${product.name} 구매가 완료되었습니다!`);
              }}
            />
          </motion.div>
        )}

        {currentPage === "point-history" && userInfo && (
          <motion.div
            key="point-history"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <PointHistory
              onBack={() => {
                setCurrentPage("profile");
              }}
              transactions={pointTransactions}
              currentPoints={1250}
            />
          </motion.div>
        )}

        {currentPage === "business-dashboard" && userInfo && userInfo.userType === "business" && (
          <motion.div
            key="business-dashboard"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <BusinessDashboard
              onBack={() => setCurrentPage("home")}
              products={businessProducts}
              applications={applications}
              reviews={completedReviews}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {userInfo && currentPage !== "signup" && currentPage !== "login" && currentPage !== "product-detail" && currentPage !== "review-write" && currentPage !== "edit-review" && currentPage !== "my-applications" && currentPage !== "my-favorites" && currentPage !== "create-product" && currentPage !== "manage-applicants" && currentPage !== "notifications" && currentPage !== "review-management" && currentPage !== "point-shop" && currentPage !== "point-history" && currentPage !== "business-dashboard" && (
        <BottomNav 
          activeTab={currentPage as "home" | "review" | "profile"} 
          onTabChange={handleTabChange}
          userType={userInfo.userType}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}