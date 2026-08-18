import { Search, MapPin, Bell, FilterX, SlidersHorizontal } from "lucide-react";
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
import { useState, useEffect } from "react";
import { calculateDistance, formatDistance, getCurrentLocation } from "../utils/locationUtils";

interface HomePageProps {
  onProductClick: (product: Product) => void;
  userName?: string;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  products?: Product[];
  onNotificationsClick?: () => void;
  unreadNotifications?: number;
  onRefresh?: () => Promise<void>;
  onMapView?: () => void;
}

export function HomePage({ onProductClick, userName = "회원", favorites, onToggleFavorite, products = mockProducts, onNotificationsClick, unreadNotifications = 0, onRefresh, onMapView }: HomePageProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("distance");

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

  // Apply filters
  let filteredProducts = productsWithDistance;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.seller.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(product =>
      product.category === selectedCategory
    );
  }

  if (distanceFilter) {
    filteredProducts = filteredProducts.filter(product =>
      product.calculatedDistance && product.calculatedDistance <= distanceFilter
    );
  }

  const sortedProducts = sortProducts(filteredProducts, sortOption);
  const hasActiveFilters = searchQuery.trim() || selectedCategory !== "all" || distanceFilter !== null;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setDistanceFilter(null);
  };

  const distanceOptions = [
    { value: null, label: "전체" },
    { value: 0.5, label: "500m" },
    { value: 1, label: "1km" },
    { value: 3, label: "3km" },
    { value: 5, label: "5km" },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-30 bg-white">
        {/* Top bar: Logo + Notification */}
        <div className="max-w-md mx-auto px-5 pt-4 pb-2 flex items-center justify-between">
          <Logo />
          {onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
            >
              <Bell size={22} className="text-gray-700" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px]">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto px-5 pb-3">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Category chips (horizontal scroll) */}
        <div className="max-w-md mx-auto px-5 pb-3">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Thin separator */}
        <div className="h-px bg-gray-100" />
      </div>

      {/* ─── Filter & Sort Row ─── */}
      <div className="max-w-md mx-auto px-5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          {/* Distance filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {distanceOptions.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setDistanceFilter(opt.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  distanceFilter === opt.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort + Map toggle */}
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {onMapView && (
              <button
                onClick={onMapView}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                title="지도 보기"
              >
                <MapPin size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Active Filters Banner ─── */}
      {hasActiveFilters && (
        <div className="max-w-md mx-auto px-5 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {searchQuery && (
              <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                "{searchQuery}"
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="shrink-0 inline-flex items-center bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                {getCategoryName(selectedCategory)}
              </span>
            )}
            {distanceFilter && (
              <span className="shrink-0 inline-flex items-center bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                {distanceFilter}km 이내
              </span>
            )}
            <button
              onClick={resetFilters}
              className="shrink-0 text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
            >
              <FilterX size={12} />
              초기화
            </button>
          </div>
        </div>
      )}

      {/* ─── Sort Row ─── */}
      <div className="max-w-md mx-auto px-5 py-2 flex items-center justify-between">
        <span className="text-[13px] text-gray-400">
          {sortedProducts.length}개의 체험단
        </span>
        <SortFilter
          selectedSort={sortOption}
          onSelectSort={setSortOption}
          resultCount={sortedProducts.length}
        />
      </div>

      {/* ─── Product List ─── */}
      <div className="max-w-md mx-auto px-5">
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={28} className="text-gray-300" />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-700 mb-1">
              {searchQuery
                ? "검색 결과가 없어요"
                : selectedCategory !== "all"
                  ? "해당 카테고리에 체험단이 없어요"
                  : "근처에 체험단이 없어요"}
            </h3>
            <p className="text-[13px] text-gray-400 mb-5">
              {hasActiveFilters
                ? "다른 조건으로 검색해보세요"
                : "곧 새로운 체험단이 등록됩니다"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <FilterX size={14} />
                필터 초기화
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() => onToggleFavorite(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
