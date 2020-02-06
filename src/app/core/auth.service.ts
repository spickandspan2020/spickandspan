import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { auth } from "firebase/app";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { Observable, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { WindowService } from "../core/window.service";
import { Alert } from "selenium-webdriver";

interface User {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  role?: any;
  gender?: any;
  communityuid?: any;
  community?: any;
  phoneNumber?: any;
  verifiedFlag?: boolean;
}
@Injectable({
  providedIn: "root"
})
export class AuthService {
  Collection: AngularFirestoreCollection<any>;
  // user: Observable<User>;
  public presentUser: any = {
    uid: null,
    email: null,
    photoURL: null,
    displayName: "a",
    role: null,
    gender: null,
    communityuid: null,
    community: null,
    phoneNumber: null,
    verifiedFlag: false
  };
  communitiesInfo: any;
  authState: any;
  windowRef: any;
  phoneNumber: any;
  test: any; // test example
  test1: any;
  registrationOverlayFlag: any;
  loadingScreen: boolean;
  recaptchaUsed = false;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private win: WindowService
  ) {
    this.windowRef = this.win.windowRef;
    console.log("nandu");
    // this.Collection =
    this.afs.firestore
      .collection("info")
      .get()
      .then(data => {
        data.forEach(doc => {
          if (doc.id == "communities") {
            this.communitiesInfo = doc.data().community;
          }
          console.log(doc.id);
        });
      });
    // .subscribe(data => console.log(data.doc()));
    // this.Collection.get().pipe(
    //   map(data => {
    //     console.log("aku");
    //     console.log(data);
    //   })
    // );
    // verify if this is really required
    // this.user = this.afAuth.authState.pipe(
    //   switchMap(user => {
    //     if (user) {
    //       return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
  }
  // Login Begin
  googleLogin() {
    const provider = new auth.GoogleAuthProvider();

    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.logInVerify(credential.user);
      // this.updateUserData(credential.user);
    });
  }

  private logInVerify(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `newuser/${user.uid}`
    );
    userRef.ref
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log(user);
          this.presentUser = doc.data();
          if (this.presentUser) {
            if (this.presentUser.phoneNumber) {
              this.router.navigate(["/customer"]); // change to login url
            } else {
              alert(
                "Account Registered but phone number not available please Register again"
              );
            }
          }
        } else {
          alert("Account does not exist please Register");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
  //Phone Login
  sendLoginCode(phoneNumber: any) {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = phoneNumber;
    this.phoneNumber = phoneNumber;
    setTimeout(
      function() {
        firebase
          .auth()
          .signInWithPhoneNumber(num, appVerifier)
          .then(result => {
            this.windowRef.confirmationResult = result;
            this.recaptchaUsed = true;
          })
          .catch(error => console.log(error));
      }.bind(this),
      1000
    );
  }

  // Verification Code
  verifyLoginCode(verificationCode: any) {
    this.windowRef.confirmationResult
      .confirm(verificationCode)
      .then(result => {
        this.Collection = this.afs.collection<User>("newuser", ref =>
          ref.where("phoneNumber", "==", this.phoneNumber)
        );
        this.Collection.snapshotChanges().subscribe(collection => {
          if (collection.length == 0) {
            alert("Account does not exist please Register");
          } else if (collection.length == 1) {
            collection.map(doc => {
              const user = doc.payload.doc.data();
              this.presentUser = {
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                displayName: user.displayName,
                role: user.role,
                community: user.community,
                phoneNumber: user.phoneNumber
              };
              this.router.navigate(["/customer"]); // change to login url
            });
          } else {
            alert("Shamina");
          }
        });
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }

  //Login End

  //Registration Start
  registration() {
    setTimeout(
      function() {
        this.loadingScreen = true;
      }.bind(this),
      3000
    );
    setTimeout(
      function() {
        this.loadingScreen = false;
      }.bind(this),
      30000
    );
    const provider = new auth.GoogleAuthProvider();

    return this.oAuthRegistration(provider);
  }

  private oAuthRegistration(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        this.RegistrationVerify(credential.user);
        // this.updateUserData(credential.user);
      })
      .catch(
        function(error) {
          this.loadingScreen = false;
          console.log("Error getting document:", error);
        }.bind(this)
      );
  }

  private RegistrationVerify(user) {
    this.loadingScreen = true;

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `newuser/${user.uid}`
    );
    userRef.ref
      .get()
      .then(doc => {
        if (doc.exists) {
          this.presentUser = {
            uid: doc.data().uid,
            email: doc.data().email,
            photoURL: doc.data().photoURL,
            displayName: doc.data().displayName,
            role: doc.data().role,
            community: doc.data().community,
            communityuid: doc.data().communityuid,
            phoneNumber: doc.data().phoneNumber
          };
          if (this.presentUser) {
            if (this.presentUser.communityuid) {
              this.loadingScreen = false;
              alert("user Already registered");
            } else {
              this.loadingScreen = false;
              this.registrationOverlayFlag = true;
              // this.router.navigate(["/arena/registration"]);
            }
          }
        } else {
          this.presentUser = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
            role: user.role,
            community: user.community,
            phoneNumber: user.phoneNumber
          };
          this.loadingScreen = false;
          this.registrationOverlayFlag = true;
          // this.router.navigate(["/arena/registration"]);
        }
      })
      .catch(function(error) {
        this.loadingScreen = false;
        console.log("Error getting document:", error);
      });
  }
  // Verification for registration
  verifyRegistrationLoginCode(verificationCode: any) {
    this.windowRef.confirmationResult
      .confirm(verificationCode)
      .then(result => {
        this.updateUserPhoneNumber(result.user.phoneNumber);
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }

  updateUserPhoneNumber(value: any) {
    this.Collection = this.afs.collection<User>("newuser", ref =>
      ref.where("phoneNumber", "==", this.phoneNumber)
    );
    const subscribe = this.Collection.snapshotChanges().subscribe(
      collection => {
        console.log("kittu" + collection.length);
        if (collection.length == 0) {
          this.presentUser = {
            uid: this.presentUser.uid,
            email: this.presentUser.email,
            photoURL: this.presentUser.photoURL,
            displayName: this.presentUser.displayName,
            role: null,
            community: null,
            phoneNumber: value
          };
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(
            `newuser/${this.presentUser.uid}`
          );
          const data: User = {
            uid: this.presentUser.uid,
            email: this.presentUser.email,
            displayName: this.presentUser.displayName,
            photoURL: this.presentUser.photoURL,
            role: this.presentUser.role,
            community: this.presentUser.community,
            phoneNumber: this.presentUser.phoneNumber
          };
          userRef.ref
            .get()
            .then(function(doc) {
              if (doc.exists) {
                userRef.set(data, { merge: true });
                this.recaptchaUsed = false;
                subscribe.unsubscribe();
                console.log("Document data:", doc.data());
              } else {
                userRef.set(data, { merge: true });
                this.recaptchaUsed = false;
                subscribe.unsubscribe();
              }
            })
            .catch(function(error) {
              console.log("Error getting document:", error);
            });
        } else if (collection.length == 1) {
          collection.map(doc => {
            const user = doc.payload.doc.data();
            alert(
              "Phone number already linked to - " +
                doc.payload.doc.data().email +
                " - no need for registration please login"
            );
          });
        } else {
          alert("Shamina");
        }
      }
    );
  }
  registrationCompleted(value: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `newuser/${this.presentUser.uid}`
    );
    this.presentUser.role = {
      user: true,
      technical: false,
      admin: false
    };
    this.presentUser.communityuid =
      value.communityName + value.block + value.flat;
    this.presentUser.verifiedFlag = false;
    this.presentUser.community = value;
    userRef.set(this.presentUser, { merge: true });
    this.registrationOverlayFlag = true;
  }

  // Dependency Funtions
}
