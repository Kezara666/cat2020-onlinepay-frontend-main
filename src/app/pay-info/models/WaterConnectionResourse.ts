import { MeterConnectionInfo } from "./MeterConnectionInfo";
import { OpeningBalanceWaterBill } from "./OpeningBalanceWaterBill";
import { Partner } from "./Partner";
import { StatusInfo } from "./StatusInfo";
import { SubRoad } from "./SunRoad";
import { WaterConnectionBalance } from "./WaterConnectionBalance";
import { WaterConnectionNature } from "./WaterConnectionNature";
import { WaterProjectNature } from "./WaterProjectNature";


export class WaterConnectionResource {
    id?: number;
    connectionId?: string;
    partnerId?: number;
    billingId?: number;
    subRoadId?: number;
    subRoad?: SubRoad;
    installDate?: any;
    nature?: WaterProjectNature;
    natureInfos?: WaterConnectionNature[];
    statusInfos?: StatusInfo[];
    documents?: Document[];
    activeNature?: WaterProjectNature;
    activeStatus?:number;
    statusChangeRequest?: boolean;
    natureChangeRequest?: boolean;
    status?: number;
    // createdAt?: Date;
    // updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;
    partnerAccount?:Partner;
    billingAccount?: Partner;
    connectionStatus?: number;

  openingBalanceInformation?: OpeningBalanceWaterBill;
  balances?:WaterConnectionBalance[];
  meterConnectInfo?:MeterConnectionInfo;

  runningOverPay?:number;





}
