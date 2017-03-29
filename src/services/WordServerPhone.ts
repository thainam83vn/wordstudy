import { IWordServer } from './iwordserver';
import { IWeb } from './iweb';
import { CambridgeDictionary } from './dictionary-cambridge';
export class WordServerPhone implements IWordServer {    
    url: string = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Fdictionary.cambridge.org%2Fus%2Fdictionary%2Fenglish%2F";
    //urlServer: string = "http://54.187.239.131:3000";
    urlServer: string = "http://localhost:3000";
    userId: string = "tranthainam";

    web: IWeb;
    constructor(web: IWeb){
        this.web = web;
    }
    browse(w: string, success: any, error: any) {
        var self = this;
        self.web.getDataType(self.url + w.toLowerCase() + "%27", "html", (data)=>{
            //console.log("data", data);
            var dic = new CambridgeDictionary();
            var entry = dic.parse(data);
            success(entry);
        }, (err)=>{
            error(err);
        });
    }
    get(word: string, success: any, error: any) {
        var self = this;
        self.web.get(self.urlServer+ "/admin/" + word, (data)=>{
            success(data);
        }, (err)=>{
            error(err);
        });
    }
    getWords(success: any, error: any){
        var self = this;
        self.web.get(self.urlServer + "/" + this.userId, (data)=>{
            success(data);
        }, (err)=>{
            error(err);
        });
    }
    post(word: string, entry: any, success: any, error: any) {
        var self = this;
        self.web.post(self.urlServer+ "/admin/" + word, entry, (data)=>{
            success(data);
        }, (err)=>{
            error(err);
        });
    }
    postWords(savedWords: any, success: any, error: any) {
        var self = this;
        self.web.post(self.urlServer+ "/" + this.userId,savedWords, (data)=>{
            success(data);
        }, (err)=>{
            error(err);
        });
    }

    log(message: string){
        
    }


}