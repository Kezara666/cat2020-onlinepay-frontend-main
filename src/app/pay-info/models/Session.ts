export class Session {
    id: number=0;
    module?: string;
    name?: string;
    startAt?: Date;
    stopAt?: Date;
    active?: number=1;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number=0;
    updatedBy?: number=0;
    officeId?: number;
    rescue?: number;
    rescueStartedAt?: Date;
}
