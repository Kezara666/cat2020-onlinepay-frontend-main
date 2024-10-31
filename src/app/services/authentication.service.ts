import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import {SharedService} from "./shared.service";
import * as CryptoJS from "crypto-js";


var apiAuthUrl = environment.API_AUTH_URL;
var httpLink = {
    isAvailable: apiAuthUrl + "/isAvailable",
    isPartnerAvailable: apiAuthUrl + "/isPartnerAvailable",
    isPartnerMobileAvailable: apiAuthUrl + "/isMobileAvailable",
    isPartnerEmailAvailable: apiAuthUrl + "/isEmailAvailable"
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private httpClient: HttpClient, private sharedService: SharedService) {
    }

    public createPartner(cPartner: any) {
        return this.httpClient.post(httpLink.isPartnerAvailable, cPartner, {observe: 'response'})
    }

    public isPartnerAvailable(NIC: string, mobileNo: string) {
        return this.httpClient.post(httpLink.isAvailable, {mobileNo, NIC}, {observe: 'response'})
    }

    public isPartnerMobileAvailable(mobileNo: string) {
        return this.httpClient.post(httpLink.isPartnerMobileAvailable, {mobileNo}, {observe: 'response'})
    }

    public isPartnerEmailAvailable(EmailAddress: string) {
        return this.httpClient.post(httpLink.isPartnerEmailAvailable, {EmailAddress}, {observe: 'response'})
    }

    public getIPAddress(): Observable<any> {
        const url = 'https://api.ipify.org/?format=json';
        return this.httpClient.get<any>(url);
    }

    login(NIC: string, mobileNo: string, operatingSystem: string, browser: string, device: string, osVersion: string, browserVersion: string, deviceType: string, orientation: string, ipAddress: string,) {
        return this.httpClient.post<any>(`${apiAuthUrl}`, {NIC, mobileNo, operatingSystem, browser, device, osVersion, browserVersion, deviceType, orientation, ipAddress})
            .pipe(map(partner => {
                if (partner.token) { // need to improve security
                    sessionStorage.setItem('partnerId', partner.partnerId);
                    sessionStorage.setItem('partnerName', partner.partnerName);
                    sessionStorage.setItem('CurrentToken', partner.token);
                    sessionStorage.setItem('partnerNIC', partner.partnerNIC);
                    sessionStorage.setItem('partnerMobileNo', partner.partnerMobileNo);
                    sessionStorage.setItem('partnerEmail', partner.partnerEmail);
                    sessionStorage.setItem('sabhaId', partner.SabhaId);
                }
            }));
    }

    login1Mobile(logInInfo: any) {
        return this.httpClient.post<any>(`${apiAuthUrl}`, logInInfo)
            .pipe(map(partner => {
                if (partner.token) { // need to improve security

                    sessionStorage.setItem('CurrentToken', partner.token);
                    sessionStorage.setItem("partnerMobileNo", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerMobileNo), environment.KEY).toString());
                    sessionStorage.setItem("partnerNIC", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerNIC), environment.KEY).toString());
                    sessionStorage.setItem("partnerName", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerName), environment.KEY).toString());
                    sessionStorage.setItem("partnerEmail", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerEmail), environment.KEY).toString());
                    sessionStorage.setItem("partnerId", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerId), environment.KEY).toString());
                    sessionStorage.setItem("createdBy", CryptoJS.AES.encrypt(JSON.stringify(partner.createdBy), environment.KEY).toString());
                    sessionStorage.setItem("updatedBy", CryptoJS.AES.encrypt(JSON.stringify(partner.updatedBy), environment.KEY).toString());

                    this.sharedService.setPartnerInfo(
                        partner.partnerName,
                        partner.partnerNIC,
                        partner.partnerMobileNo,
                        partner.createdBy,
                        partner.updatedBy
                    );

                }
            }))
    }

    login1Email(logInInfo: any) {
        return this.httpClient.post<any>(`${apiAuthUrl}`, logInInfo)
            .pipe(map(partner => {
                if (partner.token) { // need to improve security

                    sessionStorage.setItem('CurrentToken', partner.token);
                    sessionStorage.setItem("partnerMobileNo", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerMobileNo), environment.KEY).toString());
                    sessionStorage.setItem("partnerNIC", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerNIC), environment.KEY).toString());
                    sessionStorage.setItem("partnerName", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerName), environment.KEY).toString());
                    sessionStorage.setItem("partnerEmail", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerEmail), environment.KEY).toString());
                    sessionStorage.setItem("partnerId", CryptoJS.AES.encrypt(JSON.stringify(partner.partnerId), environment.KEY).toString());
                    sessionStorage.setItem("createdBy", CryptoJS.AES.encrypt(JSON.stringify(partner.createdBy), environment.KEY).toString());
                    sessionStorage.setItem("updatedBy", CryptoJS.AES.encrypt(JSON.stringify(partner.updatedBy), environment.KEY).toString());

                    this.sharedService.setPartnerInfo(
                        partner.partnerName,
                        partner.partnerNIC,
                        partner.partnerMobileNo,
                        partner.createdBy,
                        partner.updatedBy
                    );

                }
            }))
    }

}
