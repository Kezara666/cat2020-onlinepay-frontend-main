import {MixinOrderLine} from "./MixinOrderLine";
import {MixinCancelOrder} from "./models/MixinCancelOrder";
import {Office} from "./models/Office";
import {AccountDetail} from "./models/AccountDetail";

export class MixinOrder {
    id?: string;
    code?: string;
    customerName?: string;
    customerNicNumber?: string;
    customerMobileNumber?: string;
    totalAmount?: number;
    discountRate?: number;
    discountAmount?: number;
    chequeNumber?: string;
    chequeDate?: Date;
    chequeBankName?: string;
    state?: number;
    createdAt? : Date;
    updatedAt?: Date;
    sessionId?: number;
    paymentMethodId?: number;
    gnDivisions?: any[];
    gnDivisionId?: number;
    cashier?: any[];
    cashierId?: number;
    createdBy?: number;
    partner?: number;
    partnerId?: number;
    office?: Office;
    officeId?: number;
    accountDetailId?: number;
    businessId?: number;
    appCategoryId?: number;
    businessTaxId?: number;
    tradeLicenseStatus?: number;
    taxTypeId?: number;
    mixinCancelOrder?: MixinCancelOrder;
    accountDetail?: AccountDetail;
    mixinOrderLine?: MixinOrderLine[];

    paymentDetailId?: number | undefined;

    assessmentId?: number | undefined;
    shopId?: number | null;
    waterConnectionId?: number | null;
  
    assmtBalByExcessDeduction ?: number;
}
