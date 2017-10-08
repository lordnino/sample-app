import { Storage } from '@ionic/storage';
import { UserService } from './../shared/user.service';
import { SharedService } from './../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  lang: string;
  user = {
    Email: "",
    Password: ""
  }

  constructor(
    public translate: TranslateService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public ss: SharedService,
    public us: UserService,
    public storage: Storage
  ) {
    this.lang = window.localStorage.getItem('lang');
    if(this.lang  == 'ar') translate.use('ar');
    else translate.use('en');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.lang = window.localStorage.getItem('lang');
    if(this.lang  == 'ar') this.translate.use('ar');
    else this.translate.use('en');
  }

  login() {
    this.navCtrl.setRoot('TabsPage')
  }

  signup() {
    this.navCtrl.push('SignUp');
  }

  presentAlert(msg) {
    let text = {
      errorTitle: '',
      cancel: ''
    }
    if(this.lang == 'en'){
      text.errorTitle = "SomeThing Wrong Happend";
      text.cancel = "Cancel";
    }else{
      text.errorTitle = "حدث خطأ";
      text.cancel = "إلغاء";
    }
    let alert = this.alertCtrl.create({
      title: text.errorTitle,
      subTitle: msg,
      buttons: [text.cancel]
    });
    alert.present();
  }
  
  forgetPassword() {
    this.presentPrompt();
  }

  presentPrompt() {
    let text = {
      forgotPwdTitle: '',
      email: '',
      cancel: '',
      send: ''
    }
    if(this.lang = 'en'){
      text.cancel = "Cancel";
      text.forgotPwdTitle = "Reset password";
      text.email = "Email";
      text.send = "Send";
    }else{
      text.cancel = "إلغاء";
      text.forgotPwdTitle = "إعادة إرسال كلمة السر";
      text.email = "البريد اﻹكترونى";
      text.send = "إرسال";
    }
    let alert = this.alertCtrl.create({
      title: text.forgotPwdTitle,
      inputs: [
        {
          name: 'Email',
          placeholder: text.email
        }
      ],
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: text.send,
          handler: data => {
            this.ss.forgetPassword(data).subscribe(confirmation => {
              if (confirmation.Success) {
                console.log(confirmation)
                this.ss.dismissLoading();
                this.showAlertMessage(confirmation.Message)
              } else {
                console.log(confirmation)
                this.ss.dismissLoading();
                this.showAlertMessage(confirmation.Message)
              }
            })
          }
        }
      ]
    });
    alert.present();
  }
  
  showAlertMessage(msg) {
    let text = {
      cancel : '',
      message: ''
    }
    if(this.lang == 'en') {
      text.cancel = 'Cancel';
      text.message = 'Message';
    }
    else {
      text.cancel = 'إالغاء';
      text.message = 'رسالة';
    }
    let alert = this.alertCtrl.create({
      title: text.message,
      subTitle: msg,
      buttons: [text.cancel]
    });
    alert.present();
  }

  logForm() {
    this.us.getUser(this.user).subscribe(success => {
      this.us.dismissLoading();
      console.log(success.Message);
      if (success.Success) {
        this.storage.set("user", success.Message);
        this.us.getUserDetails(success.Message,this.lang).subscribe(user => {
          this.us.user.Name = user.Data.Name;
          this.us.user.Email = user.Data.Email;
          this.us.user.CountryName = user.Data.CountryName;
          this.us.user.Mobile = user.Data.Mobile;
          this.us.user.CityName = user.Data.CityName
          this.us.user.GovName = user.Data.GovName
          this.us.user.ID = success.Message;
          this.us.user.ConfirmationDate = user.Data.ConfirmationDate;
          this.us.user.IsMobileConfirmed = user.Data.IsMobileConfirmed;
          if (user.Data.PhotoUrl != "")
            this.us.user.profilePictureurl = user.Data.PhotoUrl;

          if (document.querySelector(".tabbar"))
            document.querySelector(".tabbar")['style'].display = 'flex';
          this.navCtrl.setRoot('TabsPage')
          this.us.getUserNotificationsService();
        })

      } else {
        this.presentAlert(success.Message);
      }
    })
  }

}
