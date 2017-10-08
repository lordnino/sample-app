import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HospitalsPage } from './hospitals';

@NgModule({
  declarations: [
    HospitalsPage,
  ],
  imports: [
    IonicPageModule.forChild(HospitalsPage),
  ],
})
export class HospitalsPageModule {}
