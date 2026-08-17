const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
const uid = () => Math.random().toString(36).slice(2,9);
const BAR_W = 72;
const TOTAL_BARS = 16;

const helpTextDE = {
  arranger:['ARRANGER','Hier baust du deinen Song aus Blöcken. Tippe auf eine freie Stelle, um einen Clip anzulegen. Ziehe einen Clip, um ihn zu verschieben. Ziehe den Griff rechts, um ihn länger oder kürzer zu machen.'],
  clip:['CLIP / BLOCK','Ein Clip ist ein Song-Baustein. Er kann Kick, Bass, Acid, Synth, Percussion, FX oder importiertes Audio enthalten. Verlängerst du einen Loop-Clip, wird sein Inhalt wiederholt.'],
  safe:['PASSENDE TÖNE','Wenn passende Töne aktiv sind, markiert die Klaviatur nur Töne, die zur gewählten Moll-Tonart passen. So kannst du schneller Bass und Synth spielen, ohne ständig nach passenden Noten zu suchen.'],
  swing:['SWING','Swing verschiebt jeden zweiten 16tel-Schritt leicht nach hinten. Mehr Swing = weniger gerade, mehr rollender Groove. Für Techno reichen oft 8–25 %.'],
  cutoff:['FILTER','Der Filter bestimmt, wie viele hohe Frequenzen durch den Filter kommen. Links klingt dunkler und gedämpfter, rechts heller und offener.'],
  resonance:['RESONANZ','Resonanz hebt den Bereich direkt am Filter-Grenzfrequenz an. Mehr Resonanz macht Acid- und Filterbewegungen schärfer und auffälliger.'],
  drive:['SÄTTIGUNG','Sättigung verdichtet und verzerrt den Klang. Wenig Sättigung gibt Wärme und Druck, viel Sättigung wird rau und aggressiv.'],
  delay:['ECHO','Echo erzeugt Wiederholungen. Bei Techno eignet es sich gut für kurze Stabs, Acid und FX.'],
  reverb:['HALL','Hall erzeugt Raum und Hall. Für Kick und Bass meist sparsam verwenden; für Stabs, Atmos und FX kann mehr Raum gut wirken.'],
  width:['VERSTIMMUNG / BREITE','Zwei Oszillatoren werden leicht gegeneinander verstimmt. Mehr Verstimmung macht den Synth breiter, aber zu viel kann Bass unsauber machen.'],
  punch:['DRUCK','Ein Makro für mehr Einschwing-Druck, Sättigung und direkten Druck. Gut für härtere, treibende Passagen.'],
  tone:['KLANG','Ein Makro für Filterhelligkeit und Resonanz. Links dunkler und tiefer, rechts offener und präsenter.'],
  space:['RAUM','Ein Makro für Echo, Hall und längere Ausklänge. Gut für Breaks und Atmosphäre.'],
  shimmer:['BREITE','Ein Makro für Breite und Haltepegel. Mehr Breite macht Synths größer und weiter.']
};

const helpTextEN = {
  arranger:['ARRANGER','Build your song from blocks here. Tap an empty spot to create a clip. Drag a clip to move it. Drag the right handle to make it longer or shorter.'],
  clip:['CLIP / BLOCK','A clip is a song building block. It can contain kick, bass, acid, synth, percussion, FX or imported audio. If a loop clip is extended, its content repeats.'],
  safe:['SAFE NOTES','When Safe Notes is enabled, the keyboard highlights only notes that fit the selected minor key. This helps you play bass and synth parts that fit together.'],
  swing:['SWING','Swing delays every second 16th note slightly. More swing feels less rigid and more rolling. For techno, 8–25% is often enough.'],
  cutoff:['CUTOFF','Cutoff controls how many high frequencies pass through the filter. Left sounds darker, right sounds brighter and more open.'],
  resonance:['RESONANCE','Resonance boosts the area around the filter cutoff. More resonance makes acid and filter movement sharper and more obvious.'],
  drive:['DRIVE','Drive adds saturation and distortion. A little adds warmth and punch; a lot becomes rough and aggressive.'],
  delay:['DELAY','Delay creates echoes. It works well on techno stabs, acid and FX.'],
  reverb:['REVERB','Reverb creates space. Use it sparingly on kick and bass; more can work well on stabs, atmosphere and FX.'],
  width:['DETUNE / WIDTH','Two oscillators are detuned slightly against each other. More detune makes the synth wider, but too much can make bass less focused.'],
  punch:['PUNCH','A macro for more attack, drive and direct impact. Useful for harder, driving sections.'],
  tone:['TONE','A macro for filter brightness and resonance. Left is darker, right is more open and present.'],
  space:['SPACE','A macro for delay, reverb and longer tails. Useful for breaks and atmosphere.'],
  shimmer:['SHIMMER','A macro for width and sustain. More shimmer makes synths feel bigger and wider.']
};

