export interface IWordServer {
    browse(word: string, success: any, error: any);
    get(word: string, success: any, error: any);
    getWords(success: any, error: any);
    post(word: string, data: any, success: any, error: any)
    postWords(savedWords: any, success: any, error: any);
    log(message: string);
}