import { create } from 'zustand';
import type { Application, ApplicationStatus } from '../types';
import { applicationsApi, businessApplicationsApi } from '../utils/api';

interface ApplicationState {
  applications: Application[];
  isLoading: boolean;

  // Actions
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application, accessToken?: string) => void;
  removeApplication: (appId: string, accessToken?: string) => void;
  updateStatus: (appId: string, status: ApplicationStatus, accessToken?: string) => void;
  getByProductAndUser: (productId: string, userEmail: string) => Application | undefined;
  loadFromServer: (accessToken: string, userType: string, userEmail?: string) => Promise<boolean>;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  isLoading: false,

  setApplications: (apps) => set({ applications: apps }),

  addApplication: (app, accessToken) => {
    const updated = [...get().applications, app];
    set({ applications: updated });
    // Backend save
    if (accessToken) {
      applicationsApi.create(app, accessToken).catch(e =>
        console.log("Backend save failed:", e)
      );
    }
  },

  removeApplication: (appId, accessToken) => {
    const updated = get().applications.filter(a => a.id !== appId);
    set({ applications: updated });
    // Backend delete
    if (accessToken) {
      applicationsApi.delete(appId, accessToken).catch(e =>
        console.log("Backend delete failed:", e)
      );
    }
  },

  updateStatus: (appId, status, accessToken) => {
    set(state => ({
      applications: state.applications.map(app =>
        app.id === appId
          ? { ...app, status, reviewedAt: new Date().toISOString() }
          : app
      ),
    }));
    // Backend update
    if (accessToken) {
      applicationsApi.updateStatus(appId, status, accessToken).catch(e =>
        console.log("Backend save failed:", e)
      );
    }
  },

  getByProductAndUser: (productId, userEmail) => {
    return get().applications.find(
      a => a.productId === productId && a.userEmail === userEmail
    );
  },

  loadFromServer: async (accessToken, userType, userEmail) => {
    set({ isLoading: true });
    try {
      const data = userType === "business"
        ? await businessApplicationsApi.getAll(accessToken)
        : await applicationsApi.getAll(accessToken);
      
      if (data?.success) {
        const localKey = userEmail ? `applications:${userEmail}` : 'applications';
        const localApps: Application[] = (() => {
          try { return JSON.parse(localStorage.getItem(localKey) || '[]'); } catch { return []; }
        })();
        const map = new Map<string, Application>();
        for (const item of localApps) map.set(item.id, item);
        for (const item of (data.applications ?? [])) map.set(item.id, item);
        const merged = Array.from(map.values());
        set({ applications: merged });
        try { localStorage.setItem(localKey, JSON.stringify(merged)); } catch {}
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to load applications:', e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
