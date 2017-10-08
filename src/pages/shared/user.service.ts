import { TranslateService } from '@ngx-translate/core';
import { Content, Loading } from 'ionic-angular/es2015';
import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class UserService {

    lang: string;
    
    private url = "http://api.moadii.com/account/Userlogin";
    
    private postUrl = "http://api.moadii.com/account/Register?lang=en"
    id = 0;

    public user = {
        Name: "",
        Email: "",
        CountryName: "",
        Mobile: "",
        CityName: "",
        ID: 0,
        GovName: "",
        userName: "",
        profilePictureurl: "assets/img/user.png",
        ConfirmationDate: "",
        IsMobileConfirmed: true
    }
    constructor(private localNotifications: LocalNotifications,
        public http: Http, public storage: Storage,
        public loadingCtrl: LoadingController, private translate: TranslateService) {
        this.lang = window.localStorage.getItem("lang");
        this.lang  = this.lang == 'ar' ? 'ar' : 'en';
        this.updateUser();

    }
    loading = null;
    logedin;
    /**
     *  
     *  use inside other providers during Before the HTTP call
     * 
     * 
     * @memberOf UserService
     */
    showLoading() {
        let content
        if(this.lang == 'ar') content =  '... الرجاء الانتظار'
        else content =  '... Loading'
        
        if (!this.loading) {
            this.loading = this.loadingCtrl.create({
                content: content
            });
            this.loading.present();
        }
        setTimeout(this.dismissLoading(), 70000);
    }

    /**
     * use in the component inside the subscibe method
     * 
     * 
     * @memberOf UserService
     */
    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

    getNotifications(title, text, time) {
        this.id++;
        console.log("TIME IS :")
        console.log(time)
        let notification = {
            id: this.id,
            title: title,
            text: text,
            at: time,
            icon: 'res://drawable/icon.png',
            led: "FF0000",
            smallIcon: 'res://drawable/icon.png'
        };
        console.log(notification);
        this.localNotifications.schedule(notification);
    }
    
    getUserNotificationsService() {
        this.http.get('http://api.moadii.com/account/GetUpcomingReservations?lang=ar&userid=' + this.user.ID).map(res => res.json()).subscribe(reserved => {
            this.getUserNotifications(reserved.Data);
        }
        )
    }

    getUserNotifications(reservedList) {
        reservedList.forEach(element => {
            let currentDate = new Date();
            let substring = element.TimeFrom.split(':');
            let j = 1;
            for (let i = 0; i < 3; i++) {
                console.log(substring)
                let date = new Date(element.Date).setHours((substring[0]));
                console.log('date: ' + element.Date)
                console.log(date);
                date = date - ((i + j) * (60 * 60) * 1000);
                console.log(date);
                if (currentDate.getMilliseconds() < date) {
                    console.log(element.TimeFrom)
                    this.getNotifications('مرحبا ' + this.user.Name, 'نذكرك بموعد الحجز  ...' + ' الساعة ' + element.TimeFrom + '  في مستشفي' + element.HospitalName, date);
                } if (i == 1) { j += 2 } else {
                    j += 3;
                }
            }
        });
    }
    
    newNotification(datee, TimeFrom, HospitalName) {
        let currentDate = new Date();
        let substring = TimeFrom.split(':');
        let j = 1;
        for (let i = 0; i < 3; i++) {
            console.log(substring)
            let date = new Date(datee).setHours((substring[0]));
            console.log('date: ' + Date)
            console.log(date);
            date = date - ((i + j) * (60 * 60) * 1000);
            console.log(date);
            if (currentDate.getMilliseconds() < date) {
                console.log(TimeFrom)
                this.getNotifications('مرحبا ' + this.user.Name, 'نذكرك بموعد الحجز  ...' + ' الساعة ' + TimeFrom + ' في ' + HospitalName, date);
            } if (i == 1) { j += 2 } else {
                j += 3;
            }
        }
    }

    getUser(obj) {
        this.showLoading();
        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        console.log(bodyString)
        return this.http.post(this.url, obj, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }

    /**
     *  sends a post request to server to update user password
     * 
     * @param {any} oldPwd 
     * @param {any} newPwd 
     * @returns 
     * 
     * @memberOf UserService
     */
    
     userChangePWD(oldPwd, newPwd) {
        let obj = {
            "ID": this.user.ID,
            "OldPassword": oldPwd,
            "Password": newPwd
        }

        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        console.log(bodyString)
        return this.http.post("http://api.moadii.com/Account/UserChangePWD", obj, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));

    }

    getUserDetails(id, lang) {
        return this.http.get(`http://api.moadii.com/account/GetUserDetails?lang=${lang}&userID=` + id)
            .map(res => res.json());
    }
    
    postUser(obj) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.postUrl, obj, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error || 'error'));
    }
    
    confirmMobileCode(code) {
        let obj = {
        }

        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });

        return this.http.post(`http://api.moadii.com/Account/ConfirmMobileCode?accountId=${this.user.ID}&mobileCode=${code}`, options)
            .map(res => res.json());


    }

    updateUserDetails(userobj) {
        //this.showLoading();
        let bodyString = JSON.stringify(userobj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        return this.http.post("http://api.moadii.com/Account/EditUserDetails", userobj, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }
    
    resendMobileCode() {
        let obj = {
        }

        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });

        return this.http.post(`http://api.moadii.com/Account/ResendMobileCode?accountId=${this.user.ID}    `, options)
            .map(res => res.json());
    }
    
    uploadPicture(imgdata, ID) {
        this.showLoading();
        let imgobject = {
            "UserID": ID,
            "Image": imgdata
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let bodyString = JSON.stringify(imgobject);
        let options = new RequestOptions({ headers: headers, body: bodyString });

        return this.http.post("http://api.moadii.com/Account/UploadUserProfileImage", imgobject, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }
    
    /**
     * Get the user data from the server
     * 
     * 
     * @memberOf UserService
     * 
     */
    
     updateUser() {
        this.storage.get("username").then(username => {
            this.user.userName = username;
            this.logedin = true;
        })
        this.storage.get('user').then(userID => {
            if (userID) {
                this.logedin = true;
                this.getUserDetails(userID, this.lang).subscribe(user => {
                    this.user.Name = user.Data.Name;
                    this.user.Email = user.Data.Email;
                    this.user.CountryName = user.Data.CountryName;
                    this.user.Mobile = user.Data.Mobile;
                    this.user.CityName = user.Data.CityName
                    this.user.GovName = user.Data.GovName
                    this.user.ID = userID;
                    this.user.ConfirmationDate = user.Data.ConfirmationDate;
                    this.user.IsMobileConfirmed = user.Data.IsMobileConfirmed;
                    if (user.Data.PhotoUrl != "http://api.moadii.com/uploads/accounts/")
                        this.user.profilePictureurl = user.Data.PhotoUrl;
                })
            }
        })
    }
}

interface User {
    UserName: string,
    password: string
}