import { CambridgeDictionary } from './dictionary-cambridge';
import $ from "jquery";
import { common } from './common';
import { Storage } from '@ionic/storage';
import { Word, WordEntry } from './word-model';
import { Verbs, Verb } from './verb';
import { WordList } from './word-list';
import { IWeb } from './iweb';
import { WebAjax } from './webajax';
import { IWordServer } from './iwordserver';
import { WordServerPhone } from './WordServerPhone';


export class WordBox {
    url: string = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Fdictionary.cambridge.org%2Fus%2Fdictionary%2Fenglish%2F";
    //urlServer: string = "http://54.187.239.131:3000";
    urlServer: string = "http://localhost:3000";
    userId: string = "tranthainam";
    words: Word[] = [];
    word: Word;
    savedWords: Word[] = [];
    verbs: Verbs;
    wordserver: IWordServer;

    static instance: WordBox;

    static getWordBox():WordBox{
        if (WordBox.instance == null)
            WordBox.instance = new WordBox(new WordServerPhone(new WebAjax()));
        return WordBox.instance;
    }

    constructor(wordserver: IWordServer){
        try{
            this.getWordsFromStore();
        }catch(ex){
            console.log("Error getting data from local store.");
        }
        this.verbs = Verbs.getVerbs();
        this.wordserver = wordserver;
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
        console.log(this.savedWords);
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
        //self.url + w.toLowerCase() + "%27"
        self.wordserver.browse(w, callback, errorCallback);
        // self.web.getDataType(self.url + w.toLowerCase() + "%27", "html", (data)=>{
        //     //console.log("data", data);
        //     var dic = new CambridgeDictionary();
        //     var entry = dic.parse(data);
        //     callback(entry);
        // }, (err)=>{
        //     errorCallback(err);
        // });
        // $.ajax({
        //     url:self.url + w.toLowerCase() + "%27",
        //     dataType: "html",
        //     success: function(data){
        //         //console.log(data);
        //         var dic = new CambridgeDictionary();
        //         var entry = dic.parse(data);
        //         callback(entry);
        //     },
        //     error: function(error){
        //         errorCallback(error);
        //     }
        // });
    }

    syncToServer(callback: any, errorCallback: any){
        var self = this;
        self.wordserver.postWords(self.savedWords, (data)=>{
            callback(data);
        }, (err)=>{
            errorCallback(err);
        });
        // self.web.post(self.urlServer+ "/" + this.userId,self.savedWords, (data)=>{
        //     callback(data);
        // }, (err)=>{
        //     errorCallback(err);
        // });
        // $.ajax({
        //     url:self.urlServer+ "/" + this.userId,
        //     method:"POST",
        //     data: {body: self.savedWords},
        //     success: function(data){
        //         callback(data);
        //     },
        //     error: function(error){
        //         errorCallback(error);
        //     }
        // });
    }

    queueWords: string[];

    addWordFromCurrentQueue(){
        var self = this;
        if (self.queueWords.length > 0){
            // var w = self.queueWords[0];
            // self.addWord(w, (word: Word)=>{
            //     word.saved = true;
            //     self.queueWords.splice(0, 1);
            //     self.addWordFromCurrentQueue();
            // }, (error)=>{
            //     console.log("Error: ", error);
            // });

            setTimeout(()=>{
                var w = self.queueWords[0];
                console.log(w);
                self.addWord(w, (word: Word)=>{
                    //word.saved = true;
                    if (word != null)
                        self.saveWord(word);
                    self.queueWords.splice(0, 1);
                    console.log(word);
                    //console.log(self.queueWords);
                    //self.syncToStore();
                    self.addWordFromCurrentQueue();
                    
                }, (error)=>{
                    console.log("Error: ", error);
                });
            }, 2000);
        }
    }

