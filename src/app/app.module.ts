import { APP_INITIALIZER, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './home/home.component';
import { LocalAuthorityComponent } from './local-authority/local-authority.component';
import { PayInfoComponent } from './pay-info/pay-info.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthenticationInterceptor } from "./services/interceptor";
import { NgxOtpInputModule } from "ngx-otp-input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { DatePipe } from "@angular/common";
import { SuccessMessageComponent } from './success-message/success-message.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { ServicesComponent } from './local-authority/services/services.component';
import { NgOtpInputModule } from "ng-otp-input";
import { CountdownModule } from "ngx-countdown";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatExpansionModule } from "@angular/material/expansion";
import { NgxSpinnerModule } from "ngx-spinner";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { OtherPaymentComponent } from './other-payment/other-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { provideUserIdleConfig } from "angular-user-idle";
import { LogoutService } from "./services/logout.service";
import { BookingComponent } from './booking/booking.component';
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
import { PayBillView } from './paybill/paybillview.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LocalAuthorityComponent,
    PayInfoComponent,
    SuccessMessageComponent,
    ServicesComponent,
    UserProfileComponent,
    OtherPaymentComponent,
    PaymentHistoryComponent,
    ComplaintComponent,
    BookingComponent,
    PayBillView
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    NgxOtpInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule, // Add MatNativeDateModule to imports
    MatRadioModule,
    MatToolbarModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    NgOtpInputModule,
    CountdownModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SweetAlert2Module.forRoot(),
    MatProgressBarModule,
    MatCardModule,
    MatTabsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true
    },
    DatePipe,
    provideUserIdleConfig({ idle: 600, timeout: 0, ping: 10 }),
    {
      provide: APP_INITIALIZER,
      useFactory: (logoutService: LogoutService) => () => logoutService.ngOnInit(),
      deps: [LogoutService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
