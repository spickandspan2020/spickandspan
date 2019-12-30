import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-price-list-table",
  templateUrl: "./price-list-table.component.html",
  styleUrls: ["./price-list-table.component.scss"]
})
export class PriceListTableComponent implements OnInit {
  priceList: any;
  tabflag: any;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      "rupee",
      sanitizer.bypassSecurityTrustResourceUrl("../assets/rupee.svg")
    );
    this.priceList = [
      {
        header: "Men",
        icon: "men",
        children: [
          {
            title: "Shirt",
            icon: "shirt",
            price: "5"
          },
          {
            title: "Pant",
            icon: "pant",
            price: "6"
          }
        ]
      },
      {
        header: "Women",
        icon: "women",
        children: [
          {
            title: "Shirt",
            icon: "shirt",
            price: "5"
          },
          {
            title: "pant",
            icon: "shirt",
            price: "4"
          }
        ]
      },
      {
        header: "Kids",
        icon: "kid",
        children: [
          {
            title: "Shirt",
            icon: "shirt",
            price: "5"
          },
          {
            title: "pants",
            icon: "shirt",
            price: "3"
          },
          {
            title: "short",
            icon: "short",
            price: "3.5"
          }
        ]
      }
    ];
  }

  ngOnInit() {
    this.tabflag = {
      laundry: true,
      iron: false,
      dryclean: false
    };
  }

  tabselection(value: any) {
    console.log(value);
    if (value === "laundry") {
      this.tabflag = {
        laundry: true,
        iron: false,
        dryclean: false
      };
    } else if (value === "dryclean") {
      this.tabflag = {
        laundry: false,
        iron: false,
        dryclean: true
      };
    } else if (value === "iron") {
      this.tabflag = {
        laundry: false,
        iron: true,
        dryclean: false
      };
    }
  }
}
