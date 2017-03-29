import { IWordServer } from '../../iwordserver';
import { IWeb } from '../../iweb';
import { WebNodeJs } from './web-nodejs';
import { CambridgeDictionary } from '../../dictionary-cambridge';

export class WordServerFile implements IWordServer {
    host:string = "dictionary.cambridge.org";
    path:string = "/dictionary/english/";

    serverPath: string = "/Users/thai/Desktop/workspace/wordstudy/data";
    userId: string = "tranthainam";
    web: IWeb;

    constructor(http: any){
        this.web = new WebNodeJs(http);
    }

    logError(word: string){
        var fs = require('fs');
        var filePath = this.serverPath + "/errors.txt";
        
        fs.appendFile(filePath, word + "\n", function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Update log error.");
        });         
    }

    browse(w: string, success: any, error: any) {
        var self = this;
        self.web.getDataType([self.host, self.path + w.toLowerCase()], "html", (data)=>{
            //console.log("data", data);
            var dic = new CambridgeDictionary();
            var entry = dic.parse(data);
            if (entry.length == 0){
                self.logError(w);
            }
            success(entry);
        }, (err)=>{
            error(err);
        });
    }
    get(word: string, success: any, error: any) {
        success([]);
    }
    getWords(success: any, error: any){
        
    }
    post(word: string, entry: any, success: any, error: any) {
        var fs = require('fs');

        var dir = this.serverPath + "/" + word[0];
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        var filePath = dir + "/" + word + ".json";
        var sEntry = JSON.stringify(entry);
        
        fs.writeFile(filePath, sEntry, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file " + filePath + " was saved!");
        });         
    }
    postWords(savedWords: any, success: any, error: any) {
        
    }


}