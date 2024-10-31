import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { WebApiService } from './web-api.service';
import {IOnlineBooking, SaveBookingTimeResource } from '../booking/booking.component';
import { SabhaResource } from '../booking/model/sabha';
import { BookingProperty, BookingSubProperty, BookingTimeSlot, SaveBooking } from '../booking/model/booking-property';
import { BookingPropertyCharging } from '../booking/model/charge';
import { Booking } from '../booking/model/booking';


var apiUrl = environment.API_URL;
var api = environment.API;
//var api_url = environment.api_url
var httpLink = {
  getAllAuthority: apiUrl + "/getAllAllowedLocalAuthoritiesForPartner",
  getWaterBill: apiUrl + "/getWaterBill",
  getAllServices: apiUrl + "/getAllAssessments",
  getVerification: apiUrl + "/getVerification",
  showPay: apiUrl + "/pay",
  getPBPaymentForm: apiUrl + "/peoplesBankPayment/form",
  initiatePBPayment: apiUrl + "/peoplesBankPayment/initiate",
  getPBpaymentsignature: apiUrl + "/peoplesBankPayment/paymentsignature",
  placeAssessmentOrder: apiUrl + "/placeAssessmentOrder",
  placeWaterBillOrder: apiUrl + "/placeWaterBillOrder",

  makeOtherPayment: apiUrl + "/otherPayment",
  errMsg: apiUrl + "/systemErrMsg",
  backup: apiUrl + "/placeOrderBackup",
  getAllAssessmentVoteAssignsForSabha: api + "/api/assessmenttax/voteAssign/getAllAssmtVoteAssignsForSabha",
  getAssessmentDiscountRates: api + "/api/assessmenttax/rates/getDiscountRates",
  getSessionByOfficeAndModule: api + "/api/mixin/sessions/getAnyByOfficeAndModule",
  getActiveOrLastActiveSessionForOnlinePaymentCurrentMonth: api + "/api/mixin/sessions/GetActiveOrLastActiveSessionForOnlinePaymentCurrentMonth",
  AssessmentTaxCalculateBalance: api + "/api/assessmenttax/calculator/calculateBalance",
  AssessmentTaxCalculatePaymentBalance: api + "/api/assessmenttax/calculator/calculatePaymentBalance",
  getSabha: api + "/api/sabhas",
  getAllSabha: api + "/api/getAllSabha",
  getProperty: api + "/api/onlinePayments/OnlineBooking/getBookingProperty",
  getSubProperty: api + "/api/onlinePayments/OnlineBooking/getBookingSubProperty",
  getSubPropotiesTimeSlots: api + '/api/onlinePayments/OnlineBooking/getSubPropotiesTimeSlots',
  getPartner: api + "/api/mixin/partners/getByNIC",
  getPartnerById: api + "/api/mixin/partners/getById",
  getServiceCharges: api + "/api/onlinePayments/getServiceCharge",
  getGatewayAndConfigInfoForSabha: api + "/api/onlinePayments/getGatewayAndConfigInfoForSabha",
  getOfficeForSabha: api + "/api/Offices/getAllOfficesForSabhaId",
  getProvince: api + "/api/onlinePaymentsAuth/getAllProvince",
  getSabhaForDistrict: api + "/api/onlinePaymentsAuth/getAllSabha",
  getGnDivisionForSabha: api + "/api/onlinePaymentsAuth/getGnDivision",
  savePartner: api + '/api/onlinePaymentsAuth/partners/save',
  paymentHistory: api + '/api/onlinePayments/partnerPaymentHistory',
  partnerDisputes: api + '/api/onlinePayments/partnerDisputes',
  getPaymentDetailById: apiUrl + '/result',
  saveBookingTimeSlot: apiUrl + '/BookingTimeSlots/saveBookingProperty',

  getAllChargingSchemesForSubPropertyId: api + '/api/onlinePayments/ChargingScheme/getAllChargingSchemesForSubPropertyId',

  getWaterBillsPDFForSubRoad: api + '/api/waterBilling/balance/getWaterBillsPDFForSubRoad',

  getForPaymentByConnectionId: api + '/api/waterBilling/balance/getForPaymentByConnectionId',
  getForPaymentByConnectionNo: api + '/api/waterBilling/balance/getForPaymentByConnectionNo',
  getForPaymentByBarCode: api + '/api/waterBilling/balance/getForPaymentByBarCode',
  calculateWaterBillPayment: api + '/api/waterBilling/balance/calculateWaterBillPayment',
  GetWaterConnectionsIdsPartnerSearchByNIC: api + '/api/waterBilling/waterConnection/GetWaterConnectionsIdsPartnerSearchByNIC',
  getAllVoteAssignsForWaterProject:
    api + '/api/waterBilling/voteAssign/getAllVoteAssignsForWaterProject',
  getAllWaterProjectsForOffice:
    api + '/api/waterbilling/waterProject/getAllProjectsForOffice',
  placeWaterBillOrdersAndProcessPayments: api + '/api/mixin/mixinOrder/placeWaterBillOrdersAndProcessPayments',
  getReportHtmlContent: api + "/api/ReportViewer/getReportHtmlContent",

  getSpecificSabaRelatedBooking: api + '/api/onlinePayments/OnlineBooking/getAllOnlineBookingsForSabhaId',
  saveBooking: api + '/api/onlinePayments/OnlineBooking/saveOnlineBooking',
  getBookingSpecificMainAndSubProp : api +'/api/onlinePayments/OnlineBooking/getAllOnlineBookingsForSabhaId'

}


