export class Partner {
    id: number=0;
    name?: string;
    nicNumber?: string="";
    mobileNumber?: string;
    phoneNumber?: string="";
    street1?: string="";
    street2?: string="";
    city?: string="";
    zip?: string="";
    email?: string="";
    active?: number=1;
    createdAt?: Date;
    updatedAt?: Date;
    isEditable?: number=1;
    createdBy?: number=0;
    updatedBy?: number=0;
    sabhaId?: number=0;
    gnDivisionId?: number;
    isTempory?: number = 0;
    riUserId?: number = 0;
    isBusinessOwner?: number = 0;
    isPropertyOwner?: number = 0;
}
