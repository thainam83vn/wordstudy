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

    static removeSpecialCharactors(s: string): string{    
        return s.replace(/[^\w\s]/gi, '');
    }  
}