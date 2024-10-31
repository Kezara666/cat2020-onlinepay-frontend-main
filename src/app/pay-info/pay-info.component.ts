import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import {DatePipe} from "@angular/common";
import {CalculatorBalance} from "./models/CalculatorBalance";
import {PerCalculatorBalance} from "./models/PerCalculatorBalance";
import {MixinOrder} from "./models/MixinOrder";
import {MixinOrderLine} from "./models/MixinOrderLine";
import {AssmtVoteAssign} from "./models/AssmtVoteAssign";
import {Assessment} from "./models/Assessment";
import {isEmpty, timeInterval} from "rxjs";
import BigNumber from "bignumber.js";
import {SuccessMessageComponent} from "../success-message/success-message.component";
import {SharedService} from "../services/shared.service";
import {Router} from "@angular/router";
import {Sabha} from "./models/models/Sabha";
import Swal from "sweetalert2";
import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";
import {AssessmentDiscountRates} from "./models/AssessmentDiscountRates";
import {error} from "@angular/compiler-cli/src/transformers/util";
import { PaymentGatewayBasicResource } from '../success-message/models/PaymentGatewayBasic';

declare let Checkout: any;


@Component({
  selector: 'app-pay-info',
  templateUrl: './pay-info.component.html',
  styleUrls: ['./pay-info.component.scss']
})
export class PayInfoComponent implements OnInit, OnChanges, AfterViewInit {
  assessment!: Assessment;
  dataVotesArrays: any[] = [];
  discountRates: any;
  currentSession: any;
  owner = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");

  // @Output() onCloseBtnClick = new EventEmitter<any>();
  // @Output() onSaveBtnClick = new EventEmitter<any>();


  selectedPaymentOption: any = 4;
  chequeInfoForm: FormGroup;


  mixinOrder: MixinOrder = new MixinOrder();
  mixinOrderLines: MixinOrderLine[] = [];

  inputTotal: any = undefined;
  perCalculatorBalance = new PerCalculatorBalance();
  outstandingPayable = new CalculatorBalance();
  payable = new CalculatorBalance();
  payingBalance = new CalculatorBalance();
  deduction = new CalculatorBalance();
  nextBalance = new CalculatorBalance();
  customerPaying: number = 0.00;
  discount = new CalculatorBalance();
  discountRate: any
  serviceCharges: any;
  sessionAvailable: boolean = true;
  sabha!: Sabha;
  paymentgatewayInfo=new PaymentGatewayBasicResource();

  checkboxes: any[] = [
    {id: 1, checked: true, disabled: false},
    {id: 2, checked: true, disabled: false},
    {id: 3, checked: true, disabled: false},
    {id: 4, checked: true, disabled: false}
  ];
  checkboxesTuple: any =
    {Item1: false, Item2: false, Item3: false, Item4: false}


  // private datePipe: any;
  paymentOptions = [
    // {value: 1, label: 'Cash'},
    // {value: 2, label: 'Cheque'},
    // {value: 3, label: 'Cross'},
    {value: 4, label: 'Direct'},
  ];

  constructor(private httpProvider: HttpServiceProviderService, public datePipe: DatePipe, private fb: FormBuilder, private mixinOrderService: SharedService, private router: Router) {


    this.chequeInfoForm = this.fb.group({
      chequeNumber: ['', Validators.required],
      chequeDate: ['', Validators.required],
      bankName: ['', Validators.required]
    });

    // this.checkboxesTuple[0].Item1 = false;
    // this.checkboxesTuple[1].Item2 = false;
    // this.checkboxesTuple[2].Item3 = false;
    // this.checkboxesTuple[3].Item4 = false;

  }