@Injectable({
  providedIn: 'root'
})

export class HttpServiceProviderService {

  constructor(private httpClient: HttpClient, private webApiService: WebApiService) {
  }


  public savePartner(partner: any): Observable<any> {
    return this.httpClient.post(httpLink.savePartner, partner);
  }

  public getProvince(): Observable<any> {
    return this.httpClient.get(httpLink.getProvince);
  }

  public getSabhaForProvince(selectedProvinceId: any): Observable<any> {
    return this.httpClient.get(httpLink.getSabhaForDistrict + '/' + selectedProvinceId);
  }

  public getGnDivisionForSabha(sabhaId: any): Observable<any> {
    return this.httpClient.get(httpLink.getGnDivisionForSabha + '/' + sabhaId);
  }

  public getAllAuthority(partnerId: string) {
    return this.httpClient.get(httpLink.getAllAuthority + '/' + partnerId);
  }

  public getAllSabha(sabhaId: any) {
    return this.httpClient.get(httpLink.getAllSabha + '/' + sabhaId);
  }

  public getAllSabhaData(): Observable<SabhaResource[]> {
    return this.httpClient.get<SabhaResource[]>(httpLink.getSabha);
  }

  public getAllProperty(sabhaId: number): Observable<BookingProperty[]> {
    return this.httpClient.get<BookingProperty[]>(httpLink.getProperty + '/' + sabhaId);
  }

  public getSubProperty(mainPropId: number): Observable<BookingSubProperty[]> {
    return this.httpClient.get<BookingSubProperty[]>(httpLink.getSubProperty + '/' + mainPropId);
  }

  // Get specific sub prop time slots 
  public getSubPropotiesTimeSlots(subPropId: number): Observable<BookingTimeSlot[]> {
    return this.httpClient.get<BookingTimeSlot[]>(httpLink.getSubPropotiesTimeSlots + '/' + subPropId);
  }

  public getAssessment(partnerId: string, sabhaId: string): Observable<any> {
    return this.httpClient.get(httpLink.getAllServices + '/' + partnerId + '/' + sabhaId);
  }

  public getWaterBill(partnerId: string, sabhaId: string): Observable<any> {
    return this.httpClient.get(httpLink.getWaterBill + '/' + partnerId + '/' + sabhaId);
  }

  public getAllAssmtVoteAssignsForSabha(sabhaId: number | undefined): Observable<any> {
    return this.httpClient.get(httpLink.getAllAssessmentVoteAssignsForSabha + '/' + sabhaId);

  }

