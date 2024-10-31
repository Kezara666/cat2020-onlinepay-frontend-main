import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpServiceProviderService } from '../services/http-service-provider.service';
import Swal from 'sweetalert2';
import { SabhaResource } from './model/sabha';
import { BookingProperty, BookingSubProperty, BookingTimeSlot, DateTimeSlot, SaveBooking } from './model/booking-property';
import { MatSelectChange } from '@angular/material/select';
import { OnlineBookingStatus, BookingPaymentStatus } from 'src/app/booking/model/booking-property'
import { DateOption, SelectedOption, TimeSlot } from './model/time-slots';
import { Booking } from './model/booking';

type PropertyTypeId = 1 | 2 | 3;
interface PropertyType {
  id: PropertyTypeId;
  name: string;
}
interface SabhaType {
  id: PropertyTypeId;
  name: string;
}
interface SubType {
  id: number;
  name: string;
}

//
export interface IOnlineBooking {
  id?: number;
  propertyId: number;
  subPropertyId: number;
  customerId: number;
  cremationDate: string;
  bookingTimeSlotIds: number[];
  bookingStatus: number;
  totalAmount: number; // In TypeScript, decimals are represented as numbers
  paymentStatus: number;
  transactionId: number;
  approvedBy: number;
  sabhaId: number;
  approvedAt: Date;
  rejectionReason?: string;
  cancellatioReason?: string;
  bookingNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaveBookingTimeResource {
  id?: number;
  subPropertyId: number;
  description: string;
  from: string;
  to: string;
  orderLevel?: number;
  bookingTimeSlotStatus: number;
}


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  propertyTypes!: BookingProperty[];

  sabhaType!: SabhaResource[];
  selectedSabhaId: number = 0;
  dateOptions: { date: string, timeSlots: BookingTimeSlot[] }[] = []; // List to store date-specific options

  selectedTimeSlotIds: number[] = [];

  subTypes: SubType[] = [];
  allOnlineBooking: IOnlineBooking[] = [];

  //selected date contains booking
  selectedDatePendingBooking: any;
  selectedOptions!: SelectedOption[];
  subTypeOptions!: BookingSubProperty[];

  selectedMainPropId: number = 0;
  options!: BookingTimeSlot[];
  charges: number = 0;
  startDate: any;
  endDate: any;
  dateTimeSlots: DateTimeSlot[] = [];
  closedBooking: Booking[] = [];

  constructor(private fb: FormBuilder, private httpServiceProviderService: HttpServiceProviderService) {
    this.bookingForm = this.fb.group({
      propertyType: ['', Validators.required],
      subType: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
      chargeAmount: [{ value: '', disabled: true }]
    });
  }



  ngOnInit(): void {
    this.getAllBookingRelatedToSpecificSaba(110);
    this.getSabhas();

  }

  onSabhaTypeChange(selectedTypeId: PropertyTypeId) {
    this.selectedSabhaId = selectedTypeId;
    this.getPropoties(selectedTypeId);
  }

  onSubPropertyTypeChange(selectedTypeId: PropertyTypeId) {
    this.getSubPropotiesTimeSlot(selectedTypeId);
    this.getChargesForSpecificSubProperty(selectedTypeId);

    this.filterSpecificMainAndSubProp()
    //call the filter
    var value = this.filterDateOptions(this.dateOptions, this.closedBooking, this.bookingForm.get('propertyType')?.value, this.bookingForm.get('subType')?.value, this.endDate, ["5", "9", "10"])
    console.log(value);
  }

  onPropertyTypeChange(selectedTypeId: PropertyTypeId): void {
    this.selectedMainPropId = selectedTypeId;
    this.getSubPropoties(selectedTypeId);
    // this.subTypes = this.subTypeOptions[selectedTypeId] || [];
    // this.bookingForm.get('subType')?.setValue('');
    // this.calculateCharge();
  }

