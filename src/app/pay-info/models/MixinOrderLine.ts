import {VoteAssignmentDetail} from "./models/VoteAssignmentDetail";


export class MixinOrderLine {
    id?: string;
    customVoteName?: string;
    description?: string;
    amount?: number;
    paymentVatAmount?: number|'1.2-2';
    paymentNbtAmount?: number;
    stampAmount?: number;
    totalAmount?: number;
    createdAt? : Date;
    updatedAt?: Date;
    mixinVoteAssignmentDetailId?:number;
    voteAssignmentDetails?: VoteAssignmentDetail[];
    paymentVatId?: number;
    paymentNbtId?: number;
    mixinOrderId?: number;
    voteOrBal?:number;
    voteDetailId?:number;
    voteCode:any;
    // paymentVat:Vat;
    // paymentNbt:Nbt;
    classificationId?:number;
    votePaymentTypeId?: number;
    
    assmtGrossAmount?: number;
    assmtDiscountAmount?: number;
    assmtDiscountRate?: number;
}
