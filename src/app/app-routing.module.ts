import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/home.module").then(m => m.HomeModule)
  },
  {
    path: "customer",
    loadChildren: () =>
      import("./customer/customer.module").then(m => m.CustomerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
