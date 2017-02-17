import { Component } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, Alert, LoadingController, ToastController,NavParams } from 'ionic-angular';
import { CambridgeDictionary } from '../../services/dictionary-cambridge';
import { StringLib } from '../../services/stringlib';
import { common } from '../../services/common';
import $ from "jquery";
import { WordBox } from '../../services/wordbox';
import { WordList } from '../../services/word-list';
import { WordTree } from '../../services/word-tree';
import { OrderByWordPipe } from '../../services/orderby-word';
import { MyWordsPage } from '../../pages/mywords/mywords';
import { Verbs, Verb } from '../../services/verb';


 
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  word: string = "";  
  entries: any;
  message: string = "message here";
  wordtree: WordTree;
  wordbox:WordBox;  
  verbs: Verbs;
  
  typing: boolean = false;
  searchwords: string[] = [];



  presentToast(m: string) {
    let toast = this.toastCtrl.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }
 
  constructor(public nav: NavController,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private navParams: NavParams) {
    var self = this;
    this.wordbox = WordBox.getWordBox();
    if (navParams.get("word") != null){
      this.word = navParams.get("word");
      this.search();
    }

    this.wordtree = WordTree.getWordTree();
    this.verbs = Verbs.getVerbs();
    //console.log(WordTree.getTree());
  }

  wordClick(w) {
    this.word = w;
    this.search();
  }

  playSound(file) {
    var self = this;
    var audio = new Audio(file);
    audio.play();
  }

  search(){
    this.typing = false;   
    var self = this;
    if (self.word == "")
      return;

    var loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    self.word = StringLib.removeSpecialCharactors(self.word);
    loader.present();
    this.wordbox.addWord(self.word, (newword)=>{
      //self.entries = newword.json;
      
      loader.dismiss();
      if (newword == null)
        self.presentToast("Nothing found for " + self.word);
      self.word = "";
    }, (error)=>{
      self.message = "ERROR:" + error;
      loader.dismiss();
    });
  }

  searchWord(item){
    this.word = item.text;
    this.search();  
  }  

  wordKeyup(event){
    
    this.typing = true;
    this.searchwords = this.wordtree.search(this.word.toLowerCase());    
    //alert(JSON.stringify(this.searchwords));
  }

  removeHighlightText(s: string):string{
    return s.substr(this.word.length, s.length - this.word.length);
  }

  review(){
    this.nav.push(MyWordsPage);
  }
}