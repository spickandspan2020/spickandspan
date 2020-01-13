import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { WindowService } from "../../core/window.service";

import * as firebase from "firebase";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth.service";
import { Observable, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";

export class PhoneNumber {
  number: string;

  // format phone numbers as E.164
  get e164() {
    const num = this.number;
    return `+91${num}`;
  }
}
@Component({
  selector: "app-main-card",
  templateUrl: "./main-card.component.html",
  styleUrls: ["./main-card.component.scss"]
})
export class MainCardComponent implements OnInit {
  windowRef: any;
  phoneNumber = new PhoneNumber();
  captachaverifyFlag: any;
  verificationCode: any;
  user: any;
  test12: Observable<any>;
  presentCommunity: any;
  communitys: any;
  blocks: any;
  flats: any;
  counts = [1, 2, 3, 4, 5, 6, 7, 8];
  constructor(
    public Auth: AuthService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private win: WindowService
  ) {
    iconRegistry.addSvgIcon(
      "right-arrow",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/right-arrow.svg")
    );
  }

  ngOnInit() {
    this.communitys = [
      "ADITYA HEIGHTS",
      "SMR",
      "INDU FORTUNE",
      "SRILA PARK PRIDE",
      "Mypi"
    ];
    this.blocks = ["BLOCK A", "BLOCK B", "BLOCK C", "BLOCK D", "BLOCK E"];
    this.flats = ["101", "102", "103", "104", "105", "106"];
    this.presentCommunity = {
      communityName: null,
      block: null,
      flat: null,
      gender: "male",
      adults: null,
      kids: null
    };
    this.captachaverifyFlag = false;
    this.windowRef = this.win.windowRef;
    // firebase.initializeApp(environment.firebaseConfig);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this.windowRef.recaptchaVerifier.clear();
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this.windowRef.recaptchaVerifier.render();
  }
  test2() {
    console.log(this.presentCommunity);
  }
  sendLoginCode() {
    this.windowRef.recaptchaVerifier.verify().then(result => {
      this.captachaverifyFlag = true;
      this.Auth.sendLoginCode(this.phoneNumber.e164);
    });
  }
  verifyLoginCode() {
    this.Auth.verifyRegistrationLoginCode(this.verificationCode);
  }
}
