import { Pipe } from "angular2/core";
import { Word } from './word-model';

@Pipe({
  name: "orderbyWord"
})
export class OrderByWordPipe {
  transform(array: Array<Word>, args: string): Array<Word> {
    array.sort((a: Word, b: Word) => {
      if (a.word < b.word) {
        return -1;
      } else if (a.word > b.word) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}