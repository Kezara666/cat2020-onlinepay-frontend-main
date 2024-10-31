import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpServiceProviderService} from "../services/http-service-provider.service";
import Swal from "sweetalert2";
import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, AfterViewInit{
  constructor(private fb: FormBuilder, private httpProviderService: HttpServiceProviderService) {}
  profileForm!: FormGroup;



  ngOnInit() {
    this.initializeForm();
    this.getPartner();
  }

  ngAfterViewInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      Id: ['', Validators.required],
      Name: ['', Validators.required],
      NIC: ['', Validators.required],
      phone: [null, Validators.required],
      Email: [null, Validators.required],
      address: [''],
    });

    // this.setInitialValues();
  }

  setInitialValues() {

  }

  getPartner(){
    const partnerId = CryptoJS.AES.decrypt(sessionStorage.getItem("partnerId") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
    this.httpProviderService.getPartnerById(partnerId ? partnerId : undefined ).subscribe({
        next: (data: any) => {
          if (data != null) {
            this.profileForm.setValue({
              Id: data.id,
              Name: data.name,
              NIC: data.nicNumber,
              phone: data.mobileNumber,
              Email: data.email,
              address: data.street1 + " " + data.street2 + " " + data.city,
            });
          }
        },
        // @ts-ignore
        error: (error) => {
          if (error) {
            Swal.fire("Oops!", "Something went wrong. Please try again later", "error");
          }
        },
      });

  }

}
