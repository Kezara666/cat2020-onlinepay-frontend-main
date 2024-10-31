import {Assessment} from "./Assessment";

export class AssessmentTempPartner {
  id?: number;
  name?: string;
  nicNumber?: string;
  mobileNumber?: string;
  phoneNumber?: string;
  street1?: string;
  street2?: string;
  // city?:string;
  // zip?:string;
  // email?:string;
  assessmentId?: number;

  status?:number;
  createdBy?: number;
  updatedBy?: number;
  assessment?: Assessment;
}




