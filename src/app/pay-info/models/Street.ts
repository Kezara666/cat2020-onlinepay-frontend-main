import { Ward } from "./Ward";

export class Street {
    id?: number;
    streetName?: string;
    streetNo?: string;
    streetCode?: string;
    wardId?: number;
    ward?: Ward;
    status?: number;
    createdBy?: number;
    updatedBy?: number;
}