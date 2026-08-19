import { Search, MapPin, Bell, FilterX } from "lucide-react";
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
}

export function HomePage({ onProductClick, userName = "회원", favorites, onToggleFavorite, products = mockProducts, onNotificationsClick, unreadNotifications = 0 }: HomePageProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("distance");

  useEffect(() => { loadUserLocation(); }, []);

  const loadUserLocation = async () => {
    setLocationLoading(true);
    try { setUserLocation(await getCurrentLocation()); }
    catch (e) { console.error("Location failed:", e); }
    finally { setLocationLoading(false); }
  };

  // Calculate distances
  const productsWithDistance = products.map(product => {
    if (!userLocation || !product.latitude || !product.longitude) return product;
    const distance = calculateDistance(userLocation.latitude, userLocation.longitude, product.latitude, product.longitude);
    return { ...product, calculatedDistance: distance, distance: formatDistance(distance) };
  });

  // Apply filters
  let filteredProducts = productsWithDistance;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (selectedCategory !== "all") filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  if (distanceFilter) filteredProducts = filteredProducts.filter(p => p.calculatedDistance && p.calculatedDistance <= distanceFilter);

  const sortedProducts = sortProducts(filteredProducts, sortOption);
  const hasActiveFilters = searchQuery.trim() || selectedCategory !== "all" || distanceFilter !== null;
  const resetFilters = () => { setSearchQuery(""); setSelectedCategory("all"); setDistanceFilter(null); };

  const distanceOptions = [
    { value: null, label: "전체" },
    { value: 0.5, label: "500m" },
    { value: 1, label: "1km" },
    { value: 3, label: "3km" },
    { value: 5, label: "5km" },
  ];

  return (
    <div className="min-h-screen bg-[#fffef5] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#fffef5]/95 backdrop-blur-md">
        <div className="max-w-md mx-auto px-5 pt-4 pb-2 flex items-center justify-between">
          <Logo />
          {onNotificationsClick && (
            <button onClick={onNotificationsClick} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100/80 transition-colors">
              <Bell size={22} className="text-gray-700" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#fffef5]">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          )}
        </div>
        <div className="max-w-md mx-auto px-5 pb-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="max-w-md mx-auto px-5 pb-3">
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Filter & Sort */}
      <div className="max-w-md mx-auto px-5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {distanceOptions.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setDistanceFilter(opt.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  distanceFilter === opt.value ? "bg-[#6b8e6f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="max-w-md mx-auto px-5 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {searchQuery && <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">"{searchQuery}"</span>}
            {selectedCategory !== "all" && <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">{getCategoryName(selectedCategory)}</span>}
            {distanceFilter && <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">{distanceFilter}km 이내</span>}
            <button onClick={resetFilters} className="shrink-0 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
              <FilterX size={12} />초기화
            </button>
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="max-w-md mx-auto px-5 py-2 flex items-center justify-between">
        <span className="text-sm text-gray-400">{sortedProducts.length}개의 체험단</span>
        <SortFilter selectedSort={sortOption} onSelectSort={setSortOption} resultCount={sortedProducts.length} />
      </div>

      {/* Product List */}
      <div className="max-w-md mx-auto px-5">
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-5 bg-gray-50 rounded-2xl flex items-center justify-center">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              {searchQuery ? "검색 결과가 없어요" : selectedCategory !== "all" ? "해당 카테고리에 체험단이 없어요" : "근처에 체험단이 없어요"}
            </h3>
            <p className="text-sm text-gray-400 mb-6">{hasActiveFilters ? "다른 조건으로 검색해보세요" : "곧 새로운 체험단이 등록됩니다"}</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="inline-flex items-center gap-1.5 bg-[#6b8e6f] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#5a7a5e] transition-colors shadow-sm">
                <FilterX size={14} />필터 초기화
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
