import { VoteAssignment } from "./VoteAssignment";

export class VoteAssignmentDetail {
    id?: number;
    isActive?: number;
    customVoteName?: string;
    dateCreated?: Date;
    dateModified?: Date;
    voteAssignmentId?: number;
    voteAssignment?: VoteAssignment;
}
