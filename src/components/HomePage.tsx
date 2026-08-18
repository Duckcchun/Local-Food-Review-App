import { Search, MapPin, Bell, Navigation, FilterX } from "lucide-react";
import { Logo } from "./Logo";
import { ProductCard } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { SortFilter } from "./SortFilter";
import { getCategoryName } from "../data/categories";
import { sortProducts } from "../utils/sortUtils";
import type { SortOption } from "../utils/sortUtils";
import { mockProducts } from "../data/mockData";
import type { Product } from "../data/mockData";
import { useState, useEffect, useCallback } from "react";
import { calculateDistance, formatDistance, getCurrentLocation } from "../utils/locationUtils";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { PullToRefreshIndicator } from "./common/PullToRefreshIndicator";
import { InfiniteScrollSentinel } from "./common/InfiniteScrollSentinel";
import { CardSkeleton } from "./common/PageSkeleton";

interface HomePageProps {
  onProductClick: (product: Product) => void;
  userName?: string;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  products?: Product[];
  onNotificationsClick?: () => void;
  unreadNotifications?: number;
  onRefresh?: () => Promise<void>;
}

export function HomePage({ onProductClick, userName = "회원", favorites, onToggleFavorite, products = mockProducts, onNotificationsClick, unreadNotifications = 0, onRefresh }: HomePageProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("distance");

  // Pull-to-refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      // Default: simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }, [onRefresh]);

  const { isRefreshing, pullDistance, pullProgress, containerProps } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  useEffect(() => {
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error("Failed to get location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Calculate distances and filter products
  const productsWithDistance = products.map(product => {
    if (!userLocation || !product.latitude || !product.longitude) {
      return product;
    }
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      product.latitude,
      product.longitude
    );
    
    return {
      ...product,
      calculatedDistance: distance,
      distance: formatDistance(distance)
    };
  });

  // Apply all filters: search, category, and distance
  let filteredProducts = productsWithDistance;

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.seller.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(product =>
      product.category === selectedCategory
    );
  }

  // Distance filter
  if (distanceFilter) {
    filteredProducts = filteredProducts.filter(product =>
      product.calculatedDistance && product.calculatedDistance <= distanceFilter
    );
  }

  // Apply sorting
  const sortedProducts = sortProducts(filteredProducts, sortOption);

  // Infinite scroll
  const { visibleItems, hasMore, isLoadingMore, sentinelRef, totalItems, loadedItems } = useInfiniteScroll({
    items: sortedProducts,
    pageSize: 6,
  });

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() || selectedCategory !== "all" || distanceFilter !== null;

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setDistanceFilter(null);
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24 relative" {...containerProps}>
      {/* Pull-to-Refresh Indicator */}
      <PullToRefreshIndicator 
        pullProgress={pullProgress} 
        isRefreshing={isRefreshing} 
        pullDistance={pullDistance} 
      />

      {/* Hero Section */}
  <div className="bg-linear-to-b from-[#f5f0dc] to-[#fffef5] px-6 pt-8 pb-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            {onNotificationsClick && (
              <button
                onClick={onNotificationsClick}
                className="relative p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <Bell size={24} className="text-[#6b8e6f]" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f5a145] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            )}
          </div>
          <h1 className="text-[#2d3e2d] mb-2">
            우리 동네 맛집을<br />솔직하게 평가해요
          </h1>
          <p className="text-[#6b8e6f]">
            중소 사업자를 응원하고 숨겨진 맛집을 발굴하세요
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Category Filter */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="max-w-md mx-auto px-6 mb-4">
          <div className="flex items-center justify-between bg-[#f5f0dc] rounded-[1rem] px-4 py-3 border-2 border-[#d4c5a0]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[#6b8e6f]">필터 적용중:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs text-[#6b8e6f] border border-[#d4c5a0]">
                  검색: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs text-[#6b8e6f] border border-[#d4c5a0]">
                  카테고리: {getCategoryName(selectedCategory)}
                </span>
              )}
              {distanceFilter && (
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs text-[#6b8e6f] border border-[#d4c5a0]">
                  거리: {distanceFilter}km 이내
                </span>
              )}
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-[#6b8e6f] hover:text-[#5a7a5e] transition-colors shrink-0 ml-2"
            >
              <FilterX size={16} />
              <span>초기화</span>
            </button>
          </div>
        </div>
      )}

      {/* Location Filter */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={18} className="text-[#6b8e6f]" />
          <h3 className="text-[#2d3e2d]">거리로 찾기</h3>
          {locationLoading && (
            <span className="text-xs text-[#9ca89d]">위치 확인중...</span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setDistanceFilter(null)}
            className={`shrink-0 py-2 px-4 rounded-full transition-all text-sm ${
              distanceFilter === null
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setDistanceFilter(0.5)}
            className={`shrink-0 py-2 px-4 rounded-full transition-all text-sm ${
              distanceFilter === 0.5
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            500m 이내
          </button>
          <button
            onClick={() => setDistanceFilter(1)}
            className={`shrink-0 py-2 px-4 rounded-full transition-all text-sm ${
              distanceFilter === 1
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            1km 이내
          </button>
          <button
            onClick={() => setDistanceFilter(3)}
            className={`shrink-0 py-2 px-4 rounded-full transition-all text-sm ${
              distanceFilter === 3
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            3km 이내
          </button>
          <button
            onClick={() => setDistanceFilter(5)}
            className={`shrink-0 py-2 px-4 rounded-full transition-all text-sm ${
              distanceFilter === 5
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            5km 이내
          </button>
        </div>
      </div>

      {/* Sort Filter */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <SortFilter
          selectedSort={sortOption}
          onSelectSort={setSortOption}
          resultCount={sortedProducts.length}
        />
      </div>

      {/* Products Grid */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#2d3e2d]">체험단 모집중 🔥</h2>
          <span className="text-sm text-[#9ca89d]">
            {filteredProducts.length}개
            {distanceFilter && ` (${distanceFilter}km 이내)`}
          </span>
        </div>
        
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-[1.5rem] p-12 text-center border-2 border-[#d4c5a0]">
            <Search size={48} className="mx-auto mb-4 text-[#d4c5a0]" />
            <h3 className="text-[#2d3e2d] mb-2">
              {searchQuery 
                ? "검색 결과가 없어요" 
                : selectedCategory !== "all"
                  ? "해당 카테고리에 체험단이 없어요"
                  : "근처에 체험단이 없어요"
              }
            </h3>
            <p className="text-sm text-[#9ca89d] mb-4">
              {hasActiveFilters
                ? "다른 필터 조건을 선택해보세요"
                : "새로운 체험단이 곧 등록됩니다"
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="bg-[#f5a145] text-white px-6 py-3 rounded-[1rem] hover:bg-[#e89535] transition-colors inline-flex items-center gap-2"
              >
                <FilterX size={18} />
                필터 초기화
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {visibleItems.map((product, index) => (
              <div key={product.id} className="stagger-item">
                <ProductCard
                  product={product}
                  onClick={() => onProductClick(product)}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => onToggleFavorite(product.id)}
                />
              </div>
            ))}

            {/* Loading skeleton for next page */}
            {isLoadingMore && (
              <div className="space-y-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <InfiniteScrollSentinel
              ref={sentinelRef}
              isLoading={isLoadingMore}
              hasMore={hasMore}
              loadedCount={loadedItems}
              totalCount={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}