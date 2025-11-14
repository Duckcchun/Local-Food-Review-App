/**
 * API 통신 모듈
 * 
 * 현재는 localStorage를 사용하고 있으나,
 * 향후 Supabase 또는 백엔드 서버 연동 시 사용할 API 함수들입니다.
 * 
 * TODO: 서버 연동 시 이 파일의 주석을 해제하고 App.tsx에서 import하여 사용
 */

import { projectId, publicAnonKey } from './supabase/info';
import type { Application, Review, Notification } from '../App';
import type { Product } from '../data/mockData';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-98b21042`;

interface ApiResponse<T> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  accessToken?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API 요청 실패');
  }

  return data;
}

// Products API
export const productsApi = {
  create: async (product: Omit<Product, 'id'> & { id: string }, accessToken: string) => {
    return apiCall<{ success: boolean; product: Product }>(
      '/products',
      'POST',
      product,
      accessToken
    );
  },

  getAll: async (accessToken: string) => {
    return apiCall<{ success: boolean; products: Product[] }>(
      '/products',
      'GET',
      undefined,
      accessToken
    );
  },
};

// Applications API
export const applicationsApi = {
  create: async (application: Application, accessToken: string) => {
    return apiCall<{ success: boolean; application: Application }>(
      '/applications',
      'POST',
      application,
      accessToken
    );
  },

  getAll: async (accessToken: string) => {
    return apiCall<{ success: boolean; applications: Application[] }>(
      '/applications',
      'GET',
      undefined,
      accessToken
    );
  },

  updateStatus: async (applicationId: string, status: string, accessToken: string) => {
    return apiCall<{ success: boolean; application: Application }>(
      `/applications/${applicationId}`,
      'PUT',
      { status },
      accessToken
    );
  },

  delete: async (applicationId: string, accessToken: string) => {
    return apiCall<{ success: boolean }>(
      `/applications/${applicationId}`,
      'DELETE',
      undefined,
      accessToken
    );
  },
};

// Business Applications API
export const businessApplicationsApi = {
  getAll: async (accessToken: string) => {
    return apiCall<{ success: boolean; applications: Application[] }>(
      '/business/applications',
      'GET',
      undefined,
      accessToken
    );
  },

  getForProduct: async (productId: string, accessToken: string) => {
    return apiCall<{ success: boolean; applications: Application[] }>(
      `/business/applications?productId=${encodeURIComponent(productId)}`,
      'GET',
      undefined,
      accessToken
    );
  },
};
// Favorites API
export const favoritesApi = {
  add: async (productId: string, accessToken: string) => {
    return apiCall<{ success: boolean; favorites: string[] }>(
      '/favorites',
      'POST',
      { productId, action: 'add' },
      accessToken
    );
  },

  remove: async (productId: string, accessToken: string) => {
    return apiCall<{ success: boolean; favorites: string[] }>(
      '/favorites',
      'POST',
      { productId, action: 'remove' },
      accessToken
    );
  },

  getAll: async (accessToken: string) => {
    return apiCall<{ success: boolean; favorites: string[] }>(
      '/favorites',
      'GET',
      undefined,
      accessToken
    );
  },
};

// Reviews API
export const reviewsApi = {
  create: async (review: Review, accessToken: string) => {
    return apiCall<{ success: boolean; review: Review }>(
      '/reviews',
      'POST',
      review,
      accessToken
    );
  },

  getAll: async (accessToken: string) => {
    return apiCall<{ success: boolean; reviews: Review[] }>(
      '/reviews',
      'GET',
      undefined,
      accessToken
    );
  },
};

// Notifications API
export const notificationsApi = {
  create: async (notification: Notification & { targetUserId: string }, accessToken: string) => {
    return apiCall<{ success: boolean; notification: Notification }>(
      '/notifications',
      'POST',
      notification,
      accessToken
    );
  },

  getAll: async (accessToken: string) => {
    return apiCall<{ success: boolean; notifications: Notification[] }>(
      '/notifications',
      'GET',
      undefined,
      accessToken
    );
  },

  markAsRead: async (notificationId: string, accessToken: string) => {
    return apiCall<{ success: boolean; notification: Notification }>(
      `/notifications/${notificationId}`,
      'PUT',
      undefined,
      accessToken
    );
  },
};
