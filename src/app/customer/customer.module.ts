import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomerComponent } from "./customer.component";
import { PreviousOrderDetailsCardComponent } from "../common-components/previous-order-details-card/previous-order-details-card.component";

@NgModule({
  declarations: [CustomerComponent, PreviousOrderDetailsCardComponent],
  imports: [CommonModule, CustomerRoutingModule]
})
export class CustomerModule {}