  calculateCharge(): void {
    const propertyTypeId = this.bookingForm.get('propertyType')?.value as PropertyTypeId;
    const startDate = this.bookingForm.get('startDate')?.value;
    const startTime = this.bookingForm.get('startTime')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;
    const endTime = this.bookingForm.get('endTime')?.value;

    console.log('startDate:', startDate);
    console.log('startTime:', startTime);
    // console.log('endDate:', endDate);
    // console.log('endTime:', endTime);


    if (startDate && endDate) {
      try {

        // Format the start date to YYYY-MM-DD
        const startDateObject = new Date(startDate); // Convert the date string to a Date object
        const formattedStartDate = startDateObject.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

        // Format the end date to YYYY-MM-DD
        const endDateObject = new Date(endDate); // Convert the date string to a Date object
        const formattedEndDate = endDateObject.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
        this.startDate = startDate.toISOString();
        this.endDate = endDate.toISOString();
        // // Combine the formatted date with the time
        // const startDateTimeString = `${formattedStartDate}T${startTime}`;
        // const endDateTimeString = `${formattedEndDate}T${endTime}`;

        // // Parse the combined date-time strings
        // const start = new Date(startDateTimeString);
        // const end = new Date(endDateTimeString);

        // // console.log('Start Date Object:', start);
        // // console.log('End Date Object:', end);

        // if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        //   // console.error('Invalid date or time');
        //   this.bookingForm.get('chargeAmount')?.setValue('Invalid date or time');
        //   return;
        // }

        // if (end < start) {
        //   // console.error('End date/time is before start date/time');
        //   this.bookingForm.get('chargeAmount')?.setValue('Invalid duration');
        //   return;
        // }

        // const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        // const rate = this.chargeRates[propertyTypeId] || 0;
        // const chargeAmount = hours * rate;
        // this.bookingForm.get('chargeAmount')?.setValue(chargeAmount.toFixed(2));

        // //API call check that time slot is avaible
        // this.checkTimeStot(start, end)

        // Generate a date range with options for each day
        this.dateOptions = this.getDateArray(startDate, endDate).map(date => ({
          date: date.toDateString(),
          timeSlots: this.options
        }));


        console.log(this.dateOptions);

      } catch (error) {
        console.error('Error calculating charge:', error);
        this.bookingForm.get('chargeAmount')?.setValue('Error calculating charge');
      }
    } else {
      console.log('Form data is incomplete  ....' + 'startdate:' + startDate + 'endtime:' + endTime + 'start' + startTime + 'endDate' + endDate);
      this.bookingForm.get('chargeAmount')?.setValue('Incomplete form data');
    }
  }

