// src/services/api.ts
import axios from 'axios';
import { Appointment } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ================== HELPERS GÉNÉRIQUES ==================

const get = async <T = any>(url: string, params?: any): Promise<T> =>
  axios.get<T>(url, { params }).then((res) => res.data);

const post = async <T = any>(url: string, data?: any): Promise<T> =>
  axios.post<T>(url, data).then((res) => res.data);

// ================== TYPES ==================

export interface SearchResponse {
  artisans: any[];   // tu pourras remplacer any par un type Artisan plus tard
  total: number;
  page: number;
  pageSize: number;
}

// ================== API ==================

export const api = {
  // ========= RECHERCHE D'ARTISANS =========
  async search(params: {
    city?: string;
    search?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<SearchResponse> {
    const raw = await get<any>(`${API_URL}/api/artisans`, params);

    // Le backend peut renvoyer soit un tableau brut, soit un objet { artisans, total, ... }
    const artisans: any[] = Array.isArray(raw) ? raw : raw?.artisans ?? [];

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? (artisans.length || 1);
    const total =
      typeof raw?.total === 'number' ? raw.total : artisans.length;

    return {
      artisans,
      total,
      page,
      pageSize,
    };
  },

  // ========= PROFIL ARTISAN =========
  // Utilisé par ArtisanProfilePage (/artisans/:slug)
  async getArtisanById(id: string): Promise<any> {
  return get(`${API_URL}/api/artisans/${id}`);
},

  // ========= RENDEZ-VOUS =========
  async createAppointment(
    payload: any
  ): Promise<{ id: string; appointment: Appointment }> {
    const data = await post<{ id: string; appointment: Appointment }>(
      `${API_URL}/api/appointments`,
      payload
    );
    console.log('🔵 createAppointment response:', data);
    return data;
  },

  async getAppointment(id: string): Promise<Appointment> {
    const data = await get<Appointment>(`${API_URL}/api/appointments/${id}`);
    console.log('🔵 getAppointment response:', data);
    return data;
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    const data = await post<Appointment>(
      `${API_URL}/api/appointments/${id}/cancel`
    );
    console.log('🔵 cancelAppointment response:', data);
    return data;
  },
};

