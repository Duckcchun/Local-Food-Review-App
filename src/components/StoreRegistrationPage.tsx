import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Phone, Building, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface StoreRegistrationPageProps {
  onBack: () => void;
  onComplete: () => void;
  userId: string;
  accessToken: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function StoreRegistrationPage({ onBack, onComplete, userId, accessToken }: StoreRegistrationPageProps) {
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeDescription: "",
    latitude: null as number | null,
    longitude: null as number | null,
    kakaoPlaceId: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize Kakao Map
  useEffect(() => {
    const loadKakaoMapScript = () => {
      const script = document.createElement('script');
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&libraries=services&autoload=false';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          if (mapRef.current) {
            const options = {
              center: new window.kakao.maps.LatLng(37.5665, 126.9780), // Default: Seoul
              level: 3
            };
            mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);
          }
        });
      };
    };

    // For demo purposes, we'll simulate Kakao Maps
    // In production, uncomment the above and remove the simulation
    // loadKakaoMapScript();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("검색어를 입력해주세요");
      return;
    }

    setIsSearching(true);
    
    // Simulate Kakao Place Search
    // In production, use: new window.kakao.maps.services.Places().keywordSearch(searchQuery, callback);
    setTimeout(() => {
      const mockResults = [
        {
          id: "1",
          place_name: searchQuery,
          address_name: "서울시 마포구 망원동 123-45",
          road_address_name: "서울시 마포구 월드컵로 123",
          phone: "02-1234-5678",
          x: "126.9102",
          y: "37.5563"
        },
        {
          id: "2",
          place_name: `${searchQuery} 본점`,
          address_name: "서울시 강남구 역삼동 678-90",
          road_address_name: "서울시 강남구 테헤란로 456",
          phone: "02-9876-5432",
          x: "127.0332",
          y: "37.5004"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectPlace = (place: any) => {
    setFormData({
      ...formData,
      storeName: place.place_name,
      storeAddress: place.road_address_name || place.address_name,
      storePhone: place.phone || "",
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
      kakaoPlaceId: place.id,
    });
    setSearchResults([]);
    setSearchQuery("");

    // Update map marker
    if (mapInstance.current && window.kakao) {
      const markerPosition = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
      
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      
      markerRef.current = new window.kakao.maps.Marker({
        position: markerPosition
      });
      markerRef.current.setMap(mapInstance.current);
      mapInstance.current.setCenter(markerPosition);
    }

    toast.success("가게 위치가 선택되었습니다");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeName || !formData.storeAddress) {
      toast.error("가게 이름과 주소는 필수입니다");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98b21042/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "가게 등록에 실패했습니다");
        setIsLoading(false);
        return;
      }

      toast.success(data.message || "가게 정보가 등록되었습니다!");
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error("Store registration error:", error);
      toast.error("서버 연결에 실패했습니다");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-16">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="text-white mb-6 hover:opacity-80">
            <ArrowLeft size={24} />
          </button>
          
          <h1 className="text-white mb-2">
            가게 정보 등록
          </h1>
          <p className="text-white opacity-90">
            카카오맵에서 가게를 검색하고 정보를 입력하세요
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 -mt-8 pb-32">
        <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0] shadow-lg mb-6">
          <h3 className="text-[#2d3e2d] mb-4">카카오맵 검색</h3>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca89d]" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="가게 이름으로 검색"
                className="w-full pl-12 pr-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-[#6b8e6f] text-white rounded-[1rem] hover:bg-[#5a7a5e] transition-colors disabled:opacity-50"
            >
              {isSearching ? "검색중..." : "검색"}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 mb-4">
              {searchResults.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="w-full text-left p-4 bg-[#f5f0dc] rounded-[1rem] hover:bg-[#ebe5cc] transition-colors"
                >
                  <div className="text-[#2d3e2d] mb-1">{place.place_name}</div>
                  <div className="text-sm text-[#9ca89d]">{place.road_address_name || place.address_name}</div>
                  {place.phone && <div className="text-xs text-[#9ca89d] mt-1">{place.phone}</div>}
                </button>
              ))}
            </div>
          )}

          {/* Map (Demo placeholder) */}
          <div className="bg-[#f5f0dc] rounded-[1rem] h-48 flex items-center justify-center mb-4">
            <div ref={mapRef} className="w-full h-full rounded-[1rem]">
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <MapPin size={48} className="text-[#6b8e6f] mb-2" />
                <p className="text-sm text-[#6b8e6f]">
                  카카오맵으로 가게를 검색하면<br />이곳에 지도가 표시됩니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Store Name */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              가게 이름 <span className="text-[#f5a145]">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca89d]" size={20} />
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                placeholder="가게 이름을 입력하세요"
                className="w-full pl-12 pr-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
              />
            </div>
          </div>

          {/* Store Address */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              가게 주소 <span className="text-[#f5a145]">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca89d]" size={20} />
              <input
                type="text"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleInputChange}
                placeholder="주소를 입력하세요"
                className="w-full pl-12 pr-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
              />
            </div>
          </div>

          {/* Store Phone */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              전화번호
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca89d]" size={20} />
              <input
                type="tel"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleInputChange}
                placeholder="02-1234-5678"
                className="w-full pl-12 pr-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
              />
            </div>
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              가게 소개
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-[#9ca89d]" size={20} />
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleInputChange}
                placeholder="가게를 소개해주세요"
                rows={4}
                className="w-full pl-12 pr-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Location Info */}
          {formData.latitude && formData.longitude && (
            <div className="bg-[#f5f0dc] rounded-[1rem] p-4">
              <p className="text-sm text-[#6b8e6f] mb-2">위치 정보</p>
              <p className="text-xs text-[#9ca89d]">
                위도: {formData.latitude.toFixed(6)}<br />
                경도: {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#6b8e6f] z-20">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] text-white py-4 rounded-[1.5rem] hover:opacity-90 transition-opacity disabled:opacity-50 text-center"
          >
            {isLoading ? "등록 중..." : "가게 등록 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}