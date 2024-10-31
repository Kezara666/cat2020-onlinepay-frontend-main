import { MainRoad } from "./MainRoad";
import { WaterProject } from "./WaterProject";

export class SubRoad{
    id?:  number;
    name?: string;
    mainRoadId?: number;
    waterProjectId?: number;
    status?: number;
    createdBy?: number;
    updatedBy?: number;
    mainRoad?:MainRoad;
    waterProject?:WaterProject;

    // nameSinhala: string;
    // nameEnglish: string;
    // nameTamil: string;

}