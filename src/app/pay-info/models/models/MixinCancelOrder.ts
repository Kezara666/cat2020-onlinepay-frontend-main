
export class MixinCancelOrder {
    id?: string;
    reason?: string;
    createdAt? : Date;
    updatedAt?: Date;
    createdBy?: number;
    sessionId?: number;
    mixinOrderId?: number;
    approvedBy?: number;
    ApprovalComment?: string;
    officeId?: number;
}
