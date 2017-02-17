import { common } from './common';
export class Dictionary {
    removeTags(body: string): string{
         var regex = /(<([^>]+)>)/ig;
         var result = body.replace(regex, "");
         return result;
    }
    tagContent(body: string, open: string, close: string): any{
        //console.log(body);
        var s = open + '([\\s\\S]*?)' + close;
        var pattern = new RegExp(s, "g");

        var match = pattern.exec(body);
        if (match == null)
            return null;
        if (match.length >= 2)        
            return match[1];
        else if (match.length >= 1)        
            return match[0];
        return null;
    }

    headerWord(body:string): any{
        var match = this.tagContent(body, '<span class="hw">', '</span>');
        return match;        
    }

    headerType(body:string): any{
        var match = this.tagContent(body, '<span class="pos".*?>', '</span>');
        return match;        
    }

    headerPronuncUK(body:string): any{
        var match = this.tagContent(body, '<span pron-region="UK" class="pron-info">', '</span><span pron-region="US" class="pron-info">');
        if (match == null) return null;

        var mp3 = this.tagContent(match, '<span[\\s\\S]*?data-src-mp3="(.*?)"', '</span>');
        var ogg = this.tagContent(match, '<span[\\s\\S]*?data-src-ogg="(.*?)"', '</span>');
        var text = this.tagContent(match, '<span class="pron">/<span class="ipa">', '</span>');
        return {mp3: mp3, ogg: ogg, text: text};        
    }    

    headerPronuncUS(body:string): any{
        var match = this.tagContent(body, '<span pron-region="US" class="pron-info">', '</span></span>');
        if (match == null) return null;

        var mp3 = this.tagContent(match, '<span[\\s\\S]*?data-src-mp3="(.*?)"', '</span>');
        var ogg = this.tagContent(match, '<span[\\s\\S]*?data-src-ogg="(.*?)"', '</span>');
        var text = this.tagContent(match, '<span class="pron">/<span class="ipa">', '</span>');
        return {mp3: mp3, ogg: ogg, text: text};        
    }    

    posHeader(body: string): any{    
        var match = this.tagContent(body, '<div class="pos-header">', '</div>');
        if (match == null) return null;

        var word = this.headerWord(match);
        var type = this.headerType(match);
        var uk = this.headerPronuncUK(match);
        var us = this.headerPronuncUS(match);
        return {content: match, word: word, type: type, uk: uk, us: us};
    }   

    bodySentence(body: string): any {
        var self = this;
        var def = this.tagContent(body, '<b class="def">', '</b>');

        var defbody = this.tagContent(body, '<span class="def-body">', '</span>');
        if (defbody != null){
            var sarr = defbody.split('<div class="examp emphasized">');
            var examples = [];
            common.each(sarr, function(s){
                s = self.removeTags(s);
                if (s.length > 0)
                    examples.push(s);
            });
        }

        return {definition: this.removeTags(def), examples: examples};
    }    

    bodySentences(body: string): any {
        var match = this.tagContent(body, '<div class="sense-body">', '<div class="smartt">');
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
        //var start = -1;
        //var entryPattern = /<div class="entry-body__el clrd js-share-holder">/;
        var entryBodySeparator = '<div class="entry-body__el clrd js-share-holder">';
        var sarr = body.split(entryBodySeparator);
        var entries = [];
        common.each(sarr, function(s){
            var obj = self.entry(s);
            if (obj != null)
                entries.push(obj);
        });
        console.log(entries);
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