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

interface User {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  role?: any;
  community?: any;
}
@Injectable({
  providedIn: "root"
})
export class AuthService {
  Collection: AngularFirestoreCollection<any>;
  items: Observable<any>;
  user: Observable<User>;
  authState: any;
  windowRef: any;
  test: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private win: WindowService
  ) {
    this.windowRef = this.win.windowRef;
    this.Collection = this.afs.collection<User>("newuser", ref =>
      ref.where("email", "==", "sreemadhukar@gmail.com")
    );
    this.test = this.Collection.snapshotChanges().subscribe(collecion => {
      this.test = collecion.map(doc => {
        return doc.payload.doc.data();
      });
    });

    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    console.log("madhukar");
    const provider = new auth.GoogleAuthProvider();

    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `newuser/${user.uid}`
    );
    const newUserRef: AngularFirestoreDocument<any> = this.afs.doc(
      `newuser/${user.uid}`
    );
    //delete
    console.log(this.test[0].email);
    //detele
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: { admin: false, user: true, technical: false },
      community: null
    };
    userRef.ref
      .get()
      .then(function(doc) {
        // console.log(doc.data().email);
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          newUserRef.set(data, { merge: true });
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  sendLoginCode(phoneNumber: any) {
    const appVerifier = this.windowRef.recaptchaVerifier;
    console.log("test");
    const num = phoneNumber;
    firebase
      .auth()
      .signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));
  }
  verifyLoginCode(verificationCode: any) {
    this.windowRef.confirmationResult
      .confirm(verificationCode)
      .then(result => {
        console.group(result.user);
        this.user = result.user;
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }
}
