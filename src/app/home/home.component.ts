import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "../core/auth.service";

import { WindowService } from "../core/window.service";
import * as firebase from "firebase";
import { switchMap, map } from "rxjs/operators";
import { TestBed } from "@angular/core/testing";

export class PhoneNumber {
  number: string;

  // format phone numbers as E.164
  get e164() {
    const num = this.number;
    return `+91${num}`;
  }
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;
  user: any;
  captachaFlag: boolean;
  public captachaverifyFlag: boolean;
  test: boolean;
  enablephoneFlag: boolean;
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
    iconRegistry.addSvgIcon(
      "community",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/community.svg")
    );
    iconRegistry.addSvgIcon(
      "stick-man-washing",
      sanitizer.bypassSecurityTrustResourceUrl(
        "../assets/stick-man-washing.svg"
      )
    );
    iconRegistry.addSvgIcon(
      "stick-man-drying",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/stick-man-drying.svg")
    );
    iconRegistry.addSvgIcon(
      "stick-man-ironing",
      sanitizer.bypassSecurityTrustResourceUrl(
        "../assets/stick-man-ironing.svg"
      )
    );
    iconRegistry.addSvgIcon(
      "stick-man-pick-up",
      sanitizer.bypassSecurityTrustResourceUrl(
        "../assets/stick-man-pick-up.svg"
      )
    );
    iconRegistry.addSvgIcon(
      "delivery-truck",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/delivery-truck.svg")
    );
    iconRegistry.addSvgIcon(
      "exit",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/exit.svg")
    );
    iconRegistry.addSvgIcon(
      "form",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/form.svg")
    );
  }

  ngOnInit() {
    // this.Auth.loadingScreen = true;
    // this.Auth.registrationOverlayFlag = true;
    this.enablephoneFlag = false;
    this.captachaverifyFlag = false;
    this.windowRef = this.win.windowRef;
    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //   "recaptcha-container"
    //   // , // use in the future to get hte capche response
    //   // {
    //   //   size: "normal",
    //   //   callback: function(response) {
    //   //   },
    //   //   "expired-callback": function() {
    //   //     // Response expired. Ask user to solve reCAPTCHA again.
    //   //     // ...
    //   //   }
    //   // }
    // );

    // this.windowRef.recaptchaVerifier.render();
    this.captachaFlag = false;
  }
  googleLogin() {
    this.Auth.googleLogin().then(function() {});
  }

  sendLoginCode() {
    this.windowRef.recaptchaVerifier.verify().then(result => {
      this.captachaverifyFlag = true;
      this.captachaFlag = true;
      this.Auth.sendLoginCode(this.phoneNumber.e164);
    });
  }
  verifyLoginCode() {
    this.Auth.verifyLoginCode(this.verificationCode);
  }
  exitverifyLoginCode() {
    this.captachaFlag = false;
  }
  registration() {
    // this.Auth.registrationOverlayFlag = true;
    this.Auth.registration();
  }
  enablePhone() {
    this.enablephoneFlag = true;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this.windowRef.recaptchaVerifier.render();
  }
}
