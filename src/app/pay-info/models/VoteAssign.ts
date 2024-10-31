import { paymentCategory } from "./PaymentCategorgy";
import { VoteAssignmentDetail } from "./models/VoteAssignmentDetail";


export class VoteAssign{


    id?: number;
    waterProjectId?: number;
    paymentCategoryId?: number;
    vote?: number;
    status?: number;
    createdBy?: number;
    updatedBy?: number;
    paymentCategory ?: paymentCategory;
    voteAssignmentDetails?: VoteAssignmentDetail;
}

