import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { WordBox } from '../../services/wordbox';
import { Word } from '../../services/word-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wordbox: WordBox;

  constructor(public navCtrl: NavController) {
    this.wordbox = WordBox.getWordBox();
    this.wordbox.browseWord("cuff", (entries)=>{
      alert(JSON.stringify(entries));
    }, null);
  }

}