const I18N = {
  de:{
    audioStart:'AUDIO STARTEN', audioOn:'AUDIO AN', play:'▶ ABSPIELEN', stop:'■ STOPP', record:'● AUFNEHMEN', stopRecord:'■ AUFNAHME STOPPEN', bpm:'BPM', save:'SPEICHERN', load:'LADEN', exportWav:'WAV EXPORT', help:'? HILFE',
    workflow:'TECHNO-ARBEITSWEISE', dark:'Dunkel', hypnotic:'Hypnotisch', minimal:'Minimal', raw:'Roh', heroTitle:'Song aus Blöcken bauen. Ziehen. Loopen. Verlängern.', heroText:'Der Arranger ist das Zentrum. Clips lassen sich verschieben, verlängern und loopen. Lange drücken erklärt dir, was ein Element macht.',
    soundDirection:'Sound-Richtung', key:'TONART', safeOn:'PASSENDE TÖNE AN', safeOff:'PASSENDE TÖNE AUS', songView:'Song-Ansicht', loop:'LOOP', addTrack:'+ SPUR', addAudio:'+ AUDIO', bar:'TAKT',
    arrangerHelp:'Tipp auf eine freie Stelle = Clip hinzufügen · Clip ziehen = verschieben · rechten Griff ziehen = verlängern · lange drücken = Hilfe/Aktionen',
    quickMacros:'SCHNELLREGLER', shapeFast:'Schnell formen', macroHint:'Große Regler für Druck, Helligkeit, Raum und Breite.', instrument:'Instrument', waveform:'WELLENFORM', keyboard:'KLAVIATUR', playKeys:'Spielen',
    keyboardHint:'Passende Töne leuchten zur gewählten Tonart. Halte eine Taste gedrückt: Der Ton hält genauso lange.', steps16:'16 SCHRITTE', grooveEditor:'Groove-Editor', rootNote:'GRUNDTON', swing:'SWING', clear:'LÖSCHEN', demo:'DEMO',
    project:'PROJEKT', saveProject:'Projekt sichern', projectHint:'Automatische Sicherung im Browser, JSON für Projekte und WAV für deinen fertigen Export.', projectJson:'PROJEKT JSON', importJson:'JSON IMPORTIEREN', knobHint:'ziehen · Wert antippen · halten = Hilfe', valueBetween:'Wert zwischen',
    helpTitle:'HILFE', duplicate:'DUPLIZIEREN', delete:'LÖSCHEN', loopOn:'LOOP AN', loopOff:'LOOP AUS', barOne:'Takt', barMany:'Takte', clipSuffix:'Clip', effects:'EFFEKTE',
    audioInactive:'Audio noch nicht gestartet', audioInactiveSub:'Tippe auf AUDIO STARTEN', audioActive:'Audio aktiv', audioActiveSub:'Arranger und Instrumente sind bereit.', songRunning:'Song läuft', songStopped:'Song gestoppt.',
    recording:'Aufnahme läuft', recordingSub:'Master-Ausgang wird aufgenommen.', recordingSaved:'Aufnahme gespeichert', recordingSavedSub:'Datei wurde erstellt.', wavExporting:'WAV Export', wavExportingSub:'Der aktuelle 16-Schritt-Groove wird gerendert …', wavDone:'WAV fertig', wavDoneSub:'Groove wurde exportiert.',
    imported:'Audio importiert', projectSaved:'Projekt gespeichert', projectSavedSub:'Automatische Sicherung im Browser aktualisiert.', noProject:'Noch kein Projekt gespeichert.', projectImported:'Projekt importiert', invalidProject:'Ungültige Projektdatei.',
    helpModeOn:'Hilfe-Modus aktiv', helpModeOff:'Hilfe-Modus aus', helpModeOnSub:'Tippe oder halte Elemente für Erklärungen.', helpModeOffSub:'Normale Bedienung.', preset:'Preset', languageChanged:'Sprache: Deutsch'
  },
  en:{
    audioStart:'START AUDIO', audioOn:'AUDIO ON', play:'▶ PLAY', stop:'■ STOP', record:'● RECORD', stopRecord:'■ STOP REC', bpm:'BPM', save:'SAVE', load:'LOAD', exportWav:'EXPORT WAV', help:'? HELP',
    workflow:'TECHNO WORKFLOW', dark:'Dark', hypnotic:'Hypnotic', minimal:'Minimal', raw:'Raw', heroTitle:'Build your song from blocks. Drag. Loop. Extend.', heroText:'The arranger is the center. Clips can be moved, extended and looped. Long-press an element to see what it does.',
    soundDirection:'Sound Direction', key:'KEY', safeOn:'SAFE NOTES ON', safeOff:'SAFE NOTES OFF', songView:'Song View', loop:'LOOP', addTrack:'+ TRACK', addAudio:'+ AUDIO', bar:'BAR',
    arrangerHelp:'Tap empty space = add clip · drag clip = move · drag right handle = extend · long press = help/actions',
    quickMacros:'QUICK MACROS', shapeFast:'Shape Fast', macroHint:'Large controls for punch, brightness, space and width.', instrument:'Instrument', waveform:'WAVEFORM', keyboard:'KEYBOARD', playKeys:'Play',
    keyboardHint:'Safe Notes highlights notes that fit the selected key. Hold a key down: the note lasts exactly as long as you hold it.', steps16:'16 STEP', grooveEditor:'Groove Editor', rootNote:'ROOT', swing:'SWING', clear:'CLEAR', demo:'DEMO',
    project:'PROJECT', saveProject:'Save Project', projectHint:'Autosave in the browser, JSON for projects and WAV for your finished export.', projectJson:'PROJECT JSON', importJson:'IMPORT JSON', knobHint:'drag · tap value · hold = help', valueBetween:'Value between',
    helpTitle:'HELP', duplicate:'DUPLICATE', delete:'DELETE', loopOn:'LOOP ON', loopOff:'LOOP OFF', barOne:'bar', barMany:'bars', clipSuffix:'Clip', effects:'FX',
    audioInactive:'Audio not started', audioInactiveSub:'Tap START AUDIO', audioActive:'Audio active', audioActiveSub:'Arranger and instruments are ready.', songRunning:'Song playing', songStopped:'Song stopped.',
    recording:'Recording', recordingSub:'The master output is being recorded.', recordingSaved:'Recording saved', recordingSavedSub:'File created.', wavExporting:'WAV Export', wavExportingSub:'Rendering the current 16-step groove …', wavDone:'WAV ready', wavDoneSub:'Groove exported.',
    imported:'Audio imported', projectSaved:'Project saved', projectSavedSub:'Browser autosave updated.', noProject:'No saved project yet.', projectImported:'Project imported', invalidProject:'Invalid project file.',
    helpModeOn:'Help Mode on', helpModeOff:'Help Mode off', helpModeOnSub:'Tap or hold elements for explanations.', helpModeOffSub:'Normal controls.', preset:'Preset', languageChanged:'Language: English'
  }
};
let currentLang = localStorage.getItem('nevoLanguage') || 'de';
const t = key => (I18N[currentLang] && I18N[currentLang][key]) || I18N.de[key] || key;
const localName = obj => currentLang==='en' ? (obj.nameEn || obj.name) : (obj.nameDe || obj.name);
const barText = n => `${n} ${n===1?t('barOne'):t('barMany')}`;

const presetCopy = {
  driving:{de:['TREIBEND 150','Trockene Kick · dunkler Bass'],en:['DRIVING 150','Dry kick · dark bass']},
  hypnotic:{de:['HYPNOTISCH 147','Monotoner Sog · subtile Bewegung'],en:['HYPNOTIC 147','Monotone pull · subtle movement']},
  acid:{de:['ACID 154','Resonanz · Filter · Slide-Gefühl'],en:['ACID 154','Resonance · filter · slide feel']},
  minimal:{de:['MINIMAL 146','Wenig Melodie · viel Groove'],en:['MINIMAL 146','Less melody · more groove']},
  raw:{de:['ROHER PEAK 152','Härter · direkter · dichter'],en:['RAW PEAK 152','Harder · more direct · denser']}
};

