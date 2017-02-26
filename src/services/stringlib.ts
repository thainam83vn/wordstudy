export class StringLib {
    static removeTags(body: string): string{
         var regex = /(<([^>]+)>)/ig;
         var result = body.replace(regex, "");
         return result;
    } 

    static tagContent(body: string, open: string, close: string): any{
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

    static findCloseEnd(body: string, pos: number, close: string): number {
        var tagDepth = 0;
        for(var i = pos; i + close.length < body.length; i++){
            var substring = body.substr(pos, close.length);
            if (substring == close && tagDepth == 0) return i;

            if (body[i] == '<' && body[i+1] != '/')
                tagDepth++;
            if (body[i] == '<' && body[i+1] == '/')
                tagDepth--;               
        }
        return -1;
    }

    static tagContent2(body: string, open: string, close: string): any{
        //console.log(body);
        var results: string[] = [];
        var pos = 0;
        do{
            var foundIndex = body.indexOf(open, pos);
            if (foundIndex < 0) break;
            var foundClose = StringLib.findCloseEnd(body, foundIndex + open.length, close);
            if (foundClose < 0) break;
            results.push(body.substr(pos, foundClose - pos));
            pos = foundClose;
        }while(true);
        return results;
    }  

    

    static removeSpecialCharactors(s: string): string{    
        return s.replace(/[^\w\s]/gi, '');
    }  
}