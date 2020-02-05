import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
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
  selector: "app-registration-card",
  templateUrl: "./registration-card.component.html",
  styleUrls: ["./registration-card.component.scss"]
})
export class RegistrationCardComponent implements OnInit {
  windowRef: any;
  phoneNumber = new PhoneNumber();
  captachaverifyFlag: any;
  verificationCode: any;
  user: any;
  test12: Observable<any>;
  presentCommunity: any;
  communities = [];
  blocks = [];
  flats = [];
  counts = [1, 2, 3, 4, 5, 6, 7, 8];
  changeUserNameFlag = false;
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
    for (let i = 0; i < this.Auth.communitiesInfo.length; i++) {
      // this.communities[i] = this.Auth.communitiesInfo[i].name;
      this.communities.push(this.Auth.communitiesInfo[i].name);
    }
    this.Auth.presentUser.gender = "male";
    this.presentCommunity = {
      communityName: null,
      block: null,
      flat: null
    };
    this.captachaverifyFlag = false;
    this.windowRef = this.win.windowRef;
    // firebase.initializeApp(environment.firebaseConfig);
    // this.windowRef.recaptchaVerifier.clear();
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this.windowRef.recaptchaVerifier.render();
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
  changeUserName() {
    this.changeUserNameFlag = true;
  }
  communitySelected() {
    for (let i = 0; i < this.Auth.communitiesInfo.length; i++) {
      if (
        this.presentCommunity.communityName == this.Auth.communitiesInfo[i].name
      ) {
        for (let j = 0; j < this.Auth.communitiesInfo[i].block.length; j++) {
          this.blocks.push(this.Auth.communitiesInfo[i].block[j].name);
        }
      }
    }
  }
  blockSelected() {
    for (let i = 0; i < this.Auth.communitiesInfo.length; i++) {
      if (
        this.presentCommunity.communityName == this.Auth.communitiesInfo[i].name
      ) {
        for (let j = 0; j < this.Auth.communitiesInfo[i].block.length; j++) {
          if (
            this.presentCommunity.block ==
            this.Auth.communitiesInfo[i].block[j].name
          ) {
            this.flats = this.Auth.communitiesInfo[i].block[j].flats;
          }
        }
      }
    }
  }
  Register() {
    this.Auth.registrationCompleted(this.presentCommunity);

    setTimeout(
      function() {
        if (this.Auth.presentUser.community.communityName) {
          this.Auth.registrationOverlayFlag = false;
        } else {
          alert("Re-Submit");
        }
      }.bind(this),
      2000
    );
  }
  exit() {
    this.Auth.registrationOverlayFlag = false;
    this.windowRef.recaptchaVerifier.clear();
  }
}