  public getAssessmentDiscountRates(): Observable<any> {
    return this.httpClient.get(httpLink.getAssessmentDiscountRates);
  }

  public getSessionByOfficeAndModule(officeid: any, module: any): Observable<any> {
    return this.httpClient.get(httpLink.getSessionByOfficeAndModule + '/' + officeid + '/' + module);
  }

  public getActiveOrLastActiveSessionForOnlinePaymentCurrentMonth(officeid: any, module: any): Observable<any> {
    return this.httpClient.get(httpLink.getActiveOrLastActiveSessionForOnlinePaymentCurrentMonth + '/' + officeid + '/' + module);
  }

  public AssessmentTaxCalculateBalance(request: any): Observable<any> {
    return this.httpClient.post(httpLink.AssessmentTaxCalculateBalance, request);
  }

  public AssessmentTaxCalculatePaymentBalance(request: any): Observable<any> {
    return this.httpClient.post(httpLink.AssessmentTaxCalculatePaymentBalance, request);
  }

  public showPay(orderDetail: any): Observable<any> {
    return this.httpClient.post(httpLink.showPay, orderDetail);
  }

  public getPBPaymentForm(formData: any): Observable<Object> {
    return this.httpClient.post(httpLink.getPBPaymentForm, formData);
  }

  public initiatePBPayment(formData: any): Observable<Object> {
    return this.httpClient.post(httpLink.initiatePBPayment, formData);
  }

  public getPBpaymentsignature(formData: any): Observable<Object> {
    return this.httpClient.post(httpLink.getPBpaymentsignature, formData);
  }
  // public getPBPaymentForm(formData: any): Observable<any> {
  //   return this.httpClient.post<any>(`${httpLink.getPBPaymentForm}`, formData);
  // }

  public sendErrorMessage(errorMsg: any): Observable<any> {
    return this.httpClient.post(httpLink.errMsg, errorMsg);
  }


  public placeAssessmentOrder(order: any, paymentDetailId: any): Observable<any> {
    return this.httpClient.post(httpLink.placeAssessmentOrder + '/' + 1 + '/' + paymentDetailId, order, { observe: 'response' });
  }


  public placeWaterBillOrder(order: any, paymentDetailId: any): Observable<any> {
    return this.httpClient.post(httpLink.placeWaterBillOrder + '/' + 1 + '/' + paymentDetailId, order, { observe: 'response' });
  }



  public makeOtherPayment(paymentDetailId: any): Observable<any> {
    return this.httpClient.get(httpLink.makeOtherPayment + '/' + 1 + '/' + paymentDetailId, { observe: 'response' });
  }

  public makeBackUp(paymentDetailId: any): Observable<any> {
    return this.httpClient.get(httpLink.backup + '/' + 1 + '/' + paymentDetailId);
  }


  public showPay1(description: any, partnerId: any, paymentOptions: any, orderId: any, ammount: any, session: any, generatedID: any, status: any): Observable<any> {
    return this.httpClient.post(httpLink.showPay, {
      description,
      partnerId,
      paymentOptions,
      orderId,
      ammount,
      session,
      generatedID,
      status
    });
  }

  public getPartner(NIC: any | undefined): Observable<any> {
    return this.httpClient.get(httpLink.getPartner + '/' + NIC);

  }

  public getPartnerById(id: any | undefined): Observable<any> {
    return this.httpClient.get(httpLink.getPartnerById + '/' + id);

  }

  public getServiceCharges(sabhaId: any): Observable<any> {
    return this.httpClient.get(httpLink.getServiceCharges + '/' + sabhaId);

  }

  public getOfficeForSabha(sabhaId: any): Observable<any> {
    return this.httpClient.get(httpLink.getOfficeForSabha + '/' + sabhaId);

  }

  public getGatewayAndConfigInfoForSabha(sabhaId: any): Observable<any> {
    return this.httpClient.get(httpLink.getGatewayAndConfigInfoForSabha + '/' + sabhaId);
  }

