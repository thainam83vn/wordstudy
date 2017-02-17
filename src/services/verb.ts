import { common } from './common';
import { W } from './word';
export class Verb {
    infinity: string;
    past: string;
    participle: string;
    constructor(inf, past, part){
        this.infinity = inf;
        this.past = past;
        this.participle = part;
    }
}
export class Verbs {
    private static instance:Verbs;
    static getVerbs():Verbs{
        if (Verbs.instance == null)
            Verbs.instance = new Verbs();
        return Verbs.instance;
    }
    constructor(){        
        var arr = this.string_irregular.split('\n');
        var verbs = [];
        common.each(arr, (e)=>{
            var words = e.split('\t');
            if (words.length >= 3){
                var verb = new Verb(words[0],words[1],words[2]);
                verbs.push(verb);
            }
        });
        this.irregulars = verbs;
    }

    getVerbEd(inf: string, pronunc: string):Verb{
        inf = inf.toLowerCase();    
        var w = new W(inf, pronunc);
        console.log(w);
        var added = inf + "ed";
        var end = w.end(3);
        
        if (w.endWith('e')){
            added = inf + "d";
        } else if (w.endWith('c')){
            added = inf + "ked";
        } else if (w.endWith('y')){
            if (!W.isVowel(end[1]))
                added = inf.substr(0, inf.length - 1) + "ied";            
        } else if (W.isVowel(end[1]) && w.endWith('l')){
            added = inf + "led";
        } else{
            if (!W.isVowel(end[0]) && W.isVowel(end[1]) && !W.isVowel(end[2])){
                if (w.syllables.length <= 1 || w.stressAtLast){
                    added = inf + end[2] + "ed";
                } 
            } 
        } 
        return new Verb(inf, added, added);
    }

    getVerbIng(inf: string, pronunc: string):string{
        inf = inf.toLowerCase();    
        var w = new W(inf, pronunc);
        console.log(w);
        var added = inf + "ing";
        var end = w.end(3);
        
        if (w.endWith('e')){
            added = inf.substr(0, inf.length - 1) + "ing";
        } else if (w.endWith('c')){
            added = inf + "king";
        } else if (w.endWith('y')){
            if (!W.isVowel(end[1]))
                added = inf.substr(0, inf.length - 1) + "ing";            
        } else if (W.isVowel(end[1]) && w.endWith('l')){
            added = inf + "ling";
        } else{
            if (!W.isVowel(end[0]) && W.isVowel(end[1]) && !W.isVowel(end[2])){
                if (w.syllables.length <= 1 || w.stressAtLast){
                    added = inf + end[2] + "ing";
                } 
            } 
        } 
        return added;
    }

    getVerb(inf: string, pronunc: string): Verb{
        inf = inf.toLowerCase();
        for(var i=0;i<this.irregulars.length;i++){
            var v = this.irregulars[i];
            if (v.infinity == inf)
                return v;
        }
        return this.getVerbEd(inf, pronunc);
    }


