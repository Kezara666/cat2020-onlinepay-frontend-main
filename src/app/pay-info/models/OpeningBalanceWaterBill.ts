
export class OpeningBalanceWaterBill {
    id?: number;
    waterConnectionId?: number;
    year?: number; //new
    month?: number;
    lastYearArrears?: number;
    thisYearArrears?:number; //up to 1st bill processing month
    overPayment?: number; //lastYaerOverPayment + thisYearOverPayment
    monthlyBalance?: number;
    totalBalance?: number;
    lastMeterReading?: number;
    status?: number;
    createdBy?: number;
    updatedBy?: number;
    isProcessed?: number;
}
