import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MixinOrder} from "../pay-info/models/MixinOrder";
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import {SharedService} from "../services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import * as CryptoJS from 'crypto-js';
import {environment} from "../../environments/environment";
import {MatSelectChange} from "@angular/material/select";
import {Dispute} from "./models/Dispute";
import { PbResponseDataModel } from './models/PbResponseDataModel';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent implements OnInit {

  transactionId: any;
  success: any;
  errMessage:any;
  attempt = true;
  mixInOrder: any;
  service: any;
  disputeMessage: any;
  pDID:any ;
  pbResponse: PbResponseDataModel = new PbResponseDataModel();
  mixinOrder? : MixinOrder = new MixinOrder()

  constructor(private httpProvider: HttpServiceProviderService, private mixinOrderService: SharedService, private spinner: NgxSpinnerService, private router: Router,private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      // Check if the 'data' parameter exists
      if (params['data']) {
        // Parse the JSON string stored in 'data' parameter
        const dataJson = JSON.parse(params['data']);
        // Map properties to the model
        this.pbResponse.decision = dataJson['decision'];
        this.pbResponse.reason_code = dataJson['reason_code'];
        this.pbResponse.signature = dataJson['signature'];
        this.pbResponse.message = dataJson['message'];
        // Add other mappings as needed

        // Debug print the populated model
      }
      // console.log(this.pbResponse);
    });

    // console.log(this.pbResponse); 
    // console.log(sessionStorage.getItem("Bank")); 

    const serviceString = sessionStorage.getItem("service");
    this.service = serviceString ? CryptoJS.AES.decrypt(serviceString, environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "") : null;

    const searchParams = new URLSearchParams(window.location.search);

    const resultIndicator = searchParams.get("resultIndicator");
    const sessionVersion = searchParams.get("sessionVersion");

    const tID = sessionStorage.getItem("tId");
    this.transactionId = tID ? CryptoJS.AES.decrypt(tID, environment.KEY).toString(CryptoJS.enc.Utf8) : null;

    const pDId = sessionStorage.getItem("paymentDetailId");
    const paymentDetailId = pDId ? CryptoJS.AES.decrypt(pDId, environment.KEY).toString(CryptoJS.enc.Utf8) : null;
    this.pDID = paymentDetailId;

    // console.log(this.service);
    if (this.service == "Assessment" || this.service == "WaterBilling") {
      // console.log("Asemessment")
      // console.log(sessionStorage.getItem("mixInOrder"))
      const mixInOrderString = sessionStorage.getItem("mixInOrder");
      // console.log('mixin strins',mixInOrderString);
      // const mixInOrder = mixInOrderString ? JSON.parse(mixInOrderString) : [];
      this.mixInOrder = mixInOrderString ? JSON.parse(CryptoJS.AES.decrypt(mixInOrderString, environment.KEY).toString(CryptoJS.enc.Utf8)) : [];
      //  console.log(this.mixInOrder)
       
    }


    // alert(transactionId);
    // this.getResponse([mixInOrder], 11)

    if (sessionStorage.getItem("Bank")=="BOC") {
      const sesString = sessionStorage.getItem("gateway");
      const ses = sesString ? JSON.parse(JSON.parse(CryptoJS.AES.decrypt(sesString, environment.KEY).toString(CryptoJS.enc.Utf8))) : null;
    // console.log(ses);
    // console.log(resultIndicator);

      if (ses !== null && resultIndicator !== null) {
      if (ses.successIndicator === resultIndicator) {
        this.spinner.show();
        sessionStorage.setItem("gateway", "");
        if (this.service == "Assessment") {
          this.getResponse([this.mixInOrder], paymentDetailId);
          this.makeBackUp(paymentDetailId);
          this.mixInOrder = null;
        }
        if (this.service == "OtherPayment") {
          this.makeOtherPayment(paymentDetailId);
          this.makeBackUp(paymentDetailId);
        }
        if(this.service=="WaterBilling"){
          this.getWaterBillResponse([this.mixInOrder], paymentDetailId);
          this.makeBackUp(paymentDetailId);
          this.mixInOrder = null;

        }




      } else {
        Swal.fire("Payment Failed!", "*Unfortunately, an error has occurred, and your payment cannot be processed at this time, please verify your payment details or try again later", "error");
        setTimeout(() => {
          // this.router.navigate(["/services"])
        }, 5000)
      }
    }
    else{
      Swal.fire("Payment Failed!", "**Unfortunately, an error has occurred, and your payment cannot be processed at this time, please verify your payment details or try again later", "error");
        setTimeout(() => {
          // this.router.navigate(["/services"])
        }, 5000)
    }
    }
    else if (sessionStorage.getItem("Bank")=="PeoplesBank"  && this.pbResponse !== null && this.pbResponse.decision !== null && this.pbResponse.reason_code !== null && this.pbResponse.signature !== null) {
      // console.log("OK Peoples"); 
      if (this.pbResponse.decision == "ACCEPT" && this.pbResponse.reason_code == '100') {
      // if (ses.successIndicator === resultIndicator) {
        this.spinner.show();
        sessionStorage.setItem("gateway", "");
        if (this.service == "Assessment") {
          this.getResponse([this.mixInOrder], paymentDetailId);
          this.makeBackUp(paymentDetailId);
          this.mixInOrder = null;
        }
        if (this.service == "OtherPayment") {
          this.makeOtherPayment(paymentDetailId);
          this.makeBackUp(paymentDetailId);
        }
        if(this.service=="WaterBilling"){
          this.getWaterBillResponse([this.mixInOrder], paymentDetailId);
          this.makeBackUp(paymentDetailId);
          this.mixInOrder = null;

        }


      // } else {
      //   Swal.fire("Payment Failed!", "Unfortunately, an error has occurred, and your payment cannot be processed at this time, please verify your payment details or try again later", "error");
      //   setTimeout(() => {
      //     // this.router.navigate(["/services"])
      //   }, 5000)

      // }
    }
    else if (this.pbResponse.decision == "DECLINE")
      {
        Swal.fire("Payment Declined!", "Unfortunately, an error has occurred, and your payment cannot be processed at this time. The Error given from the bank is as follows : "+this.pbResponse.message, "error");
        setTimeout(() => {
        // this.router.navigate(["/services"])
      }, 5000)
      }
      else{
        Swal.fire("Payment Failed!", "Unfortunately, an error has occurred, and your payment cannot be processed at this time, please verify your payment details or try again later", "error");
      setTimeout(() => {
        // this.router.navigate(["/services"])
      }, 5000)
      }
    }
    else {
    //   console.log("Nothing"); 
    //   console.log(this.pbResponse); 
    // console.log(sessionStorage.getItem("Bank")); 

      Swal.fire("Payment Failed!", "Unfortunately, an error has occurred, and your payment cannot be processed at this time, please verify your payment details or try again later", "error");
      setTimeout(() => {
        // this.router.navigate(["/services"])
      }, 5000)

    }

    if (sessionStorage.getItem("success") === "true") {
      this.success = true;
    }


  }

  getResponse(order: any, paymentDetailId: any) {
    // console.log(order);
    // console.log(paymentDetailId);
    this.httpProvider.placeAssessmentOrder(order, paymentDetailId).subscribe({
      next: (response) => {
        // console.log(response);
        if (response.body.status == 1) {
          this.spinner.hide();
          Swal.fire("Payment Success!", "Payment is successful", "success");
          this.success = true;
          sessionStorage.setItem("success", "true");

        }
        if (response.body.status != 1) {
          Swal.fire("Payment Failed", `Unfortunately, an error has occurred, and your payment cannot be processed at this time. Please contact 0372228204 or submit your complaint immediately. Your inquiry ID is ${this.transactionId}`, "error");
          this.spinner.hide();
          this.success = false;
          this.errMessage = true;
        }

      },
      // @ts-ignore
      error: (error) => {
        // console.log(error);
        // this.success = true;
        this.spinner.hide();
        // sessionStorage.setItem("success", "true");
        Swal.fire("Payment Failed", `Unfortunately, an error has occurred, and your payment cannot be processed at this time. Please contact 0372228204 or submit your complaint immediately. Your inquiry ID is ${this.transactionId}`, "error");
        this.success = false;
          this.errMessage = true;

      },
    })
  }

  getWaterBillResponse(order: any, paymentDetailId: any) {
    //  console.log('water',order);
    // console.log(paymentDetailId);
    this.httpProvider.placeWaterBillOrder(order, paymentDetailId).subscribe({
      next: (response) => {
        // console.log(response);
        if (response.body.status == 1) {
          this.spinner.hide();
          Swal.fire("Payment Success!", "Payment is successful", "success");
          this.success = true;
          sessionStorage.setItem("success", "true");

        }
        if (response.body.status != 1) {
          Swal.fire("Payment Failed", `Unfortunately, an error has occurred, and your payment cannot be processed at this time. Please contact 0372228204 or submit your complaint immediately. Your inquiry ID is ${this.transactionId}`, "error");
          this.spinner.hide();
          this.success = false;
          this.errMessage = true;
        }

      },
      // @ts-ignore
      error: (error) => {
        // console.log(error);
        // this.success = true;
        this.spinner.hide();
        // sessionStorage.setItem("success", "true");
        Swal.fire("Payment Failed", `Unfortunately, an error has occurred, and your payment cannot be processed at this time. Please contact 0372228204 or submit your complaint immediately. Your inquiry ID is ${this.transactionId}`, "error");
        this.success = false;
          this.errMessage = true;

      },
    })
  }





  makeBackUp(paymentDetailId: any) {
    this.httpProvider.makeBackUp(paymentDetailId).subscribe({
      next: (response) => {

      },
      // @ts-ignore
      error: (error) => {

      },
    })
  }

  sendErrorMessage() {
    const errorMsg = {
      PartnerMobileNo: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerMobileNo") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      SabhaId: CryptoJS.AES.decrypt(sessionStorage.getItem("sabhaId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      TransactionId: this.transactionId,
      id : null,
      paymentDetailId : this.pDID,
      reason: this.reason? this.reason : null,
      message: this.disputeMessage? this.disputeMessage : null,
    }

    this.httpProvider.sendErrorMessage(errorMsg).subscribe({
      next: (response) => {
          if (response == true){
            this.back();
          }
      },
      // @ts-ignore
      error: (error) => {

      },
    })

  }

  makeOtherPayment(paymentDetailId: any) {
    this.httpProvider.makeOtherPayment(paymentDetailId).subscribe({
      next: (response) => {
        if (response.body.status == 1) {
          this.spinner.hide();
          Swal.fire("Payment Success!", "Payment is successful", "success");
          this.success = true;
          sessionStorage.setItem("success", "true");
        }
        if (response.body.status != 1) {
          Swal.fire("Payment Failed", `Unfortunately, an error has occurred, and your payment cannot be processed at this time. Please contact 0372228204 or submit your complaint  immediately. Your inquiry ID is ${this.transactionId}`, "error");
          this.spinner.hide();
          this.success = false;
            this.errMessage = true;
        }
      },
      // @ts-ignore
      error: (error) => {
        // this.success = true;
        this.spinner.hide();
        // sessionStorage.setItem("success", "true");
        Swal.fire("Payment Failed", `Unfortunately, an error has occurred, and your payment cannot be processed at this time. Please contact 0372228204 or submit your complaint immediately. Your inquiry ID is ${this.transactionId}`, "error");
        this.success = false;
          this.errMessage = true;


      },
    })
  }


  back() {
    const createdBy = CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    const updatedBy = CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    sessionStorage.setItem("success", "false");
    if (createdBy == '0' && createdBy == '0') {
      this.router.navigate(["/other-payment"]);
    } else {
      this.router.navigate(["/services"]);

    }
  }

  dispute = [
    {id: 1, description: 'PaymentFailed'},
    // {id: 2, description: 'Other'}

  ];

  reason:any = 'PaymentFailed';
  onDisputeSelectionChange(event: any) {
    this.reason = event.value;
  }



  /*
getResponseForWaterBill(){
   

  



  if (this.mixinOrder.waterConnectionId != undefined && this.mixinOrderLines.length > 0 && this.mixinOrder.sessionId!= 0 ) {
    this.mixinOrder.mixinOrderLine = this.mixinOrderLines;

  // console.log(this.mixinOrder)

    this.httpProvider.placeWaterBillOrdersAndProcessPayments(this.mixinOrder)
      .subscribe({
        next: (data) => {
        console.log(data);
          if (data != null) {
            let resultData = data;
             console.log("Order", resultData)
            this.openAndDuplicatePrintNewOption(resultData.id);
            this.inputTotal=0
         //   Notify.success("Order Place Successfully");
            this.waterConnection = new WaterConnectionResource();
            this.balances = resultData.waterConnectionBalances;
            this.hWaterBillBalance = resultData.hWaterBillBalance;
            this.mixinOrder = new MixinOrder();
            this.mixinOrderLines = [];
          
          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
            //  Notify.failure(error.error.message);
            }
          }
        },
      })
**/
 // } else {
 //   Notify.failure("Something Went Wrong")
 // }

  // console.log(this.mixinOrder)




//}

}
