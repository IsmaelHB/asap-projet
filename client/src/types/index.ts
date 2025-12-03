// Enums matching backend
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

// User & Artisan
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

// Service
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

// Availability
export interface AvailabilitySlot {
  id: string;
  artisanId: string;
  startTs: string;
  endTs: string;
  isBooked: boolean;
}

export interface AvailabilityByDate {
  date: string;
  morningAvailable: boolean;
  afternoonAvailable: boolean;
}

// Appointment
export interface Appointment {
  id: string;
  artisanId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string | null;
  startTs: string;
  endTs: string;
  status: AppointmentStatus;
  cancellationFeeCents: number;
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
customerNotes?: string; // tu l’as déjà logiquement, sinon ajoute-le aussi

  // 🔔 Champs pour l’IA d’appel (NOUVEAU) :
  callMode?: CallMode;        // comment ce RDV gère l’appel: NONE / AUTO_AI / ARTISAN_DECIDES
  callStatus?: CallStatus;    // état actuel: NOT_NEEDED / PENDING / DONE...
  callBy?: 'AI' | 'ARTISAN';  // qui a finalement appelé
  callSummary?: string;       // résumé de l’appel (écrit par l’IA ou l’artisan)

}

// Search result
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

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

// 🔔 Nouveau : gestion des appels autour du RDV
export type CallMode = 'NONE' | 'AUTO_AI' | 'ARTISAN_DECIDES';
export type CallStatus = 'NOT_NEEDED' | 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
