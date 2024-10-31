import {Component, HostListener, Inject, OnInit, ViewChild,ChangeDetectorRef} from '@angular/core';
import {SharedService} from "./services/shared.service";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {timeout} from "rxjs";
import {LoaderServiceService} from "./services/loader-service.service";
import {environment} from "../environments/environment";
import * as CryptoJS from 'crypto-js';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;


  partnerMobileNo: any = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerMobileNo") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  partnerEmailAddress: any = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerEmailAddress") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  partnerName: any = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  partnerNIC: any = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  createdBy = CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  updatedBy = CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");

  constructor(private sharedService: SharedService, private router: Router, public loaderService: LoaderServiceService) {
  }

  ngOnInit() {
    if (CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8) == ""
      && CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8) == "") {
      this.sharedService.partnerName$.subscribe(name => this.partnerName = name);
      this.sharedService.partnerNIC$.subscribe(nic => this.partnerNIC = nic);
      this.sharedService.partnerMobileNo$.subscribe(mobileNo => this.partnerMobileNo = mobileNo);
      this.sharedService.createdBy$.subscribe(created => this.createdBy = created);
      this.sharedService.updatedBy$.subscribe(updated => this.updatedBy = updated);
    }


  }

  loadStart(){
    this.partnerMobileNo;
    this.partnerNIC;
    this.partnerName;
    this.createdBy;
    this.updatedBy;
  }

  logOut() {
    sessionStorage.clear();
    this.partnerName = null;
    this.partnerNIC = null;
    this.router.navigate([""]);
    this.sidenav.close();

  }

  home() {
    if (this.partnerName != null && this.partnerNIC != null) {
      this.router.navigate(["/local-authority"])
    } else {
      this.router.navigate([""])

    }
  }
}
