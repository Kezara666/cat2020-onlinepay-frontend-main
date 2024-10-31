import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MixinOrder } from '../pay-info/models/MixinOrder';
import { MixinOrderLine } from '../pay-info/models/MixinOrderLine';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Partner } from '../pay-info/models/Partner';
import { Ward } from '../pay-info/models/Ward';
import { HttpServiceProviderService } from '../services/http-service-provider.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WaterConnectionResource } from '../pay-info/models/WaterConnectionResourse';
import { WaterConnectionBalance } from '../pay-info/models/WaterConnectionBalance';
import { HWaterBillBalance } from '../pay-info/models/HWaterBalance';
import { MainRoad } from '../pay-info/models/MainRoad';
import { SubRoad } from '../pay-info/models/SunRoad';
import { WaterProject } from '../pay-info/models/WaterProject';
import { Pagination } from '../pay-info/models/Pagination';
import { PageEvent} from "@angular/material/paginator";
import { OpeningBalanceWaterBill } from '../pay-info/models/OpeningBalanceWaterBill';
import { Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import {debounceTime} from "rxjs/operators";
import { Session } from '../pay-info/models/Session';
import { BirtReport } from '../pay-info/models/birtReport';
import { VoteAssign } from '../pay-info/models/VoteAssign';
import {environment} from "../../environments/environment";
import * as CryptoJS from "crypto-js";
import Swal from 'sweetalert2';
import { PaymentGatewayBasicResource } from '../success-message/models/PaymentGatewayBasic';
import { Sabha } from '../pay-info/models/models/Sabha';
import BigNumber from 'bignumber.js';


declare let Checkout: any;


@Component({
  selector: 'app-paybillview',
  templateUrl: './paybillview.component.html',
  styleUrls: ['./paybillview.component.scss']
})
export class PayBillView implements OnInit {
 
  APIMonthsList: any;
  currentDate: Date = new Date();

  activeSession: Session = new Session();
  dataVotesArrays: any[] = [];

  waterConnection: WaterConnectionResource = new WaterConnectionResource();
  runningOverPay?:number
  balances: WaterConnectionBalance[] = [];
  hWaterBillBalance: HWaterBillBalance = new HWaterBillBalance()
  inputTotal: number = 0;

  mixinOrder: MixinOrder = new MixinOrder();
  
  
  mixinOrderLines: MixinOrderLine[] = [];

  isPaymentDisabled=true;

  dataSource = new MatTableDataSource<OpeningBalanceWaterBill>([]);
  paginator?: MatPaginator;

  currentBalance: number = 0;
  owner: Partner = new Partner();
  // add model
  SelectedWard: Ward = new Ward();


  paymentgatewayInfo=new PaymentGatewayBasicResource();

  displayedColumns: string[] = [
    "position",
    "barcode",
    "billMonth",
    "consumption",
    "monthCharge",
    "totalDue",
    "actions"
  ];

  selectedPaymentOption: any;
;

  paymentOptions = [
    {value: 1, label: 'Cash'},
    {value: 2, label: 'Cheque'},
    {value: 3, label: 'Cross'},
    {value: 4, label: 'Direct'},
  ];


  selectedPrintSize: number = 1;
  printSizes = [
    {value: 1, label: '8.5 x 5.5'},
    {value: 2, label: '4 x 5.5'},
  ];



  chequeInfoForm?: FormGroup

  @Input() pagination: Pagination = {pageIndex: 0, pageSize: 10, total: 0};

  @Output() paginated = new EventEmitter<PageEvent>();


  NicControl = new FormControl('');
  filteredOptionsNIC?: Observable<any[]>;
  waterConnections?: any[];
  sabha!: Sabha;

  constructor(
    private httpProvider: HttpServiceProviderService,
    public fb: FormBuilder,
    private _router: Router,
    public datePipe: DatePipe,
    private _Activatedroute: ActivatedRoute) {
  }

  SelectedLanguage: any;
  isSinhala?: boolean;
  isTamil?: boolean;
  isEnglish?: boolean;


  officeId :any
  id :any 

  ngOnInit() {





    this._Activatedroute.paramMap.subscribe({
      next: (params) => {
    
         this.officeId = params.get('officeid')
        this.id = params.get('connectedid');
        // console.log(this.officeId,this.id)

        if(this.officeId != null && this.id != null){
          
          this. getForPaymentByConnectionId(this.id);
        }
       
      }
    });
   this.getSessionByOfficeAndModule(this.officeId,"MIX"
   );


    this.onPageLoad();

    this.SelectedLanguage = sessionStorage.getItem('CurrentSabhaLang');
    if (this.SelectedLanguage == "Sinhala") {
      this.isSinhala = true;
    }
    if (this.SelectedLanguage == "Tamil") {
      this.isTamil = true;
    }
    if (this.SelectedLanguage == "English") {
      this.isEnglish = true;
    }

    this.chequeInfoForm = this.fb.group({
      chequeNumber: ['', Validators.required],
      chequeDate: ['', Validators.required],
      bankName: ['', Validators.required]
    });


    this.NicControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(query => {
      // console.log(query);
      // this.GetWaterConnectionsIdsPartnerSearchByNIC(173,query);

    });

    this.getGatewayAndConfigInfoForSabha(sessionStorage.getItem("sabhaIdraw"));
   sessionStorage.setItem("service", CryptoJS.AES.encrypt(JSON.stringify("WaterBilling"), environment.KEY).toString());
 
  }


  async onPageLoad() {
    this.GetAllWaterProjectsForOffice();

    this.paymentForm = this.fb.group({
      barcodeNo: [''],

      connectionId: [''],
      connectionNo: [''],
      customerName: [''],
      customerAddress: [''],
      billingAddress: [''],
      nic: [''],
      nature: [''],
      mainRoad: [''],
      subRoad: [''],
      project: [''],

      billMonth: [],

      previousMeterReading: [''],
      currentMeterReading: [''],
      consumption: [''],
      balance: [''],
      thisMonthCharge: [''],
      fixedCharge: [''],
      vatAmount: [''],
      totalAmountDue: [''],


    });

    this.balanceForm = this.fb.group({
      lastYearArrears: [''],
      thisYearArrears: [''],
      currentBalance: [''],
    });
    // this.getForPaymentByConnectionId('172-68-00008');
  }

  displayNicFn(wc: WaterConnectionResource): string {
    return wc ? String(wc.partnerAccount?.nicNumber) : '';
  }

  onchangeWaterConnection(wc: any) {
    this.getForPaymentByConnectionNo(wc.connectionId)
  }

  onNicEnterByNIC(nic: any) {
    this.GetWaterConnectionsIdsPartnerSearchByNIC(this.officeId, nic);
  }


  waterProjectListForOffice?: WaterProject[];
  mainRoadListForOffice?: MainRoad[];
  subRoadListForMainRoad?: SubRoad[];
  waterConnectionInfoInSubRoadList?: WaterConnectionResource[];

  //#1
  GetAllWaterProjectsForOffice() { ///need to re-think
    this.httpProvider
      .getAllWaterProjectsForOffice(this.officeId)
      .subscribe({
        next: (data) => {
          if (data != null && data.body != null) {
            let resultData = data.body;
            if (resultData) {
              this.waterProjectListForOffice = resultData;
            }
          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
          //    Notify.failure(error.error.message);
              this.waterProjectListForOffice = [];
            }
          }
        },
      });
  }


  patchData() {

    // console.log(this.waterConnection)
    // @ts-ignore
    let lastBill: WaterConnectionBalance = this.waterConnection.balances.slice(-1)[0]

    if (lastBill == undefined) {

      lastBill = new WaterConnectionBalance();
    }
    // @ts-ignore
    // @ts-ignore
    this.paymentForm.patchValue({

      barcodeNo: lastBill.barCode,
      connectionId: this.waterConnection.connectionId,
      connectionNo: this.waterConnection?.meterConnectInfo?.connectionNo,
      customerName: this.waterConnection.partnerAccount?.name,
      customerAddress: this.waterConnection.partnerAccount?.street1,
      billingAddress: this.waterConnection.billingAccount?.street1,
      nic: this.waterConnection.partnerAccount?.nicNumber,
      nature: this.waterConnection.activeNature?.type,
      mainRoad: this.waterConnection.subRoad?.mainRoad?.name,
      subRoad: this.waterConnection.subRoad?.name,
      project: this.waterConnection.subRoad?.waterProject?.name,


      billMonth: lastBill.year ? lastBill.year + "-" + lastBill.month : '',
      balance: lastBill.printLastBalance ? lastBill.printLastBalance : '',
      previousMeterReading: lastBill.previousMeterReading,
      currentMeterReading: lastBill.thisMonthMeterReading,
      consumption: (lastBill.thisMonthMeterReading && lastBill.previousMeterReading ? lastBill.thisMonthMeterReading - lastBill.previousMeterReading : ''),
      thisMonthCharge: lastBill.waterCharge,
      fixedCharge: lastBill.fixedCharge,
      vatAmount: lastBill.vatAmount,
      totalAmountDue: lastBill.totalDue,


    });

  }

  patchBalanceFrom() {
    // @ts-ignore
    this.balanceForm.patchValue({
      lastYearArrears: this.hWaterBillBalance.lyArrears,
      thisYearArrears: this.hWaterBillBalance.tyArrears,
      // @ts-ignore
      currentBalance: this.hWaterBillBalance.lyArrears + this.hWaterBillBalance.tyArrears + this.hWaterBillBalance.tmCharge - this.runningOverPay,
    });
  }


  getGatewayAndConfigInfoForSabha(sabhaId: any) {
    this.httpProvider.getGatewayAndConfigInfoForSabha(sabhaId).subscribe({
      next: (data) => {
        if (data !== null) { // Use strict comparison !== instead of !=
          // console.log(data)
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


  async getSessionByOfficeAndModule(officeid: number, module: any) {
    this.httpProvider.getSessionByOfficeAndModule(officeid, module).subscribe({
      next: (data) => {
        if (data != null ) {
          var resultData = data;
          if (resultData) {
            this.activeSession = resultData;
           this.updatePaymentBtnState()

          }
        }
      },
      error: (error) => {
        if (error.status == 404) {
          if (error.error && error.error.message) {
            //Notify.failure(error.error.message);
            this.activeSession = new Session();
          }
        }
      },
    });
  }

  /*GetAllWaterProjectsForOffice() { ///need to re-think
    this.httpProvider
      .getAllWaterProjectsForOffice(Number(sessionStorage.getItem("CurrentOfficeId")))
      .subscribe({
        next: (data) => {
          if (data != null && data.body != null) {
            let resultData = data.body;
            if (resultData) {
              this.waterProjectListForOffice = resultData;
            }
          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              Notify.failure(error.error.message);
              this.waterProjectListForOffice = [];
            }
          }
        },
      });
  }*/



  getAllVoteAssignsForWaterProject(waterProjectId: any) {

    this.httpProvider.getAllVoteAssignsForWaterProject(waterProjectId).subscribe({
      next: (data) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            // console.log("Votes", resultData);
            this.dataVotesArrays = resultData;
          }
        }
      },
      error: error => {
        if (error.status == 404) {
          if (error.error && error.error.message) {
        //    Notify.failure(error.error.message);
            this.dataVotesArrays = [];
          }
        }
      }
    });
  }

  getForPaymentByConnectionId(connectionId: any) {
    this.httpProvider
      .getForPaymentByConnectionId(this.officeId, connectionId)
      .subscribe({
        next: (data) => {
        //  console.log(data)
          if (data != null ) {
            // console.log(data);
            let resultData = data;
            if (resultData) {
             //  console.log(resultData)
              this.waterConnection = resultData;
              this.calculateWaterBillPayment(this.waterConnection.id, 0)
              this.getAllVoteAssignsForWaterProject(this.waterConnection.subRoad?.waterProjectId);

            }
          } else {
           // Notify.failure("Not Found");
            this.waterConnection = new WaterConnectionResource()
            this.balances = [];
            this.mixinOrder = new MixinOrder();
            this.mixinOrderLines = [];
            this.chequeInfoForm?.reset();
            this.balanceForm.reset();
            this.paymentForm.reset();
            this.paymentForm.get('connectionId').setValue(connectionId);


          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
           //   Notify.failure(error.error.message);
              this.mainRoadListForOffice = [];
            }
          }
        },
      })
  }


  getForPaymentByConnectionNo(connectionNo: any) {
    this.httpProvider
      .getForPaymentByConnectionNo(this.officeId, connectionNo)
      .subscribe({
        next: (data) => {
          if (data != null ) {
            let resultData = data;
            if (resultData) {
              this.waterConnection = resultData;
              this.calculateWaterBillPayment(this.waterConnection.id, 0)
              this.getAllVoteAssignsForWaterProject(this.waterConnection.subRoad?.waterProjectId);
            }
          } else {
           // Notify.failure("Not Found")
            this.waterConnection = new WaterConnectionResource()
            this.balances = [];
            this.mixinOrder = new MixinOrder();
            this.mixinOrderLines = [];
            this.chequeInfoForm?.reset();
            this.balanceForm.reset();
            this.paymentForm.reset();
            this.paymentForm.get('connectionNo').setValue(connectionNo);
          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
             // Notify.failure(error.error.message);
              this.mainRoadListForOffice = [];
            }
          }
        },
      })
  }


  getForPaymentByBarCode(barcode: any) {
    if (barcode != "0000-0000-0000") {
      this.httpProvider
        .getForPaymentByBarCode(this.officeId, barcode)
        .subscribe({
          next: (data) => {
            if (data != null ) {
              let resultData = data;
              if (resultData) {
                this.waterConnection = resultData;
                this.patchData();
                this.calculateWaterBillPayment(this.waterConnection.id, 0)
                this.getAllVoteAssignsForWaterProject(this.waterConnection.subRoad?.waterProjectId);
              }
            } else {
             // Notify.failure("Not Found")
              this.waterConnection = new WaterConnectionResource()
              this.balances = [];
              this.mixinOrder = new MixinOrder();
              this.mixinOrderLines = [];
              this.chequeInfoForm?.reset();
              this.balanceForm.reset();
              this.paymentForm.reset();
              this.paymentForm.get('barcodeNo').setValue(barcode);

            }
          },
          error: (error) => {
            if (error.status == 404) {
              if (error.error && error.error.message) {
            //    Notify.failure(error.error.message);
                this.mainRoadListForOffice = [];
              }
            }
          },
        })
    } else {
   //   Notify.failure("Please Enter Valid Barcode")
    }
  }

  //#3
  GetWaterConnectionsIdsPartnerSearchByNIC(officeId: any, nic: any) {
    this.httpProvider
      .GetWaterConnectionsIdsPartnerSearchByNIC(officeId, nic)
      .subscribe({
        next: (data) => {
          if (data != null ) {
            let resultData =data;
            if (resultData) {
              // console.log(resultData);
              this.waterConnections = resultData;
              this.filteredOptionsNIC = of(resultData)
            }
          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
             // Notify.failure(error.error.message);
              this.subRoadListForMainRoad = [];
            }
          }
        },
      })
  }


  calculateWaterBillPayment(wcPrimaryId: any, amount: any) {
    const calRequest = {

      officeId: this.officeId,
      wcId: wcPrimaryId,
      amount: amount,
      // sessionDate : this.datePipe.transform(this.activeSession.startAt,"yyyy-MM-dd" ),
      sessionDate: this.activeSession.startAt,
    }
    // console.log(calRequest)

    this.httpProvider.calculateWaterBillPayment(calRequest)
      .subscribe({

        next: (data) => {
          // console.log("a"+data)
          if (data != null ) {
            let resultData = data;
            // // console.log("Balances", resultData)
            this.balances = resultData.waterConnectionBalances;
            this.hWaterBillBalance = resultData.hWaterBillBalance;
            this.runningOverPay = resultData.runningOverPay;
            // console.log(resultData.waterConnectionBalances);
            // console.log(resultData.hWaterBillBalance);
            this.mixinOrder = new MixinOrder();
            this.mixinOrderLines = [];
            this.patchData();
            this.patchBalanceFrom();

          }
        },
        error: (error) => {
          if (error.status == 404) {
            if (error.error && error.error.message) {
//              Notify.failure(error.error.message);
            }
          }
        },
      })
  }




  maxDateTimeInForm: any;

  YearMonthValidation() {
    var date = new Date();
    var year: any = date.getFullYear(); //year
    var month: any = date.getMonth() + 1; //month

    this.maxDateTimeInForm = year + "-" + month;
  }

  numberOnly(event: any): boolean { //should include negative also //no need
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  paymentForm: any = FormGroup;
  balanceForm: any = FormGroup;


  ResetForm(form: FormGroup) {
    /*form.value.yearMonth = "";
    form.value.lastYearArreasOverPay = "";
    form.value.thisYearArreasOverPay = "";
    form.value.monthlyBalance = "";
    form.value.lastMeterReading = "";*/

    form.reset();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (filterValue != "" && filterValue.length > 7) {
      this.waterConnectionInfoInSubRoadList = this.waterConnectionInfoInSubRoadList?.filter(res => {
        return (
          (res && res.connectionId?.toLowerCase().includes(filterValue))
        )
      });
    } else {

    }
  }


  async updateRecord() {
  }


  onRadioChange(event: any) {
    // // console.log('Selected season:', event.value);
    // this.waterConnection = event.value;
    this.getForPaymentByConnectionId(event.value.connectionId)
  }

  trackByFn(index: number, wc: any): number {
    return wc.id;
  }


  calculateConsumption(obj: WaterConnectionBalance) {

    // @ts-ignore
    return obj.thisMonthMeterReading - obj.previousMeterReading;
  }

  getThisMonthChargeWithVAT(b: WaterConnectionBalance) {
    // @ts-ignore
    return (b.thisMonthCharge + b.vatAmount);
  }

  getTotalPaid(obj: WaterConnectionBalance) {

    // @ts-ignore
    return obj.onTimePaid + obj.latePaid;
  }

  getBalance(obj: WaterConnectionBalance) {

    // @ts-ignore
    // return (obj.thisMonthCharge + obj.vatAmount) - (obj.onTimePaid + obj.latePaid)-obj.payingAmount-obj.payingVatAmount;

    return (obj.payable) - obj.payingAmount - obj.payingVatAmount - obj.overPay;
  }

  onEnterPaymentAmount(paymentAmount: any) {

    if (this.waterConnection.id != undefined && this.waterConnection.id != 0) {
      this.calculateWaterBillPayment(this.waterConnection.id, this.inputTotal)
    }
  }

  findVote(paymentCategoryId: number): VoteAssign | undefined {

    var x = this.dataVotesArrays.find(obj => obj.paymentCategoryId === paymentCategoryId);

    // // console.log(x);

    return x;
  }

  onPayButtonClick() :Boolean {

    if (this.waterConnection.id != undefined && this.hWaterBillBalance.payingAmount != 0 && this.inputTotal == this.hWaterBillBalance.payingAmount  ) {

      // console.log(this.dataVotesArrays)
    
      if(this.dataVotesArrays[0].voteAssignmentDetails.voteAssignment.bankAccountId != undefined){
       // console.log(Number(sessionStorage.getItem("IsFinalAccountsEnabled"))==1)
      //  console.log(Number(sessionStorage.getItem("isFinalAccountsEnabled")))
        if( ( Number(sessionStorage.getItem("isFinalAccountsEnabled"))==1 ? this.dataVotesArrays.length == 5 :this.dataVotesArrays.length == 4 )) {
          this.mixinOrder.id = "0";
          this.mixinOrder.code = "";
          this.mixinOrder.state = 2;


          if (this.waterConnection.billingId) {
            this.mixinOrder.partnerId = this.waterConnection.billingId
          } else {
      //      Notify.failure("Unable To Find Billing Details")
          }

          this.mixinOrder.customerName = String(this.waterConnection.billingAccount?.name);
          this.mixinOrder.customerNicNumber = String(this.waterConnection.billingAccount?.nicNumber)
          this.mixinOrder.customerMobileNumber = String(this.waterConnection.billingAccount?.mobileNumber)


          this.mixinOrder.totalAmount = this.hWaterBillBalance.payingAmount;
          this.mixinOrder.discountRate = 0;
          this.mixinOrder.discountAmount = 0;

          this.mixinOrder.createdBy = this.officeId;
          this.mixinOrder.officeId = this.officeId;
          this.mixinOrder.appCategoryId = 4; // Assessment 5
          this.mixinOrder.sessionId =this.activeSession.id;
          this.mixinOrder.accountDetailId = this.dataVotesArrays[0].voteAssignmentDetails.voteAssignment.bankAccountId;
          this.mixinOrder.cashierId = this.officeId;
          this.mixinOrder.paymentMethodId = 4
          //this.mixinOrder.paymentMethodId = this.selectedPaymentOption;
          this.mixinOrder.businessId = 0;
          this.mixinOrder.businessTaxId = 0;
          this.mixinOrder.taxTypeId = 0;
          this.mixinOrder.tradeLicenseStatus = 0;
          this.mixinOrder.waterConnectionId = this.waterConnection.id
        //  console.log(this.mixinOrder)
        //   console.log(this.mixinOrder.paymentMethodId )

           
      

          if (this.mixinOrder.paymentMethodId == 2) {


            this.mixinOrder.chequeBankName = this.chequeInfoForm?.value.bankName;
            this.mixinOrder.chequeNumber = this.chequeInfoForm?.value.chequeNumber;
            // this.mixinOrder.chequeDate =  this.myForm.value.chequeDate;

            const customDate = this.datePipe.transform(
              this.chequeInfoForm?.value.chequeDate,
              "yyyy-MM-dd"
            );
            this.mixinOrder.chequeDate = new Date(customDate!);

          } else {
            this.mixinOrder.chequeBankName = undefined;
            this.mixinOrder.chequeNumber = undefined;
            this.mixinOrder.chequeDate = undefined;
          }

          // this.mixinOrder.assmtBalByExcessDeduction = this.deduction.total! > 0 ? this.deduction.total : undefined;
          this.mixinOrder.assmtBalByExcessDeduction = undefined;
        }else{
        //  Notify.failure("Make Sure That You're Properly Assign Votes")
        }
        }else {
      //  Notify.failure("Make Sure That You're Properly Assign Bank Account")
      }
    } else {
    //  Notify.failure("Calculation Error Orr curd")
    }

    // console.log(this.hWaterBillBalance)

    if (this.hWaterBillBalance.lyArrearsPaying != 0) {
      let va = this.findVote(1);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName != undefined && va.paymentCategory?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.hWaterBillBalance.lyArrearsPaying),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `${va.paymentCategory?.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: Number(this.hWaterBillBalance.lyaPayingVAT),
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.hWaterBillBalance.lyArrearsPaying) + Number(this.hWaterBillBalance.lyaPayingVAT),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId: 1,
          voteDetailId: va.voteAssignmentDetails.voteAssignment?.voteId,
          classificationId:1,

          assmtGrossAmount: undefined,
          assmtDiscountAmount: undefined,
          assmtDiscountRate: undefined,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
       // Notify.failure("Unable to find Last Year Arrears Ledger Account")
      }

    }


    if (this.hWaterBillBalance.tyArrearsPaying != 0) {
      let va = this.findVote(2);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.paymentCategory?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.hWaterBillBalance.tyArrearsPaying),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `${va.paymentCategory?.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: Number(this.hWaterBillBalance.tyaPayingVAT),
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.hWaterBillBalance.tyArrearsPaying) + Number(this.hWaterBillBalance.tyaPayingVAT),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId: 2,
          voteDetailId: va.voteAssignmentDetails.voteAssignment?.voteId,
          classificationId:1,

          assmtGrossAmount: undefined,
          assmtDiscountAmount: undefined,
          assmtDiscountRate: undefined,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
       // Notify.failure("Unable to find This Year Arrears Ledger Account")
      }

    }

    if (this.hWaterBillBalance.tmChargePaying != 0) {
      let va = this.findVote(3);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.paymentCategory?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.hWaterBillBalance.tmChargePaying),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `${va.paymentCategory?.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: Number(this.hWaterBillBalance.tmPayingVAT),
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.hWaterBillBalance.tmChargePaying) + Number(this.hWaterBillBalance.tmPayingVAT),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId: 3,
          voteDetailId: va.voteAssignmentDetails.voteAssignment?.voteId,
          classificationId:1,

          assmtGrossAmount: undefined,
          assmtDiscountAmount: undefined,
          assmtDiscountRate: undefined,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
      //  Notify.failure("Unable to find This Year Arrears Ledger Account")
      }

    }

    if (this.hWaterBillBalance.overPayment != 0) {
      let va = this.findVote(4);
      if (va != undefined && va.voteAssignmentDetails?.id != undefined && va.voteAssignmentDetails?.customVoteName && va.paymentCategory?.description != undefined) {
        const mxOrderLine: MixinOrderLine = {
          amount: Number(this.hWaterBillBalance.overPayment),
          customVoteName: va.voteAssignmentDetails.customVoteName,
          description: `${va.paymentCategory?.description}`,
          mixinOrderId: 0,
          mixinVoteAssignmentDetailId: va.voteAssignmentDetails?.id,
          paymentNbtAmount: 0, paymentNbtId: 0,
          paymentVatAmount: Number(this.hWaterBillBalance.overPaymentVAT),
          paymentVatId: 0,
          stampAmount: 0,
          totalAmount: Number(this.hWaterBillBalance.overPayment) + Number(this.hWaterBillBalance.overPaymentVAT),
          voteAssignmentDetails: [],
          voteCode: 1,
          voteOrBal: 1,
          votePaymentTypeId: 4,
          voteDetailId: va.voteAssignmentDetails.voteAssignment?.voteId,
          classificationId:1,


          assmtGrossAmount: undefined,
          assmtDiscountAmount: undefined,
          assmtDiscountRate: undefined,
        };

        this.mixinOrderLines.push(mxOrderLine);
      } else {
       // Notify.failure("Unable To find Over Pay Ledger Account")
      }


    }
        // console.log(this.mixinOrder);
        // console.log(this.mixinOrderLines);

        this.mixinOrder.mixinOrderLine=this.mixinOrderLines;
        sessionStorage.setItem("mixInOrder", CryptoJS.AES.encrypt(JSON.stringify(this.mixinOrder), environment.KEY).toString());
      //  sessionStorage.setItem("mixinOrder", JSON.stringify(this.mixinOrder))
        return true
/*        
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
              this.patchData();
              this.patchBalanceFrom();
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

    } else {
   //   Notify.failure("Something Went Wrong")
    }
*/
    // console.log(this.mixinOrder)
  }


  birtReport: BirtReport = new BirtReport();

  openAndDuplicatePrintNewOption(orderid: Number) {


    this.paymentForm.reset();
    this.balanceForm.reset();
    this.birtReport.repoParameters = "printedBy="+sessionStorage.getItem("Currentuserid")+"&orderid="+ orderid;

    if (this.isSinhala) {
      if (this.selectedPrintSize == 2) {
        this.birtReport.repoType = "mixinorderreceipt_sin_format2";
      } else {
        this.birtReport.repoType = "mixinorderreceipt_sin";

      }

    } else if (this.isTamil) {
      if (this.selectedPrintSize == 2) {

        this.birtReport.repoType = "mixinorderreceipt_tml_format2";
      } else {
        this.birtReport.repoType = "mixinorderreceipt_tml";
      }
    } else {
      if (this.selectedPrintSize == 2) {

        this.birtReport.repoType = "mixinorderreceipt_eng_format2";
      } else {
        this.birtReport.repoType = "mixinorderreceipt_eng";
      }
    }


    this.httpProvider.getReportHtmlContent(this.birtReport).subscribe(response => {
      let fileName = response.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let blob: Blob = response.body as Blob;
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      //a.click();

      // window.open(a.href, "_blank");

      // Set the width and height for the new window
      const windowWidth = 1180;
      const windowHeight = 750;

      // Calculate the position to center the window on the screen
      const windowLeft = (screen.width - windowWidth) / 2;
      const windowTop = (screen.height - windowHeight) / 2;

      // Specify the window features
      const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`;

