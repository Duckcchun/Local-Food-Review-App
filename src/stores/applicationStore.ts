import { create } from 'zustand';
import type { Application, ApplicationStatus } from '../types';
import { applicationsApi, businessApplicationsApi } from '../utils/api';
import { toast } from 'sonner';
import { hasPriorityPass, usePriorityPass } from '../utils/inventory';

interface ApplicationState {
  applications: Application[];

  // Actions
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  removeApplication: (appId: string) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;

  // Business logic
  apply: (params: {
    product: { id: string; name: string; image: string };
    userInfo: { email: string; name: string; phone: string };
    accessToken?: string;
  }) => Application | null;
  cancelApplication: (productId: string, userEmail: string, accessToken?: string) => string | null;
  loadApplications: (accessToken: string, userType: string) => Promise<void>;
  initFromLocalStorage: (userEmail?: string) => void;
  persistToLocalStorage: (userEmail?: string) => void;
}

function localKey(key: string, email?: string) {
  const id = (email || '').trim();
  return id ? `${key}:${id}` : key;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],

  setApplications: (applications) => set({ applications }),

  addApplication: (app) => {
    set(state => ({ applications: [...state.applications, app] }));
  },

  removeApplication: (appId) => {
    set(state => ({ applications: state.applications.filter(a => a.id !== appId) }));
  },

  updateApplicationStatus: (appId, status) => {
    set(state => ({
      applications: state.applications.map(app =>
        app.id === appId ? { ...app, status, reviewedAt: new Date().toISOString() } as Application : app
      ),
    }));
  },

  apply: ({ product, userInfo, accessToken }) => {
    const { applications } = get();
    if (applications.find(app => app.productId === product.id && app.userEmail === userInfo.email)) {
      toast.error("이미 신청한 체험단입니다");
      return null;
    }

    // Check priority pass
    let usedPriority = false;
    const priorityPass = hasPriorityPass(userInfo.email);
    if (priorityPass) {
      usedPriority = usePriorityPass(userInfo.email);
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
      hasPriority: usedPriority,
    };

    set(state => ({ applications: [...state.applications, newApplication] }));
    toast.success(usedPriority ? "⭐ 우선 선정권이 적용되어 신청되었습니다!" : "체험단 신청이 완료되었습니다!");

    // Save to backend
    if (accessToken) {
      applicationsApi.create(newApplication, accessToken).catch(error => {
        console.log("Backend save failed (using localStorage):", error);
      });
    }

    return newApplication;
  },

  cancelApplication: (productId, userEmail, accessToken) => {
    const { applications } = get();
    const app = applications.find(a => a.productId === productId && a.userEmail === userEmail);
    if (!app) {
      toast.error("신청 내역을 찾을 수 없습니다");
      return null;
    }
    if (app.status !== "pending") {
      toast.error("대기 중 상태에서만 취소할 수 있습니다");
      return null;
    }

    set(state => ({ applications: state.applications.filter(a => a.id !== app.id) }));
    toast.success("신청이 취소되었습니다");

    if (accessToken) {
      applicationsApi.delete(app.id, accessToken).catch(error => {
        console.log("Backend delete failed (using localStorage):", (error as any)?.message || error);
      });
    }

    return productId; // Return productId so caller can decrement applicants
  },

  loadApplications: async (accessToken, userType) => {
    try {
      const appsData = userType === "business"
        ? await businessApplicationsApi.getAll(accessToken)
        : await applicationsApi.getAll(accessToken);
      if (appsData?.success && appsData.applications) {
        const { applications } = get();
        // Merge by id
        const map = new Map<string, Application>();
        for (const item of applications) map.set(item.id, item);
        for (const item of appsData.applications) map.set(item.id, item);
        set({ applications: Array.from(map.values()) });
      }
    } catch (e) {
      console.warn('Failed to load applications:', e);
    }
  },

  initFromLocalStorage: (userEmail) => {
    try {
      const saved = localStorage.getItem(localKey('applications', userEmail));
      if (saved) set({ applications: JSON.parse(saved) });
    } catch { /* ignore */ }
  },

  persistToLocalStorage: (userEmail) => {
    const { applications } = get();
    try {
      localStorage.setItem(localKey('applications', userEmail), JSON.stringify(applications));
    } catch { /* ignore */ }
  },
}));
