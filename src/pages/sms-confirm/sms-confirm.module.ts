import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsConfirmPage } from './sms-confirm';

@NgModule({
  declarations: [
    SmsConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(SmsConfirmPage),
  ],
})
export class SmsConfirmPageModule {}
