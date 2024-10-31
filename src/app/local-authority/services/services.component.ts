import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpServiceProviderService} from "../../services/http-service-provider.service";
import {SharedService} from "../../services/shared.service";
import {Router} from "@angular/router";
import BigNumber from "bignumber.js";
import {CalculatorBalance} from "../../pay-info/models/CalculatorBalance";
import {Assessment} from "../../pay-info/models/Assessment";
import {DatePipe} from "@angular/common";
import {MatAccordion} from "@angular/material/expansion";
import {forkJoin, min} from "rxjs";
import Swal from "sweetalert2";
import * as CryptoJS from "crypto-js";
import {environment} from "../../../environments/environment";
import {AssessmentDiscountRates} from "../../pay-info/models/AssessmentDiscountRates";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit{
  sabhaId:any;
  ptnrid=0;
  createdBy =  CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  updatedBy =  CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");

  owner = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  currentStep:any = 1;
  secondStepDataSource = [
    { column1: 'Value 1', column2: 'Value 2', column3: 'Value 3', column4: 'Value 4', column5: 'Value 5' ,column6: 'Value 6', column7: 'Value 7'},
  ];

  displayedColumnsStep2: string[] = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7'];
  waterDataSource = [
    { column1: 'Value 1', column2: 'Value 2', column3: 'Value 3', column4: 'Value 4', column5: 'Value 5' ,column6: 'Value 6'},
  ];

  displayedColumnsWater: string[] = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6'];


  payable = new CalculatorBalance();
  deduction = new CalculatorBalance();
  nextBalance = new CalculatorBalance();
  customerPaying: number = 0.00;
  discount = new CalculatorBalance();
  discountRates:any;
  discountRate: any
  currentSession: any;
  assessment!: Assessment;
  showAssessmentTable=false;
  showWaterTable=false;
  showbookingssection =false;

  constructor(private httpProviderService : HttpServiceProviderService, private router: Router,public datePipe: DatePipe, private fromBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.sabhaId = CryptoJS.AES.decrypt(sessionStorage.getItem("sabhaId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    this.ptnrid=Number(CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, ""));
    this.getServices();
  }
  ngAfterViewInit() {
  }


async getServices(){
  this.showbookingssection =true;

  const partnerId = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");

  const assessmentObs = this.httpProviderService.getAssessment(partnerId,this.sabhaId);
  const waterBillObs = this.httpProviderService.getWaterBill(partnerId, this.sabhaId);

  forkJoin([assessmentObs, waterBillObs]).subscribe(([assessmentData, watarBillData]) =>{
    if (assessmentData.length != 0){
      this.secondStepDataSource = assessmentData;
      this.showAssessmentTable = true;
    }
    if (watarBillData.length != 0){
      this.waterDataSource = watarBillData;
      this.showWaterTable = true;
    }


    if (assessmentData.length ==0 && watarBillData.length == 0 ){
      // Swal.fire("Not Found", "Looks like you don't have any registered services at the moment", "info");

    }

  },(error) => {
      Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
    }


  );

}



  protected readonly sessionStorage = sessionStorage;

  onBookingClick(){
    this.router.navigate(["/booking"]);
  }

  onPay(element: any) {

// console.log("water list",element);

    if (element.assessmentBalance.HasTransaction == true) {
      Swal.fire("We're Sorry", "We could not complete your action at the moment. You have already an ongoing transaction", "info");
    }

    const sessionObs = this.httpProviderService.getActiveOrLastActiveSessionForOnlinePaymentCurrentMonth(element.officeId, "MIX");
    const voteAssignsObs = this.httpProviderService.getAllAssmtVoteAssignsForSabha(element.sabhaId);
    const sabhaObs = this.httpProviderService.getAllSabha(element.sabhaId);
    const serviceChargesObs = this.httpProviderService.getServiceCharges(element.sabhaId);
    const AssDisRatesObs = this.httpProviderService.getAssessmentDiscountRates();

    let flag = true;
    let sessionavailable = true;

    forkJoin([sessionObs, voteAssignsObs, sabhaObs, serviceChargesObs, AssDisRatesObs]).subscribe({
      next: ([sessionData, voteAssignsData, sabhaData, serviceChargesData, AssDisRatesData]) => {
        // Process each result
        if (sessionData) {
          this.currentSession = sessionData;
          sessionStorage.setItem("currentSession", CryptoJS.AES.encrypt(JSON.stringify(sessionData), environment.KEY).toString());
        } else {
          flag = false;
          sessionavailable = false;
        }

        if (voteAssignsData.length != 0) {
          sessionStorage.setItem("sabhaVote", CryptoJS.AES.encrypt(JSON.stringify(voteAssignsData), environment.KEY).toString());
        } else {
          flag = false;
        }

        if (sabhaData) {
          sessionStorage.setItem("sabha", CryptoJS.AES.encrypt(JSON.stringify(sabhaData), environment.KEY).toString());
        } else {
          flag = false;
        }

        if (serviceChargesData) {
          sessionStorage.setItem("serviceCharges", CryptoJS.AES.encrypt(JSON.stringify(serviceChargesData), environment.KEY).toString());
        } else {
          flag = false;
        }

        if (AssDisRatesData) {
          sessionStorage.setItem("discountRates", CryptoJS.AES.encrypt(JSON.stringify(AssDisRatesData), environment.KEY).toString());
        } else {
          flag = false;
        }

        sessionStorage.setItem("selectedAssessment", CryptoJS.AES.encrypt(JSON.stringify(element), environment.KEY).toString());

        if (flag) {
          this.router.navigate(["/info"]);
        } else {
          Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
        }
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          if (error.url && error.url.includes('GetActiveOrLastActiveSessionForOnlinePaymentCurrentMonth')) {
              this.showError('The Assessment Tax online payments for the new month is not enabled yet. Please contact Local Authority to enable payments.');
          } else {
              this.showError("The target Local Authority doesn't have online payment facility at the moment. Please Try again Later");
          }
      }
      }
    });
  }

  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message
    });
  }

  prevStep() {
      this.router.navigate(["/local-authority"]);
  }

  nextStep() {

  }
  @ViewChild(MatAccordion) accordion!: MatAccordion;


  protected readonly CryptoJS = CryptoJS;
  protected readonly environment = environment;
  protected readonly min = min;
  protected readonly undefined = undefined;


}
