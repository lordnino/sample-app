import { SplashScreen } from '@ionic-native/splash-screen';
import { UserService } from '../shared/user.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {

  lang: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public splashScreen: SplashScreen,
    public platform: Platform
  ) {
    this.lang = window.localStorage.getItem("lang");
    if (this.lang == 'ar') this.translate.use('ar');
    else this.translate.use('en');
  }

  ionViewDidLoad() {
    if (document.querySelector(".tabbar"))
      document.querySelector(".tabbar")['style'].display = 'none';
    console.log('ionViewDidLoad EntryPage');
  }

  skip() {
    if (document.querySelector(".tabbar"))
      document.querySelector(".tabbar")['style'].display = 'flex';

    this.navCtrl.setRoot('TabsPage');
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignUpPage');
  }

  changeLang(){
    if(this.lang == 'ar'){
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.translate.reloadLang('en');
      this.platform.setDir("ltr", true);
      window.localStorage.setItem('lang', 'en');
      console.log(window.localStorage.getItem('lang'));
      this.changeDir();
      this.lang = 'en';
    }else{
      this.translate.setDefaultLang('ar');
      this.translate.use('ar');
      this.translate.reloadLang('ar');
      this.platform.setDir("rtl", true);
      window.localStorage.setItem('lang', 'ar');
      console.log(window.localStorage.getItem('lang'));
      this.changeDir();
      this.lang = 'ar';
    }
  }

  changeDir(){
    var initialHref = window.location.href;
    this.splashScreen.show();
    // Reload original app url (ie your index.html file)
    window.location.replace(initialHref)
    // this.platform.init()
    this.splashScreen.hide();
  }

}
