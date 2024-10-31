export interface BookingProperty {
  id?: number;
  propertyName: string;
  code?: string;
  status?: number;
  sabhaId?: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  bookingNotes: string;
}

export interface BookingSubProperty {
  id?: number;
  subPropertyName: string;
  code?: string;
  status: number;
  sabhaId?: number;
  propertyId: number;
  address: string;
  telephoneNumber: number;
  latitude: string;
  longitude: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  bookingProperty?: BookingProperty;
  // chargingSchemes: ChargingScheme[] = [];
  // bookingTimeSlots: BookingTimeSlot[] = [];
}

export enum BookingTimeSlotStatus {
  AVAILABLE = 1,
  BOOKED = 2,
  PENDING = 3,
  // Add other statuses as needed
}

export interface BookingTimeSlot {
  id?: number;
  subPropertyId: number;
  PropertyId: number;
  description: string;
  from: string;
  to: string;
  //bookingTimeSlotStatus: BookingTimeSlotStatus;
  orderLevel: number;
  sabhaId?: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum OnlineBookingStatus {
  pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum BookingPaymentStatus {
  PaymentPending = 0,
  Paid = 1,
}


export interface SaveBooking {

  id: number | null,
  propertyId: number,
  subPropertyId: number,
  customerId: number,
  creationDate: string,
  bookingTimeSlotIds: number[],
  sabhaId: number,
  bookingNotes: string,
  bookingStatus: number,
  totalAmount: number,
  paymentStatus: number,
  transactionId: number,
  approvedBy: number,
  approvedAt: string,
  rejectionReason: string,
  cancellatioReason: string,
  createdAt: string,
  updatedAt: string,
  dateTimeSlot: DateTimeSlot[]

}

export interface DateTimeSlot {
  startDate: string,
  endDate: string,
  bookingTimeSlotIds: number[]
}
