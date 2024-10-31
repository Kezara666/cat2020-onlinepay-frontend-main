import { AssmtVoteAssign } from "./AssmtVoteAssign";

export class AssessmentPaymentType {
    id?:number;
    description?:string;
    status?:number;
    createdAt?:Date;
    updatedAt?:Date;
    createdBy?:number;
    updatedBy?:number;
    voteAssigns?:AssmtVoteAssign;
}



