import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import {MatTableDataSource} from "@angular/material/table";
import {PayInfoComponent} from "../pay-info/pay-info.component";
import {ServicesComponent} from "./services/services.component";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared.service";
import {environment} from "../../environments/environment";
import * as CryptoJS from 'crypto-js';
import Swal from "sweetalert2";
import {AppComponent} from "../app.component";


interface Sabha {
  id: number;
  districtID: number;
  nameSinhala: string;
  nameEnglish: string;
  nameTamil: string;
  code: string;
  logoPath: string;
  status: number;
  createdDate: string;
  telephone1: string;
  telephone2: string;
  addressSinhala: string;
  addressEnglish: string;
  addressTamil: string;
  district: District;
}

interface District {
  id: number;
  provinceID: number;
  nameSinhala: string;
  nameEnglish: string;
  nameTamil: string;
  status: number;
  province: Province;
  sabha: Sabha[];
}

interface Province {
  id: number;
  nameSinhala: string;
  nameEnglish: string;
  nameTamil: string;
  status: number;
  district: District[];
}


@Component({
  selector: 'app-local-authority',
  templateUrl: './local-authority.component.html',
  styleUrls: ['./local-authority.component.scss']
})
export class LocalAuthorityComponent implements OnInit {



  steps = [
    {label: 'Step 1', content: 'Step 1 content'},
    // { label: 'Step 2', content: 'Step 2 content' },
    // { label: 'Step 3', content: 'Step 3 content' }
  ];

  dataSource: any = [];
  currentStep = 0;

  total: any;


  displayedColumns: string[] = ['name', 'age', 'select'];
  // displayedColumns: string[] = ['province', 'Local Authority ', 'Select to Local Authority '];

  //secondtable

  secondStepDataSource = [
    {
      column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6'
    },
    // Add more rows as needed
  ];

  displayedColumnsStep2: string[] = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6'];


  secondStepDataSource2 = [
    {columnX: 'Value 5', columnY: 'Value 6', columnZ: 'Value 7', columnW: 'Value 8'},
    // Add more rows as needed
  ];


  displayedColumnsStep: string[] = ['columnX', 'columnY', 'columnZ', 'pay2'];

  constructor(private httpProviderService: HttpServiceProviderService, private router: Router, private sharedService: SharedService,private appComponent: AppComponent
  ) {
  }

  ngOnInit(): void {
    this.appComponent.loadStart();
    this.getServicesForProvince();
  }


  getServicesForProvince() {
    const partnerId = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    if (partnerId) {
      this.httpProviderService.getAllAuthority(partnerId).subscribe({
        next: (data: any) => {
          if (data != null) {
            var resultData = data;
            this.dataSource = resultData;
            if (resultData.length == 0){
              Swal.fire("Not Found", "Looks like you don't have any registered Authority at the moment", "info");
            }
          }
        },
        error: (error: any) => {
          if (error){
            Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
            return;
          }
        },
        complete: () => {
        }
      })
    }

  }


  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  @ViewChild(ServicesComponent) services!: ServicesComponent;

  onSelect(sabha: any): void {
    // sessionStorage.setItem("sabhaId",payment.id)
    // console.log(sabha)
    sessionStorage.setItem("sabhaId", CryptoJS.AES.encrypt(JSON.stringify(sabha.id),environment.KEY).toString());
   // sessionStorage.setItem("isFinalAccountsEnabled", CryptoJS.AES.encrypt(JSON.stringify(sabha.isFinalAccountsEnabled),environment.KEY).toString());
    sessionStorage.setItem("isFinalAccountsEnabled", sabha.isFinalAccountsEnabled);

    sessionStorage.setItem("sabhaIdraw", sabha.id);
    this.router.navigate(['/services']);
  }


  Assessment: any;
  isPayinfo: boolean = false;
  @ViewChild('payInfoComponent', {static: false}) payInfoComponent!: PayInfoComponent;

  // onPay(payment: any) {
  //   this.Assessment = payment;
  //   this.getSessionByOfficeAndModule(payment.officeId, "MIX");
  //   this.isPayinfo = true;
  //   this.currentStep++;
  //
  //   // this.payInfoComponent.assessment = payment;
  //
  //
  // }
  //
  //
  // async getSessionByOfficeAndModule(officeid: number | undefined, module: any) {
  //   this.httpProviderService.getSessionByOfficeAndModule(officeid, module).subscribe({
  //     next: (data: any) => {
  //       if (data != null && data.body != null) {
  //         var resultData = data.body;
  //         if (resultData) {
  //           sessionStorage.setItem("currentSession", resultData);
  //         }
  //       }
  //     },
  //     // @ts-ignore
  //     error: (error) => {
  //       if (error.status == 404) {
  //         if (error.error && error.error.message) {
  //         }
  //       }
  //     },
  //   });
  // }

  onPay2() {

  }

  protected readonly sessionStorage = sessionStorage;
}
