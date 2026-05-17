export enum Role {
  ARTISAN = 'ARTISAN',
  ADMIN = 'ADMIN'
}

export enum PriceLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Complexity {
  SIMPLE = 'SIMPLE',
  MEDIUM = 'MEDIUM',
  COMPLEX = 'COMPLEX'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  zipcode: string;
  address: string;
  phone: string;
  description: string | null;
  rating: number;
  reviewCount: number;
  priceLevel: PriceLevel;
  serviceRadiusKm: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  artisanId: string;
  name: string;
  description: string | null;
  priceMinCents: number;
  priceMaxCents: number;
  estimatedDurationMin: number;
  complexity: Complexity;
  isActive: boolean;
}

export interface AvailabilitySlot {
  id: string;
  artisanId: string;
  startTs: string;
  endTs: string;
  isBooked: boolean;
}

export interface AvailabilityByDate {
  date: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  artisanId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string | null;
  slotStart: string;
  slotEnd: string;
  status: AppointmentStatus;
  cancellationFeeCents: number;
  photos?: string[];
  createdAt: string;
  
  service?: {
    name: string;
    priceMinCents: number;
    priceMaxCents: number;
  };
  artisan?: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
}

export interface ArtisanSearchResult {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  zipcode: string;
  rating: number;
  reviewCount: number;
  priceLevel: PriceLevel;
  description: string | null;
  availabilityBadges: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}