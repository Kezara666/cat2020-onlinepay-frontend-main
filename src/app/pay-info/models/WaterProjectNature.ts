import { NonMeterFixCharge } from "./NonMeterFixCharge";
import { Tariff } from "./Tariff";

export class WaterProjectNature{
    id?:number;
    type?: string;
    status?: number;
    createdBy?: number;
    sabhaId?: number;
    cType?:number; // charging type
    updatedBy?: number;
    waterProjectId?: number;
    waterTariffs?:Tariff[];
  nonMeterFixCharges?:NonMeterFixCharge[];
 }
