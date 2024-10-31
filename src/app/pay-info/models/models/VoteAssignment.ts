import {VoteAssignmentDetail} from "./VoteAssignmentDetail";
import {Office} from "./Office";
import {AccountDetail} from "./AccountDetail";
import {VoteDetail} from "./VoteDetail";


export class VoteAssignment {
    id?: string;
    isActive?: number;
    voteId?: number;
    officeId?: number;
    bankAccountId?: number;
    dateCreated?: Date;
    dateModified?: Date;
    sabhaId?:number;
    voteDetail?: VoteDetail;
    voteAssignmentDetail?: VoteAssignmentDetail;
    office?: Office;
    accountDetail?: AccountDetail;
    voteAssignmentDetails?: VoteAssignmentDetail[];
}

export class VoteAssignmentFullDataClass {
    id?: string;
    isActive?: number;
    voteDetail? : VoteDetail;
    voteId?: number;
    office? : Office
    officeId?: number;
    accountDetail? : AccountDetail;
    bankAccountId?: number;
    dateCreated?: Date;
    dateModified?: Date;
    sabhaId?:number;
    voteAssignmentDetail? : VoteAssignmentDetail;
}