    find(word: string):string{
        word = word.toLowerCase();
        var results = [];
        for(var i=0;i<this.irregulars.length;i++){
            var e = this.irregulars[i];
            if (e.infinity == word || e.past == word || e.participle == word){
                return e.infinity;
            }
        }

        var w = new W(word, '');
        if (w.endWith('ed')){
            var end3 = w.end(3);
            var end4 = w.end(4);
            var inf = word.substr(0, word.length - 2);
            if (end3 == 'ied'){
                inf = word.substr(0, word.length - 3) + 'y';
            } else if (end4[0] == end4[1] && end4[2] == 'e' && end4[3] == 'd') {
                inf = word.substr(0, word.length - 4) + end4[0];
            }                        
            return inf;
        }

        
        return null;
    }
    irregulars: Verb[];
    string_irregular = `
arise	arose	arisen
awake	awoke	awoken
bear	bore	borne
beat	beat	beaten
become	became	become
begin	began	begun
bend	bent	bent
beset	beset	beset
bet	bet/betted	bet
bid	bid	bid
bind	bound	bound
bite	bit	bitten
bleed	bled	bled
blow	blew	blown
break	broke	broken
breed	bred	bred
bring	brought	brought
broadcast	broadcast	broadcast
build	built	built
burn	burnt/burned	burnt/burned
burst	burst	burst
buy	bought	bought    
cast	cast	cast
catch	caught	caught
choose	chose	chosen
cling	clung	clung
come	came	come
cost	cost	cost
creep	crept	crept
cut	cut	cut
deal	dealt	dealt
dig	dug	dug
dive	dived/dove  dived
do	did	done
draw	drew	drawn
dream	dreamt/dreamed  dreamt/dreamed
drink	drank	drunk
drive	drove	driven
eat	ate	eaten
fall	fell	fallen
feed	fed	fed
feel	felt	felt
fight	fought	fought
find	found	found
fit	fit	fit
flee	fled	fled
fling	flung	flung
fly	flew	flown
forbid	forbade	forbidden
forget	forgot	forgotten
forego	forewent	foregone
forgo	forewent	foregone
forgive	forgave	forgiven
forsake	forsook	forsaken
foretell	foretold	foretold
freeze	froze	frozen
get	got	got/gotten
give	gave	given
go	went	gone
grind	ground	ground
grow	grew	grown
hang	hung	hung
hang	hanged	hanged
have	had	had
hear	heard	heard
hide	hid	hidden
hit	hit	hit
hold	held	held
hurt	hurt	hurt
keep	kept	kept
kneel	knelt	knelt
know	knew	known
lay	laid	laid
lead	led	led
lean	leant/leaned	leant/leaned
leap	leapt/leaped	leapt/leaped
learn	learnt/learned	learnt/learned
leave	left	left
lend	lent	lent
let	let	let
lie	lay	lain
light	lit/lighted	lit/lighted
lose	lost	lost
make	made	made
mean	meant	meant
meet	met	met
misspell	misspelt/misspelled	misspelt/misspelled
mistake	mistook	mistaken
mow	mowed	mowed/mown
overcome	overcame	overcome
overdo	overdid	overdone
overtake	overtook	overtaken
overthrow	overthrew	overthrown
pay	paid	paid
plead	pleaded/plead	pleaded/plead
prove	proved	proved/proven
put	put	put
quit	quit	quit
read	read	read
rid	rid	rid
ride	rode	ridden
ring	rang	rung
rise	rose	risen
run	ran	run
saw	sawed	sawn /sawed
say	said	said
see	saw	seen
seek	sought	sought
sell	sold	sold
send	sent	sent
set	set	set
sew	sewed	sewn/sewed
shake	shook	shaken
shear	sheared	sheared/shorn
shed	shed	shed
shine	shone	shone
shoot	shot	shot
show	showed	shown
shrink	shrank	shrunk
shut	shut	shut
sing	sang	sung
sink	sank	sunk
sit	sat	sat
sleep	slept	slept
slay	slew	slayed/slain
slide	slid	slid
sling	slung	slung
slit	slit	slit
smell	smelt/smelled	smelt/smelled
smite	smote	smitten
sow	sowed	sown/sowed
speak	spoke	spoken
speed	sped/speeded	sped/speeded
spell	spelt/spelled	spelt/spelled
spend	spent	spent
spill	spilt/spilled	spilt/spilled
spin	spun	spun
spit	spat	spat
split	split	split
spoil	spoilt/spoiled	spoilt/spoiled
spread	spread	spread
spring	sprang	sprung
stand	stood	stood
steal	stole	stolen
stick	stuck	stuck
sting	stung	stung
stink	stank	stunk
stride	strode	stridden
strike	struck	struck
strive	strove	striven
swear	swore	sworn
sweep	swept	swept
swell	swelled	swelled/swollen
swim	swam	swum
swing	swung	swung
take	took	taken
teach	taught	taught
tear	tore	torn
tell	told	told
think	thought	thought
thrive	thrived/throve	thrived
throw	threw	thrown
thrust	thrust	thrust
tread	trod	trodden
understand	understood	understood
uphold	upheld	upheld
upset	upset	upset
wake	woke/waked	woken/waked
wear	wore	worn
weave	wove/weaved	woven /weaved
wed	wedded/wed	wedded/wed
weep	wept	wept
win	won	won
wind	wound	wound
withdraw	withdrew	withdrawn
withhold	withheld	withheld
withstand	withstood	withstood
wring	wrung	wrung
write	wrote	written
    `;
}