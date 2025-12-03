// server/src/types/index.ts
import { Request } from 'express';
// On importe tout depuis le client Prisma généré
import { 
    Role, 
    AppointmentStatus as PrismaAppointmentStatus, 
    CallMode as PrismaCallMode,
    CallStatus as PrismaCallStatus,
    Artisan as PrismaArtisan, 
    Service as PrismaService
} from '@prisma/client';

// === ENUMS ===
// On ré-exporte les enums Prisma pour qu'ils soient utilisables dans toute l'app
export const AppointmentStatus = {
    PENDING: 'PENDING' as PrismaAppointmentStatus,
    CONFIRMED: 'CONFIRMED' as PrismaAppointmentStatus,
    CANCELLED: 'CANCELLED' as PrismaAppointmentStatus,
    NO_SHOW: 'NO_SHOW' as PrismaAppointmentStatus
};
export type AppointmentStatus = PrismaAppointmentStatus;

export const CallMode = {
    NONE: 'NONE' as PrismaCallMode,
    AUTO_AI: 'AUTO_AI' as PrismaCallMode,
    ARTISAN_DECIDES: 'ARTISAN_DECIDES' as PrismaCallMode
};
export type CallMode = PrismaCallMode;

export const CallStatus = {
    NOT_NEEDED: 'NOT_NEEDED' as PrismaCallStatus,
    PENDING: 'PENDING' as PrismaCallStatus,
    DONE: 'DONE' as PrismaCallStatus,
    FAILED: 'FAILED' as PrismaCallStatus
};
export type CallStatus = PrismaCallStatus;

// Ré-exporter Role directement depuis Prisma
export { Role } from '@prisma/client';

// === INTERFACES ===
export interface JwtPayload {
    userId: string;
    role: Role;
}

export interface RequestWithUser extends Request {
    user?: JwtPayload;
}

// Types pour les entités Prisma
export type Artisan = PrismaArtisan;
export type Service = PrismaService;

// Interface Appointment étendue (pour les includes)
export interface Appointment {
    id: string;
    artisanId: string;
    serviceId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNotes?: string | null;
    startTs: Date;
    endTs: Date;
    status: AppointmentStatus;
    cancellationFeeCents: number;

    // Champs IA
    callMode: CallMode;
    callStatus: CallStatus;
    callBy?: string | null; 
    callSummary?: string | null; 

    createdAt: Date;
    updatedAt: Date;

    // Relations optionnelles
    service?: Service; 
    artisan?: Artisan; 
}