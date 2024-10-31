import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {forkJoin, min} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {environment} from "../../environments/environment";
import BigNumber from "bignumber.js";
import * as CryptoJS from "crypto-js";
import { PaymentGatewayBasicResource } from '../success-message/models/PaymentGatewayBasic';

declare let Checkout: any;

@Component({
  selector: 'app-other-payment',
  templateUrl: './other-payment.component.html',
  styleUrls: ['./other-payment.component.scss']
})
export class OtherPaymentComponent implements OnInit {
  @Output() formDataSubmitted = new EventEmitter<any>();
  formData: any = {};

  submitForm() {
    this.formDataSubmitted.emit(this.formData);
  }
  protected readonly min = min;
  protected readonly CryptoJS = CryptoJS;
  protected readonly environment = environment;
  sabhaList: any;
  officeList: any;
  sabha: any;
  officeId: any;
  service: any
  sabhaId: any;
  otherForm!: FormGroup;
  district: any
  paymentgatewayInfo=new PaymentGatewayBasicResource();

  constructor(private httpProviderService: HttpServiceProviderService, private router: Router, public datePipe: DatePipe, private fromBuilder: FormBuilder) {
  }


  ngOnInit() {
    this.loadDistrict();
    this.otherForm = this.fromBuilder.group({
      district: ['', Validators.required],
      localAuthority: ['', Validators.required],
      office: ['', Validators.required],
      services: ['', Validators.required],
      reference: ['', Validators.required],
      note: ['', Validators.required],
      amount: ['', Validators.required],

    });

    this.service = [
      {id: 1, description: 'Water Bill'},
      {id: 2, description: 'Shop Rental'},
      {id: 3, description: 'Trade Tax'},
      {id: 4, description: 'Gully'},
      {id: 5, description: 'Hall Book'},
      {id: 6, description: 'Street Line Certificate'},
      {id: 7, description: 'Advertisement'},
      {id: 8, description: 'BOP'},
      {id: 9, description: 'Building Applications'},
      {id: 10, description: 'Three Wheel Park'},
      {id: 11, description: 'Environment License'},
      {id: 12, description: 'Other Payment'}
    ];

    sessionStorage.setItem("service", CryptoJS.AES.encrypt(JSON.stringify("OtherPayment"), environment.KEY).toString());


  }



  getGatewayAndConfigInfoForSabha(sabhaId: any) {
    this.httpProviderService.getGatewayAndConfigInfoForSabha(sabhaId).subscribe({
      next: (data) => {
        if (data !== null) { // Use strict comparison !== instead of !=
          this.paymentgatewayInfo = data;
          sessionStorage.setItem("Bank", this.paymentgatewayInfo.bankName!);
        }
      },
      error: (error: any) => {
        Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
      },
      complete: () => {
        // Any completion logic you want to add
      }
    });
  }

  loadDistrict() {
    this.httpProviderService.getProvince().subscribe({
      next: (data) => {
        if (data.length !== 0) {
          this.district = data;
        }
      },
      error: (error: any) => {
        Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
      },
      complete: () => {
        // Any completion logic you want to add
      }
    });

  }

  serviceCharges: any;

  getServiceCharges(sabhaId: any) {
    this.httpProviderService.getServiceCharges(sabhaId).subscribe({
      next: (data) => {
        if (data.length !== 0) {
          this.serviceCharges = data;
        }
      },
      error: (error: any) => {
        Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
      },
      complete: () => {
        // Any completion logic you want to add
      }
    });
  }

  getOfficeForSabha(sabhaId: any) {
    this.httpProviderService.getOfficeForSabha(sabhaId).subscribe({
      next: (data) => {
        if (data.length !== 0) {
          this.officeList = data;
        }
      },
      error: (error: any) => {
        Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
      },
      complete: () => {
        // Any completion logic you want to add
      }
    });
  }


  onDistrictSelectionChange(event: any) {
    const selectedDistrictId = event.value;
    this.httpProviderService.getSabhaForProvince(selectedDistrictId).subscribe({
      next: (data) => {
        if (data.length !== 0) {
          this.sabhaList = data;
        }
      },
      error: (error: any) => {
        console.error("Error:", error);
      },
      complete: () => {
        // Any completion logic you want to add
      }
    });
  }

  onSubmitOther(signUpForm: FormGroup) {
    if (this.otherForm.valid) {


    } else {
      return
    }
  }


  onSabhaSelectionChange(event: any) {
    this.sabha = event.value;
    this.sabhaId = this.sabha.id;
    this.getServiceCharges(this.sabhaId);
    this.getOfficeForSabha(this.sabhaId);
    this.getGatewayAndConfigInfoForSabha(this.sabhaId);
  }

  onOfficeChange(event: any) {
    this.officeId = event.value;
  }

  serviceDescription: any;

  onServiceSelectionChange(event: any) {
    this.serviceDescription = event.value;
  }

  noteText = '';
  note(event:any){
    this.noteText = event.target.value;
  }

  inputTotal: any;
  newServiceCharges: any;
  grandTotal: any;

  onTotalChange(event: any) {
    this.inputTotal = event.target.value.trim();
    this.newServiceCharges = this.solveForX(+this.inputTotal);
    this.grandTotal = new BigNumber(BigNumber(this.inputTotal).plus(this.newServiceCharges)).toFixed(2);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }

  // bankServiceCharges = +CryptoJS.AES.decrypt(sessionStorage.getItem("serviceCharges") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "")

  // solveForX(y: number): string {
  //   const yBig = new BigNumber(y);

  //   const xBig = yBig.times(0.01).dividedBy(1 - this.serviceCharges);

  //   const roundedX = xBig.toFixed(2);

  //   return roundedX;
  // }

  solveForX(y: number): string {
    if(this.paymentgatewayInfo.bankName == "BOC")
    {
    const yBig = new BigNumber(y);

    const xBig = yBig.times(0.01).dividedBy(1 - this.serviceCharges);

    const roundedX = xBig.toFixed(2);

    return roundedX;
    }
    else if(this.paymentgatewayInfo.bankName == "PeoplesBank"){
    const yBig = new BigNumber(y);

    const xBig = yBig.times(this.serviceCharges);

    const roundedX = xBig.toFixed(2);

    return roundedX;
    }
    else{
      const roundedX = "10000000000.00";

    return roundedX;
    }
  }

  closeSection(input: any) {

    const orderDetails = {
      PaymentDetailId: null,
      TransactionId: null,
      SessionId: "",
      ResultIndicator: "",
      // Status:null,
      // Error:null,
      Description: this.serviceDescription,
      InputAmount: this.inputTotal,
      TotalAmount: this.grandTotal,
      Discount: 0,
      ServicePercentage: this.serviceCharges,
      ServiceCharges: this.newServiceCharges,
      OrderId: Math.floor(Math.random() * 90) + 10,
      AccountNo: this.otherForm.get("reference")?.value,
      PartnerId: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      // PartnerName: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerName: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerNIC: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerMobileNo: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerMobileNo") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerEmail: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerEmail") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      SabhaId: this.sabhaId,
      OfficeId: this.officeId,
      DateTime: "",
      OfficeSessionId: null,
      OtherDescription: {
        Description: this.noteText.trim()
      }
    };

    this.httpProviderService.showPay(orderDetails)
      .subscribe({
        next: (data: any) => {
          if (this.paymentgatewayInfo != null && this.paymentgatewayInfo.bankName == "BOC" && this.paymentgatewayInfo.sabhaId == orderDetails.SabhaId) {
          if (data != null) {
            //BOC
            const sessionData = JSON.parse(data.sessionId);
            // sessionStorage.setItem('gateway', JSON.stringify(data.sessionId));
            // sessionStorage.setItem('paymentDetailId', data.paymentDetailId);
            // sessionStorage.setItem('tId', data.transactionId);
            sessionStorage.setItem("gateway", CryptoJS.AES.encrypt(JSON.stringify(data.sessionId), environment.KEY).toString());
            sessionStorage.setItem("paymentDetailId", CryptoJS.AES.encrypt(JSON.stringify(data.paymentDetailId), environment.KEY).toString());
            sessionStorage.setItem("tId", CryptoJS.AES.encrypt(JSON.stringify(data.transactionId), environment.KEY).toString());

            const sabhaString = this.sabha;

            this.httpProviderService.getPaymentDetailById(data.paymentDetailId).subscribe({
              next: (responseData: any) => {
                if (responseData.transactionId != null && data.transactionId == responseData.transactionId && responseData.sessionId != null  && responseData.resultIndicator != null &&
                  responseData.resultIndicator == data.resultIndicator && responseData.totalAmount == data.totalAmount) {
                  let inter = {
                    merchant: {
                      name: "CAT20 Automation System",
                      address: {
                        line1: `${this.sabha.nameEnglish},`,
                        line2: `${this.sabha.addressEnglish},`,
                        line3: "SRI LANKA,",
                      },
                      phone: this.sabha.telephone1,
                      logo: 'https://pay.cat2020.lk/assets/images/android-chrome-192x192.png'
                    }
                  };

                  if (sessionData && sessionData.session && sessionData.session.id) {
                    Checkout.configure(
                      {
                        session: {id: sessionData.session.id},
                        interaction: inter
                      }
                    );
                    Checkout.showPaymentPage()
                  } else {
                    Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
                    return;
                  }
                } else {
                  return;
                }
              },
              error: (error: any) => {
                Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
              }
            });
          }
        }
        else
        { //Peoples Bank 
          // sessionStorage.setItem("gateway", CryptoJS.AES.encrypt(JSON.stringify(data.sessionId), environment.KEY).toString());
            sessionStorage.setItem("paymentDetailId", CryptoJS.AES.encrypt(JSON.stringify(data.orderDetails!.paymentDetailId), environment.KEY).toString());
            sessionStorage.setItem("tId", CryptoJS.AES.encrypt(JSON.stringify(data.orderDetails!.transactionId), environment.KEY).toString());

          this.redirectToPaymentGatewayNew(data.formHtml);
        }
        },
        // @ts-ignore
        error: (error) => {
          if (error.status == 500 ) {
            Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
          }
        }
      });
  }

  redirectToPaymentGatewayNew(formHtml: string) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formHtml;
      const form = tempDiv.querySelector('form');
      if (form) {
          document.body.appendChild(form);
          form.submit();
      } else {
          console.error('Form element not found in the provided HTML string.');
      }
  }
  
  protected readonly undefined = undefined;
}
