import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private sabhaIdSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sabhaId$: Observable<any> = this.sabhaIdSubject.asObservable();

  setSabhaId(newSabhaId: any) {
    this.sabhaIdSubject.next(newSabhaId);
  }

  // @ts-ignore
  private partnerNameSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  partnerName$: Observable<any> = this.partnerNameSubject.asObservable();

  // @ts-ignore
  private partnerNICSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  partnerNIC$: Observable<any> = this.partnerNICSubject.asObservable();

  // @ts-ignore
  private partnerMobileNoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  partnerMobileNo$: Observable<any> = this.partnerMobileNoSubject.asObservable();

  private createdBySubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  createdBy$: Observable<any> = this.createdBySubject.asObservable();

  private updatedBySubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  updatedBy$: Observable<any> = this.updatedBySubject.asObservable();

  setPartnerInfo(partnerName: any, partnerNIC: any, partnerMobileNo: any, createdBy:any, updatedBy:any) {
    this.partnerNameSubject.next(partnerName);
    this.partnerNICSubject.next(partnerNIC);
    this.partnerMobileNoSubject.next(partnerMobileNo);
    this.createdBySubject.next(createdBy);
    this.updatedBySubject.next(updatedBy);
  }
  constructor() { }
}
