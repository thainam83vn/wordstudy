export class W {
    static vowels = ['a','e','u','i','o'];
    static pronunc_vowels = ['eɪ','æ','i','ɛ','ɑɪ','ɪ','oʊ','ɑ','ju','ʌ','ʊ','u','ɔ','ɔɪ','aʊ'];
    static isVowel(a: string){
        for(var i = 0; i < W.vowels.length; i++){
            if (a == W.vowels[i])
                return true;
        }
        return false;
    }
    static isVowelPronunc(a: string){
        var pronunc = W.pronunc_vowels.join('');
        if (pronunc.indexOf(a)>=0)
            return true;
        return false;
    }
    word: string;
    pronunc: string;
    syllables: string[];
    stressAtLast: boolean;
    countAfterStress: number;

    constructor(word: string, pronunc: string){
        this.word = word;
        this.pronunc = pronunc;
        this.syllables = [];
        
        this.initSyllables();
        this.initPronuncSyllables();
    }

    private initSyllables(){
        var i = 0;
        var start = 0;
        while (i < this.word.length){
            while(!W.isVowel(this.word[i])){
                i++;
                if(i >= this.word.length)
                    return; 
            }
            while(W.isVowel(this.word[i])){
                i++;
                if(i >= this.word.length)
                    return;
            }                
            var syllable = this.word.substr(start, i - start);
            this.syllables.push(syllable);
        }
    }

    private initPronuncSyllables(){
        var i = 0;
        this.countAfterStress = 0;
        this.stressAtLast = true;
        while(this.pronunc[i] != 'ˈ' && i < this.word.length) i++;
        while(i < this.pronunc.length){
            while(!W.isVowelPronunc(this.pronunc[i])){
                i++;
                if(i >= this.pronunc.length){
                    this.stressAtLast = (this.countAfterStress <= 1);
                    return;                
                }
            }
            while(W.isVowelPronunc(this.pronunc[i])){
                i++;
                if(i >= this.pronunc.length){
                    this.stressAtLast = (this.countAfterStress <= 1);
                    return;                
                }
            }
            this.countAfterStress++;
        }
        this.stressAtLast = (this.countAfterStress <= 1);
    }

    endWith(s: string):boolean{
        return this.word.lastIndexOf(s) == this.word.length - s.length;
    }

    end(number: number):string{
        var r = this.word.substr(this.word.length - number, number);
        while (r.length < number)
            r = ' ' + r;
        return r;
    }
}