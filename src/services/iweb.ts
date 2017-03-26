export interface IWeb{
    getDataType(url: any, dataType: string, success: any, error: any);
    get(url: string, success: any, error: any);
    post(url: string, data: any, success: any, error:any);
}