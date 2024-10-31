export interface Booking {
    id: number;
    propertyId: number;
    subPropertyId: number;
    bookingTimeSlotIds: string[];
    startDate: string;
    endDate: string;
  }