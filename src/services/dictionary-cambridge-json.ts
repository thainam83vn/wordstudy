import { common } from './common';
//import { StringLib } from './stringlib';
import { JsonLib } from './jsonlib';
export class CambridgeDictionaryJSON {
    headerWord(body:any): any{
        var match = JsonLib.findElement(body, (x)=> x.class=="hw");
        return match[0].content;        
    }

    headerType(body:any): any{
        var match = JsonLib.findElement(body, (x)=>x.class=="pos");
        return match[0].content;        
    }

    headerPronuncUK(body:any): any{
        var match = JsonLib.findElement(body, function(x){ return x["pron-region"] == "US" && x.class =='pron-info';});
        if (match == null) return null;
        match=match[0];

        var mp3 = null;//StringLib.tagContent(match, '<span[\\s\\S]*?data-src-mp3="(.*?)"', '</span>');
        var ogg = null;//StringLib.tagContent(match, '<span[\\s\\S]*?data-src-ogg="(.*?)"', '</span>');
        var text = null;//StringLib.tagContent(match, '<span class="pron">/<span class="ipa">', '</span>');
        return {mp3: mp3, ogg: ogg, text: text};        
    }    

    headerPronuncUS(body:any): any{
        //var self = this;
        var match = JsonLib.findElement(body, function(x){ return x["pron-region"] == "UK" && x.class =='pron-info';});
        if (match == null) return null;
        match = match[0];        

        var mp3 = null;//JsonLib.findElement(match, '<span[\\s\\S]*?data-src-mp3="(.*?)"', '</span>');
        var ogg = null;//StringLib.tagContent(match, '<span[\\s\\S]*?data-src-ogg="(.*?)"', '</span>');
        var text = null//StringLib.tagContent(match, '<span class="pron">/<span class="ipa">', '</span>');
        return {mp3: mp3, ogg: ogg, text: text};        
    }    

    posHeader(body: any): any{    
        //var self = this;
        var match = JsonLib.findElement(body, function(x){ return x.class =="pos-header";});
        if (match == null) return null;
        match = match[0];

        var word = this.headerWord(match);
        var type = this.headerType(match);
        var uk = this.headerPronuncUK(match);
        var us = this.headerPronuncUS(match);
        return {content: match, word: word, type: type, uk: uk, us: us};
    }   

    bodySentence(body: any): any {
        //var self = this;
        var def = JsonLib.findElement(body, function(x){ return x.class =="def";})[0];
        if (def != null){
            def = def.content;
        }

        var examples = [];
        var defExamples = JsonLib.findElement(body, function(x){ return x.class == "def-body";})[0];
        common.each(defExamples, function(example){
            var eg = JsonLib.findElement(example, function(x){ return x.class == "eg";})[0];
            var s = eg.content;
            if (s.length > 0)
                examples.push(s);
        });                

        return {definition: def, examples: examples};
    }    

    bodySentences(body: any): any {
        //var self = this;
        
        //var match = StringLib.tagContent(body, '<div class="sense-body">', '<div class="smartt">');
        //if (match == null) return null;

        var sarr = JsonLib.findElement(body, function(x){ return x.class == "def-block pad-indent"; });
        var arr = [];
        common.each(sarr, (s)=>{
            var sentence = this.bodySentence(s);
            arr.push(sentence);
        });
        return arr;
    }

    entry(body:any): any{
        //var self = this;
        var header = this.posHeader(body);
        if (header == null)
            return null;
        var sentences = this.bodySentences(body);
        if (sentences == null || sentences.length == 0)
            return null;
        return {word: header.word, type: header.type, 
            pronunc: {uk: header.uk, us: header.us}, 
            definitions: sentences};
    }

    compare(element: any, value: any){
        return (element.class == value);
    }
    

    parse(root: any):any{
        var self = this;

        var entries = [];
        var founds = JsonLib.findElement(root, function(x){ return x.class == "entry-body__el clrd js-share-holder" });
        common.each(founds, function(e){
            entries.push(self.entry(e));
        });

        return entries;
        
        /*
        var match = body.indexOf(entryBody);
        
        while (match >= 0){
            
            if (start >= 0){
                var entryBody = body.substr(start, match - start);
                var obj = this.entry(entryBody);
                console.log(obj);
            }
            start = match + entryBody.length;
            //body.replace('<div class="entry-body__el clrd js-share-holder">',"");
            match = body.indexOf(entryBody, start);
        }
        console.log("end parse");
        //console.log(matches);        

        return {};
        */
    }
}