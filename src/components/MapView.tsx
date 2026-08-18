import { useEffect, useRef, useState, useCallback } from 'react';
import { Map, List, Navigation2, Loader2, AlertTriangle } from 'lucide-react';
import type { Product } from '../data/mockData';
import { loadKakaoMapSDK, isKakaoMapConfigured, createProductMarkerContent } from '../utils/kakaoMap';
import { getCurrentLocation } from '../utils/locationUtils';

interface MapViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onToggleView: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

type MapState = 'loading' | 'ready' | 'error' | 'no-key';

/**
 * Map view component showing nearby products as markers.
 * Uses Kakao Maps JavaScript SDK.
 *
 * Features:
 * - Product markers with custom overlay (name + progress)
 * - Click marker → product card popup
 * - Current location button
 * - Map/List view toggle
 * - Graceful fallback when API key is missing
 */
export function MapView({ products, onProductClick, onToggleView, userLocation }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const [mapState, setMapState] = useState<MapState>('loading');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentLocation, setCurrentLocation] = useState(userLocation);

  // Initialize map
  useEffect(() => {
    if (!isKakaoMapConfigured()) {
      setMapState('no-key');
      return;
    }

    let cancelled = false;

    const initMap = async () => {
      try {
        const maps = await loadKakaoMapSDK();
        if (cancelled || !mapContainerRef.current) return;

        const center = currentLocation
          ? new maps.LatLng(currentLocation.latitude, currentLocation.longitude)
          : new maps.LatLng(37.5665, 126.9780); // Default: Seoul

        const map = new maps.Map(mapContainerRef.current, {
          center,
          level: 5, // Zoom level (smaller = closer)
        });

        mapRef.current = map;
        setMapState('ready');
      } catch (e) {
        console.error('Map initialization failed:', e);
        if (!cancelled) setMapState('error');
      }
    };

    initMap();

    return () => { cancelled = true; };
  }, [currentLocation]);

  // Add product markers when map is ready
  useEffect(() => {
    if (mapState !== 'ready' || !mapRef.current) return;

    const maps = window.kakao?.maps;
    if (!maps) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    overlaysRef.current.forEach(o => o.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];

    // Add markers for products with coordinates
    const bounds = new maps.LatLngBounds();
    let hasValidProducts = false;

    products.forEach(product => {
      if (!product.latitude || !product.longitude) return;

      hasValidProducts = true;
      const position = new maps.LatLng(product.latitude, product.longitude);
      bounds.extend(position);

      // Create custom overlay
      const content = document.createElement('div');
      content.innerHTML = createProductMarkerContent(product);
      content.onclick = () => setSelectedProduct(product);

      const overlay = new maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.3,
      });
      overlay.setMap(mapRef.current);
      overlaysRef.current.push(overlay);
    });

    // Fit bounds if we have products
    if (hasValidProducts && products.length > 1) {
      mapRef.current.setBounds(bounds);
    }
  }, [mapState, products]);

  // Center on current location
  const handleLocate = useCallback(async () => {
    try {
      const loc = await getCurrentLocation();
      setCurrentLocation(loc);
      if (mapRef.current && window.kakao?.maps) {
        const center = new window.kakao.maps.LatLng(loc.latitude, loc.longitude);
        mapRef.current.setCenter(center);
        mapRef.current.setLevel(4);
      }
    } catch (e) {
      console.error('Location failed:', e);
    }
  }, []);

  return (
    <div className="relative h-[calc(100vh-180px)] bg-gray-100 rounded-2xl overflow-hidden border-2 border-[#d4c5a0]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading State */}
      {mapState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f0dc]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-[#6b8e6f] animate-spin" />
            <p className="text-sm text-[#6b8e6f]">지도를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* No API Key State */}
      {mapState === 'no-key' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f0dc]">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <Map size={48} className="text-[#d4c5a0]" />
            <h3 className="text-[#2d3e2d] font-bold">지도 API 키 필요</h3>
            <p className="text-sm text-[#9ca89d] max-w-xs">
              환경 변수에 <code className="bg-white px-1.5 py-0.5 rounded text-xs">VITE_KAKAO_MAP_APP_KEY</code>를 설정해주세요.
            </p>
            <a
              href="https://developers.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#6b8e6f] underline"
            >
              Kakao Developers에서 키 발급 →
            </a>
          </div>
        </div>
      )}

      {/* Error State */}
      {mapState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f0dc]">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <AlertTriangle size={48} className="text-[#f5a145]" />
            <h3 className="text-[#2d3e2d] font-bold">지도를 불러올 수 없어요</h3>
            <p className="text-sm text-[#9ca89d]">
              네트워크 연결을 확인하고 다시 시도해주세요.
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Toggle to List View */}
        <button
          onClick={onToggleView}
          className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-[#d4c5a0] hover:bg-[#f5f0dc] transition-colors"
          title="리스트 보기"
        >
          <List size={20} className="text-[#6b8e6f]" />
        </button>

        {/* My Location */}
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-[#d4c5a0] hover:bg-[#f5f0dc] transition-colors"
          title="내 위치"
        >
          <Navigation2 size={20} className="text-[#6b8e6f]" />
        </button>
      </div>

      {/* Product count badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-[#d4c5a0]">
        <span className="text-xs font-medium text-[#2d3e2d]">
          주변 체험단 {products.filter(p => p.latitude && p.longitude).length}개
        </span>
      </div>

      {/* Selected Product Card (bottom sheet style) */}
      {selectedProduct && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl border-2 border-[#d4c5a0] animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-2 right-3 text-[#9ca89d] hover:text-[#2d3e2d] text-lg"
          >
            ×
          </button>
          <div
            className="flex gap-3 cursor-pointer"
            onClick={() => onProductClick(selectedProduct)}
          >
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#d4c5a0]"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="%23f5f0dc" width="100%" height="100%"/></svg>'; }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#2d3e2d] truncate">{selectedProduct.name}</h4>
              <p className="text-xs text-[#9ca89d] mb-1">{selectedProduct.seller} • {selectedProduct.distance}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#f0f9f4] text-[#6b8e6f] px-2 py-0.5 rounded-full">
                  {selectedProduct.currentApplicants}/{selectedProduct.requiredReviewers}명
                </span>
                <span className="text-xs text-[#f5a145]">❤️ {selectedProduct.likeCount}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-[#6b8e6f] text-xs font-medium">상세 →</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