  ngOnInit() {
    this.getGatewayAndConfigInfoForSabha(sessionStorage.getItem("sabhaIdraw"));
    sessionStorage.setItem("service", CryptoJS.AES.encrypt(JSON.stringify("Assessment"), environment.KEY).toString());


    // this.dataVotesArrays = JSON.parse(sessionStorage.getItem("sabhaVote") as string) || [];
    const discountRates = sessionStorage.getItem("discountRates");
    // this.discountRates = discountRates ? JSON.parse(discountRates) : null;
    this.discountRates = discountRates ? JSON.parse(CryptoJS.AES.decrypt(discountRates, environment.KEY).toString(CryptoJS.enc.Utf8)) : null;

    const session = sessionStorage.getItem("currentSession");
    // this.currentSession = session ? JSON.parse(session) : null;
    this.currentSession = session ? JSON.parse(CryptoJS.AES.decrypt(session, environment.KEY).toString(CryptoJS.enc.Utf8)) : null;


    const assessment = sessionStorage.getItem("selectedAssessment");
    // this.assessment = assessment ? JSON.parse(assessment) : null;
    this.assessment = assessment ? JSON.parse(CryptoJS.AES.decrypt(assessment, environment.KEY).toString(CryptoJS.enc.Utf8)) : null;

    const voteArray = sessionStorage.getItem("sabhaVote");
    // this.dataVotesArrays = voteArray ? JSON.parse(voteArray) : [];
    this.dataVotesArrays = voteArray ? JSON.parse(CryptoJS.AES.decrypt(voteArray, environment.KEY).toString(CryptoJS.enc.Utf8)) : null;


  }

  ngAfterViewInit() {

    this.perCalculate();
    this.calculatePaymentBalance();

  }

