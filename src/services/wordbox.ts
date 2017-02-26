import { CambridgeDictionary } from './dictionary-cambridge';
import $ from "jquery";
import { common } from './common';
import { Storage } from '@ionic/storage';
import { Word, WordEntry } from './word-model';
import { Verbs, Verb } from './verb';


export class WordBox {
    url: string = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Fdictionary.cambridge.org%2Fus%2Fdictionary%2Fenglish%2F";
    words: Word[] = [];
    word: Word;
    savedWords: Word[] = [];
    verbs: Verbs;

    static instance: WordBox;

    static getWordBox():WordBox{
        if (WordBox.instance == null)
            WordBox.instance = new WordBox();
        return WordBox.instance;
    }

    constructor(){
        this.getWordsFromStore();
        this.verbs = Verbs.getVerbs();
    }    

    getTodayWords(): Word[]{
        var today = common.dateToString(new Date());
        var result = [];
        for(var i = 0; i < this.savedWords.length; i++){
            var w = this.savedWords[i];
            var sd = w.datetime;
            if (today == sd){
                result.push(w);
            } 
        }
        return result;
    }

    getDates():string[] {
        var dates = [];
        var d = null;
        for(var i = 0; i < this.savedWords.length; i++){
            var w = this.savedWords[i];
            var sd = w.datetime;
            if (d == null || d != sd){
                d = sd;
                dates.push(d);
            } 
        }
        return dates;
    }

    getSavedWordsByDate(d: string): Word[]{
        var words = [];
        common.each(this.savedWords, (wd: Word)=>{
            if (d == wd.datetime){
                words.push(wd);
            }
        });
        words.sort((a: Word, b: Word)=>{
            if (a.word.toLowerCase() < b.word.toLowerCase()) {
                return -1;
            } else if (a.word.toLowerCase() > b.word.toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });
        return words;
    }

    getWordsFromStore(){
        var sjson = window.localStorage.getItem("words");
        if (sjson != null)
            this.savedWords = JSON.parse(sjson);
        else 
            this.savedWords = [];
    }

    syncToStore(){
        var sjson = JSON.stringify(this.savedWords);
        window.localStorage.setItem("words", sjson);
    }

    getWord(w: string):Word{
        if (this.words != null){
            for(var i = 0; i < this.words.length; i++)
                if (this.words[i].word == w)
                    return this.words[i];
        }
        return null;
    }

    getSavedWord(w: string):Word{
        if (this.savedWords != null){                
            for(var i = 0; i < this.savedWords.length; i++)
                if (this.savedWords[i].word == w){
                    return this.savedWords[i];
                }
        }                            
        return null;
    }

    saveWord(word: Word){
        word.saved = !word.saved;
        if (word.saved){
            word.datetime = common.dateToString(new Date());
            common.arrayPushNoDuplicate(this.savedWords, word);
        } else {
            this.savedWords = common.arrayRemove(this.savedWords, word);
        }

        //window.localStorage.setItem("words", word.word);
        //this.wordStore.set("words", word.word);
        //alert("Save " + word.word);
        this.syncToStore();
    }



    selectWord(word: Word){
        this.word = word;
    }

    removeWord(wd: Word){
        var newwords = [];
        for(var i = 0; i < this.words.length; i++)
            if (this.words[i].word != wd.word)
                newwords.push(this.words[i]);
        this.words = newwords;
        var w = this.getWord(this.word.word);
        if (w == null){
            if (this.words.length > 0)
                this.word = this.words[0];
        }
    }
    
    addWord(w: string, callback: any, errorCallback){
        var found = this.getWord(w);
        if (found == null){
            found = this.getSavedWord(w);
            if (found != null)
                common.arrayPushNoDuplicate(this.words, found);
        }
        if (found == null){
            this.browseWord(w, (entry: WordEntry[])=>{
                if (entry.length > 0){
                    var newword = new Word(w, entry);
                    common.each(entry, (e: WordEntry)=>{
                        if (e.type == "verb"){
                            e.verb = this.verbs.getVerb(w, e.pronunc.uk.text);
                        }
                    });                                      
                    this.words.push(newword);
                    this.word = newword;   
                    if (callback != null) callback(newword);
                } else {
                    //check verb
                    var inf = this.verbs.find(w);
                    if (inf != null){
                        this.addWord(inf, (newword)=>{
                            if (callback != null) callback(newword);
                        }, null);
                    } else {
                        if (callback != null) callback(null);
                    }
                }
            }, (error)=>{
                if (errorCallback != null) errorCallback(error);
                console.log(error);
            });
             
        } else {
            this.word =found;
            if (callback != null) callback(found);
        }
        
    };

    browseWord(w: string, callback: any, errorCallback: any){
        var self = this;
        $.ajax({
            url:self.url + w.toLowerCase() + "%27",
            dataType: "html",
            success: function(data){
                console.log(data);
                var dic = new CambridgeDictionary();
                var entry = dic.parse(data);
                callback(entry);
            },
            error: function(error){
                errorCallback(error);
            }
        });
    }
}