    syncFromServer(callback: any, errorCallback: any){
        var self = this;
        self.wordserver.getWords((data)=>{
            console.log(data);
            if (data[0].words != null){
                var sjson = JSON.stringify(data[0].words);
                window.localStorage.setItem("words", sjson);
                self.getWordsFromStore();
            } 
            else if (data[0].unsavedwords != null){
                self.queueWords = data[0].unsavedwords;
                self.addWordFromCurrentQueue();                
            }
        }, (err)=>{
            errorCallback(err);
        });
        // self.web.get(self.urlServer + "/" + this.userId, (data)=>{
        //     console.log(data);
        //     if (data[0].words != null){
        //         var sjson = JSON.stringify(data[0].words);
        //         window.localStorage.setItem("words", sjson);
        //         self.getWordsFromStore();
        //     } 
        //     else if (data[0].unsavedwords != null){
        //         self.queueWords = data[0].unsavedwords;
        //         self.addWordFromCurrentQueue();                
        //     }
        // }, (err)=>{
        //     errorCallback(err);
        // });

        // $.ajax({
        //     url:self.urlServer + "/" + this.userId,
        //     method:"GET",
        //     success: function(data){
        //         console.log(data);
        //         if (data[0].words != null){
        //             var sjson = JSON.stringify(data[0].words);
        //             window.localStorage.setItem("words", sjson);
        //             self.getWordsFromStore();
        //         } 
        //         else if (data[0].unsavedwords != null){
        //             self.queueWords = data[0].unsavedwords;
        //             self.addWordFromCurrentQueue();
                    
        //         }
        //     },
        //     error: function(error){
        //         errorCallback(error);
        //     }
        // });
    }

    postWordToServer(word: string, entry: any, callback: any, errorCallback: any){
        var self = this;
        console.log("save ", word, " to server");
        self.wordserver.post(word, entry, callback, errorCallback);
        // self.web.post(self.urlServer+ "/admin/" + word, entry, (data)=>{
        //     callback(data);
        // }, (err)=>{
        //     errorCallback(err);
        // });
        // $.ajax({
        //     url:self.urlServer+ "/admin/" + word,
        //     method:"POST",
        //     data: {body: entry},
        //     success: function(data){
        //         callback(data);
        //     },
        //     error: function(error){
        //         errorCallback(error);
        //     }
        // });
    }

    getWordFromServer(word: string, callback: any, errorCallback: any){
        var self = this;
        self.wordserver.get(word, callback, errorCallback);
        // self.web.get(self.urlServer+ "/admin/" + word, (data)=>{
        //     callback(data);
        // }, (err)=>{
        //     errorCallback(err);
        // });
        // $.ajax({
        //     url:self.urlServer+ "/admin/" + word,
        //     method:"GET",
        //     success: function(data){
        //         callback(data);
        //     },
        //     error: function(error){
        //         errorCallback(error);
        //     }
        // });
    }

    scrappingWords: string[] = null;
    scrapCount: number = 0;
    scrapFailCount: number = 0;
    scrapWords(){       
        var self = this;
        if (this.scrappingWords == null){
            this.scrappingWords = WordList.getList();
            this.scrapCount = 0;
            this.scrapFailCount = 0;
            while (this.scrappingWords.length > 0 && this.scrappingWords[0] != 'trineural'){
               console.log('skip ', this.scrappingWords[0]);
               this.scrappingWords.splice(0,1);               
            }
        }
        console.log(self.scrappingWords);
        if (self.scrappingWords.length > 0){            
            var word = this.scrappingWords[0];
    
            console.log("Total fails:", this.scrapFailCount, "/", this.scrapCount , " ", word);
            this.wordserver.log("Total fails:"+ this.scrapFailCount+ "/"+ this.scrapCount + "   browsing " + word);

            this.scrappingWords.splice(0, 1);
            if (word == ''){
                self.scrapWords();
            } else {
                self.getWordFromServer(word, (entry)=>{
                    if (entry.length > 0){
                        console.log(word, " already existed!");
                        self.scrapWords();
                    } else {
                        console.log("scrapping ", word, " from remote source!");
                        self.scrapWordFromRemote(word);
                    }
                }, (error)=>{
                    console.log(error);
                    self.scrapWordFromRemote(word);
                });
            }
            
        }
    }

    private scrapWordFromRemote(word: string){
        var self = this;
        this.browseWord(word, (entry)=>{
            console.log("scrapped result: ", word, entry);
            if (entry != null && entry.length > 0){
                self.postWordToServer(word, entry, ()=>{
                }, (error)=>{
                    console.log(error);
                });
            } else {
                this.scrapFailCount++;
            }
            this.scrapCount++;
            setTimeout(function(){
                self.scrapWords();
            }, 5000);
        }, (error)=>{
            setTimeout(function(){
                self.scrapWords();
            }, 5000);
        });
    }
}