  getDateArray(start: Date, end: Date) {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1)
    }
    return arr;
  }

  getAllTimeSlotsRe(start: Date) {

  }

  getAllBookingRelatedToSpecificSaba(sabaId: number) {
    this.httpServiceProviderService.getBookingRelatedToSaba(sabaId).subscribe(element => {
      this.allOnlineBooking = Array.isArray(element) ? element : [element];
    });
  }




  onSubmit(): void {
    console.log('Selected Options:', this.selectedOptions);

    // Prepare time slot IDs array from selected options
    // Assuming selectedOptions is populated correctly
    const timeSlotIdArray = this.selectedOptions.map((item: SelectedOption) => item.option); // This gets the IDs of the selected options.
    const timeSlots = this.selectedOptions.map((item: SelectedOption) => item.option);

    console.log(timeSlots);

    // Create the booking object with necessary conversions
    let saveBookingObj: SaveBooking = {
      id: null, // Set to null for new bookings
      subPropertyId: this.bookingForm.get('subType')?.value,
      propertyId: this.bookingForm.get('propertyType')?.value,
      customerId: 1,
      bookingNotes: '', // Empty string if nullable
      creationDate: new Date().toISOString(), // ISO format datetime
      bookingTimeSlotIds: this.selectedTimeSlotIds, // Array of slot IDs
      sabhaId: this.selectedSabhaId,
      bookingStatus: OnlineBookingStatus.pending as number, // Set to pending
      totalAmount: this.charges, // Charges amount
      paymentStatus: BookingPaymentStatus.PaymentPending as number,
      transactionId: 0, // Placeholder transaction ID
      approvedBy: 0, // Default for new bookings
      approvedAt: new Date().toISOString(), // ISO format datetime
      rejectionReason: '', // Empty if nullable
      cancellatioReason: '', // Match backend spelling exactly
      // Correctly named and formatted DateTimeSlot
      dateTimeSlot: this.dateTimeSlots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log(timeSlotIdArray);
    this.bookingForm.get('propertyType')?.value   // Log for debugging


    // Submit booking
    this.addBooking(saveBookingObj);
  }

  filterSpecificMainAndSubProp() {
    this.httpServiceProviderService.getBookingGetBookingSpecificMainAndSubProp(this.bookingForm.get('propertyType')?.value, this.bookingForm.get('subType')?.value).subscribe(item => {
      this.closedBooking = item

    })
  }

  filterDateOptions(
    dateOptions: DateOption[],
    bookings: Booking[],
    propertyId: number,
    subPropertyId: number,
    endDate: string,
    bookingTimeSlotIds: string[]
  ): DateOption[] {
    return dateOptions.filter(dateOption =>
      dateOption.timeSlots.some(timeSlot =>
        bookings.some(booking =>
          booking.propertyId === propertyId &&
          booking.subPropertyId === subPropertyId &&
          booking.endDate === endDate &&
          booking.bookingTimeSlotIds.some(id => bookingTimeSlotIds.includes(id))
        )
      )
    );
  }


  addBooking(newBooking: SaveBooking): void {
    this.httpServiceProviderService.createBooking(newBooking).subscribe(
      (data: any) => {
        console.log('Booking created:', data);
        Swal.fire("Booking Success!", "Booking is successful", "success");
        //this.loadBookings(); // Refresh bookings after adding
      },
      (error: any) => {
        console.error('Error creating booking:', error);
        Swal.fire("Booking Failed!", "Booking is failed", "error");
      }
    );
  }

  addTimeSlot(timeSlot: SaveBookingTimeResource): void {
    this.httpServiceProviderService.createTimeSlot(timeSlot).subscribe(
      (data: any) => {
        console.log('Time Slot created:', data);
        Swal.fire("Time Slot created Success!", "Time Slot Create is successful", "success");
        //this.loadBookings(); // Refresh bookings after adding
      },
      (error: any) => {
        console.error('Error creating booking:', error);
      }
    );
  }

  getPropoties(sabhaId: number) {
    this.httpServiceProviderService.getAllProperty(sabhaId).subscribe((data: BookingProperty[]) => {
      this.propertyTypes = data;
    })
  }

  getSabhas() {
    this.httpServiceProviderService.getAllSabhaData().subscribe((data: SabhaResource[]) => {
      this.sabhaType = data;
    })
  }

  getSubPropoties(propId: number) {
    this.httpServiceProviderService.getSubProperty(propId).subscribe((data: BookingSubProperty[]) => {
      this.subTypeOptions = data;
      console.log(data);
    })
  }

  getSubPropotiesTimeSlot(subPropId: number) {
    this.httpServiceProviderService.getSubPropotiesTimeSlots(subPropId).subscribe((data: BookingTimeSlot[]) => {
      this.options = data;
      console.log(data);
    })
  }

  getChargesForSpecificSubProperty(subPropId: number) {
    this.httpServiceProviderService.getAllChargingSchemesForSubPropertyId(subPropId).subscribe(items => {
      //get specific charge for sub prop
      this.charges = items[0].amount
      console.log(this.charges + "charge")
    });
  }

  getCharges() {
    this.bookingForm.get('chargeAmount')?.setValue(this.selectedOptions.length * this.charges);
    console.log(this.closedBooking);
    console.log(this.dateOptions);
    console.log(

    )
  }

  onSelectionChange(event: MatSelectChange) {
    // this.selectedOptions = event.value;
    // console.log(this.selectedOptions);
    // this.getCharges()

    this.selectedOptions = event.value; // Update selected options
    console.log(this.selectedOptions);
    this.getCharges(); // Call your method to get charges based on selection

    // Extract time slot IDs from selected options
    this.selectedTimeSlotIds = this.selectedOptions.flatMap(item => {
      if (item.option) {
        return [item.option.id]; // Return the ID of the selected time slot
      }
      return [];
    });


    // Create a mapping for dateTimeSlots
    this.dateTimeSlots = this.selectedOptions.reduce((acc: DateTimeSlot[], item) => {
      const existingSlot = acc.find(slot => slot.startDate === item.date);
      const timeSlotId = item.option.id;

      if (existingSlot) {
        // If the date already exists, push the time slot ID into its array
        existingSlot.bookingTimeSlotIds.push(timeSlotId);
      } else {
        // Create a new DateTimeSlot entry
        acc.push({
          startDate: item.date,
          endDate: item.date, // Set endDate as the same as startDate for now
          bookingTimeSlotIds: [timeSlotId] // Initialize with the current time slot ID
        });
      }

      return acc; // Return the accumulator for the next iteration
    }, []);

    const arr: number[][] = []



    // Sample data
    // const bookings: Booking[] = [
    //   { id: 1, propertyId: 8, subPropertyId: 15, bookingTimeSlotIds: ['9'], startDate: '2024-10-01', endDate: '2024-10-01' },
    //   { id: 2, propertyId: 8, subPropertyId: 15, bookingTimeSlotIds: ['10'], startDate: '2024-10-02', endDate: '2024-10-02' },
    //   // Add more bookings as needed
    // ];
    const bookings =this.closedBooking;
    const dateTimeSlots = this.dateTimeSlots;

    // const dateTimeSlots: DateTimeSlot[] = [
    //   { startDate: '2024-10-01', endDate: '2024-10-01', bookingTimeSlotIds: [9] },
    //   { startDate: '2024-10-02', endDate: '2024-10-02', bookingTimeSlotIds: [10] },
    //   // Add more dateTimeSlots as needed
    // ];

    // Function to check properties and return matched items
    const findMatchingBookings = (bookings: Booking[], dateTimeSlots: DateTimeSlot[]) => {
      return bookings.filter(booking =>
        dateTimeSlots.some(dateTimeSlot =>
          booking.propertyId === 8 && // Check if propertyId matches
          booking.subPropertyId === 15 && // Check if subPropertyId matches
          booking.startDate === dateTimeSlot.startDate && // Check if startDate matches
          booking.endDate === dateTimeSlot.endDate && // Check if endDate matches
          booking.bookingTimeSlotIds.some(id => dateTimeSlot.bookingTimeSlotIds.includes(Number(id))) // Check if any bookingTimeSlotId matches
        )
      );
    };

    console.log(findMatchingBookings(bookings,dateTimeSlots));

    // Log the constructed dateTimeSlots
    console.log('Constructed DateTime Slots:', this.dateTimeSlots);
    console.log('Selected DateTime Slots:', this.selectedOptions);
  }


}
