import { WordList } from '../../word-list';
import { WordBox } from '../../wordbox';
import { WebNodeJs } from './web-nodejs';
import { WordServerNodeJs } from './word-server-nodejs';
import { WordServerFile } from './word-server-file';
var http = require('http');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/wordstudy');

var path = require('path');

// var num: number = 123;
// export class Number{
//     square(n: number): number{
//         return n * n;
//     }
// }
// function identity(num: number): number {
//     return num * 2;
// }

console.log("start--------------------------------");
var wordbox = new WordBox(new WordServerFile(http));
// wordbox.browseWord('touch', (entries)=>{
//     console.log(entries);
// }, (error)=>{
//     console.log(error);
// })
// for(var i = 1; i < 10; i++){
    
// }
wordbox.scrapWords();

