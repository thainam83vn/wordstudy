export class AlphabetWords{
    static instance: AlphabetWords = null;
    static getWordTree():AlphabetWords{
        if (AlphabetWords.instance == null)
            AlphabetWords.instance = new AlphabetWords();
        return AlphabetWords.instance;
    }
    static charactors: string = 'abcdefghijklmnopqrstuvwxyz';

    

    constructor(){

    }

}