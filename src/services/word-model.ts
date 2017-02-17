import { Verb } from './verb';
export class Word {
    word: string = "";
    saved: boolean = false;
    datetime: string = "";
    entries: WordEntry[];

    constructor(word: string, entries: any){
        this.word = word;
        this.entries = entries;
    }
}

export class WordEntry {
    type: string;
    verb: Verb;
    pronunc: any;
    definitions:any;
}