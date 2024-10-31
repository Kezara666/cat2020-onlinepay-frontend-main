import {AssessmentPropertyTypes} from "./AssessmentPropertyTypes";
import {PropertyDescriptions} from "./PropertyDescriptions";
import {Street} from "./Street";
import {Ward} from "./Ward";
import {Allocation} from "./Allocation";
import {AssessmentBalance} from "./AssessmentBalance";

import {AssessmentTempPartner} from "./AssessmentTempPartner";
import {AssessmentTempSubPartner} from "./AssessmentTempSubPartner";
import {Partner} from "./Partner";
import {Office} from "./Office";
import {MixinOrder} from "../MixinOrder";

export class Assessment {
  id?: number;
  partnerId?: number;
  subPartnerId?: number;
  streetId?: number;

  wardId?: number;
  propertyTypeId?: number;
  descriptionId?: number;
  OrderNo?: number;
  assessmentNo?: string;
  assessmentStatus?: number;
  syn?: number;
  comment?: string;
  obsolete?: string;

  officeId?: number;
  sabhaId?: number;

  isWarrant?: number;
  tempPartnerId?: number;
  tempSubPartnerId?: number;

  isPartnerUpdated?: boolean;
  isSubPartnerUpdated?: boolean;


  propertyTypeChangeRequest? :boolean;
  descriptionChangeRequest?:boolean;
  // mandatory fields
  createdBy?: number;
  updatedBy?: number;

  // relations
  description?: PropertyDescriptions;
  assessmentPropertyType?: AssessmentPropertyTypes;
  ward?: Ward;
  street?: Street;
  allocation?: Allocation;
  partner?: Partner;
  subPartner?: Partner;

  office?: Office;
  assessmentTempPartner?:AssessmentTempPartner;
  assessmentTempSubPartner?:AssessmentTempSubPartner|null;
  assessmentBalance?: AssessmentBalance;

  //virtual property there is no relationship
  mixinOrder?:MixinOrder;
}


