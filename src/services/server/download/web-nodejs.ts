import { IWeb } from '../../iweb';
export class WebNodeJs implements IWeb {    
    http: any;
    constructor(http: any){
        this.http = http;
    }

    getDataType(url: any, dataType: string, success: any, error: any) {
        // var options = {
        //     host: "http://dictionary.cambridge.org",
        //     path: "/dictionary/english/touch",
        //     port: 80,
        //     dataType: dataType
        // };

        // this.http.get(options, function(resp){
        //     console.log("resp", resp);
        //     if (success) success(resp);
        // }).on("error", function(e){
        //     if (error) success(e);
        // });
        //console.log(url);
        var host = url[0];
        var path = url[1];
        this.http.get({
            host:host,
            path:path
        }, function(response){
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                //console.log(body);
                success(body);
                // Data reception is done, do whatever with it!
                // var parsed = JSON.parse(body);
                // callback({
                //     email: parsed.email,
                //     password: parsed.pass
                // });
            });
        });
    }
    get(url: string, success: any, error: any) {
        throw new Error('Method not implemented.');
    }
    post(url: string, data: any, success: any, error: any) {
        throw new Error('Method not implemented.');
    }


}