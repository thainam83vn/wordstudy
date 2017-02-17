import { WordList } from './word-list';
import { common } from './common';
import { Word } from '../../.tmp/services/word-model';
import { TreeLeaf } from './tree-leaf';
export class WordTree{
    static instance: WordTree = null;
    static getWordTree():WordTree{
        if (WordTree.instance == null)
            WordTree.instance = new WordTree();
        return WordTree.instance;
    }

    tree: any;
    constructor(){
        setTimeout(()=>{
            this.tree = WordTree.getTree();
        }, 10);
        
        //console.log(JSON.stringify(this.tree));
        //console.log(this.tree);
    }

    traverse(rs: any, callback: any){
        for(var a in rs){
            var value = rs[a];
            if (value != null){
                if (value["text"] != null){
                    if (callback(value))
                        return;
                }
                else
                    this.traverse(value, callback);
            }
        }
    }

    getFirst(rs: any, count: number):string[]{
        var result = [];
        this.traverse(rs, (x)=>{
            if (result.length < count)
                result.push(x);
            return (result.length >= count);
        });
        return result;
    }

    search(s: string):string[]{
        var i = 0;
        var rs = this.tree;
        while(i < s.length && i <= 2){
            rs = rs[s[i]];
            i++;
        }
        if (i < s.length){
            var result = [];
            common.each(rs, (w)=>{
                if (w.text.indexOf(s)>=0)
                    result.push(w);
            });
            return this.getFirst(result, 30);
        } else {
            return this.getFirst(rs, 30);
        }        
    }

    static getTree():any{
        var data = window.localStorage.getItem("db2");
        if (data == null){
            var l0 = WordList.getList();
            l0 = WordTree.divide(l0, 0);
            //console.log(l0);

            common.in2(l0, (c0, l1)=>{
                /*
                if (c0 == 'f'){
                    debugger;
                }
                */
                l1 = WordTree.divide(l1, 1);
                l0[c0] = l1;            
                common.in2(l1, (c1, l2)=>{
                    l2 = WordTree.divide(l2, 2);
                    for(var i in l2){
                        for(var j in l2[i]){
                            var val = l2[i][j];
                            l2[i][j] = new TreeLeaf(val, null);
                        }
                    }
                    l1[c1] = l2;            
                });
            });

            //var s = JSON.stringify(l0);
            //console.log("s", s);
            //window.localStorage.setItem("db2", s);
            
            /*
            common.each(l0, (l1)=>{
                l1.list = WordTree.divide(l1.list, 1);
                common.each(l1.list, (l2)=>{
                    l2.list = WordTree.divide(l2.list, 2);
                });
            });
            */                
            //console.log(l0);
            return l0;
        } else {
            var t = JSON.parse(data);
            console.log("t", t);
            return t;
        }
    }

    static divide(ls: any[], level: number): any{
        var root = {};
        var current = null;
        var currentList = null;
        var preWord = null;
        common.each(ls, (w)=>{
            if (preWord != w){
                if (w.length > level){
                    if (current == null || current != w[level]){
                        current = w[level];
                        currentList = [];
                        
                    } else {
                        root[current] = currentList;
                    }
                    currentList.push(w);
                }
                preWord = w;
            }

        });
        return root;
    }    

/*
    static divide(ls: any[], level: number): any{
        var root = [];
        var current = null;
        var preWord = null;
        common.each(ls, (w)=>{
            if (preWord != w){
                if (w.length > level){
                    if (current == null || current.char != w[level]){
                        current = {char:w[level], list: []};
                        current.list.push(w);
                        root.push(current);
                    } 
                    current.list.push(w);
                }
                preWord = w;
            }
        });
        return root;
    }
*/    
}
