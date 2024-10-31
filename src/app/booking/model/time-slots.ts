import { BookingTimeSlot } from "./booking-property";

export interface TimeSlot {
    id: number;
    subPropertyId: number;
    description: string;
    from: string;
    to: string;
}

export interface DateOption {
    date: string;
    timeSlots: BookingTimeSlot[] ;
}

export interface SelectedOption {
    date: string;
    option: TimeSlot;
}