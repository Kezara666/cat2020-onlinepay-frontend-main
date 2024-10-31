import { WaterProjectNature } from "./WaterProjectNature";

export class StatusInfo {
    id?: number;
    connectionStatus?: number;
    comment?: string;
    actionNote?: string;
    connectionId?: number;
    waterConnection?: string;
    status?: number;
    activatedDate?: Date;
    // createdAt?: Date | null;
    // updatedAt?: Date | null;
    actionBy?:number;
    createdBy?: number;
    updatedBy?: number;
    natureId?: number;
    nature?: WaterProjectNature[];
}