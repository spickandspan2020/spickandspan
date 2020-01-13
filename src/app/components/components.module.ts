import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { ComponentsRoutingModule } from "./components-routing.module";
import { ComponentsComponent } from "./components.component";
import { RegistrationComponent } from "./registration/registration.component";
import { NavCardComponent } from "../common-components/nav-card/nav-card.component";
import { MainCardComponent } from "../common-components/main-card/main-card.component";
import { environment } from "../../environments/environment";

@NgModule({
  declarations: [
    ComponentsComponent,
    RegistrationComponent,
    NavCardComponent,
    MainCardComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    MatIconModule,
    FormsModule
    // ,
    // AngularFireModule.initializeApp(environment.firebaseConfig)
  ]
})
export class ComponentsModule {}
