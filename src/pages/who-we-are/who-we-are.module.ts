import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhoWeArePage } from './who-we-are';

@NgModule({
  declarations: [
    WhoWeArePage,
  ],
  imports: [
    IonicPageModule.forChild(WhoWeArePage),
  ],
})
export class WhoWeArePageModule {}
