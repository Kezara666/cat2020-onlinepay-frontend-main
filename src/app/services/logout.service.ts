import {Injectable, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {fromEvent, switchMap, timer} from "rxjs";
import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";
import {UserIdleService} from "angular-user-idle";

@Injectable({
  providedIn: 'root'
})
export class LogoutService implements OnInit{
  partnerName: any =   CryptoJS.AES.decrypt(sessionStorage.getItem("partnerName") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");
  partnerNIC: any =   CryptoJS.AES.decrypt(sessionStorage.getItem("partnerNIC") ?? "", environment.KEY).toString(CryptoJS.enc.Utf8).replace(/"/g, "");

  // private inactivityThreshold = 0.5 * 60 * 1000;
  // private timer$ = timer(this.inactivityThreshold);
  // private activity$ = fromEvent(document, 'mousemove').pipe(
  //     switchMap(() => this.timer$)
  // );
  //
  // constructor(private router: Router) {
  //   this.activity$.subscribe(() => {
  //     this.timer$ = timer(this.inactivityThreshold);
  //   });
  //
  //   this.startLogoutTimer();
  // }
  //
  // private startLogoutTimer() {
  //   this.timer$.subscribe(() => {
  //     this.logOut();
  //   });
  // }

  constructor(private userIdle: UserIdleService, private router: Router) {

  }

  ngOnInit() {
    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe();

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => this.logOut());
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  logOut() {
    sessionStorage.clear();
    this.partnerName = null;
    this.partnerNIC = null;
    this.router.navigate([""]);
  }
}
