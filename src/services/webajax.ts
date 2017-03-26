import $ from "jquery";
import { IWeb } from "./iweb";

export class WebAjax implements IWeb {
    getDataType(url: any, dataType: string, success: any, error: any) {
        $.ajax({
            url:url,
            method:"GET",
            dataType: dataType,
            success: function(response){
                if (success) success(response);
            },
            error: function(err){
                if (error) error(err);
            }
        });
    }
    get(url: string, success: any, error: any) {
        $.ajax({
            url:url,
            method:"GET",
            success: function(response){
                if (success) success(response);
            },
            error: function(err){
                if (error) error(err);
            }
        });
    }
    
    post(url: string, data: any, success: any, error: any) {
        $.ajax({
            url:url,
            method:"POST",
            data: {body: data},
            success: function(response){
                if (success) success(response);
            },
            error: function(err){
                if (error) error(err);
            }
        });
    }


}