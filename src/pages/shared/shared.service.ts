import { Loading } from 'ionic-angular';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class SharedService {
    loading;
    Url = 'http://api.moadii.com/search/UserNewReservation?lang=en';
    lang: any;

    constructor(public http: Http, public us: UserService, public loadingCtrl: LoadingController) { }

    showLoading() {
        this.lang = window.localStorage.getItem('lang');
        let content;
        if(this.lang == 'ar')
            content =  '... الرجاء الانتظار'
        else 
            content =  '... Loading'
        
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

    cancelReservation(obj){
        console.log(obj);
        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        this.us.showLoading();
        return this.http.post('http://api.moadii.com/account/CancelReservation', bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }
    getCountries(lang?) {
        if (lang)
            return this.http.get(`http://api.moadii.com/account/GetCountries?lang=${lang}`).map(res => res.json());
        else
            return this.http.get('http://api.moadii.com/account/GetCountries?lang=ar').map(res => res.json());
    }
    getCities(id, lang?) {
        if (lang)
            return this.http.get(`http://api.moadii.com/account/GetGovOfCountry?lang=${lang}&countryid=` + id).map(res => res.json());
        else
            return this.http.get('http://api.moadii.com/account/GetGovOfCountry?lang=ar&countryid=' + id).map(res => res.json());

    }
    getSpecialization(lang) {
        if (lang)
        return this.http.get(`http://api.moadii.com/search/GetSpecilaizationList?lang=${lang}`).map(res => res.json());
    }
    getDoctors(lang?) {
        if (lang)
        return this.http.get(`http://api.moadii.com/search/GetDoctors?lang=${lang}`).map(res => res.json());
        else 
          return this.http.get('http://api.moadii.com/search/GetDoctors?lang=ar').map(res => res.json());
        
    }
    getDoctorByID(id,lang) {
        return this.http.get(`http://api.moadii.com/search/GetDoctorByID?lang=${lang}&doctorId=`+id).map(res => res.json());
    }
    getStates(id, lang?) {
        if (lang)
            return this.http.get(`http://api.moadii.com/account/GetCitiesOfGov?lang=${lang}&govid=` + id).map(res => res.json());
        else 
            return this.http.get('http://api.moadii.com/account/GetCitiesOfGov?lang=ar&govid=' + id).map(res => res.json());
    }
    GetMedicalCaresList(hospitalID,lang){
    
        return this.http.get(`http://api.moadii.com/Search/GetMedicalCareByHospitalID?lang=${lang}&hospitalid=${hospitalID}`).map(res => res.json());
    }
    postNewReservation(obj) {
        console.log(obj);
        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        this.us.showLoading();
        return this.http.post(this.Url, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }
    getMoaiid(doctorID, date, dateTo) {
      //  this.showLoading();
        console.log("heree"+doctorID);
        return this.http.get('http://api.moadii.com/Search/GetDoctorAvailableDates?lang=ar&doctorId=' + doctorID + '&dateFrom=' + date + '&dateTo=' + dateTo + '&onlyFree=false&consultTime=0').map(res => res.json());
    }
    getReservedList(userID,lang) {
        console.log(lang);
        return this.http.get(`http://api.moadii.com/account/GetUpcomingReservations?lang=${lang}&userid=` + userID).map(res => res.json());
      
        
    }
    getHistoryReservations(userID,lang) {
       
        return this.http.get(`http://api.moadii.com/account/GetHistoryReservations?lang=${lang}&userid=` + userID).map(res => res.json());
      
        
    }
    getDoctorsReviews(id) {
        return this.http.get('http://api.moadii.com/search/GetDoctorReviews?doctorid=' + id + '&lang=ar').map(res => res.json());
    }
    getHospitalsReviews(id,lang) {
        return this.http.get(`http://api.moadii.com/Search/GetHospitalReviews?lang=${lang}&hospitalID=` + id).map(res => res.json());
    }
    getHospitalById(id,lang) {
        return this.http.get(`http://api.moadii.com/Search/gethospitalbyid?lang=${lang}&id=` + id).map(res => res.json());

    }
    getDoctorsOfHospitals(id,lang) {
        return this.http.get(`http://api.moadii.com/Search/GetDoctors?lang=${lang}&hospitalid=` + id).map(res => res.json());
    }
    forgetPassword(data){
         let bodyString = JSON.stringify(data);
         console.log(bodyString);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        this.showLoading();
        return this.http.post("http://api.moadii.com/Account/ForgotPassword", bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }
    
    /**
     * return a list contians contain the matched search query doctors
     * 
     * @param {any} name the name of the doctor 
     * @param {any} lang the languge of the api
     * @returns 
     * 
     * @memberOf SharedService
     */

     getDoctorByName(name,lang){

       return this.http.get('http://api.moadii.com/Search/GetDoctors?lang='+lang+'&doctorName=' + name)
            .map(res => res.json());
    }

     postUserReview(obj) {
        let bodyString = JSON.stringify(obj);
         console.log(bodyString);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, body: bodyString });
        this.showLoading();
        return this.http.post("http://api.moadii.com/Search/UserRating", bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'error'));
    }
}

interface Reservation {
    doctorName: string,
    price: number,
    Date: Date,
    DoctorID: number,
    AccountID: number,
    TimeFrom: string,
    TimeTo: string,
    MedicalCareID: number
}