  public getPaymentHistory(partnerId: any,
    pageSize?: number,
    pageNumber?: number): Observable<any> {
    return this.httpClient.get(httpLink.paymentHistory + '/' + partnerId +
      '?' +
      'pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize);

  }
  public getPartnerDisputes(partnerId: any,
    pageSize?: number,
    pageNumber?: number): Observable<any> {
    return this.httpClient.get(httpLink.partnerDisputes + '/' + partnerId +
      '?' +
      'pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize);

  }

  public getPaymentDetailById(id: any) {
    return this.httpClient.get(httpLink.getPaymentDetailById + '/' + id);
  }

  //new


  //------- Get WaterBills Pdf
  public getWaterBillsPDFForSubRoad(PrintWaterBillRRequest: any): Observable<any> {
    return this.webApiService.pdfDocumentDownload(httpLink.getWaterBillsPDFForSubRoad, PrintWaterBillRRequest);
  }

  //

  public getForPaymentByConnectionId(officeId: number, connectionId: any): Observable<any> {
    return this.httpClient.get(
      httpLink.getForPaymentByConnectionId + '/' + officeId + '/' + connectionId
    );
  }


  public getForPaymentByConnectionNo(officeId: number, connectionNo: any): Observable<any> {
    return this.httpClient.get(
      httpLink.getForPaymentByConnectionNo + '/' + officeId + '/' + connectionNo
    );
  }

  public getForPaymentByBarCode(officeId: number, barcode: any): Observable<any> {

    return this.httpClient.get(
      httpLink.getForPaymentByBarCode + '/' + officeId + '/' + barcode
    );
  }



  public calculateWaterBillPayment(calRequest: any): Observable<any> {
    return this.httpClient.post(
      httpLink.calculateWaterBillPayment, calRequest);
  }


  public GetWaterConnectionsIdsPartnerSearchByNIC(officeId: any, nic: any): Observable<any> {


    return this.httpClient.get(
      httpLink.GetWaterConnectionsIdsPartnerSearchByNIC + '/' + officeId + '/' + nic
    );
  }


  public getAllVoteAssignsForWaterProject(
    waterProjectId: number
  ): Observable<any> {
    return this.webApiService.get(
      httpLink.getAllVoteAssignsForWaterProject + '/' + waterProjectId
    );
  }

  public getAllWaterProjectsForOffice(officeid: number): Observable<any> {
    return this.webApiService.get(
      httpLink.getAllWaterProjectsForOffice + '/' + officeid
    );
  }



  public placeWaterBillOrdersAndProcessPayments(mixinOrder: any): Observable<any> {
    return this.webApiService.post(
      httpLink.placeWaterBillOrdersAndProcessPayments, mixinOrder);
  }

  //------- Get Birt Report
  public getReportHtmlContent(birtReport: any): Observable<any> {
    return this.webApiService.birtReportDownload(httpLink.getReportHtmlContent, birtReport);
  }

  //Get booking list related to Saba
  public getBookingRelatedToSaba(sabaId: number): Observable<IOnlineBooking> {
    return this.httpClient.get<IOnlineBooking>(`${httpLink.getSpecificSabaRelatedBooking}/${sabaId}`);
  }


  public createBooking(booking:SaveBooking): Observable<any> {
    return this.httpClient.post(`${httpLink.saveBooking}`, booking);
  }

  public getBookingGetBookingSpecificMainAndSubProp(mainPropId:number,subPropId:number): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${httpLink.getBookingSpecificMainAndSubProp}/${mainPropId}/${subPropId}`,);
  }

  public createTimeSlot(timeSlot: SaveBookingTimeResource): Observable<any> {
    return this.httpClient.post(`${httpLink.saveBookingTimeSlot}`, timeSlot);
  }

  getAllChargingSchemesForSubPropertyId(subPropertyId: number): Observable<BookingPropertyCharging[]> {
    return this.httpClient.get<BookingPropertyCharging[]>(`${httpLink.getAllChargingSchemesForSubPropertyId}/${subPropertyId}`);
  }
  


}
