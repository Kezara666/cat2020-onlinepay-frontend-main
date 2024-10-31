import { BookingSubProperty } from "./booking-property";

export enum BookingPropertyChargingType {
    PerMinute = 1,
    PerHour = 2,
    PerDay = 3,
    PerWeek = 4,
    PerMonth = 5
}

export interface BookingPropertyCharging {
    id?: number; // Nullable type
    subPropertyId: number;
    chargingType: BookingPropertyChargingType;
    amount: number; // Precision is managed in the backend, so it's simply 'number' here
    status?: number; // Nullable type
    sabhaId?: number; // Nullable type
    createdBy?: number; // Nullable type
    updatedBy?: number; // Nullable type
    createdAt?: Date; // Nullable type
    updatedAt?: Date; // Nullable type
    bookingSubProperty?: BookingSubProperty; // Nullable type for virtual property
}