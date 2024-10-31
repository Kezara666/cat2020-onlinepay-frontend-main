import { Assessment } from "./Assessment";
import {Quarter} from "./Quarter";

export class AssessmentBalance {
    id?:number;
    assessmentId?:number;
    year?:number;
    startDate:any;

    excessPayment?:number;
    lyArrears?:number;
    lyWarrant?:number;
    tyArrears?:number;
    tyWarrant?:number;

    annualAmount?:number;
    byExcessDeduction?:number;
    paid?:number;
    overPayment?:number;
    discountRate?:number;
    discount?:number;
    currentQuarter?:number;
    isCompleted?:boolean;

    assessment?:Assessment;

    q1?:Quarter;
    q2?:Quarter;
    q3?:Quarter;
    q4?:Quarter;

  // mandatory fields
    status?:number;
    createdBy?:number;
    updatedBy?:number;
}


