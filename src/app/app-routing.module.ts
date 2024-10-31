import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LocalAuthorityComponent } from './local-authority/local-authority.component';
import { PayInfoComponent } from './pay-info/pay-info.component';
import {SuccessMessageComponent} from "./success-message/success-message.component";
import {ServicesComponent} from "./local-authority/services/services.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {OtherPaymentComponent} from "./other-payment/other-payment.component";
import {PaymentHistoryComponent} from "./payment-history/payment-history.component";
import {ComplaintComponent} from "./complaint/complaint.component";
import { PayBillView } from './paybill/paybillview.component';
import { BookingComponent } from './booking/booking.component';

const routes: Routes = [

  // {path: '', redirectTo:'online-payment',pathMatch:'full'},
  {path: '',component: HomeComponent},
  {path: 'payment-history',component: PaymentHistoryComponent},
  {path: 'success-message',component: SuccessMessageComponent},
  {path: 'local-authority',component:LocalAuthorityComponent},
  {path: 'services', component:ServicesComponent},
  {path: 'info', component:PayInfoComponent},
  {path: 'profile', component:UserProfileComponent},
  {path:'other-payment', component:OtherPaymentComponent},
  {path:'complaints', component:ComplaintComponent},
  {path:'paybillview/:officeid/:connectedid', component:PayBillView},


  {path:'booking', component:BookingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
