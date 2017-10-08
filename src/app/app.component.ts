import { UserService } from './../pages/shared/user.service';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController, App, AlertController, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any;
  userInfo: any;
  lang: any;
  userId: any;
  pages: Array<{ title: string, component: any, icon: string }>;
  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public translate: TranslateService,
    private config: Config,
    public storage: Storage,
    public us: UserService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    this.lang = window.localStorage.getItem('lang');
    console.log(this.lang);
    this.storage.get('user').then(userID => {
      this.userId = userID;
      console.log(this.userId);
      if (userID) {
        this.us.getUserDetails(userID, this.lang).subscribe(user => {
          this.us.user.Name = user.Data.Name;
          this.us.user.Email = user.Data.Email;
          this.us.user.CountryName = user.Data.CountryName;
          this.us.user.Mobile = user.Data.Mobile;
          this.us.user.CityName = user.Data.CityName
          this.us.user.ID = userID;
          this.us.user.ConfirmationDate = user.Data.ConfirmationDate;
          this.us.user.IsMobileConfirmed = user.Data.IsMobileConfirmed;
          if (user.Data.IsMobileConfirmed === false) this.rootPage = 'SmsConfirmPage';
          else this.rootPage = 'TabsPage';
        })
      } else {
        this.rootPage = 'EntryPage';
      }
    })

    this.pages = [
      // { title: "Login/Register", component: EntryPage, icon: 'person' },
      { title: "Profile", component: 'ProfilePage', icon: 'person' },
      { title: "Moadii offers", component: 'MoadiOffersPage', icon: 'logo-usd' },
      // { title: "Change language", component: ChangeLanguages, icon: 'information' },
      { title: "Who we are", component: 'WhoWeArePage', icon: 'alert' },
      { title: "Contact us", component: 'ContactUsPage', icon: 'mail' },
      // { title: "Logout", component: LogOut, icon: 'information-circle' },
    ];

    this.initTranslate();
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    if(page == 'EntryPage') this.app.getRootNav().setRoot('EntryPage');
    else this.nav.push(page.component);
  }

  changeDir() {
    console.log('change dir fired');
    var initialHref = window.location.href;
    this.splashScreen.show();
    // Reload original app url (ie your index.html file)
    window.location.replace(initialHref)
    // this.platform.init()
    this.splashScreen.hide();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    // this.translate.setDefaultLang('en');
    // this.platform.setDir('rtl', true);
    if (window.localStorage.getItem("lang")) {
      this.translate.use(window.localStorage.getItem("lang"));
      if (window.localStorage.getItem("lang") == 'en') {
        this.platform.setDir("ltr", true);
      } else {
        this.platform.setDir("rtl", true);
      }
    } else {
      this.translate.use('ar'); // Set your language here
      this.platform.setDir("rtl", true);
      console.log(this.translate.currentLang);
      window.localStorage.setItem("lang", this.translate.currentLang)
    }

    // this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
    //   this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    // });
  }

  changeLanguage(){
    this.lang = window.localStorage.getItem('lang');
    if(this.lang == 'ar'){
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.translate.reloadLang('en');
      this.changeDir();
      window.localStorage.setItem('lang', 'en');
      this.platform.setDir("ltr", true);
      this.nav.setRoot('TabsPage');
    }else{
      this.translate.setDefaultLang('ar');
      this.translate.use('ar');
      this.translate.reloadLang('ar');
      this.changeDir();
      window.localStorage.setItem('lang', 'ar');
      this.platform.setDir("rtl", true);
      this.nav.setRoot('TabsPage');
    }
  }
}

