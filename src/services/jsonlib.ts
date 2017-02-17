export class JsonLib {
    static findElementLocal(element: any, comparer: any, results: any){
        var self = this;
        if (element == null)
            return;
        else if (comparer(element))
            results.push(element);
        else if (typeof element != "string"){
            for(var i in element){
                var child = element[i];
                self.findElementLocal(child, comparer, results);
            }
        }    
    }

    static findElement(element: any, comparer: any){
        var results = [];
        JsonLib.findElementLocal(element, comparer, results);
        return results;
    }
}