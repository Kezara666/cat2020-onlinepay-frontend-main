import { Assessment } from "./Assessment";

export class Allocation{
    id?:number;
    allocationAmount?:number;
    status?: number;
    assessmentId?:number;
    changedDate?:any;
    allocationDescription?:string;


    createdBy?:number;
    updatedBy?:number;
    assessment?:Assessment;





}




