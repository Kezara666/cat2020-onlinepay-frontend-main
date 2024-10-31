import { Assessment } from "./Assessment";
import { Street } from "./Street";

export class Ward {
    id?: number;
    wardName?: string;
    wardNo?: string;
    wardCode?: string;
    officeId?: number;
    sabhaId?: number;
    streets?: Street[];
    status?: number;
    createdBy?: number;
    updatedBy?: number;
    assessments?: Assessment[];
}
