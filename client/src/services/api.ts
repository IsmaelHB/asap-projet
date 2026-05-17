import axios from 'axios';
import {
  Appointment,
  AppointmentStatus,
  AvailabilitySlot,
  AvailabilityByDate,
  Service,
  Artisan,
  ApiResponse,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
  axios.get<T>(url, { params }).then((res) => res.data);

const post = async <T>(url: string, data?: unknown): Promise<T> =>
  axios.post<T>(url, data).then((res) => res.data);

export interface SearchResponse {
  artisans: Artisan[];
  total: number;
  page: number;
  pageSize: number;
}

export const api = {
  async search(params: {
    city?: string;
    search?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<SearchResponse> {
    const raw = await get<Artisan[] | { artisans?: Artisan[]; total?: number }>(
      `${API_URL}/api/artisans`,
      params as Record<string, unknown>
    );
    const artisans = Array.isArray(raw) ? raw : (raw as { artisans?: Artisan[] }).artisans ?? [];
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? (artisans.length || 1);
    const total =
      typeof (raw as { total?: number }).total === 'number'
        ? (raw as { total: number }).total
        : artisans.length;
    return { artisans, total, page, pageSize };
  },

  async getArtisanBySlug(slug: string): Promise<ApiResponse<{ artisan: Artisan; services: Service[] }>> {
    return get(`${API_URL}/api/artisans/${slug}`);
  },

  async getArtisanAvailability(
    artisanId: string,
    from: string,
    to: string
  ): Promise<ApiResponse<{ availability: AvailabilityByDate[] }>> {
    return get(`${API_URL}/api/artisans/${artisanId}/availability`, { from, to });
  },

  async listArtisanServices(token: string): Promise<ApiResponse<Service[]>> {
    const res = await axios.get(`${API_URL}/api/artisan/services`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async createService(token: string, data: Omit<Service, 'id' | 'artisanId'>): Promise<ApiResponse<Service>> {
    const res = await axios.post(`${API_URL}/api/artisan/services`, data, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async updateService(
    token: string,
    id: string,
    data: Partial<Omit<Service, 'id' | 'artisanId'>>
  ): Promise<ApiResponse<Service>> {
    const res = await axios.put(`${API_URL}/api/artisan/services/${id}`, data, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async deleteService(token: string, id: string): Promise<ApiResponse<void>> {
    const res = await axios.delete(`${API_URL}/api/artisan/services/${id}`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async listAppointments(
    token: string,
    status?: string
  ): Promise<ApiResponse<{ appointments: Appointment[] }>> {
    const res = await axios.get(`${API_URL}/api/appointments`, {
      headers: authHeader(token),
      params: status ? { status } : undefined,
    });
    return res.data;
  },

  async updateAppointmentStatus(
    token: string,
    id: string,
    status: AppointmentStatus
  ): Promise<ApiResponse<Appointment>> {
    const res = await axios.patch(
      `${API_URL}/api/appointments/${id}/status`,
      { status },
      { headers: authHeader(token) }
    );
    return res.data;
  },

  async markNoShow(token: string, id: string): Promise<ApiResponse<Appointment>> {
    const res = await axios.post(
      `${API_URL}/api/appointments/${id}/no-show`,
      {},
      { headers: authHeader(token) }
    );
    return res.data;
  },

  async listArtisanAvailability(
    token: string,
    from: string,
    to: string
  ): Promise<ApiResponse<AvailabilitySlot[]>> {
    const res = await axios.get(`${API_URL}/api/artisan/availability`, {
      headers: authHeader(token),
      params: { from, to },
    });
    return res.data;
  },

  async createAvailability(
    token: string,
    data: { startTs: string; endTs: string }
  ): Promise<ApiResponse<AvailabilitySlot>> {
    const res = await axios.post(`${API_URL}/api/artisan/availability`, data, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async deleteAvailability(token: string, id: string): Promise<ApiResponse<void>> {
    const res = await axios.delete(`${API_URL}/api/artisan/availability/${id}`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async createAppointment(payload: FormData): Promise<{ id: string; appointment: Appointment }> {
    return post(`${API_URL}/api/appointments`, payload);
  },

  async getAppointment(id: string): Promise<Appointment> {
    return get(`${API_URL}/api/appointments/${id}`);
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    return post(`${API_URL}/api/appointments/${id}/cancel`);
  },
};
