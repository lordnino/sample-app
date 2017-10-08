import { HeaderPage } from './header/header';
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  imports: [  
    IonicPageModule.forChild(HeaderPage)
  ],
  declarations: [
      HeaderPage
  ],
  exports: [
      HeaderPage
  ]
})
export class ComponentsModule {
}