// Step 1: Open the external URL in a new window
      const newWindow = window.open(a.href, '_blank', windowFeatures);

      // Check if the new window is opened successfully
      if (newWindow) {
        newWindow.focus();

        setTimeout(() => {
          newWindow.print();
          newWindow.close();
          // this.navigationService.goBack();
        }, 1000);

        // if (newWindow) {
        //   newWindow.onload = () => {
        //     // Automatically trigger the print function after the window has loaded
        //     newWindow.print();
        //   };
        // }

        // newWindow.addEventListener('afterprint', () => {
        // setTimeout(() => {
        //   newWindow.close();
        //   }, 2000);
        // });
        // this.navigationService.goBack();
      } else {
        console.error('Unable to open the new window.');
      }


    });
  }

  protected readonly Number = Number;


  updatePaymentBtnState() {
   //  if (this.dataVotesArrays.length !== 6) {
   //    return true;
   //  }
   //  if (this.activeSession.id == 0) {
   //    return true;
   //  }
   //
    let today = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let sessionDate = this.datePipe.transform(this.activeSession.startAt, "yyyy-MM-dd");
   // //
   // //  // return today != sessionDate && this.activeSession.rescue != 1;
   // // return  false;
   //
   // this.isPaymentDisabled = this.dataVotesArrays.length == 6 && this.activeSession.id != 0 || ( today != sessionDate && this.activeSession.rescue != 1);
   this.isPaymentDisabled = this.waterConnection!=undefined && this.dataVotesArrays.length == 6 && this.activeSession.id != 0 ;

   if(today != sessionDate && this.activeSession.rescue != 1){
     this.isPaymentDisabled = true;
   }



  }

  backToCashierView() {
    this._router.navigateByUrl("/services");
  }






