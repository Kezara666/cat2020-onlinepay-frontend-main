import { MainRoad } from "./MainRoad";
import { SubRoad } from "./SunRoad";
import { WaterProjectNature } from "./WaterProjectNature";
import { Office } from "./models/Office";

export class WaterProject {
    id?: number;
    name?: string;
    officeId?: number;
    //wpgnDivisions?: GnDivision;
    status?: number;
    createdBy?: number;
    updatedBy?: number;
    //gnDivisions?: GnDivision[];
    natures?:WaterProjectNature[];
    mainRoads?: MainRoad[];
    subRoads?: SubRoad[];
    office?: Office;

    
    // officeTypeID: number;
    // nameSinhala: string;
    // nameEnglish: string;
    // nameTamil: string;


}
