import { WaterProjectNature } from "./WaterProjectNature";

export class WaterConnectionNature {
    id?: number;
    connectionId?: number;
    natureId?: number;
    nature?: WaterProjectNature[];
    status?: number;
    // createdAt?: Date | null;
    // updatedAt?: Date | null;
    createdBy?: number;
    updatedBy?: number;
    
  }
  