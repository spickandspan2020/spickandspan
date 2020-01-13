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
  community?: any;
  phoneNumber?: any;
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
    displayName: null,
    role: null,
    community: null,
    phoneNumber: null,
    completeFlag: false
  };
  authState: any;
  windowRef: any;
  phoneNumber: any;
  test: any; // test example
  test1: any;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private win: WindowService
  ) {
    this.windowRef = this.win.windowRef;
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
              this.router.navigate(["/arena/registration"]); // change to login url
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
    firebase
      .auth()
      .signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        console.log("test test");
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));
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
              this.router.navigate(["/arena/registration"]); // change to login url
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
    const provider = new auth.GoogleAuthProvider();

    return this.oAuthRegistration(provider);
  }

  private oAuthRegistration(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.RegistrationVerify(credential.user);
      // this.updateUserData(credential.user);
    });
  }

  private RegistrationVerify(user) {
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
            phoneNumber: doc.data().phoneNumber
          };
          if (this.presentUser) {
            if (this.presentUser.completeFlag) {
              alert("user Already registered");
            } else {
              this.router.navigate(["/arena/registration"]);
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
          this.router.navigate(["/arena/registration"]);
        }
      })
      .catch(function(error) {
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
                subscribe.unsubscribe();
                console.log("Document data:", doc.data());
              } else {
                userRef.set(data, { merge: true });
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
}
