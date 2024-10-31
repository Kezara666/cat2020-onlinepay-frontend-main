import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";
import { DeviceDetectorService, DeviceInfo } from "ngx-device-detector";
import { first } from "rxjs";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxOtpBehavior, NgxOtpInputConfig } from "ngx-otp-input";
import { CountdownConfig, CountdownEvent } from "ngx-countdown";
import { DOCUMENT } from "@angular/common";
import { SharedService } from "../services/shared.service";
import { environment } from "../../environments/environment";
import * as CryptoJS from 'crypto-js';
import { HttpServiceProviderService } from "../services/http-service-provider.service";
import { Partner } from "../pay-info/models/Partner";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    deviceInfo!: DeviceInfo;
    ipAddress: any;
    partner: Partner = new Partner();

    nic: any;
    mobile: any;
    emailAddress: any;
    otp: string = '';
    currentStep: number = 0;
    steps: string[] = ['Step 1', 'Step 2'];

    province: any
    sabha: any
    gnDivision: any;

    loginForm1!: FormGroup
    loginForm2!: FormGroup
    title = 'loginForm';

    selectedOption: string;

    signUpForm!: FormGroup;

    submitted = false;
    partnerNotPreset = false;


    constructor(private authenticationService: AuthenticationService,
        private deviceDetectorService: DeviceDetectorService,
        private httpServiceProvider: HttpServiceProviderService,
        private router: Router,
        private fromBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
        private sharedService: SharedService
    ) {
        this.selectedOption = 'Mobile';
    }


    ngOnInit() {

        this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
        this.getIP();

        this.loginForm1 = this.fromBuilder.group({
            // nic: ['', Validators.required],
            mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
            rememberMeCheckbox: [false]
        });

        this.loginForm2 = this.fromBuilder.group({
            // nic: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]],
            rememberMeCheckbox: [false]
        });

        this.signUpForm = this.fromBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.email]],
            phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            nic: ['', Validators.required],
            province: ['', Validators.required],
            localAuthority: ['', Validators.required],
            gnDivision: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: '',
            city: '',
            zip: ''
        });

        const storedNic = localStorage.getItem('rememberedNic');
        const storedMobileNo = localStorage.getItem('rememberedMobileNo');
        const storedEmailAddress = localStorage.getItem('rememberedEmailAddress');

        // if (storedNic && storedMobileNo) {
        //     this.loginForm.patchValue({
        //         nic: storedNic,
        //         mobileNo: storedMobileNo
        //     });
        // }

        if (storedMobileNo) {
            this.loginForm1.patchValue({
                mobileNo: storedMobileNo
            });
        }

        if (storedEmailAddress) {
            this.loginForm2.patchValue({
                emailAddress: storedEmailAddress
            });
        }

    }

    async getIP() {
        this.authenticationService.getIPAddress().subscribe((res: any) => {
            this.ipAddress = res.ip;
        });
    }


    nextStep() {
        this.submitted = true

        if (this.selectedOption == "Mobile") {
            if (this.loginForm1.invalid) {
                return;
            }
            if (this.currentStep < this.steps.length - 1) {
                // this.currentStep++;

                this.isPartnerAvailable();
            }
        }
        else {
            if (this.loginForm2.invalid) {
                return;
            }
            if (this.currentStep < this.steps.length - 1) {
                // this.currentStep++;

                this.isPartnerAvailable();
            }
        }


    }

    saveLoginDetails() {
        if (this.selectedOption == "Mobile") {
            if (this.loginForm1.get('rememberMeCheckbox')?.value) {
                // localStorage.setItem('rememberedNic', this.loginForm.get('nic')?.value);
                localStorage.setItem('rememberedMobileNo', this.loginForm1.get('mobileNo')?.value);
            }
        }
        else {
            if (this.loginForm2.get('rememberMeCheckbox')?.value) {
                // localStorage.setItem('rememberedNic', this.loginForm.get('nic')?.value);
                localStorage.setItem('rememberedEmailAddress', this.loginForm2.get('emailAddress')?.value);
            }
        }
    }

    logIn() {
        if (this.selectedOption == "Mobile") {
            const loginRequest = {

                logInID: null,
                // NIC: this.loginForm.get('nic')?.value ,
                MobileNo: this.loginForm1.get('mobileNo')?.value,
                EmailAddress: "",
                IpAddress: this.ipAddress,
                Device: this.deviceInfo.deviceType,
                OperatingSystem: this.deviceInfo.os,
                OsVersion: this.deviceInfo.os_version,
                Browser: this.deviceInfo.browser,
                BrowserVersion: this.deviceInfo.browser_version,
                DeviceType: this.deviceInfo.device,
                Orientation: this.deviceInfo.orientation,
                Time: null,

            };

            // this.authenticationService.login(this.loginForm.get('nic')?.value, this.loginForm.get('mobileNo')?.value, this.deviceInfo.os, this.deviceInfo.browser, this.deviceInfo.device, this.deviceInfo.os_version, this.deviceInfo.browser_version, this.deviceInfo.deviceType, this.deviceInfo.orientation, this.ipAddress)
            // console.log(loginRequest);
            this.authenticationService.login1Mobile(loginRequest)
                .pipe(first())
                .subscribe({
                    next: (data) => {
                        const createdBy = CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                        const updatedBy = CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                        if (createdBy == "0" && updatedBy == "0") {
                            this.router.navigate(['/local-authority'])
                        } else {
                            this.router.navigate(['/local-authority']);
                        }
                    },
                    error: error => {

                    }
                });
        }
        else {
            const loginRequest = {

                logInID: null,
                // NIC: this.loginForm.get('nic')?.value ,
                MobileNo: "",
                EmailAddress: this.loginForm2.get('emailAddress')?.value,
                IpAddress: this.ipAddress,
                Device: this.deviceInfo.deviceType,
                OperatingSystem: this.deviceInfo.os,
                OsVersion: this.deviceInfo.os_version,
                Browser: this.deviceInfo.browser,
                BrowserVersion: this.deviceInfo.browser_version,
                DeviceType: this.deviceInfo.device,
                Orientation: this.deviceInfo.orientation,
                Time: null,

            };

            // this.authenticationService.login(this.loginForm.get('nic')?.value, this.loginForm.get('mobileNo')?.value, this.deviceInfo.os, this.deviceInfo.browser, this.deviceInfo.device, this.deviceInfo.os_version, this.deviceInfo.browser_version, this.deviceInfo.deviceType, this.deviceInfo.orientation, this.ipAddress)
            this.authenticationService.login1Email(loginRequest)
                .pipe(first())
                .subscribe({
                    next: (data) => {
                        const createdBy = CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                        const updatedBy = CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                        if (createdBy == "0" && updatedBy == "0") {
                            this.router.navigate(['/local-authority'])
                        } else {
                            this.router.navigate(['/local-authority']);
                        }
                    },
                    error: error => {

                    }
                });
        }
    }

    logIn1Mobile() {
        const loginRequest = {
            logInID: null,
            // NIC:  this.nic.trim(),
            MobileNo: this.mobile.trim(),
            EmailAddress: this.emailAddress.trim(),
            IpAddress: this.ipAddress,
            Device: this.deviceInfo.deviceType,
            OperatingSystem: this.deviceInfo.os,
            OsVersion: this.deviceInfo.os_version,
            Browser: this.deviceInfo.browser,
            BrowserVersion: this.deviceInfo.browser_version,
            DeviceType: this.deviceInfo.device,
            Orientation: this.deviceInfo.orientation,
            Time: null,
        };

        // this.authenticationService.login(this.loginForm.get('nic')?.value, this.loginForm.get('mobileNo')?.value, this.deviceInfo.os, this.deviceInfo.browser, this.deviceInfo.device, this.deviceInfo.os_version, this.deviceInfo.browser_version, this.deviceInfo.deviceType, this.deviceInfo.orientation, this.ipAddress)
        this.authenticationService.login1Mobile(loginRequest)
            .pipe(first())
            .subscribe({
                next: (data) => {
                    const createdBy = CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                    const updatedBy = CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                    if (createdBy == "0" && updatedBy == "0") {
                        this.router.navigate(['/local-authority'])
                    } else {
                        this.router.navigate(['/local-authority']);
                    }

                },
                error: error => {

                }
            });
    }

    logIn1Email() {
        const loginRequest = {
            logInID: null,
            // NIC:  this.nic.trim(),
            MobileNo: this.mobile.trim(),
            EmailAddress: this.emailAddress.trim(),
            IpAddress: this.ipAddress,
            Device: this.deviceInfo.deviceType,
            OperatingSystem: this.deviceInfo.os,
            OsVersion: this.deviceInfo.os_version,
            Browser: this.deviceInfo.browser,
            BrowserVersion: this.deviceInfo.browser_version,
            DeviceType: this.deviceInfo.device,
            Orientation: this.deviceInfo.orientation,
            Time: null,
        };

        // this.authenticationService.login(this.loginForm.get('nic')?.value, this.loginForm.get('mobileNo')?.value, this.deviceInfo.os, this.deviceInfo.browser, this.deviceInfo.device, this.deviceInfo.os_version, this.deviceInfo.browser_version, this.deviceInfo.deviceType, this.deviceInfo.orientation, this.ipAddress)
        this.authenticationService.login1Email(loginRequest)
            .pipe(first())
            .subscribe({
                next: (data) => {
                    const createdBy = CryptoJS.AES.decrypt(sessionStorage.getItem("createdBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                    const updatedBy = CryptoJS.AES.decrypt(sessionStorage.getItem("updatedBy") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
                    if (createdBy == "0" && updatedBy == "0") {
                        this.router.navigate(['/local-authority'])
                    } else {
                        this.router.navigate(['/local-authority']);
                    }

                },
                error: error => {

                }
            });
    }


    OTP: any;
    userVerification = false;
    isPartnerAvailable() {
        // this.authenticationService.isPartnerAvailable(this.loginForm.get('nic')?.value, this.loginForm.get('mobileNo')?.value).subscribe({
        //         next: (data: any) => {
        //             if (data != null) {
        //                 const statusCode = data.status;
        //                 if (statusCode === 404) {
        //                     return;
        //                 } else if (statusCode === 200) {
        //                     // sessionStorage.setItem("OTP", data.body.otp);
        //                     // sessionStorage.setItem("partnerMobileNo", this.loginForm.get('mobileNo')?.value.trim());
        //                     this.OTP = data.body.otp;
        //                     sessionStorage.setItem("partnerMobileNo", CryptoJS.AES.encrypt(JSON.stringify(this.loginForm.get('mobileNo')?.value.trim()), environment.KEY).toString());
        //                     if (this.currentStep == 0) {
        //                         this.currentStep++;
        //                         this.userVerification = true;
        //                     }

        //                 }
        //             }
        //         },
        //         error: (error: any) => {
        //             this.partnerNotPreset = true;
        //             console.error("Error:", error);
        //         },
        //         complete: () => {
        //         }
        //     }
        // )
        if (this.selectedOption == "Mobile") {
            this.authenticationService.isPartnerMobileAvailable(this.loginForm1.get('mobileNo')?.value).subscribe({
                next: (data: any) => {
                    if (data != null) {
                        const statusCode = data.status;
                        if (statusCode === 404) {
                            return;
                        } else if (statusCode === 200) {
                            // sessionStorage.setItem("OTP", data.body.otp);
                            // sessionStorage.setItem("partnerMobileNo", this.loginForm.get('mobileNo')?.value.trim());
                            this.OTP = data.body.otp;
                            sessionStorage.setItem("partnerMobileNo", CryptoJS.AES.encrypt(JSON.stringify(this.loginForm1.get('mobileNo')?.value.trim()), environment.KEY).toString());
                            if (this.currentStep == 0) {
                                this.currentStep++;
                                this.userVerification = true;
                            }

                        }
                    }
                },
                error: (error: any) => {
                    // console.log(error);
                    this.partnerNotPreset = true;
                    console.error("Error:", error);
                },
                complete: () => {
                }
            }
            )
        }
        else {
            this.authenticationService.isPartnerEmailAvailable(this.loginForm2.get('emailAddress')?.value).subscribe({
                next: (data: any) => {
                    if (data != null) {
                        const statusCode = data.status;
                        if (statusCode === 404) {
                            return;
                        } else if (statusCode === 200) {
                            // sessionStorage.setItem("OTP", data.body.otp);
                            // sessionStorage.setItem("partnerMobileNo", this.loginForm.get('mobileNo')?.value.trim());
                            this.OTP = data.body.otp;
                            sessionStorage.setItem("partnerEmailAddress", CryptoJS.AES.encrypt(JSON.stringify(this.loginForm2.get('emailAddress')?.value.trim()), environment.KEY).toString());
                            if (this.currentStep == 0) {
                                this.currentStep++;
                                this.userVerification = true;
                            }

                        }
                    }
                },
                error: (error: any) => {
                    // console.log(error);
                    this.partnerNotPreset = true;
                    console.error("Error:", error);
                },
                complete: () => {
                }
            }
            )
        }
    }

    isPhoneExist: any;
    isNICExist: any;
    mobileVerification = false;
    createPartner() {

        const cPartner = {
            MobileNo: this.partner?.mobileNumber || '',
            NIC: this.partner?.nicNumber || '',
            sabhaId: this.partner?.sabhaId || ''
        };


        this.authenticationService.createPartner(cPartner).subscribe({
            next: (data: any) => {
                if (data != null) {
                    if (data.body.id == 1) {
                        this.isPhoneExist = true
                    }
                    if (data.body.pNumber == 1) {
                        this.isPhoneExist = true
                    }
                    if (data.body.pNumber == 0 && data.body.id == 0) {
                        this.OTP = data.body.otp;
                        this.mobileVerification = true;
                    }

                }
            },
            error: (error: any) => {
                this.partnerNotPreset = true;

            },
            complete: () => {
            }
        }
        )
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    otpInputConfig: NgxOtpInputConfig = {
        otpLength: 6,
        autofocus: true,
        autoblur: true,
        behavior: NgxOtpBehavior.DEFAULT,
        classList: {
            container: 'my-super-container',
            inputBox: 'my-super-box-class',
            input: 'my-super-class',
            inputFilled: 'my-super-filled-class',
            inputDisabled: 'my-super-disable-class',
            inputSuccess: 'my-super-success-class',
            inputError: 'my-super-error-class',
        },
    };
    otpStatus: any = 'error';
    @ViewChild('verify') verify!: ElementRef;


    protected readonly onsubmit = onsubmit;
    protected readonly sessionStorage = sessionStorage;

    inputDigitLeft: string = "6 digits left";
    btnStatus: string = "btn-light";

    public configOptions = {
        length: 6,
        inputClass: 'digit-otp',
        containerClass: 'd-flex justify-content-between',

    }
    isLocked: any = true;
    initialColor = "blue";
    cursor: any;
    myOTP = 123456;
    counter: number = 5;
    remainingduration: any = "{ leftTime: 60000 }";

    onOtpChange(event: any) {
        this.otp = event;
        if (this.otp.length < this.configOptions.length) {
            this.inputDigitLeft = this.configOptions.length - this.otp.length + " digits left";
            this.btnStatus = 'btn-light';
            this.initialColor = 'blue'
            this.isLocked = true;
        }

        if (this.otp.length == this.configOptions.length && this.otp == this.OTP) {
            this.inputDigitLeft = "Verified!";
            this.btnStatus = 'btn-success';
            this.isLocked = false;
            this.cursor = 'cursor-success';
            this.initialColor = '#20cca5';
            if (this.mobileVerification) {
                this.savePartner();
            } else {
                this.logIn();
            }

        }
        if (this.otp.length == this.configOptions.length && this.otp != this.OTP) {
            this.inputDigitLeft = "Wrong code!";
            this.btnStatus = 'btn-danger';
            this.isLocked = true;
            this.cursor = 'cursor-danger';
            this.initialColor = 'rgba(255, 91, 91, 0.66)';

        }

    }


    yourOwnFunction() {

    }

    counterConfiguration: CountdownConfig = {
        leftTime: 30,
        demand: true
    }

    countStatus: any;

    handleCountDown(event: CountdownEvent) {
        if (event.status == 3) {
            this.countStatus = false;
        }
    }

    resendOTP() {
        this.countStatus = true;
        this.counterConfiguration = {
            leftTime: 30,
            demand: false
        }

    }

    onSubmitSignUp(signUpForm: FormGroup) {

        if (this.signUpForm.valid) {
            this.partner.name = signUpForm.value.username;
            this.partner.email = signUpForm.value.email;
            this.partner.mobileNumber = signUpForm.value.phone;
            this.partner.nicNumber = signUpForm.value.nic;
            this.partner.street1 = signUpForm.value.addressLine1;
            this.partner.street2 = signUpForm.value.addressLine2;
            this.partner.city = signUpForm.value.city;
            this.partner.zip = signUpForm.value.zip;

            this.createPartner();

        } else {
            return
        }
    }


    savePartner() {
        if (this.selectedOption == "Mobile") {
            this.httpServiceProvider.savePartner(this.partner)
                .subscribe({
                    next: (data) => {
                        if (data != null) {
                            this.logIn1Mobile();
                        }

                    },
                    error: error => {
                    }
                });
        }
        else {
            this.httpServiceProvider.savePartner(this.partner)
                .subscribe({
                    next: (data) => {
                        if (data != null) {
                            this.logIn1Email();
                        }

                    },
                    error: error => {
                    }
                });
        }
    }


    loadProvince(event: any) {
        if (event.index == 1) {
            this.httpServiceProvider.getProvince().subscribe({
                next: (data) => {
                    if (data.length !== 0) {
                        this.province = data;
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
    }

    onProvinceSelectionChange(event: any) {
        const selectedProvinceId = event.value;
        this.gnDivision = [];
        this.sabha = [];
        this.httpServiceProvider.getSabhaForProvince(selectedProvinceId).subscribe({
            next: (data) => {
                if (data.length !== 0) {
                    this.sabha = data;
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

    onSabhaSelectionChange(event: any) {
        const selectedSabhaId = event.value;
        this.gnDivision = []
        this.partner.sabhaId = selectedSabhaId;
        this.httpServiceProvider.getGnDivisionForSabha(selectedSabhaId).subscribe({
            next: (data) => {
                if (data.length !== 0) {
                    this.gnDivision = data;
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

    protected readonly environment = environment;

    protected readonly CryptoJS = CryptoJS;
    localAuthority: any;
    protected readonly event = event;
    protected readonly FormControl = FormControl;


    onGnDivisionChange(event: any) {
        this.partner.gnDivisionId = event.value.id;
        this.partner.gnDivision = null;

    }

}
