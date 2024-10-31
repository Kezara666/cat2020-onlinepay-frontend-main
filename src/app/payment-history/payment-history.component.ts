import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit{
  columnsToDisplay: string[] = ['column1', 'column2', 'column3', 'column4', 'column5'];
  historyDataSource = new MatTableDataSource<PaymentDetail>([]);
  partnerId:any;
  pageSize = 10;
  pageNumber =1;


  constructor(private httpProvider: HttpServiceProviderService) {
  }

  ngOnInit() {
    this.partnerId =  CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    this.getPaymentHistory();
  }

  paymentDetailArray: any  = [];

  getPaymentHistory(){
      this.httpProvider.getPaymentHistory(this.partnerId, this.pageSize, this.pageNumber).subscribe({
        next: (data: any) => {
          if (data != null) {
            this.paymentDetailArray.push(...data);
            this.historyDataSource = new MatTableDataSource(this.paymentDetailArray);
            if (this.paymentDetailArray.length == 0){
              Swal.fire("Not Found", "Looks like you don't have any payment history at the moment", "info");
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

  updatePageNumberSize(){
    this.pageNumber++;
    this.getPaymentHistory();
  }


}




interface PaymentDetail {
  paymentDetailId: number;
  transactionId: string;
  sessionId: string;
  resultIndicator: string;
  status: number;
  error: number;
  description: string;
  inputAmount: number;
  discount: number;
  totalAmount: number;
  servicePercentage: number;
  serviceCharges: number;
  orderId: number;
  accountNo: string | null;
  partnerId: number;
  partnerName: string;
  partnerNIC: string;
  partnerMobileNo: string;
  partnerEmail: string;
  sabhaId: number;
  officeId: number;
  time: string;
  officeSessionId: string | null;
  check: number;
  cashierId: number | null;
}
