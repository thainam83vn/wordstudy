export class WordList{
    static getList():string[]{
        if (WordList.list == null)
            WordList.list = WordList.wordText.split('\n');
        return WordList.list;
    }
    static list: string[] = null;
    static wordText: string = `
tell
ask
how
`;
}