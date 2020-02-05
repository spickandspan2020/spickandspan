import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { HeaderComponent } from "./header/header.component";
import { PriceListTableComponent } from "../common-components/price-list-table/price-list-table.component";
import { RegistrationCardComponent } from "../common-components/registration-card/registration-card.component";
import { LoadingScreenComponent } from "../common-components/loading-screen/loading-screen.component";

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    PriceListTableComponent,
    RegistrationCardComponent,
    LoadingScreenComponent
  ],
  imports: [CommonModule, HomeRoutingModule, MatIconModule, FormsModule]
})
export class HomeModule {}
