/**
 * Kakao Map SDK 로딩 및 유틸리티.
 *
 * Kakao Maps JavaScript SDK는 CDN 스크립트 태그로 로드됩니다.
 * 이 모듈은 SDK 로딩을 Promise로 감싸 async/await 패턴을 사용할 수 있게 합니다.
 *
 * 환경 변수: VITE_KAKAO_MAP_APP_KEY
 */

const KAKAO_MAP_APP_KEY = import.meta.env?.VITE_KAKAO_MAP_APP_KEY as string | undefined;
const KAKAO_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY || 'YOUR_APP_KEY'}&autoload=false&libraries=services,clusterer`;

let loadPromise: Promise<typeof kakao.maps> | null = null;

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

declare namespace kakao {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      setLevel(level: number): void;
      getCenter(): LatLng;
      getLevel(): number;
      setBounds(bounds: LatLngBounds): void;
      relayout(): void;
    }
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng;
    }
    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, marker: Marker): void;
      close(): void;
    }
    class LatLngBounds {
      constructor();
      extend(latlng: LatLng): void;
    }
    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
    }
    namespace event {
      function addListener(target: any, type: string, handler: (...args: any[]) => void): void;
      function removeListener(target: any, type: string, handler: (...args: any[]) => void): void;
    }
    function load(callback: () => void): void;

    interface MapOptions {
      center: LatLng;
      level: number;
    }
    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      title?: string;
      image?: any;
    }
    interface InfoWindowOptions {
      content: string;
      removable?: boolean;
    }
    interface CustomOverlayOptions {
      position: LatLng;
      content: string | HTMLElement;
      map?: Map;
      yAnchor?: number;
      xAnchor?: number;
    }
  }
}

/**
 * Load Kakao Maps SDK asynchronously.
 * Returns the kakao.maps namespace once loaded.
 * Caches the promise so multiple calls don't reload the script.
 */
export function loadKakaoMapSDK(): Promise<typeof kakao.maps> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.kakao?.maps) {
      resolve(window.kakao.maps);
      return;
    }

    // Create script tag
    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;

    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          resolve(window.kakao.maps);
        });
      } else {
        reject(new Error('Kakao Maps SDK failed to initialize'));
      }
    };

    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Kakao Maps SDK'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Check if Kakao Map API key is configured.
 */
export function isKakaoMapConfigured(): boolean {
  return !!KAKAO_MAP_APP_KEY && KAKAO_MAP_APP_KEY !== 'YOUR_APP_KEY';
}

/**
 * Create a custom marker HTML for a product on the map.
 */
export function createProductMarkerContent(product: {
  name: string;
  category: string;
  currentApplicants: number;
  requiredReviewers: number;
}): string {
  const progress = Math.round((product.currentApplicants / product.requiredReviewers) * 100);
  
  return `
    <div style="
      background: white;
      border: 2px solid #6b8e6f;
      border-radius: 12px;
      padding: 8px 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-family: -apple-system, sans-serif;
      min-width: 100px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s;
    ">
      <div style="font-size: 11px; font-weight: 700; color: #2d3e2d; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
        ${product.name}
      </div>
      <div style="font-size: 10px; color: #6b8e6f;">
        ${product.currentApplicants}/${product.requiredReviewers}명 (${progress}%)
      </div>
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #6b8e6f;
      "></div>
    </div>
  `;
}