closeSection(input: any) {

  var mixIn = this.onPayButtonClick();
  if (!mixIn) {
    Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
    return;
  }
 
 // const serviceChargepercentage  =0.01
   const servicecharge = (this.inputTotal * this.paymentgatewayInfo.servicePercentage!)
   const totalAmount = this.inputTotal + servicecharge
 
  const orderDetails = {
    PaymentDetailId: null,
    TransactionId: null,
    SessionId: "",
    ResultIndicator: "",
    // Status:null,
    // Error:null,
    Description: "Water Bill",
    InputAmount: this.inputTotal,
    TotalAmount:totalAmount,
    Discount:  this.mixinOrder.discountAmount,
    ServicePercentage:this.paymentgatewayInfo.servicePercentage,
    ServiceCharges: servicecharge,
    OrderId: this.mixinOrder.waterConnectionId,
    AccountNo: '',
    PartnerId: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
    PartnerName: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
    PartnerNIC: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
    PartnerMobileNo: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerMobileNo") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
    PartnerEmail: CryptoJS.AES.decrypt(sessionStorage.getItem("partnerEmail") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""),
    SabhaId:Number (CryptoJS.AES.decrypt(sessionStorage.getItem("sabhaId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "")),
    OfficeId: this.mixinOrder.officeId,
    DateTime: "",
    OfficeSessionId: this.activeSession.id


  };

    //  console.log(orderDetails)

  this.httpProvider.showPay(orderDetails)
    .subscribe({
      next: (data: any) => {

        if (this.paymentgatewayInfo != null && this.paymentgatewayInfo.bankName == "BOC" &&  this.paymentgatewayInfo.sabhaId == orderDetails.SabhaId) {
          //boc
        if (data != null) {

          const sessionData = JSON.parse(data.sessionId);

          sessionStorage.setItem("gateway", CryptoJS.AES.encrypt(JSON.stringify(data.sessionId), environment.KEY).toString());
          sessionStorage.setItem("paymentDetailId", CryptoJS.AES.encrypt(JSON.stringify(data.paymentDetailId), environment.KEY).toString());
          sessionStorage.setItem("tId", CryptoJS.AES.encrypt(JSON.stringify(data.transactionId), environment.KEY).toString());


          const sabhaString = sessionStorage.getItem("sabhaId");
          this.sabha = sabhaString ? JSON.parse(CryptoJS.AES.decrypt(sabhaString, environment.KEY).toString(CryptoJS.enc.Utf8)) : null;
          //  console.log(this.sabha) 

          this.httpProvider.getPaymentDetailById(data.paymentDetailId).subscribe({
            next: (responseData: any) => {


              if (responseData.transactionId != null && data.transactionId == responseData.transactionId && responseData.sessionId != null  && responseData.resultIndicator != null &&
                responseData.resultIndicator == data.resultIndicator && responseData.totalAmount == data.totalAmount) {
                let inter = {
                  merchant: {
                    name: "CAT20 Automation System",
                    address: {
                      line1: `${this.sabha?.nameEnglish},`,
                      line2: `${this.sabha?.addressEnglish},`,
                      line3: "SRI LANKA,",
                    },
                    phone: this.sabha?.telephone1,
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

  const xBig = yBig.times(0.01).dividedBy(1 - this.bankServiceCharges);

  const roundedX = xBig.toFixed(2);

  return roundedX;
  }
  else if(this.paymentgatewayInfo.bankName == "PeoplesBank"){
  const yBig = new BigNumber(y);

  const xBig = yBig.times(this.bankServiceCharges);

  const roundedX = xBig.toFixed(2);

  return roundedX;
  }
  else{
    const roundedX = "10000000000.00";

  return roundedX;
  }
}


newServiceCharges: any;



}