function applyLanguageToUI(rebuild=true){
  document.documentElement.lang=currentLang;
  localStorage.setItem('nevoLanguage',currentLang);
  $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(I18N[currentLang][key])el.textContent=t(key)});
  $('#langDe')?.classList.toggle('active',currentLang==='de');
  $('#langEn')?.classList.toggle('active',currentLang==='en');
  if($('#safeNotesBtn')) $('#safeNotesBtn').textContent=safeNotes?t('safeOn'):t('safeOff');
  const waveNames=currentLang==='en'?{sawtooth:'Saw',square:'Square',triangle:'Triangle',sine:'Sine'}:{sawtooth:'Sägezahn',square:'Rechteck',triangle:'Dreieck',sine:'Sinus'};
  $$('#waveform option').forEach(o=>{o.textContent=waveNames[o.value]||o.textContent});
  const keyNames=currentLang==='en'?{'D3':'D MINOR','F3':'F MINOR','C#3':'C# MINOR','A2':'A MINOR'}:{'D3':'D-MOLL','F3':'F-MOLL','C#3':'C#-MOLL','A2':'A-MOLL'};
  $$('#keySelect option').forEach(o=>{o.textContent=keyNames[o.value]||o.textContent});
  if($('#audioBtn')) $('#audioBtn').textContent=audioReady?t('audioOn'):t('audioStart');
  if($('#recBtn') && (!recorder || recorder.state==='inactive')) $('#recBtn').textContent=t('record');
  Object.values(params).forEach(p=>{if(!p.labelDe)p.labelDe=p.label;p.label=currentLang==='en'?(p.labelEn||p.labelDe):p.labelDe});
  Object.values(macros).forEach(p=>{if(!p.labelDe)p.labelDe=p.label;p.label=currentLang==='en'?(p.labelEn||p.labelDe):p.labelDe});
  $$('.preset-card').forEach(card=>{const copy=presetCopy[card.dataset.preset]?.[currentLang];if(copy){card.querySelector('strong').textContent=copy[0];card.querySelector('span').textContent=copy[1]}});
  if(rebuild){buildMacros(false);buildKnobs();renderTracks()}
}
function setLanguage(lang){currentLang=lang==='en'?'en':'de';applyLanguageToUI(true);setStatus(audioReady,t('languageChanged'),currentLang==='de'?'Die App ist jetzt auf Deutsch.':'The app is now in English.')}

const params = {
  volume:{label:'LAUTSTÄRKE',labelEn:'VOLUME',color:'green',min:0,max:1,value:.78,def:.78,step:.01,fmt:v=>Math.round(v*100)+'%',help:'clip'},
  cutoff:{label:'FILTER',labelEn:'CUTOFF',color:'cyan',min:80,max:18000,value:5600,def:5600,step:1,curve:'log',fmt:v=>v>=1000?(v/1000).toFixed(2)+' kHz':Math.round(v)+' Hz',help:'cutoff'},
  resonance:{label:'RESONANZ',labelEn:'RESONANCE',color:'amber',min:.1,max:18,value:2.8,def:2.8,step:.1,fmt:v=>v.toFixed(1),help:'resonance'},
  attack:{label:'EINSCHWINGEN',labelEn:'ATTACK',color:'cyan',min:.002,max:2,value:.012,def:.012,step:.001,curve:'log',fmt:v=>v<1?Math.round(v*1000)+' ms':v.toFixed(2)+' s',help:'clip'},
  decay:{label:'ABKLINGEN',labelEn:'DECAY',color:'cyan',min:.01,max:2,value:.18,def:.18,step:.01,curve:'log',fmt:v=>v<1?Math.round(v*1000)+' ms':v.toFixed(2)+' s',help:'clip'},
  sustain:{label:'HALTEPEGEL',labelEn:'SUSTAIN',color:'amber',min:0,max:1,value:.62,def:.62,step:.01,fmt:v=>Math.round(v*100)+'%',help:'clip'},
  release:{label:'AUSKLINGEN',labelEn:'RELEASE',color:'amber',min:.02,max:4,value:.46,def:.46,step:.01,curve:'log',fmt:v=>v<1?Math.round(v*1000)+' ms':v.toFixed(2)+' s',help:'clip'},
  drive:{label:'SÄTTIGUNG',labelEn:'DRIVE',color:'amber',min:0,max:1,value:.16,def:.16,step:.01,fmt:v=>Math.round(v*100)+'%',help:'drive'},
  delay:{label:'ECHO',labelEn:'DELAY',color:'cyan',min:0,max:.75,value:.14,def:.14,step:.01,fmt:v=>Math.round(v*100)+'%',help:'delay'},
  delayTime:{label:'ECHO-ZEIT',labelEn:'DELAY TIME',color:'cyan',min:.04,max:.7,value:.22,def:.22,step:.01,fmt:v=>Math.round(v*1000)+' ms',help:'delay'},
  reverb:{label:'HALL',labelEn:'REVERB',color:'amber',min:0,max:.75,value:.12,def:.12,step:.01,fmt:v=>Math.round(v*100)+'%',help:'reverb'},
  width:{label:'VERSTIMMUNG',labelEn:'DETUNE',color:'cyan',min:0,max:28,value:7,def:7,step:1,fmt:v=>Math.round(v)+' ct',help:'width'}
};
const macros = {
  punch:{label:'DRUCK',labelEn:'PUNCH',color:'amber',min:0,max:100,value:58,def:58,step:1,fmt:v=>Math.round(v)+'%',help:'punch'},
  tone:{label:'KLANG',labelEn:'TONE',color:'cyan',min:0,max:100,value:60,def:60,step:1,fmt:v=>Math.round(v)+'%',help:'tone'},
  space:{label:'RAUM',labelEn:'SPACE',color:'cyan',min:0,max:100,value:28,def:28,step:1,fmt:v=>Math.round(v)+'%',help:'space'},
  shimmer:{label:'BREITE',labelEn:'SHIMMER',color:'amber',min:0,max:100,value:38,def:38,step:1,fmt:v=>Math.round(v)+'%',help:'shimmer'}
};

