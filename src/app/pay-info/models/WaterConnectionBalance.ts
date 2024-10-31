
export class WaterConnectionBalance {
    id?: number;
    wcPrimaryId?: number;
    // waterConnection?: WaterConnectionResource | null;
  
    barCode?: string;
    invoiceNo?: string;
  
    year?: number;
    month?: number;
  
    fromDate?: Date;
    toDate?: any | null;
  
    billProcessDate?: Date;
    meterNo?: string;
    previousMeterReading?: number | null;
    thisMonthMeterReading?: number | null;
    readingDate?: Date | null;
  
  
    printLastBalance?: number | null;
  
    waterCharge?: number | null;
    fixedCharge?: number | null;
    vatRate?: number | null;
    vatAmount?: number | null;
    thisMonthCharge?: number | null;
    thisMonthChargeWithVAT?: number | null;
    totalDue?: number | null;
  
    meterCondition?: number | null;
  
    byExcessDeduction?: number | null;
    onTimePaid?: number | null;
    latePaid?: number | null;
    payments?: number | null;
    overPay ?:number|null;
  
    isCompleted?: boolean | null;
    isFilled?: boolean | null;
    isProcessed?: boolean | null;
  
    calculationString?:string
    lastBillYearMonth?: string;
    printBillingDetails?: string;
    printBalanceBF?: number | null;
    printLastMonthPayments?: number | null;
  
    numPrints?: number | null;
  
    createdAt?: Date | null;
    updatedAt?: Date | null;
    createdBy?: number | null;
    updatedBy?: number | null;
    readBy?: number | null;
  
    /*notMapProperty*/
  
    sessionId?:number|null;
    payable?:number|null;
    payingVatAmount?:number|null;
    payingAmount?:number|null;
  
  }
  