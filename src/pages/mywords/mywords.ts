import { Component } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';
//import {HTTP, NativeAudio} from 'ionic-native';
import { EmailComposer } from 'ionic-native';
import { NavController, Alert, LoadingController, ToastController  } from 'ionic-angular';
import { CambridgeDictionary } from '../../services/dictionary-cambridge';
import { StringLib } from '../../services/stringlib';
import { common } from '../../services/common';
import $ from "jquery";
import { WordBox } from '../../services/wordbox';
import { MainPage } from '../../pages/main/main';
import { Word } from '../../services/word-model';


 
@Component({
  selector: 'page-mywords',
  templateUrl: 'mywords.html'
})
export class MyWordsPage {
  wordbox:WordBox;  
  dates: Array<{date: string, collapse: boolean}>;
  emailAvailable: boolean = false;

  presentToast(m: string) {
    let toast = this.toastCtrl.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }  

  constructor(public nav: NavController, public toastCtrl: ToastController) {
    this.wordbox = WordBox.getWordBox();
    var alldates = this.wordbox.getDates();
    this.dates = [];
    common.each(alldates, (d)=>{
      if (d != common.dateToString(new Date()))
        this.dates.push({date: d, collapse: true});
      else
        this.dates.push({date: d, collapse: false});
    });

    /*
    EmailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
        this.emailAvailable = true;
      }
    });
    */
  }

  openWord(wd: Word){
    this.nav.push(MainPage, {"word": wd.word});
  }

  expandDate(date: any){
    date.collapse = !date.collapse;
  }

  isToday(date: any): boolean{
    return date.date == common.dateToString(new Date());
  }

  emailMe(){
    var s = "";
    common.each(this.wordbox.savedWords, (w: Word)=>{
      s += w.word + "\n";
    });
    alert(s);
    /*
    try{
      let email = {
        to: 'thainam83vn@gmail.com',
        subject: 'Word Study - My words',
        body: JSON.stringify(this.wordbox.savedWords),
        isHtml: true
      };

      // Send a text message using default options
      EmailComposer.open(email);
      this.presentToast("Email sent, please check your inbox.");
    } catch(ex){
      this.presentToast(ex);
    }
    */
    
  }
}