const tracks = [
  {id:'kick',name:'KICK',nameDe:'KICK',nameEn:'KICK',color:'#ffb55e',type:'kick',mute:false,solo:false,clips:[{id:uid(),start:0,len:8,name:'Driving Kick',nameDe:'Treibende Kick',nameEn:'Driving Kick',loop:true},{id:uid(),start:8,len:8,name:'Peak Kick',nameDe:'Peak-Kick',nameEn:'Peak Kick',loop:true}]},
  {id:'bass',name:'BASS',nameDe:'BASS',nameEn:'BASS',color:'#54d8ff',type:'bass',mute:false,solo:false,clips:[{id:uid(),start:0,len:6,name:'Dark Bass',nameDe:'Dunkler Bass',nameEn:'Dark Bass',loop:true},{id:uid(),start:8,len:8,name:'Bass Peak',nameDe:'Bass-Peak',nameEn:'Bass Peak',loop:true}]},
  {id:'acid',name:'ACID',nameDe:'ACID',nameEn:'ACID',color:'#36f0c0',type:'acid',mute:false,solo:false,clips:[{id:uid(),start:4,len:4,name:'Acid Texture',nameDe:'Acid-Textur',nameEn:'Acid Texture',loop:true},{id:uid(),start:12,len:4,name:'Acid Push',nameDe:'Acid-Schub',nameEn:'Acid Push',loop:true}]},
  {id:'synth',name:'SYNTH',nameDe:'SYNTH',nameEn:'SYNTH',color:'#7edfff',type:'synth',mute:false,solo:false,clips:[{id:uid(),start:2,len:4,name:'Hypnotic Pulse',nameDe:'Hypnotischer Puls',nameEn:'Hypnotic Pulse',loop:true},{id:uid(),start:10,len:6,name:'Dark Stab',nameDe:'Dunkler Stab',nameEn:'Dark Stab',loop:true}]},
  {id:'perc',name:'PERC',nameDe:'PERCUSSION',nameEn:'PERCUSSION',color:'#ffcc84',type:'perc',mute:false,solo:false,clips:[{id:uid(),start:0,len:16,name:'Hat Groove',nameDe:'Hi-Hat-Groove',nameEn:'Hat Groove',loop:true}]},
  {id:'fx',name:'FX',nameDe:'EFFEKTE',nameEn:'FX',color:'#9bb7ca',type:'fx',mute:false,solo:false,clips:[{id:uid(),start:7,len:1,name:'Riser',nameDe:'Anstieg',nameEn:'Riser',loop:false},{id:uid(),start:15,len:1,name:'Down FX',nameDe:'Abwärts-FX',nameEn:'Down FX',loop:false}]}
];
const audioBuffers = new Map();

let ctx,master,filter,driveNode,dryGain,delay,delayFeedback,delayWet,convolver,reverbWet,mediaDest,analyser,noiseBuffer;
let voices=new Map(),audioReady=false,isPlaying=false,seqTimer=null,nextStepTime=0,globalStep=0,recorder=null,recChunks=[],meterRAF=null;
let helpMode=false,safeNotes=true;
const synthPattern=Array(16).fill(false),kickPattern=Array(16).fill(false),hatPattern=Array(16).fill(false);
[0,4,8,12].forEach(i=>kickPattern[i]=true);[2,6,10,14].forEach(i=>hatPattern[i]=true);[0,3,6,10,12,14].forEach(i=>synthPattern[i]=true);

function setStatus(on,text,sub=''){$('#statusDot').classList.toggle('on',on);$('#statusText').textContent=text;$('#statusSub').textContent=sub}
function showHelp(key,extraActions=[]){const helpText=currentLang==='en'?helpTextEN:helpTextDE;const h=helpText[key]||helpText.clip;$('#helpTitle').textContent=t('helpTitle');$('#helpHeading').textContent=h[0];$('#helpText').textContent=h[1];const box=$('#helpActions');box.innerHTML='';extraActions.forEach(a=>{const b=document.createElement('button');b.className='btn small';b.textContent=a.label;b.onclick=()=>{a.run();hideHelp()};box.appendChild(b)});$('#helpModal').classList.remove('hidden')}
function hideHelp(){$('#helpModal').classList.add('hidden')}
$('#helpClose').onclick=hideHelp;$('#helpModal').addEventListener('pointerdown',e=>{if(e.target===$('#helpModal'))hideHelp()});

function longPress(el,cb,ms=600){let t,moved=false,x=0,y=0;el.addEventListener('pointerdown',e=>{moved=false;x=e.clientX;y=e.clientY;t=setTimeout(()=>{if(!moved)cb(e)},ms)});el.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-x)>8||Math.abs(e.clientY-y)>8){moved=true;clearTimeout(t)}});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>clearTimeout(t)))}

function makeImpulse(seconds=1.7,decay=2.6){const rate=ctx.sampleRate,len=Math.floor(rate*seconds),b=ctx.createBuffer(2,len,rate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay)}return b}
function distortionCurve(amount){const n=44100,curve=new Float32Array(n),k=amount*180+1;for(let i=0;i<n;i++){const x=i*2/n-1;curve[i]=((3+k)*x*20*Math.PI/180)/(Math.PI+k*Math.abs(x))}return curve}
function createNoiseBuffer(audioCtx,dur=.4){const len=Math.floor(audioCtx.sampleRate*dur),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;return b}
async function initAudio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();filter=ctx.createBiquadFilter();filter.type='lowpass';driveNode=ctx.createWaveShaper();driveNode.oversample='4x';dryGain=ctx.createGain();delay=ctx.createDelay(1.2);delayFeedback=ctx.createGain();delayWet=ctx.createGain();convolver=ctx.createConvolver();convolver.buffer=makeImpulse();reverbWet=ctx.createGain();mediaDest=ctx.createMediaStreamDestination();analyser=ctx.createAnalyser();analyser.fftSize=256;noiseBuffer=createNoiseBuffer(ctx,.5);filter.connect(driveNode);driveNode.connect(dryGain);dryGain.connect(master);driveNode.connect(delay);delay.connect(delayWet);delayWet.connect(master);delay.connect(delayFeedback);delayFeedback.connect(delay);driveNode.connect(convolver);convolver.connect(reverbWet);reverbWet.connect(master);master.connect(ctx.destination);master.connect(mediaDest);master.connect(analyser);updateAudioParams();startMeter()}await ctx.resume();audioReady=true;setStatus(true,t('audioActive'),t('audioActiveSub'));$('#audioBtn').textContent=t('audioOn')}
function updateAudioParams(){if(!ctx)return;master.gain.setTargetAtTime(params.volume.value,ctx.currentTime,.01);filter.frequency.setTargetAtTime(params.cutoff.value,ctx.currentTime,.01);filter.Q.setTargetAtTime(params.resonance.value,ctx.currentTime,.01);driveNode.curve=distortionCurve(params.drive.value);delay.delayTime.setTargetAtTime(params.delayTime.value,ctx.currentTime,.01);delayFeedback.gain.setTargetAtTime(.31,ctx.currentTime,.01);delayWet.gain.setTargetAtTime(params.delay.value,ctx.currentTime,.01);reverbWet.gain.setTargetAtTime(params.reverb.value,ctx.currentTime,.01)}
function startMeter(){if(meterRAF)return;const data=new Uint8Array(analyser.fftSize),fill=$('#masterMeterFill'),lab=$('#meterLabel');const tick=()=>{analyser.getByteTimeDomainData(data);let peak=0;for(const v of data)peak=Math.max(peak,Math.abs(v-128)/128);fill.style.width=clamp(peak*135,0,100)+'%';lab.textContent=peak?`${(20*Math.log10(peak)).toFixed(1)} dB`:'-∞ dB';meterRAF=requestAnimationFrame(tick)};tick()}

