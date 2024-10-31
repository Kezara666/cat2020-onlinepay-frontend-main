import { MainRoad } from "./MainRoad";
import { StatusInfo } from "./StatusInfo";
import { SubRoad } from "./SunRoad";
import { WaterProject } from "./WaterProject";

export class MeterConnectionInfo{
    connectionId?: string;
    keyPattern?: any;
    officeId?:number;
    connectionNo?: string;
    meterNo?:number;
    installDate?: Date;
    subRoadId?: number;
    orderNo?:number;
    status?:number;
    createdBy?:number;
    updatedBy?:number;
    mainRoad?: MainRoad;
    waterProjectSubRoad?: SubRoad;
    waterProject?: WaterProject;
    statusInfos?: StatusInfo;

  
    isAssigned?:boolean;
  }
  