  getGatewayAndConfigInfoForSabha(sabhaId: any) {
    this.httpProvider.getGatewayAndConfigInfoForSabha(sabhaId).subscribe({
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

  ngOnChanges(changes: SimpleChanges) {


    if (this.assessment.assessmentBalance?.currentQuarter == 1 || this.assessment.assessmentBalance?.q1?.isCompleted || this.assessment.assessmentBalance?.q1?.isOver) {
      this.checkboxes[0].checked = true;
      this.checkboxes[0].disabled = this.assessment.assessmentBalance?.q1?.isCompleted || this.assessment.assessmentBalance?.q1?.isOver;
      this.checkboxes[1].disabled = false;
    }
    if (this.assessment.assessmentBalance?.currentQuarter == 2 || this.assessment.assessmentBalance?.q2?.isCompleted || this.assessment.assessmentBalance?.q2?.isOver) {
      this.checkboxes[1].checked = true;
      this.checkboxes[1].disabled = this.assessment.assessmentBalance?.q2?.isCompleted || this.assessment.assessmentBalance?.q2?.isOver;
      this.checkboxes[2].disabled = false;
    }

    if (this.assessment.assessmentBalance?.currentQuarter == 3 || this.assessment.assessmentBalance?.q3?.isCompleted || this.assessment.assessmentBalance?.q3?.isOver) {
      this.checkboxes[2].checked = true;
      this.checkboxes[2].disabled = this.assessment.assessmentBalance?.q3?.isCompleted || this.assessment.assessmentBalance?.q3?.isOver;
      this.checkboxes[3].disabled = false;
    }

    if (this.assessment.assessmentBalance?.currentQuarter == 4 || this.assessment.assessmentBalance?.q4?.isCompleted || this.assessment.assessmentBalance?.q4?.isOver) {
      this.checkboxes[3].checked = true;
      this.checkboxes[3].disabled = this.assessment.assessmentBalance?.q4?.isCompleted || this.assessment.assessmentBalance?.q4?.isOver;
    }

    if (this.assessment.mixinOrder != undefined && this.assessment.mixinOrder.totalAmount != undefined || null || 0) {
      this.inputTotal = this.assessment.mixinOrder?.totalAmount;
      this.selectedPaymentOption = this.assessment.mixinOrder?.paymentMethodId;
      if (this.selectedPaymentOption == 2) {
        this.chequeInfoForm.patchValue({
          chequeNumber: this.assessment.mixinOrder?.chequeNumber,
          chequeDate: this.assessment.mixinOrder?.chequeDate,
          bankName: this.assessment.mixinOrder?.chequeBankName,

        });
      }

    }

    this.perCalculate();
    this.calculatePaymentBalance();
    // this.onTotalChange(1)
  }


  closeSection(input: any) {

    var mixIn = this.onBeforeClose();
    if (!mixIn) {
      Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
      return;
    }


    const orderDetails = {
      PaymentDetailId: null,
      TransactionId: null,
      SessionId: "",
      ResultIndicator: "",
      // Status:null,
      // Error:null,
      Description: "Assessment",
      InputAmount: this.inputTotal,
      TotalAmount: this.grandTotal,
      Discount: this.discount.total ? this.discount.total : 0,
      ServicePercentage: this.bankServiceCharges,
      ServiceCharges: this.serviceCharges,
      OrderId: this.assessment.id,
      AccountNo: this.assessment.assessmentNo,
      PartnerId: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerName: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerNIC: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerMobileNo: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerMobileNo") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      PartnerEmail: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerEmail") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
      SabhaId: this.assessment.sabhaId,
      OfficeId: this.assessment.officeId,
      DateTime: "",
      OfficeSessionId: this.currentSession.id


    };

    this.httpProvider.showPay(orderDetails)
      .subscribe({
        next: (data: any) => {

          if (this.paymentgatewayInfo != null && this.paymentgatewayInfo.bankName == "BOC" && this.paymentgatewayInfo.sabhaId == orderDetails.SabhaId) {
            //boc
          if (data != null) {

            const sessionData = JSON.parse(data.sessionId);

            sessionStorage.setItem("gateway", CryptoJS.AES.encrypt(JSON.stringify(data.sessionId), environment.KEY).toString());
            sessionStorage.setItem("paymentDetailId", CryptoJS.AES.encrypt(JSON.stringify(data.paymentDetailId), environment.KEY).toString());
            sessionStorage.setItem("tId", CryptoJS.AES.encrypt(JSON.stringify(data.transactionId), environment.KEY).toString());


            const sabhaString = sessionStorage.getItem("sabha");
            this.sabha = sabhaString ? JSON.parse(CryptoJS.AES.decrypt(sabhaString, environment.KEY).toString(CryptoJS.enc.Utf8)) : null;


            this.httpProvider.getPaymentDetailById(data.paymentDetailId).subscribe({
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
          //boc
        }
        else
        {
          // sessionStorage.setItem("gateway", CryptoJS.AES.encrypt(JSON.stringify(data.sessionId), environment.KEY).toString());
          sessionStorage.setItem("paymentDetailId", CryptoJS.AES.encrypt(JSON.stringify(data.orderDetails!.paymentDetailId), environment.KEY).toString());
          sessionStorage.setItem("tId", CryptoJS.AES.encrypt(JSON.stringify(data.orderDetails!.transactionId), environment.KEY).toString());

          this.redirectToPaymentGatewayNew(data.formHtml);
        }

        },
        // @ts-ignore
        error: (error) => {
          if (error.status == 500) {
            Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
          }
        }
      });


  }

  redirectToPaymentGatewayNew(formHtml: string) {
    // Create a temporary div element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formHtml;

    // Get the form element from the temporary div
    const form = tempDiv.querySelector('form');

    // Check if the form element exists
    if (form) {
        // Append the form to the document body
        document.body.appendChild(form);

        // Submit the form
        form.submit();
    } else {
        console.error('Form element not found in the provided HTML string.');
    }
}

  prevStep() {
    this.router.navigate(["/services"]);
  }

  save() {
    // this.onSaveBtnClick.emit();
  }

  isInputDisabled: boolean = false;

  onTotalChange(event: any) {
    this.inputTotal = event.target.value.trim();
    this.isInputDisabled = true;
    if (this.inputTotal == 0) {
      this.isInputDisabled = false;
    }


    this.calculatePaymentBalance()


  }

  grandTotal: any;

  perCalculate() {
    this.checkboxesTuple.Item1 = this.checkboxes[0].checked;
    this.checkboxesTuple.Item2 = this.checkboxes[1].checked;
    this.checkboxesTuple.Item3 = this.checkboxes[2].checked;
    this.checkboxesTuple.Item4 = this.checkboxes[3].checked;

    let request = {
      Balance: {...this.assessment.assessmentBalance},
      DiscountRates: this.discountRates,
      SessionMonth: this.currentSession.startAt ? this.datePipe.transform(this.currentSession.startAt, 'MM') : -1,
      CheckBoxes: this.checkboxesTuple,

    }


    this.httpProvider.AssessmentTaxCalculateBalance(request)
      .subscribe({
        next: (result) => {
          this.perCalculatorBalance = result;

        },
        error: error => {
          // Notify.failure('Calculation Error..!');
        }
      });

    setTimeout(() => {

    }, 1000);

  }

  bankServiceCharges = +CryptoJS.AES.decrypt(sessionStorage.getItem("serviceCharges") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "")

  // solveForX(y: number): string {
  //   const yBig = new BigNumber(y);

  //   const xBig = yBig.times(0.01).dividedBy(1 - this.bankServiceCharges);

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



  newServiceCharges: any;

  // calculatePaymentBalance() {

  //   let request = {
  //     Balance: {...this.assessment.assessmentBalance},
  //     Amount: this.inputTotal ? this.inputTotal : 0,
  //     DiscountRates: this.discountRates,
  //     SessionMonth: this.currentSession.startAt ? this.datePipe.transform(this.currentSession.startAt, 'MM') : -1,

  //   }


  //   this.httpProvider.AssessmentTaxCalculatePaymentBalance(request)
  //     .subscribe({
  //       next: (result) => {
  //         const resultData = result;
  //         // Notify.success('Calculation Successfully..!');

  //         // this.outstandingPayable = resultData.outstandingPayable;
  //         this.payable = resultData.payable;
  //         this.payingBalance = resultData.paying;
  //         this.deduction = resultData.deduction;
  //         this.nextBalance = resultData.nextBalance;
  //         this.customerPaying = resultData.customerPaying;
  //         this.discount = resultData.discount;
  //         this.discountRate = resultData.discountRate;

  //         if (this.customerPaying) {
  //           const beforeServiceCharges = new BigNumber(BigNumber(this.customerPaying).minus(BigNumber(this.discount.total ? this.discount.total : 0)));
  //           // this.newServiceCharges = new BigNumber(BigNumber(beforeServiceCharges).times(0.09)).toFixed(2);
  //           this.newServiceCharges = this.solveForX(+beforeServiceCharges)
  //           this.grandTotal = new BigNumber(BigNumber(beforeServiceCharges).plus(this.newServiceCharges)).toFixed(2);


  //           const AfterServiceCharges = new BigNumber(BigNumber(this.customerPaying).minus(BigNumber(this.discount.total ? this.discount.total : 0))).times(1.009);
  //           var serviceCharges = AfterServiceCharges.minus(beforeServiceCharges);
  //           this.serviceCharges = +serviceCharges.toFixed(2);
  //           // this.grandTotal = +AfterServiceCharges.toFixed(2);
  //           this.isInputDisabled = false;
  //         }

  //       },
  //       error: error => {
  //         // Notify.failure('Calculation Error..!');
  //       }
  //     });

  //   setTimeout(() => {

  //   }, 1000);

  // }

  calculatePaymentBalance() {

    let request = {
      Balance: {...this.assessment.assessmentBalance},
      Amount: this.inputTotal ? this.inputTotal : 0,
      DiscountRates: this.discountRates,
      SessionMonth: this.currentSession.startAt ? this.datePipe.transform(this.currentSession.startAt, 'MM') : -1,

    }


    this.httpProvider.AssessmentTaxCalculatePaymentBalance(request)
      .subscribe({
        next: (result) => {
          const resultData = result;
          // Notify.success('Calculation Successfully..!');

          // this.outstandingPayable = resultData.outstandingPayable;
          this.payable = resultData.payable;
          this.payingBalance = resultData.paying;
          this.deduction = resultData.deduction;
          this.nextBalance = resultData.nextBalance;
          this.customerPaying = resultData.customerPaying;
          this.discount = resultData.discount;
          this.discountRate = resultData.discountRate;

          if (this.customerPaying) {
            const beforeServiceCharges = new BigNumber(BigNumber(this.customerPaying));
            // const beforeServiceCharges = new BigNumber(BigNumber(this.customerPaying).minus(BigNumber(this.discount.total ? this.discount.total : 0)));
            // this.newServiceCharges = new BigNumber(BigNumber(beforeServiceCharges).times(0.09)).toFixed(2);
            this.newServiceCharges = this.solveForX(+beforeServiceCharges)
            this.grandTotal = new BigNumber(BigNumber(beforeServiceCharges).plus(this.newServiceCharges)).toFixed(2);

            // const AfterServiceCharges = new BigNumber(this.customerPaying).times(1.009);
            const AfterServiceCharges = new BigNumber(this.newServiceCharges)
            // const AfterServiceCharges = new BigNumber(BigNumber(this.customerPaying).minus(BigNumber(this.discount.total ? this.discount.total : 0))).times(1.009);
            var serviceCharges = new BigNumber(this.grandTotal).minus(beforeServiceCharges);
            this.serviceCharges = +serviceCharges.toFixed(2);
            // this.grandTotal = +AfterServiceCharges.toFixed(2);
            this.isInputDisabled = false;
          }

        },
        error: error => {
          // Notify.failure('Calculation Error..!');
        }
      });

    setTimeout(() => {

    }, 1000);

  }

  updateCheckbox(id: number) {

    // Toggle the clicked checkbox
    this.checkboxes[id].checked = !this.checkboxes[id].checked;

    // Uncheck and disable the following checkboxes if the current one is unchecked
    for (let i = id + 1; i < this.checkboxes.length; i++) {

      if (this.checkboxes[id].checked) {
        this.checkboxes[++id].disabled = false;
      } else {
        this.checkboxes[i].checked = false;
        this.checkboxes[i].disabled = true;
      }
    }

    // this.onTotalChange(1);
    this.perCalculate();
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  onBeforeClose(): boolean {

    if (this.dataVotesArrays.length > 0 && this.dataVotesArrays[0].voteAssignmentDetails.voteAssignment.bankAccountId != undefined) {
      this.mixinOrder.id = "0";
      this.mixinOrder.code = "";
      this.mixinOrder.state = 1;

      // if (this.assessment.isPartnerUpdated && this.assessment.partnerId != undefined) {
      this.mixinOrder.partnerId = this.assessment.partnerId;
      // } else if (this.assessment.assessmentTempPartner?.name == "Owner" || "owner") {
      //   // the default system customer as owner / Owner
      //   this.mixinOrder.partnerId = 50;
      // } else {
      //   // the default system customer
      //   this.mixinOrder.partnerId = 60;
      // }

      // this.mixinOrder.customerName = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
      // this.mixinOrder.customerNicNumber = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
      // this.mixinOrder.customerMobileNumber = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerMobileNo") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
      this.mixinOrder.customerName = this.assessment.partner?.name ?? "";
      this.mixinOrder.customerNicNumber = this.assessment.partner?.nicNumber ?? "";
      this.mixinOrder.customerMobileNumber = this.assessment.partner?.mobileNumber ?? "";

      if (this.inputTotal == this.customerPaying) {
        this.mixinOrder.totalAmount = this.customerPaying;
        this.mixinOrder.discountRate = this.discountRate ? this.discountRate : 0;
        this.mixinOrder.discountAmount = this.discount.total;
      }
      this.mixinOrder.createdBy = -1;
      this.mixinOrder.officeId = this.assessment.officeId;
      this.mixinOrder.appCategoryId = 5; // Assessment 5
      this.mixinOrder.sessionId = this.currentSession.id;
      this.mixinOrder.accountDetailId = this.dataVotesArrays[0].voteAssignmentDetails.voteAssignment.bankAccountId;
      this.mixinOrder.cashierId = 0;
      // this.mixinOrder.paymentMethodId = 1,2,3,4
      this.mixinOrder.paymentMethodId = this.selectedPaymentOption;
      this.mixinOrder.businessId = 0;
      this.mixinOrder.businessTaxId = 0;
      this.mixinOrder.taxTypeId = 0;
      this.mixinOrder.tradeLicenseStatus = 0;
      this.mixinOrder.assessmentId = this.assessment.id


      // if (this.mixinOrder.paymentMethodId == 2) {
      //
      //
      //   this.mixinOrder.chequeBankName = this.chequeInfoForm.value.bankName;
      //   this.mixinOrder.chequeNumber = this.chequeInfoForm.value.chequeNumber;
      //   // this.mixinOrder.chequeDate =  this.myForm.value.chequeDate;
      //
      //   const customDate = this.datePipe.transform(
      //     this.chequeInfoForm.value.chequeDate,
      //     "yyyy-MM-dd"
      //   );
      //   this.mixinOrder.chequeDate = new Date(customDate!);
      //
      // } else {
      //   this.mixinOrder.chequeBankName = undefined;
      //   this.mixinOrder.chequeNumber = undefined;
      //   this.mixinOrder.chequeDate = undefined;
      // }

    } else {
      // Notify.failure("Make Sure That You're Properly Assign Votes")
      return false;
    }

    if (this.payingBalance.lyWarrant != 0) {

      let va = this.findVote(1);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.lyWarrant),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: va.votePaymentType.description,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.lyWarrant),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:1,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }
    }

    if (this.payingBalance.lyArrears != 0) {

      let va = this.findVote(2);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.lyArrears),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: va.votePaymentType.description,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.lyArrears),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:2,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }
    }


    if (this.payingBalance.tyWarrant != 0) {

      let va = this.findVote(3);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.tyWarrant),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: va.votePaymentType.description,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.tyWarrant),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:3,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }
    }

    if (this.payingBalance.tyArrears != 0) {

      let va = this.findVote(4);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.tyArrears),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: va.votePaymentType.description,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.tyArrears),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:4,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }
    }

    if (this.payingBalance.q1 != 0) {

      let va = this.findVote(5);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.q1),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `Quarter 1 ${va.votePaymentType.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.q1),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:5,
          assmtGrossAmount: this.assessment.assessmentBalance?.q1?.amount ,
          assmtDiscountAmount: this.discount.q1!>0 ? this.discount.q1:undefined ,
          assmtDiscountRate:this.discount.q1!>0 ? this.discountRate:undefined ,
        };

        this.mixinOrderLines.push(mxOrderLine);
      }
    }
    if (this.payingBalance.q2 != 0) {
      if (this.payingBalance.q2 != 0) {

        let va = this.findVote(5);
        if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
          const mxOrderLine: MixinOrderLine = {
            amount: Number(this.payingBalance.q2),
            customVoteName: va.voteAssignmentDetails.customVoteName,
            description: `Quarter 2 ${va.votePaymentType.description}`,
            mixinOrderId: 0,
            mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
            paymentNbtAmount: 0, paymentNbtId: 0,
            paymentVatAmount: 0,
            paymentVatId: 0,
            stampAmount: 0,
            totalAmount: Number(this.payingBalance.q2),
            voteAssignmentDetails: [],
            voteCode: 1,
            voteOrBal: 1,
            votePaymentTypeId:5,
            assmtGrossAmount: this.assessment.assessmentBalance?.q2?.amount ,
            assmtDiscountAmount: this.discount.q2!>0 ? this.discount.q2:undefined ,
            assmtDiscountRate:this.discount.q2!>0 ? this.discountRate:undefined ,
          };
  
          this.mixinOrderLines.push(mxOrderLine);
        } else {
          // Notify.failure("Make Sure That You're Properly Assign Votes")
        }
      }
    }
    if (this.payingBalance.q3 != 0) {

      let va = this.findVote(5);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.q3),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `Quarter 3 ${va.votePaymentType.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.q3),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:5,
          assmtGrossAmount: this.assessment.assessmentBalance?.q3?.amount ,
          assmtDiscountAmount: this.discount.q3!>0 ? this.discount.q3:undefined ,
          assmtDiscountRate:this.discount.q3!>0 ? this.discountRate:undefined ,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }
    }

    if (this.payingBalance.q4 != 0) {

      let va = this.findVote(5);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.q4),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `Quarter 4 ${va.votePaymentType.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.q4),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId:5,

          assmtGrossAmount: this.assessment.assessmentBalance?.q4?.amount ,
          assmtDiscountAmount: this.discount.q4!>0 ? this.discount.q4:undefined ,
          assmtDiscountRate:this.discount.q4!>0 ? this.discountRate:undefined ,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }

    }

    if (this.payingBalance.overPayment != 0) {

      let va = this.findVote(6);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.votePaymentType?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.payingBalance.overPayment),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: va.votePaymentType.description,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: 0,
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.payingBalance.overPayment),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId :6,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
        // Notify.failure("Make Sure That You're Properly Assign Votes")
      }
    }


    if (this.mixinOrder.assessmentId != undefined && this.mixinOrderLines.length >= 0) {

      this.mixinOrder.mixinOrderLine = this.mixinOrderLines;

      // this.dialogRef.close(this.mixinOrder);
      // this.onSaveBtnClick.emit(this.mixinOrder);
      // Notify.info("Save Successfully");
      // this.mixinOrderService.mixinOrder = this.mixinOrder;
      // sessionStorage.setItem("mixInOrder", JSON.stringify(this.mixinOrder));

      sessionStorage.setItem("mixInOrder", CryptoJS.AES.encrypt(JSON.stringify(this.mixinOrder), environment.KEY).toString());
      return true;

    } else {
      return false;
      // Notify.failure("Something Went Wrong")
    }

  }

  findVote(paymentTypeId: number): AssmtVoteAssign | undefined {
    return this.dataVotesArrays.find(obj => obj.paymentTypeId === paymentTypeId);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }

  protected readonly min = 1;
  protected readonly sessionStorage = sessionStorage;
  protected readonly isEmpty = isEmpty;
  currentStep: any = 1;
  payNowFromControl = new FormControl('', [Validators.required]);

  protected readonly CryptoJS = CryptoJS;
  protected readonly environment = environment;
}

