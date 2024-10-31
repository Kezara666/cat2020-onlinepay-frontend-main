import { AssessmentPropertyTypes } from "./AssessmentPropertyTypes";
import { PropertyDescriptions } from "./PropertyDescriptions";
import { Street } from "./Street";
import { Ward } from "./Ward";
import { Allocation } from "./Allocation";
import { AssessmentBalance } from "./AssessmentBalance";
import { AssessmentTempSubPartner } from "./AssessmentTempSubPartner";
import { AssessmentTempPartner } from "./AssessmentTempPartner";

export class SendExcelAssmData {
    streetId?: number;
    wardId?: number;
    assessmentPropertyTypeId?: number;
    descriptionId?:number;
    assessmentOrder?:number;
    assessmentNo?: string;
    assessmentStatus?: number;
    assessmentComment?: string;
    assessmentObsolete?:string;
    officeId?: number;
    sabhaId?:number;
    isWarrant?: number;
    createdBy?:number;
    subOwner_name?:string;
    subOwner_nICNumber?:string;
    subOwner_title?:string;
    allocation_allocationAmount?:number;
    allocation_changedDate?:Date;
    allocation_allocationDescription?:string;
    opnbal_oBYear?:number;
    opnbal_quarterNumber?:number;
    // opnbal_processDate:Date;
    opnbal_lYArreas?:number;
    opnbal_lYWarrant?: number;
    opnbal_overPayment?: number;
    // opnbal_lYCArreas?:number;
    // opnbal_lQArreas?:number;
    // opnbal_lQWarrant?:number;
    // opnbal_lQCArreas?:number;
    // opnbal_lQCWarrant?:number;
    // opnbal_haveToQPay?:number;
    // opnbal_qPay?:number;
    // opnbal_qDiscont?:number;
    // opnbal_qTotal?:number;
    // opnbal_fullTotal?:number;
    // opnbal_processUpdateWarrant?:number;
    // opnbal_processUpdateArrears?:number;
    // opnbal_processUpdateComment?:string;
    // opnbal_oldArrears?:number;
    // opnbal_oldWarrent?:number;
    tempPartner_name?:string;
    tempPartner_nicNumber?: string;
    tempPartner_mobileNumber?:string;
    tempPartner_phoneNumber?:string;
    tempPartner_street1?:string;
    tempPartner_street2?:string;
    tempPartner_city?:string;
    tempPartner_zip?:string;
    tempPartner_email?:string;
}


// public virtual ICollection<SubOwner>? SubOwner { get; set; }
// public virtual Allocation? Allocation { get; set; }
// public virtual ICollection<QuarterOpeningBalance>? QuarterOpeningBalance { get; set; }
