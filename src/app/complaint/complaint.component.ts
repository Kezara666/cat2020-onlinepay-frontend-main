import {Component, HostListener, OnInit} from '@angular/core';
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import {MatTableDataSource} from "@angular/material/table";
import Swal from "sweetalert2";
import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit{

  columnsToDisplay: string[] = ['column1', 'column2', 'column3', 'column4','column5'];
  complainDataSource:any = new MatTableDataSource([]);
  pageSize = 10;
  pageNumber =1;
  partnerId:any;
  complaintDetailArray: any  = [];

  constructor(private httpProvider: HttpServiceProviderService) {
  }

  ngOnInit() {
    this.partnerId =  CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    this.getPartnerDisputes();
  }


  updatePageNumberSize(){
    this.pageNumber++;
    this.getPartnerDisputes();
  }

  getPartnerDisputes(){
    this.httpProvider.getPartnerDisputes(this.partnerId, this.pageSize, this.pageNumber).subscribe({
      next: (data: any) => {
        if (data != null) {
          this.complaintDetailArray.push(...data);
          this.complainDataSource = new MatTableDataSource(this.complaintDetailArray);
          if (this.complaintDetailArray.length == 0){
            Swal.fire("Not Found", "Looks like you don't have any payment complaint at the moment", "info");
          }
        }
      },
      error: (error: any) => {
        Swal.fire("Oops!", "Something went wrong. Please try again later", "error");

      },
      complete: () => {

      }
    })
  }
}
