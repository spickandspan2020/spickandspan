import { Component, OnInit } from "@angular/core";
import { AuthService } from "../core/auth.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"]
})
export class CustomerComponent implements OnInit {
  constructor(public Auth: AuthService) {}

  ngOnInit() {}
}
