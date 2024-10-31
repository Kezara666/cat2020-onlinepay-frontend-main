import { WaterProjectNature } from "./WaterProjectNature";


export class NonMeterFixCharge{
    id?: number;
    waterProjectId?: number;
    natureId?: number;
    waterProjectNature?:WaterProjectNature;
    fixedCharge?: number;
    status?: number;
    createdBy?: number;
    updatedBy?: number;
}