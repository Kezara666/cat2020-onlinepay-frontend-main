
export class Tariff
{
    id?:number;
  waterProjectId?: number;
  natureId?: number;
  
  nature?:any[];
  rangeStart?: number;
  rangeEnd?: number;
  unitPrice?: number;
  fixedCharge?: number;
  status?: number;
  createdBy?: number;
  updatedBy?: number;
}