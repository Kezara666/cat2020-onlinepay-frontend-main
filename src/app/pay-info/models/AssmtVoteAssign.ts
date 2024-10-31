import {AssessmentPaymentType} from "./AssessmentPaymentType";
import {VoteAssignmentDetail} from "./models/VoteAssignmentDetail";

export class AssmtVoteAssign {


  id?: number;
  sabhaId?: number;
  paymentTypeId?: number;
  voteAssignmentDetailId?: number;
  status?: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;


  votePaymentType?: AssessmentPaymentType;
  voteAssignmentDetails?: VoteAssignmentDetail;


}
