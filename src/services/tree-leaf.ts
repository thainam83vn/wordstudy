import { Word } from './word-model';
export class TreeLeaf {
    text: string;
    word: Word;

    constructor(text: string, word: Word){
        this.text = text;
        this.word = word;
    }
}