const noteMap={C:-9,'C#':-8,D:-7,'D#':-6,E:-5,F:-4,'F#':-3,G:-2,'G#':-1,A:0,'A#':1,B:2};
function noteFreq(note){const m=note.match(/^([A-G]#?)(-?\d)$/);const semi=noteMap[m[1]]+(Number(m[2])-4)*12;return 440*Math.pow(2,semi/12)}
function transpose(note,semitones){const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];const m=note.match(/^([A-G]#?)(-?\d)$/);let idx=Number(m[2])*12+names.indexOf(m[1])+semitones;return names[(idx%12+12)%12]+Math.floor(idx/12)}
function startVoice(note,when=0,duration=null,opts={}){if(!ctx)return;const t=when||ctx.currentTime,f=noteFreq(note),g=ctx.createGain(),o1=ctx.createOscillator(),o2=ctx.createOscillator();o1.type=opts.wave||$('#waveform').value;o2.type=o1.type;o1.frequency.value=f;o2.frequency.value=f;o1.detune.value=-(opts.width??params.width.value);o2.detune.value=(opts.width??params.width.value);o1.connect(g);o2.connect(g);g.connect(filter);const a=opts.attack??params.attack.value,d=opts.decay??params.decay.value,s=opts.sustain??params.sustain.value,r=opts.release??params.release.value,amp=opts.amp??.36;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+a);g.gain.exponentialRampToValueAtTime(Math.max(.0001,amp*s),t+a+d);o1.start(t);o2.start(t);if(duration!=null){const off=t+Math.max(duration,a+d+.02);g.gain.setValueAtTime(Math.max(.0001,amp*s),off);g.gain.exponentialRampToValueAtTime(.0001,off+r);o1.stop(off+r+.03);o2.stop(off+r+.03)}else{if(!voices.has(note))voices.set(note,[]);voices.get(note).push({g,o1,o2})}}
function stopVoice(note){if(!ctx||!voices.has(note))return;const t=ctx.currentTime,r=params.release.value;voices.get(note).forEach(v=>{v.g.gain.cancelScheduledValues(t);v.g.gain.setTargetAtTime(.0001,t,Math.max(.005,r/5));v.o1.stop(t+r+.08);v.o2.stop(t+r+.08)});voices.delete(note)}
function kick(t){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.connect(g);g.connect(filter);o.frequency.setValueAtTime(155,t);o.frequency.exponentialRampToValueAtTime(43,t+.17);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.start(t);o.stop(t+.31)}
function hat(t,open=false){const src=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;hp.type='highpass';hp.frequency.value=7000;src.connect(hp);hp.connect(g);g.connect(filter);const dur=open?.18:.07;g.gain.setValueAtTime(open?.24:.18,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.start(t);src.stop(t+dur+.02)}
function fxNoise(t){const src=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;bp.type='bandpass';bp.frequency.setValueAtTime(500,t);bp.frequency.exponentialRampToValueAtTime(9000,t+.45);src.connect(bp);bp.connect(g);g.connect(filter);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+.48);src.start(t);src.stop(t+.5)}

function valueToNorm(p){return p.curve==='log'?Math.log(p.value/p.min)/Math.log(p.max/p.min):(p.value-p.min)/(p.max-p.min)}
function normToValue(p,n){let v=p.curve==='log'?p.min*Math.pow(p.max/p.min,n):p.min+(p.max-p.min)*n;return Math.round(v/p.step)*p.step}
function bindKnob(knob,p,onChange){let sy,sn,timer,moved=false;knob.addEventListener('pointerdown',e=>{e.preventDefault();knob.setPointerCapture(e.pointerId);sy=e.clientY;sn=valueToNorm(p);moved=false;timer=setTimeout(()=>{if(!moved)showHelp(p.help||'clip')},650)});knob.addEventListener('pointermove',e=>{if(sy===undefined)return;const dy=sy-e.clientY;if(Math.abs(dy)>4)moved=true;if(moved)clearTimeout(timer);p.value=normToValue(p,clamp(sn+dy/220,0,1));p.render();onChange()});const end=()=>{clearTimeout(timer);sy=undefined};knob.addEventListener('pointerup',end);knob.addEventListener('pointercancel',end);knob.addEventListener('dblclick',()=>{p.value=p.def;p.render();onChange()})}
function buildKnobCard(target,key,p,onChange){const card=document.createElement('div');card.className=target.id==='macroGrid'?'macro-card':'knob-card';card.innerHTML=`<div class="knob-label">${p.label}</div><div class="knob" tabindex="0"></div><div class="knob-value clickable"></div><div class="knob-sub">${t('knobHint')}</div>`;target.appendChild(card);const knob=card.querySelector('.knob'),val=card.querySelector('.knob-value');const ring=p.color==='amber'?'#ffb55e':p.color==='green'?'#62f58b':'#54d8ff';knob.style.setProperty('--ring',ring);p.render=()=>{const n=clamp(valueToNorm(p),0,1);knob.style.setProperty('--fill',n*270+'deg');knob.style.setProperty('--angle',-135+n*270+'deg');val.textContent=p.fmt(p.value)};val.onclick=()=>{const x=prompt(`${p.label}: ${t('valueBetween')} ${p.min} – ${p.max}`,p.value);if(x!==null&&!isNaN(Number(x))){p.value=clamp(Number(x),p.min,p.max);p.render();onChange()}};bindKnob(knob,p,onChange);p.render()}
function buildKnobs(){const g=$('#knobGrid');g.innerHTML='';Object.entries(params).forEach(([k,p])=>buildKnobCard(g,k,p,updateAudioParams))}
function applyMacros(){const pu=macros.punch.value/100,to=macros.tone.value/100,sp=macros.space.value/100,sh=macros.shimmer.value/100;params.drive.value=.04+.48*pu;params.attack.value=.06*Math.pow(.0025/.06,pu);params.decay.value=.3-.19*pu;params.cutoff.value=450*Math.pow(18000/450,to);params.resonance.value=.8+6.8*to;params.delay.value=.03+.42*sp;params.reverb.value=.03+.5*sp;params.release.value=.16+1.5*sp;params.width.value=26*sh;params.sustain.value=.38+.48*sh;Object.values(params).forEach(p=>p.render?.());updateAudioParams()}
function buildMacros(apply=true){const g=$('#macroGrid');g.innerHTML='';Object.entries(macros).forEach(([k,p])=>buildKnobCard(g,k,p,applyMacros));if(apply)applyMacros()}

const keyboardNotes=['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5'];
function safePitchClasses(){const root=$('#keySelect').value.match(/^([A-G]#?)/)[1],names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],ri=names.indexOf(root),minor=[0,2,3,5,7,8,10];return new Set(minor.map(x=>names[(ri+x)%12]))}
function refreshSafeNotes(){const safe=safePitchClasses();$$('.key').forEach(k=>{const pc=k.dataset.note.match(/^([A-G]#?)/)[1];k.classList.toggle('safe',safeNotes&&safe.has(pc))})}
function buildKeyboard(){const kb=$('#keyboard');kb.innerHTML='';const whites=keyboardNotes.filter(n=>!n.includes('#'));whites.forEach(n=>{const e=document.createElement('div');e.className='key';e.dataset.note=n;e.textContent=n;kb.appendChild(e)});const ww=100/whites.length;let wi=0;keyboardNotes.forEach(n=>{if(!n.includes('#')){wi++;return}const e=document.createElement('div');e.className='key black';e.dataset.note=n;e.textContent=n;e.style.left=`calc(${wi*ww}% - 22px)`;kb.appendChild(e)});kb.querySelectorAll('.key').forEach(el=>{const held=new Set();const down=async e=>{e.preventDefault();held.add(e.pointerId);try{el.setPointerCapture(e.pointerId)}catch{}el.classList.add('active');await initAudio();if(held.has(e.pointerId)){startVoice(el.dataset.note)}};const up=e=>{e.preventDefault();held.delete(e.pointerId);if(held.size===0){el.classList.remove('active');stopVoice(el.dataset.note)}};el.addEventListener('pointerdown',down);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up)});refreshSafeNotes()}

function buildTimeline(){const t=$('#timeline');t.innerHTML='';for(let i=1;i<=TOTAL_BARS;i++){const e=document.createElement('div');e.className='bar-num';e.textContent=i;t.appendChild(e)}}
function anySolo(){return tracks.some(t=>t.solo)}
function trackAudible(track){return !track.mute&&(!anySolo()||track.solo)}
function activeClip(track,bar){return track.clips.find(c=>bar>=c.start&&bar<c.start+c.len)}
function clipHelp(track,clip){showHelp('clip',[{label:clip.loop?t('loopOff'):t('loopOn'),run:()=>{clip.loop=!clip.loop;renderTracks()}},{label:t('duplicate'),run:()=>{const copy={...clip,id:uid(),start:clamp(clip.start+clip.len,0,TOTAL_BARS-1)};copy.len=Math.min(copy.len,TOTAL_BARS-copy.start);track.clips.push(copy);renderTracks()}},{label:t('delete'),run:()=>{track.clips=track.clips.filter(c=>c.id!==clip.id);renderTracks()}}])}
function renderTracks(){const list=$('#trackList');list.innerHTML='';tracks.forEach(track=>{const row=document.createElement('div');row.className='track-row';const lab=document.createElement('div');lab.className='track-label';lab.innerHTML=`<span class="track-color" style="color:${track.color};background:${track.color}"></span><div class="track-meta"><strong>${localName(track)}</strong><small>${track.type==='fx'?t('effects'):track.type.toUpperCase()}</small></div><button class="track-btn mute ${track.mute?'on':''}">M</button><button class="track-btn solo ${track.solo?'on':''}">S</button>`;row.appendChild(lab);const lane=document.createElement('div');lane.className='track-lane';lane.dataset.track=track.id;row.appendChild(lane);lab.querySelector('.mute').onclick=e=>{e.stopPropagation();track.mute=!track.mute;renderTracks()};lab.querySelector('.solo').onclick=e=>{e.stopPropagation();track.solo=!track.solo;renderTracks()};longPress(lab,()=>showHelp('arranger'));
    lane.addEventListener('click',e=>{if(e.target!==lane)return;const r=lane.getBoundingClientRect(),bar=clamp(Math.floor((e.clientX-r.left)/BAR_W),0,TOTAL_BARS-1);track.clips.push({id:uid(),start:bar,len:2,name:track.name+' Clip',nameDe:localName(track)+' '+t('clipSuffix'),nameEn:(track.nameEn||track.name)+' Clip',loop:true});renderTracks()});
    track.clips.forEach(clip=>lane.appendChild(makeClip(track,clip,lane)));
    list.appendChild(row)
  })}
function makeClip(track,clip,lane){const el=document.createElement('div');el.className='clip'+(clip.loop?' looped':'');el.style.color=track.color;el.style.left=clip.start*BAR_W+'px';el.style.width=Math.max(BAR_W,clip.len*BAR_W-4)+'px';el.innerHTML=`<div><strong>${localName(clip)}</strong><small>${barText(clip.len)}</small></div><span class="resize-handle"></span>`;let mode=null,sx=0,start=0,len=0,moved=false;el.addEventListener('pointerdown',e=>{e.stopPropagation();mode=e.target.classList.contains('resize-handle')?'resize':'move';sx=e.clientX;start=clip.start;len=clip.len;moved=false;el.setPointerCapture(e.pointerId)});el.addEventListener('pointermove',e=>{if(!mode)return;const dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;const bars=Math.round(dx/BAR_W);if(mode==='move'){clip.start=clamp(start+bars,0,TOTAL_BARS-clip.len);el.style.left=clip.start*BAR_W+'px'}else{clip.len=clamp(len+bars,1,TOTAL_BARS-clip.start);el.style.width=Math.max(BAR_W,clip.len*BAR_W-4)+'px';el.querySelector('small').textContent=barText(clip.len)}});const end=()=>{mode=null};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);longPress(el,()=>{if(!moved)clipHelp(track,clip)});return el}

function buildSteps(){[['synthSteps',synthPattern],['kickSteps',kickPattern],['hatSteps',hatPattern]].forEach(([id,a])=>{const e=$('#'+id);e.innerHTML='';a.forEach((v,i)=>{const b=document.createElement('button');b.className='step'+(v?' on':'');b.textContent=i+1;b.onclick=()=>{a[i]=!a[i];b.classList.toggle('on',a[i])};e.appendChild(b)})})}
function stepDur(){return 60/Number($('#bpm').value)/4}
function swingOffset(local){return local%2?stepDur()*(Number($('#swing').value)/100)*.5:0}
function scheduleTrack(track,bar,local,t){if(!trackAudible(track)||!activeClip(track,bar))return;const root=$('#keySelect').value;switch(track.type){case'kick':if(kickPattern[local])kick(t);break;case'perc':if(hatPattern[local])hat(t,local===14);break;case'synth':if(synthPattern[local])startVoice(transpose(root,12),t,stepDur()*.65,{amp:.18,width:12});break;case'bass':if([0,3,6,10,12,14].includes(local))startVoice(transpose(root,-12+(local===10?3:0)),t,stepDur()*.55,{wave:'sawtooth',amp:.2,width:2,attack:.004,release:.12});break;case'acid':if([2,5,7,10,14].includes(local))startVoice(transpose(root,[0,3,7,10,12][[2,5,7,10,14].indexOf(local)]),t,stepDur()*.38,{wave:'sawtooth',amp:.14,width:1,attack:.003,release:.08});break;case'fx':if(local===0)fxNoise(t);break;case'audio':if(local===0){const c=activeClip(track,bar);if(c&&c.audioId&&bar===c.start)playImportedAudio(c,t)}break}}
function playImportedAudio(clip,t){const buffer=audioBuffers.get(clip.audioId);if(!buffer)return;const src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=buffer;src.loop=clip.loop;src.connect(g);g.connect(master);g.gain.value=.75;src.start(t);if(clip.loop)src.stop(t+clip.len*stepDur()*16)}
function markStep(local,t){setTimeout(()=>{$$('.step').forEach(x=>x.classList.remove('playing'));$$('.steps').forEach(r=>r.children[local]?.classList.add('playing'))},Math.max(0,(t-ctx.currentTime)*1000))}
function updatePlayhead(bar,local,t){const loopStart=Number($('#loopStart').value)-1;const pos=bar+local/16;setTimeout(()=>{const left=(window.innerWidth<=760?126:150)+(pos*BAR_W);$('#playhead').style.left=left+'px'},Math.max(0,(t-ctx.currentTime)*1000))}
function scheduleStep(global,t){const bar=Math.floor(global/16),local=global%16,st=t+swingOffset(local);tracks.forEach(tr=>scheduleTrack(tr,bar,local,st));markStep(local,st);updatePlayhead(bar,local,st)}
function scheduler(){const loopStart=(Number($('#loopStart').value)-1)*16,loopEnd=Number($('#loopEnd').value)*16;while(nextStepTime<ctx.currentTime+.12){scheduleStep(globalStep,nextStepTime);nextStepTime+=stepDur();globalStep++;if(globalStep>=loopEnd)globalStep=loopStart}}
async function play(){await initAudio();if(isPlaying)return;isPlaying=true;globalStep=(Number($('#loopStart').value)-1)*16;nextStepTime=ctx.currentTime+.06;scheduler();seqTimer=setInterval(scheduler,25);$('#playBtn').classList.add('primary');$('#playhead').classList.add('on');setStatus(true,t('songRunning'),`${$('#bpm').value} BPM · ${t('loop')} ${$('#loopStart').value}–${$('#loopEnd').value}`)}
function stop(){isPlaying=false;clearInterval(seqTimer);seqTimer=null;$$('.step').forEach(x=>x.classList.remove('playing'));$('#playBtn').classList.remove('primary');$('#playhead').classList.remove('on');if(audioReady)setStatus(true,t('audioActive'),t('songStopped'))}

const presets={
 driving:{bpm:150,swing:18,cutoff:5200,drive:.22,reverb:.08,delay:.1},hypnotic:{bpm:147,swing:24,cutoff:3900,drive:.14,reverb:.2,delay:.2},acid:{bpm:154,swing:14,cutoff:7600,drive:.26,reverb:.1,delay:.22},minimal:{bpm:146,swing:20,cutoff:4600,drive:.12,reverb:.08,delay:.12},raw:{bpm:152,swing:10,cutoff:6800,drive:.38,reverb:.06,delay:.08}
};
function applyPreset(name){const p=presets[name];$('#bpm').value=p.bpm;$('#swing').value=p.swing;$('#swingValue').textContent=p.swing+'%';params.cutoff.value=p.cutoff;params.drive.value=p.drive;params.reverb.value=p.reverb;params.delay.value=p.delay;Object.values(params).forEach(x=>x.render?.());updateAudioParams();$$('.preset-card').forEach(x=>x.classList.toggle('active',x.dataset.preset===name));setStatus(audioReady,`${t('preset')}: ${presetCopy[name]?.[currentLang]?.[0]||name.toUpperCase()}`,`${p.bpm} BPM · ${t('swing')} ${p.swing}%`)}
$$('.preset-card').forEach(b=>b.onclick=()=>applyPreset(b.dataset.preset));

function projectData(){return{version:2.1,language:currentLang,bpm:Number($('#bpm').value),waveform:$('#waveform').value,key:$('#keySelect').value,safeNotes,swing:Number($('#swing').value),params:Object.fromEntries(Object.entries(params).map(([k,p])=>[k,p.value])),macros:Object.fromEntries(Object.entries(macros).map(([k,p])=>[k,p.value])),patterns:{synth:[...synthPattern],kick:[...kickPattern],hat:[...hatPattern]},tracks:tracks.map(t=>({...t,clips:t.clips.map(c=>({...c,audioId:c.audioId?null:undefined}))}))}}
function applyProject(d){if(!d)return;if(d.language)setLanguage(d.language);$('#bpm').value=d.bpm||150;$('#waveform').value=d.waveform||'sawtooth';$('#keySelect').value=d.key||'D3';safeNotes=d.safeNotes!==false;$('#safeNotesBtn').classList.toggle('on',safeNotes);$('#safeNotesBtn').textContent=safeNotes?t('safeOn'):t('safeOff');$('#swing').value=d.swing??20;$('#swingValue').textContent=$('#swing').value+'%';if(d.params)Object.entries(d.params).forEach(([k,v])=>{if(params[k]){params[k].value=clamp(Number(v),params[k].min,params[k].max);params[k].render?.()}});if(d.macros)Object.entries(d.macros).forEach(([k,v])=>{if(macros[k]){macros[k].value=clamp(Number(v),macros[k].min,macros[k].max);macros[k].render?.()}});if(d.patterns){['synth','kick','hat'].forEach(n=>{const arr=n==='synth'?synthPattern:n==='kick'?kickPattern:hatPattern;if(Array.isArray(d.patterns[n]))d.patterns[n].slice(0,16).forEach((v,i)=>arr[i]=!!v)})}if(Array.isArray(d.tracks)){tracks.length=0;d.tracks.forEach(t=>tracks.push({...t,clips:(t.clips||[]).map(c=>({...c,id:c.id||uid()}))}))}buildSteps();renderTracks();refreshSafeNotes();updateAudioParams()}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}

async function toggleRecord(){await initAudio();if(!recorder||recorder.state==='inactive'){recChunks=[];recorder=new MediaRecorder(mediaDest.stream);recorder.ondataavailable=e=>{if(e.data.size)recChunks.push(e.data)};recorder.onstop=()=>downloadBlob(new Blob(recChunks,{type:recorder.mimeType}),'NEVO-recording.webm');recorder.start();$('#recBtn').classList.add('active');$('#recBtn').textContent=t('stopRecord');setStatus(true,t('recording'),t('recordingSub'))}else{recorder.stop();$('#recBtn').classList.remove('active');$('#recBtn').textContent=t('record');setStatus(true,t('recordingSaved'),t('recordingSavedSub'))}}
function encodeWav(buffer){const nCh=buffer.numberOfChannels,rate=buffer.sampleRate,len=buffer.length*nCh*2+44,ab=new ArrayBuffer(len),view=new DataView(ab);let p=0;const str=s=>{for(let i=0;i<s.length;i++)view.setUint8(p++,s.charCodeAt(i))},u16=v=>{view.setUint16(p,v,true);p+=2},u32=v=>{view.setUint32(p,v,true);p+=4};str('RIFF');u32(len-8);str('WAVE');str('fmt ');u32(16);u16(1);u16(nCh);u32(rate);u32(rate*nCh*2);u16(nCh*2);u16(16);str('data');u32(len-44);const ch=[];for(let c=0;c<nCh;c++)ch.push(buffer.getChannelData(c));for(let i=0;i<buffer.length;i++)for(let c=0;c<nCh;c++){let s=clamp(ch[c][i],-1,1);view.setInt16(p,s<0?s*0x8000:s*0x7fff,true);p+=2}return ab}
async function exportWav(){await initAudio();setStatus(true,t('wavExporting'),t('wavExportingSub'));const bpm=Number($('#bpm').value),sd=60/bpm/4,total=sd*16+2,sr=44100,off=new OfflineAudioContext(2,Math.ceil(total*sr),sr),out=off.createGain();out.gain.value=params.volume.value;out.connect(off.destination);const synth=(note,t)=>{const o=off.createOscillator(),g=off.createGain();o.type=$('#waveform').value;o.frequency.value=noteFreq(note);o.connect(g);g.connect(out);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+sd*.7);o.start(t);o.stop(t+sd*.75)},kk=t=>{const o=off.createOscillator(),g=off.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.16);o.connect(g);g.connect(out);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.start(t);o.stop(t+.3)};for(let i=0;i<16;i++){const t=.05+i*sd+(i%2?sd*(Number($('#swing').value)/100)*.5:0);if(kickPattern[i])kk(t);if(synthPattern[i])synth($('#keySelect').value,t)}const r=await off.startRendering();downloadBlob(new Blob([encodeWav(r)],{type:'audio/wav'}),'NEVO-groove.wav');setStatus(true,t('wavDone'),t('wavDoneSub'))}

$('#audioImport').onchange=async e=>{const f=e.target.files[0];if(!f)return;await initAudio();const arr=await f.arrayBuffer(),buf=await ctx.decodeAudioData(arr.slice(0)),audioId=uid();audioBuffers.set(audioId,buf);let tr=tracks.find(t=>t.type==='audio');if(!tr){tr={id:'audio-'+uid(),name:'AUDIO',color:'#ffffff',type:'audio',mute:false,solo:false,clips:[]};tracks.push(tr)}const barDur=60/Number($('#bpm').value)*4,len=clamp(Math.ceil(buf.duration/barDur),1,16);tr.clips.push({id:uid(),start:0,len,name:f.name.replace(/\.[^.]+$/,''),loop:false,audioId});renderTracks();setStatus(true,t('imported'),`${f.name} · ${buf.duration.toFixed(1)} s`);e.target.value=''};
$('#addTrackBtn').onclick=()=>{tracks.push({id:'track-'+uid(),name:'SYNTH '+(tracks.length+1),nameDe:'SYNTH '+(tracks.length+1),nameEn:'SYNTH '+(tracks.length+1),color:'#54d8ff',type:'synth',mute:false,solo:false,clips:[]});renderTracks()};
$('#audioBtn').onclick=initAudio;$('#playBtn').onclick=play;$('#stopBtn').onclick=stop;$('#recBtn').onclick=toggleRecord;$('#exportBtn').onclick=exportWav;
$('#saveBtn').onclick=()=>{localStorage.setItem('nevoStudioProject',JSON.stringify(projectData()));setStatus(audioReady,t('projectSaved'),t('projectSavedSub'))};
$('#loadBtn').onclick=()=>{const d=localStorage.getItem('nevoStudioProject');if(d)applyProject(JSON.parse(d));else alert(t('noProject'))};
$('#downloadProjectBtn').onclick=()=>downloadBlob(new Blob([JSON.stringify(projectData(),null,2)],{type:'application/json'}),'NEVO-Studio-project.json');
$('#importProject').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{applyProject(JSON.parse(await f.text()));setStatus(audioReady,t('projectImported'),f.name)}catch{alert(t('invalidProject'))}};
$('#clearSeq').onclick=()=>{synthPattern.fill(false);kickPattern.fill(false);hatPattern.fill(false);buildSteps()};
$('#fillSeq').onclick=()=>{synthPattern.fill(false);kickPattern.fill(false);hatPattern.fill(false);[0,3,6,10,12,14].forEach(i=>synthPattern[i]=true);[0,4,8,12].forEach(i=>kickPattern[i]=true);[2,6,10,14,15].forEach(i=>hatPattern[i]=true);$('#swing').value=22;$('#swingValue').textContent='22%';buildSteps()};
$('#swing').oninput=()=>$('#swingValue').textContent=$('#swing').value+'%';
$('#safeNotesBtn').onclick=()=>{safeNotes=!safeNotes;$('#safeNotesBtn').classList.toggle('on',safeNotes);$('#safeNotesBtn').textContent=safeNotes?t('safeOn'):t('safeOff');refreshSafeNotes()};longPress($('#safeNotesBtn'),()=>showHelp('safe'));$('#keySelect').onchange=()=>{$('#rootNote').value=$('#keySelect').value;refreshSafeNotes()};
$('#helpBtn').onclick=()=>{helpMode=!helpMode;document.body.classList.toggle('help-mode',helpMode);$('#helpBtn').classList.toggle('primary',helpMode);setStatus(audioReady,helpMode?t('helpModeOn'):t('helpModeOff'),helpMode?t('helpModeOnSub'):t('helpModeOffSub'))};
longPress($('.arranger-panel'),()=>showHelp('arranger'));longPress($('.swing-box'),()=>showHelp('swing'));
$('#langDe').onclick=()=>setLanguage('de');$('#langEn').onclick=()=>setLanguage('en');

buildTimeline();renderTracks();buildMacros();buildKnobs();buildKeyboard();buildSteps();applyLanguageToUI(true);applyPreset('driving');if(!audioReady)setStatus(false,t('audioInactive'),t('audioInactiveSub'));
setInterval(()=>{try{localStorage.setItem('nevoStudioAutosave',JSON.stringify(projectData()))}catch{}},15000);
