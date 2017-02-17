import { common } from './common';
import { StringLib } from './stringlib';
export class CambridgeDictionary {
    headerWord(body:string): any{
        var match = StringLib.tagContent(body, '<span class="hw">', '</span>');
        return match;        
    }

    headerType(body:string): any{
        var match = StringLib.tagContent(body, '<span class="pos".*?>', '</span>');
        return match;        
    }

    headerPronuncUK(body:string): any{
        var match = StringLib.tagContent(body, '<span[\\s\\S]*?pron-region="UK"[\\s\\S]*?>', '</span>/[\\s\\S]*?</span></span>');
        if (match == null) return null;
        match = match + "</span>";

        var mp3 = StringLib.tagContent(match, '<span[\\s\\S]*?data-src-mp3="(.*?)"', '</span>');
        var ogg = StringLib.tagContent(match, '<span[\\s\\S]*?data-src-ogg="(.*?)"', '</span>');
        var text = StringLib.removeTags(StringLib.tagContent(match, '<span class="pron">/<span class="ipa">', '</span>'));
        return {mp3: mp3, ogg: ogg, text: text};        
    }    

    headerPronuncUS(body:string): any{
        var match = StringLib.tagContent(body, '<span[\\s\\S]*?pron-region="US"[\\s\\S]*?>', '</span>/[\\s\\S]*?</span></span>');
        if (match == null) return null;
        match = match + "</span>";

        var mp3 = StringLib.tagContent(match, '<span[\\s\\S]*?data-src-mp3="(.*?)"', '</span>');
        var ogg = StringLib.tagContent(match, '<span[\\s\\S]*?data-src-ogg="(.*?)"', '</span>');
        var text = StringLib.removeTags(StringLib.tagContent(match, '<span class="pron">/<span class="ipa">', '</span>'));
        return {mp3: mp3, ogg: ogg, text: text};        
    }    

    posHeader(body: string): any{    
        var match = StringLib.tagContent(body, '<div class="pos-header">', '</div>');
        if (match == null) return null;

        var word = this.headerWord(match);
        var type = this.headerType(match);
        var uk = this.headerPronuncUK(match);
        var us = this.headerPronuncUS(match);
        return {content: match, word: word, type: type, uk: uk, us: us};
    }   

    bodySentence(body: string): any {
        var self = this;
        var def = StringLib.tagContent(body, '<b class="def">', '</b>');

        var defbody = StringLib.tagContent(body, '<span class="def-body">', '</span>');
        if (defbody != null){
            var sarr = defbody.split('<div class="examp emphasized">');
            var examples = [];
            common.each(sarr, function(s){
                s = StringLib.removeTags(s);
                if (s.length > 0)
                    examples.push(s);
            });
        }

        return {definition: StringLib.removeTags(def), examples: examples};
    }    

    bodySentences(body: string): any {
        var match = StringLib.tagContent(body, '<div class="sense-body">', '<div class="smartt">');
        if (match == null) return null;

        var sarr = match.split('<div class="def-block pad-indent"');
        var arr = [];
        for(var i = 0; i < sarr.length; i++){
            var s = sarr[i];
            if (s.length > 0){
                var sentence = this.bodySentence(s);
                arr.push(sentence);
            }
        }
        return arr;
    }

    entry(body:string): any{
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
    

    parse(body: string):any{
        
        var self = this;
        var start = -1;
        var entryBodySeparator = '<div class="entry-body__el clrd js-share-holder">';
        var sarr = body.split(entryBodySeparator);
        var entries = [];
        common.each(sarr, (s)=>{            
            try{
                var obj = self.entry(s);
                if (obj != null)
                    entries.push(obj);
            }catch(ex){
                console.log(ex);
            }
        });
        console.log(entries);
        return entries;
    }
}