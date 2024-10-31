export interface SabhaResource {
    id: number;
    districtId?: number;
    nameSinhala?: string;
    nameEnglish?: string;
    nameTamil?: string;
    code?: string;
    logoPath?: string;
    status?: number;
    createdDate?: Date;
    telephone1?: string;
    telephone2?: string;
    addressSinhala?: string;
    addressEnglish?: string;
    addressTamil?: string;
    accountSystemVersionId?: number;
    isFinalAccountsEnabled?: number;
    chartOfAccountVersionId?: number;
   // district?: District;
    // province?: Province; // Uncomment if you have a Province interface
    // offices?: Office[]; // Uncomment if you have an Office interface array
}