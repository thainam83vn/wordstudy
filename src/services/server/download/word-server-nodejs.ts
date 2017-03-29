import { IWordServer } from '../../iwordserver';
import { IWeb } from '../../iweb';
import { WebNodeJs } from './web-nodejs';
import { CambridgeDictionary } from '../../dictionary-cambridge';

export class WordServerNodeJs implements IWordServer {
    host:string = "dictionary.cambridge.org";
    path:string = "/dictionary/english/";

    urlServer: string = "http://localhost:3000";
    userId: string = "tranthainam";
    web: IWeb;
    db: any;

    constructor(http: any, db: any){
        this.web = new WebNodeJs(http);
        this.db = db;
    }
    browse(w: string, success: any, error: any) {
        var self = this;
        self.web.getDataType([self.host, self.path + w.toLowerCase()], "html", (data)=>{
            //console.log("data", data);
            var dic = new CambridgeDictionary();
            var entry = dic.parse(data);
            success(entry);
        }, (err)=>{
            error(err);
        });
    }
    get(word: string, success: any, error: any) {
        var collUsers = this.db.get('words');        
        //var entry = collUsers.find({ word: word }, { entry: 1 });        
        collUsers.find({ word: word }, { entry: 1 }).then((entry) => {
            //console.log("get ", word, entry);
            success(entry);
        });

        //console.log("get ", word, entry);
        //success(entry);
    }
    getWords(success: any, error: any){
        var collUsers = this.db.get("users");
        collUsers.find({ userId: this.userId }).then((words) => {
            success(words);
        });
    }
    post(word: string, entry: any, success: any, error: any) {
        console.log("WordServerNodeJs.post ", word);
        var collUsers = this.db.get('users');
        collUsers.update({ 'userId': this.userId }, 
            { 'userId': this.userId, 'words': entry }, { upsert: true }).then((resp)=>{
                console.log("WordServerNodeJs.post[response] ", resp);
            });
    }
    postWords(savedWords: any, success: any, error: any) {
        
    }

    log(message: string){
        
    }

}