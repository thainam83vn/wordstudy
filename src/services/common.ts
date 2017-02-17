export class common {
    static dateToString(d:Date){
        return (d.getMonth() + 1)+"/"+d.getDate()+"/"+d.getFullYear();
    }

    static each(arr: any, handle: any): any {
        for(var i = 0; i < arr.length; i++){
            handle(arr[i]);
        }
    }

    static in(obj: any, handle: any): any {
        for(var i in obj) {
            if(obj.hasOwnProperty(i)){
                handle(obj[i]);                
            }
        }   
    }

    static in2(obj: any, handle: any): any {
        for(var i in obj) {
            if(obj.hasOwnProperty(i)){
                handle(i, obj[i]);                
            }
        }   
    }

    static arrayPushNoDuplicate(arr: any[], item: any){
        if (!common.arrayExist(arr, item))
            arr.push(item);
    }  

    static arrayExist(arr: any[], item: any): boolean{
        var newarr = [];
        common.each(arr, (e)=>{
            if (e == item){
                return true;
            }
        });
        return false;
    }    

    static arrayRemove(arr: any[], item: any): any[]{
        var newarr = [];
        common.each(arr, (e)=>{
            if (e != item){
                newarr.push(e);
            }
        });
        return newarr;
    }
}