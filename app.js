const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
const uid = () => Math.random().toString(36).slice(2,9);
const BAR_W = 72;
let TOTAL_BARS = 16;
const MAX_SONG_SECONDS = 600;
const PIANO_STEP_W = 36;
const PIANO_ROW_H = 30;

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
  shimmer:['BREITE','Ein Makro für Breite und Haltepegel. Mehr Breite macht Synths größer und weiter.'],
  playMode:['SPIELART','DIREKT: Der Ton endet fast sofort, sobald du den Finger hebst – gut für kurze Stabs und perkussives Spiel. NATÜRLICH: Der Ton klingt nach dem Loslassen mit dem eingestellten Ausklang weiter – näher an einem echten Instrument.'],
  sustain:['SUSTAIN','Sustain hält losgelassene Töne weiter. Schalte Sustain wieder aus, damit die gehaltenen Töne natürlich ausklingen.'],
  piano:['PIANO-ROLL','Hier bearbeitest du einen aufgenommenen Noten-Clip. Tippe ins Raster, um eine Note zu setzen. Ziehe die Note zum Verschieben und ihren rechten Rand zum Verlängern.'],
  library:['VORLAGEN & LOOP-BIBLIOTHEK','Hier findest du fertige Demo-Songs und einzelne Song-Bausteine. VORSCHAU spielt einen Loop kurz vor. HINZUFÜGEN legt ihn als Block in die passende Spur. Verlängerst du den Block, wiederholt er sich automatisch.'],
  libraryLoop:['FERTIGER LOOP','Ein fertiger Loop ist ein sofort nutzbarer Baustein. Du kannst ihn als Grundlage nehmen, verschieben, verlängern, loopen, duplizieren und danach mit deinen eigenen Elementen kombinieren.'],
  djPlayer:['NÉVO PLAYER','Hier kannst du fertige Songs wie auf DJ-Decks laden, vorhören, cueen, Tempo anpassen, zwischen Deck A und B blenden und einen Song direkt in den Arranger übernehmen.']
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
  shimmer:['SHIMMER','A macro for width and sustain. More shimmer makes synths feel bigger and wider.'],
  playMode:['PLAY STYLE','DIRECT: The note stops almost immediately when you lift your finger – useful for short stabs and percussive playing. NATURAL: The note continues with the release setting after you lift your finger – closer to a real instrument.'],
  sustain:['SUSTAIN','Sustain keeps released notes sounding. Turn Sustain off again to let held notes fade naturally.'],
  piano:['PIANO ROLL','Edit a recorded note clip here. Tap the grid to add a note. Drag a note to move it and drag its right edge to change its length.'],
  library:['TEMPLATES & LOOP LIBRARY','Find ready-made demo songs and individual song building blocks here. PREVIEW auditions a loop. ADD places it as a block on the matching track. Extending the block repeats it automatically.'],
  libraryLoop:['READY LOOP','A ready loop is a song building block you can use immediately. Move it, extend it, loop it, duplicate it and combine it with your own material.'],
  djPlayer:['NÉVO PLAYER','Load finished songs onto DJ-style decks, audition them, set cues, change tempo, crossfade between Deck A and B, and send a song directly into the arranger.']
};

const I18N = {
  de:{
    audioStart:'AUDIO STARTEN', audioOn:'AUDIO AN', play:'▶ ABSPIELEN', stop:'■ STOPP', record:'● AUFNEHMEN', stopRecord:'■ AUFNAHME STOPPEN', bpm:'BPM', save:'SPEICHERN', load:'LADEN', exportWav:'WAV EXPORT', help:'? HILFE',
    workflow:'TECHNO-ARBEITSWEISE', dark:'Dunkel', hypnotic:'Hypnotisch', minimal:'Minimal', raw:'Roh', heroTitle:'Song aus Blöcken bauen. Ziehen. Loopen. Verlängern.', heroText:'Der Arranger ist das Zentrum. Clips lassen sich verschieben, verlängern und loopen. Lange drücken erklärt dir, was ein Element macht.',
    soundDirection:'Sound-Richtung', key:'TONART', safeOn:'PASSENDE TÖNE AN', safeOff:'PASSENDE TÖNE AUS', songView:'Song-Ansicht', loop:'LOOP', addTrack:'+ SPUR', addAudio:'+ AUDIO', bar:'TAKT',
    arrangerHelp:'Tipp auf eine freie Stelle = Clip hinzufügen · Clip ziehen = verschieben · rechten Griff ziehen = verlängern · lange drücken = Hilfe/Aktionen',
    quickMacros:'SCHNELLREGLER', shapeFast:'Schnell formen', macroHint:'Große Regler für Druck, Helligkeit, Raum und Breite.', instrument:'Instrument', waveform:'WELLENFORM', keyboard:'KLAVIATUR', playKeys:'Spielen',
    keyboardHint:'Wähle zwischen direktem Spiel und natürlichem Ausklang. Gedrückte Tasten leuchten solange der Ton aktiv ist.', keyboardRecordHint:'Wenn oben AUFNEHMEN aktiv ist, wird dein Klavierspiel zusätzlich als verschiebbarer Noten-Clip im Arranger gespeichert.', playStyle:'SPIELART', directMode:'DIREKT', naturalMode:'NATÜRLICH', sustainPedal:'SUSTAIN', on:'AN', off:'AUS', octave:'OKTAVE', steps16:'16 SCHRITTE', grooveEditor:'Groove-Editor', rootNote:'GRUNDTON', swing:'SWING', clear:'LÖSCHEN', demo:'DEMO', groovePlay:'▶ GROOVE ANHÖREN', grooveStop:'■ STOPP', grooveApply:'→ IN SONG ÜBERNEHMEN', songPlay:'▶ SONG', songLength:'SONGLÄNGE', position:'POSITION', maxTenMinutes:'MAX. 10 MINUTEN', grooveInfo:'Tippe einen Schritt an = Sound kurz vorhören. GROOVE ANHÖREN spielt nur diesen 16-Schritt-Groove. IN SONG ÜBERNEHMEN legt ihn als eigene Blöcke in den Arranger.',
    project:'PROJEKT', saveProject:'Projekt sichern', projectHint:'Automatische Sicherung im Browser, JSON für Projekte und WAV für deinen fertigen Export.', projectJson:'PROJEKT JSON', importJson:'JSON IMPORTIEREN', knobHint:'ziehen · Wert antippen · halten = Hilfe', valueBetween:'Wert zwischen',
    helpTitle:'HILFE', duplicate:'DUPLIZIEREN', delete:'LÖSCHEN', loopOn:'LOOP AN', loopOff:'LOOP AUS', barOne:'Takt', barMany:'Takte', clipSuffix:'Clip', effects:'EFFEKTE',
    audioInactive:'Audio noch nicht gestartet', audioInactiveSub:'Tippe auf AUDIO STARTEN', audioActive:'Audio aktiv', audioActiveSub:'Arranger und Instrumente sind bereit.', songRunning:'Song läuft', songStopped:'Song gestoppt.',
    recording:'Aufnahme läuft', recordingSub:'Master-Ausgang wird aufgenommen.', recordingSaved:'Aufnahme gespeichert', recordingSavedSub:'Datei wurde erstellt.', noteClipSaved:'Noten-Clip erstellt', noteClipSavedSub:'Dein Klavierspiel liegt jetzt als Block im Arranger.', wavExporting:'WAV Export', wavExportingSub:'Der aktuelle 16-Schritt-Groove wird gerendert …', wavDone:'WAV fertig', wavDoneSub:'Groove wurde exportiert.',
    imported:'Audio importiert', projectSaved:'Projekt gespeichert', projectSavedSub:'Automatische Sicherung im Browser aktualisiert.', noProject:'Noch kein Projekt gespeichert.', projectImported:'Projekt importiert', invalidProject:'Ungültige Projektdatei.',
    helpModeOn:'Hilfe-Modus aktiv', helpModeOff:'Hilfe-Modus aus', helpModeOnSub:'Tippe oder halte Elemente für Erklärungen.', helpModeOffSub:'Normale Bedienung.', preset:'Preset', languageChanged:'Sprache: Deutsch', pianoRoll:'PIANO-ROLL', pianoSub:'Tippe ins Raster für eine Note. Ziehe eine Note zum Verschieben. Ziehe ihren rechten Rand zum Verlängern.', preview:'▶ VORSCHAU', snap:'RASTER', deleteNote:'NOTE LÖSCHEN', clearNotes:'ALLE NOTEN LÖSCHEN', editNotes:'NOTEN BEARBEITEN', pianoLongHelp:'Langes Drücken auf einen Noten-Clip öffnet ebenfalls diesen Editor.', stepsWord:'Schritte', noNoteSelected:'Keine Note ausgewählt.', templatesEyebrow:'VORLAGEN & LOOPS', templatesTitle:'Fertige Beats als Startpunkt', templatesText:'Eine Vorlage laden und sofort hören – oder einzelne Kick-, Bass-, Drum-, Acid-, Synth-, Melodie-, Vocal- und FX-Blöcke in deinen eigenen Song setzen.', demoSongs:'DEMO-SONGS', demoSongsHint:'Komplette 16-Takt-Grundlagen zum Zerlegen und Umbauen.', loopLibrary:'LOOP-BIBLIOTHEK', loopLibraryHint:'Vorschau anhören oder als verlängerbaren Block in den Arranger legen.', audition:'▶ VORSCHAU', addLoop:'+ HINZUFÜGEN', templateLoad:'VORLAGE LADEN', allLoops:'ALLE', templateLoaded:'Vorlage geladen', loopAdded:'Loop hinzugefügt', loopPreview:'Loop-Vorschau', overwriteQuestion:'Aktuelles Arrangement durch diese Vorlage ersetzen?', emptyTemplate:'LEER STARTEN', djEyebrow:'NÉVO PLAYER', djTitle:'Fertige Songs abspielen & mixen', djText:'Lade deine fertigen WAV/MP3-Dateien, spiele sie wie auf einem DJ-Deck und ziehe sie bei Bedarf direkt in den Arranger.', djImport:'+ SONGS LADEN', djLibrary:'PLAYER-BIBLIOTHEK', djLibraryHint:'Song auswählen und auf Deck A oder B laden.', djEmpty:'Noch keine Songs geladen.', djSetCue:'CUE SETZEN', djKeyLock:'TONHALTE AN', djTrackBpm:'TRACK BPM', djPitch:'TEMPO', djVolume:'LAUTSTÄRKE', djLoop:'LOOP', djAddArranger:'→ IN ARRANGER', djCrossfader:'CROSSFADER', djLoaded:'Song geladen', djAddedArranger:'Song im Arranger', audioEditorHint:'Tippe in die Wellenform, um den Schnitt-Cursor zu setzen. Ziehe START/ENDE zum Trimmen. Fade-Regler bestimmen Ein- und Ausblendung.'
  },
  en:{
    audioStart:'START AUDIO', audioOn:'AUDIO ON', play:'▶ PLAY', stop:'■ STOP', record:'● RECORD', stopRecord:'■ STOP REC', bpm:'BPM', save:'SAVE', load:'LOAD', exportWav:'EXPORT WAV', help:'? HELP',
    workflow:'TECHNO WORKFLOW', dark:'Dark', hypnotic:'Hypnotic', minimal:'Minimal', raw:'Raw', heroTitle:'Build your song from blocks. Drag. Loop. Extend.', heroText:'The arranger is the center. Clips can be moved, extended and looped. Long-press an element to see what it does.',
    soundDirection:'Sound Direction', key:'KEY', safeOn:'SAFE NOTES ON', safeOff:'SAFE NOTES OFF', songView:'Song View', loop:'LOOP', addTrack:'+ TRACK', addAudio:'+ AUDIO', bar:'BAR',
    arrangerHelp:'Tap empty space = add clip · drag clip = move · drag right handle = extend · long press = help/actions',
    quickMacros:'QUICK MACROS', shapeFast:'Shape Fast', macroHint:'Large controls for punch, brightness, space and width.', instrument:'Instrument', waveform:'WAVEFORM', keyboard:'KEYBOARD', playKeys:'Play',
    keyboardHint:'Choose direct playing or a natural release. Pressed keys glow while the note is active.', keyboardRecordHint:'When RECORD is active above, your keyboard performance is also saved as a movable note clip in the arranger.', playStyle:'PLAY STYLE', directMode:'DIRECT', naturalMode:'NATURAL', sustainPedal:'SUSTAIN', on:'ON', off:'OFF', octave:'OCTAVE', steps16:'16 STEP', grooveEditor:'Groove Editor', rootNote:'ROOT', swing:'SWING', clear:'CLEAR', demo:'DEMO', groovePlay:'▶ PREVIEW GROOVE', grooveStop:'■ STOP', grooveApply:'→ ADD TO SONG', songPlay:'▶ SONG', songLength:'SONG LENGTH', position:'POSITION', maxTenMinutes:'MAX. 10 MINUTES', grooveInfo:'Tap a step to audition it. PREVIEW GROOVE plays only this 16-step groove. ADD TO SONG places it as blocks in the arranger.',
    project:'PROJECT', saveProject:'Save Project', projectHint:'Autosave in the browser, JSON for projects and WAV for your finished export.', projectJson:'PROJECT JSON', importJson:'IMPORT JSON', knobHint:'drag · tap value · hold = help', valueBetween:'Value between',
    helpTitle:'HELP', duplicate:'DUPLICATE', delete:'DELETE', loopOn:'LOOP ON', loopOff:'LOOP OFF', barOne:'bar', barMany:'bars', clipSuffix:'Clip', effects:'FX',
    audioInactive:'Audio not started', audioInactiveSub:'Tap START AUDIO', audioActive:'Audio active', audioActiveSub:'Arranger and instruments are ready.', songRunning:'Song playing', songStopped:'Song stopped.',
    recording:'Recording', recordingSub:'The master output is being recorded.', recordingSaved:'Recording saved', recordingSavedSub:'File created.', noteClipSaved:'Note clip created', noteClipSavedSub:'Your keyboard performance is now a block in the arranger.', wavExporting:'WAV Export', wavExportingSub:'Rendering the current 16-step groove …', wavDone:'WAV ready', wavDoneSub:'Groove exported.',
    imported:'Audio imported', projectSaved:'Project saved', projectSavedSub:'Browser autosave updated.', noProject:'No saved project yet.', projectImported:'Project imported', invalidProject:'Invalid project file.',
    helpModeOn:'Help Mode on', helpModeOff:'Help Mode off', helpModeOnSub:'Tap or hold elements for explanations.', helpModeOffSub:'Normal controls.', preset:'Preset', languageChanged:'Language: English', pianoRoll:'PIANO ROLL', pianoSub:'Tap the grid to add a note. Drag a note to move it. Drag its right edge to change its length.', preview:'▶ PREVIEW', snap:'SNAP', deleteNote:'DELETE NOTE', clearNotes:'DELETE ALL NOTES', editNotes:'EDIT NOTES', pianoLongHelp:'Long-pressing a note clip also opens this editor.', stepsWord:'steps', noNoteSelected:'No note selected.', templatesEyebrow:'TEMPLATES & LOOPS', templatesTitle:'Ready beats as a starting point', templatesText:'Load a template and hear it immediately – or place individual kick, bass, drum, acid, synth, melody, vocal and FX blocks into your own song.', demoSongs:'DEMO SONGS', demoSongsHint:'Complete 16-bar foundations to take apart and rebuild.', loopLibrary:'LOOP LIBRARY', loopLibraryHint:'Preview a loop or place it into the arranger as an extendable block.', audition:'▶ PREVIEW', addLoop:'+ ADD', templateLoad:'LOAD TEMPLATE', allLoops:'ALL', templateLoaded:'Template loaded', loopAdded:'Loop added', loopPreview:'Loop preview', overwriteQuestion:'Replace the current arrangement with this template?', emptyTemplate:'START EMPTY', djEyebrow:'NÉVO PLAYER', djTitle:'Play & mix finished songs', djText:'Load finished WAV/MP3 files, play them on DJ-style decks and send them directly into the arranger when you want to edit them.', djImport:'+ LOAD SONGS', djLibrary:'PLAYER LIBRARY', djLibraryHint:'Choose a song and load it to Deck A or B.', djEmpty:'No songs loaded yet.', djSetCue:'SET CUE', djKeyLock:'KEY LOCK ON', djTrackBpm:'TRACK BPM', djPitch:'TEMPO', djVolume:'VOLUME', djLoop:'LOOP', djAddArranger:'→ TO ARRANGER', djCrossfader:'CROSSFADER', djLoaded:'Song loaded', djAddedArranger:'Song added to arranger', audioEditorHint:'Tap the waveform to set the cut cursor. Drag START/END to trim. Fade sliders control fade-in and fade-out.'
  }
};
let currentLang = localStorage.getItem('nevoLanguage') || 'de';
const t = key => (I18N[currentLang] && I18N[currentLang][key]) || I18N.de[key] || key;
const localName = obj => currentLang==='en' ? (obj.nameEn || obj.name) : (obj.nameDe || obj.name);
const barText = n => `${n} ${n===1?t('barOne'):t('barMany')}`;
const barDurationSeconds = () => 60 / clamp(Number($('#bpm')?.value)||150,60,220) * 4;
const maxBarsForTenMinutes = () => Math.max(16, Math.floor(MAX_SONG_SECONDS / barDurationSeconds()));
const fmtTime = sec => {
  sec=Math.max(0,Math.round(sec));
  const m=Math.floor(sec/60), ss=sec%60;
  return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
};
function populateBarSelect(sel,max,current){
  if(!sel)return;
  const keep=clamp(Number(current)||1,1,max);
  sel.innerHTML='';
  for(let i=1;i<=max;i++){
    const o=document.createElement('option');o.value=String(i);o.textContent=String(i);
    if(i===keep)o.selected=true;sel.appendChild(o);
  }
}
function updateSongTimeLabel(bar=Number($('#loopStart')?.value||1)-1,local=0){
  const start=Math.max(0,Number($('#loopStart')?.value||1)-1);
  const end=Math.max(start+1,Number($('#loopEnd')?.value||16));
  const pos=Math.max(0,(bar+local/16-start)*barDurationSeconds());
  const total=(end-start)*barDurationSeconds();
  if($('#songPositionLabel'))$('#songPositionLabel').textContent=`${fmtTime(pos)} / ${fmtTime(total)}`;
}
function clampArrangementToSong(){
  tracks.forEach(tr=>{
    tr.clips=(tr.clips||[]).filter(c=>c.start<TOTAL_BARS);
    tr.clips.forEach(c=>{c.start=clamp(c.start,0,TOTAL_BARS-1);c.len=clamp(c.len,1,TOTAL_BARS-c.start)});
  });
}
function refreshSongLengthLimit(preserve=true){
  const oldStart=preserve?Number($('#loopStart')?.value||1):1;
  const oldEnd=preserve?Number($('#loopEnd')?.value||16):16;
  TOTAL_BARS=maxBarsForTenMinutes();
  document.documentElement.style.setProperty('--timeline-width',`${TOTAL_BARS*BAR_W}px`);
  populateBarSelect($('#loopStart'),TOTAL_BARS,Math.min(oldStart,TOTAL_BARS));
  populateBarSelect($('#loopEnd'),TOTAL_BARS,Math.min(Math.max(oldEnd,1),TOTAL_BARS));
  if(Number($('#loopEnd').value)<Number($('#loopStart').value))$('#loopEnd').value=$('#loopStart').value;
  if($('#songBarsInfo'))$('#songBarsInfo').textContent=`${$('#bpm').value} BPM · ${TOTAL_BARS} ${currentLang==='de'?'Takte':'bars'}`;
  clampArrangementToSong();
  buildTimeline();
  renderTracks();
  updateSongTimeLabel();
}

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
  if($('#groovePlayBtn')) $('#groovePlayBtn').textContent=t('groovePlay');
  if($('#grooveStopBtn')) $('#grooveStopBtn').textContent=t('grooveStop');
  if($('#grooveToArrangerBtn')) $('#grooveToArrangerBtn').textContent=t('grooveApply');
  if($('#arrPlayBtn')) $('#arrPlayBtn').textContent=t('songPlay');
  if($('#arrStopBtn')) $('#arrStopBtn').textContent=t('stop');
  if($('#arrBottomPlayBtn')) $('#arrBottomPlayBtn').textContent=currentLang==='de'?'▶ SONG ABSPIELEN':'▶ PLAY SONG';
  if($('#arrBottomStopBtn')) $('#arrBottomStopBtn').textContent=t('stop');
  if($('#grooveInfo')) $('#grooveInfo').textContent=t('grooveInfo');
  if($('#recBtn') && (!recorder || recorder.state==='inactive')) $('#recBtn').textContent=t('record');
  updateKeyboardControls();
  Object.values(params).forEach(p=>{if(!p.labelDe)p.labelDe=p.label;p.label=currentLang==='en'?(p.labelEn||p.labelDe):p.labelDe});
  Object.values(macros).forEach(p=>{if(!p.labelDe)p.labelDe=p.label;p.label=currentLang==='en'?(p.labelEn||p.labelDe):p.labelDe});
  $$('.preset-card').forEach(card=>{const copy=presetCopy[card.dataset.preset]?.[currentLang];if(copy){card.querySelector('strong').textContent=copy[0];card.querySelector('span').textContent=copy[1]}});
  if($('#songBarsInfo'))$('#songBarsInfo').textContent=`${$('#bpm')?.value||150} BPM · ${TOTAL_BARS} ${currentLang==='de'?'Takte':'bars'}`;
  if($('#songLengthPreset')){
    const labels=currentLang==='de'?{'16':'16 Takte','32':'32 Takte','64':'64 Takte','128':'128 Takte','5m':'5:00 Min','10m':'10:00 Min'}:{'16':'16 bars','32':'32 bars','64':'64 bars','128':'128 bars','5m':'5:00 min','10m':'10:00 min'};
    $$('#songLengthPreset option').forEach(o=>o.textContent=labels[o.value]||o.textContent);
  }
  if(rebuild){buildMacros(false);buildKnobs();renderTracks();renderDemoTemplates();renderLoopLibrary();if(pianoClip)renderPianoRoll()}
}
function setLanguage(lang){currentLang=lang==='en'?'en':'de';applyLanguageToUI(true);setStatus(audioReady,t('languageChanged'),currentLang==='de'?'Die App ist jetzt auf Deutsch.':'The app is now in English.');setTimeout(()=>{try{renderDjLibrary();refreshAllDeckUi()}catch{}},0)}

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


const LOOP_CATEGORIES = [
  ['all','ALLE','ALL'],['kick','KICK','KICK'],['drums','DRUMS','DRUMS'],['bass','BASS','BASS'],['acid','ACID','ACID'],['synth','SYNTH','SYNTH'],['melody','MELODIE','MELODY'],['vocals','VOCALS','VOCALS'],['fx','FX','FX'],['psy','PSY','PSY']
];
let activeLoopCategory='all';

const LOOP_LIBRARY = {
  'kick-driving':{cat:'kick',target:'kick',trackType:'kick',color:'#ffb55e',bars:1,bpm:150,engine:'kick',steps:[0,4,8,12],nameDe:'Treibende Kick',nameEn:'Driving Kick',descDe:'Trocken, kompakt, 4/4 – gute Minimal-Techno-Basis.',descEn:'Dry, compact 4/4 – a solid minimal-techno base.'},
  'kick-deep':{cat:'kick',target:'kick',trackType:'kick',color:'#f5a04c',bars:1,bpm:146,engine:'kickDeep',steps:[0,4,8,12],nameDe:'Tiefe Minimal Kick',nameEn:'Deep Minimal Kick',descDe:'Etwas runder und tiefer, weniger aggressiv.',descEn:'Rounder and deeper, less aggressive.'},
  'kick-psy':{cat:'kick',tags:['psy'],target:'kick',trackType:'kick',color:'#ff9e5d',bars:1,bpm:148,engine:'kickPsy',steps:[0,4,8,12],nameDe:'Psy-Tech Kick',nameEn:'Psy-Tech Kick',descDe:'Kurze, feste Kick für rollende Psy-Tech-Bässe.',descEn:'Short, firm kick for rolling psy-tech bass.'},
  'kick-raw':{cat:'kick',target:'kick',trackType:'kick',color:'#ff775e',bars:1,bpm:152,engine:'kickRaw',steps:[0,4,8,12],nameDe:'Rohe Peak Kick',nameEn:'Raw Peak Kick',descDe:'Härter, dichter und direkter für Peak-Passagen.',descEn:'Harder, denser and more direct for peak sections.'},

  'drums-minimal':{cat:'drums',target:'perc',trackType:'perc',color:'#ffcc84',bars:1,bpm:146,engine:'hats',steps:[2,6,10,14],openSteps:[14],nameDe:'Minimal Hats',nameEn:'Minimal Hats',descDe:'Saubere Offbeat-Hats mit wenig Ablenkung.',descEn:'Clean offbeat hats with little distraction.'},
  'drums-rolling':{cat:'drums',target:'perc',trackType:'perc',color:'#ffd089',bars:1,bpm:150,engine:'drums',steps:[2,4,6,10,12,14,15],clapSteps:[4,12],openSteps:[6,14],nameDe:'Rollender Drum-Groove',nameEn:'Rolling Drum Groove',descDe:'Hats, kurze Percussion und Clap als fertiger Groove.',descEn:'Hats, short percussion and clap as a ready groove.'},
  'drums-tribal':{cat:'drums',target:'perc',trackType:'perc',color:'#e8a85e',bars:2,bpm:150,engine:'tribal',steps:[3,6,10,14,19,22,27,30],nameDe:'Trockene Tribal Perc',nameEn:'Dry Tribal Perc',descDe:'Trockene Percussion für Bewegung ohne große Melodie.',descEn:'Dry percussion for movement without much melody.'},
  'drums-psy':{cat:'drums',tags:['psy'],target:'perc',trackType:'perc',color:'#d6adff',bars:1,bpm:148,engine:'hats',steps:[2,3,6,7,10,11,14,15],openSteps:[6,14],nameDe:'Psy Hats',nameEn:'Psy Hats',descDe:'Schnellere Hats für rollende Psy-Tech-Grooves.',descEn:'Faster hats for rolling psy-tech grooves.'},

  'bass-coronita':{cat:'bass',target:'bass',trackType:'bass',color:'#54d8ff',bars:1,bpm:150,engine:'bass',steps:[0,3,6,8,10,14],offsets:[0,0,3,0,7,3],nameDe:'Coronita Rolling Bass',nameEn:'Coronita Rolling Bass',descDe:'Kurzer, rollender Minimal-Bass mit unregelmäßiger Bewegung.',descEn:'Short rolling minimal bass with irregular movement.'},
  'bass-minimal':{cat:'bass',target:'bass',trackType:'bass',color:'#48cfff',bars:1,bpm:146,engine:'bass',steps:[0,5,8,11,14],offsets:[0,0,3,0,5],nameDe:'Minimal Bass',nameEn:'Minimal Bass',descDe:'Wenig Noten, viel Platz für Kick und Percussion.',descEn:'Few notes, lots of room for kick and percussion.'},
  'bass-deep':{cat:'bass',target:'bass',trackType:'bass',color:'#3bb9ea',bars:1,bpm:150,engine:'bassDeep',steps:[0,4,7,10,12,15],offsets:[0,0,-2,0,3,0],nameDe:'Dunkler Deep Bass',nameEn:'Dark Deep Bass',descDe:'Tiefer, kompakter Bass als stabiles Fundament.',descEn:'Deep compact bass as a stable foundation.'},
  'bass-psy':{cat:'bass',tags:['psy'],target:'bass',trackType:'bass',color:'#b980ff',bars:1,bpm:148,engine:'psyBass',steps:[1,2,3,5,6,7,9,10,11,13,14,15],offsets:[0,0,0,0,0,0,0,0,0,0,0,0],nameDe:'Rollender Psy Bass',nameEn:'Rolling Psy Bass',descDe:'Kurze Bassnoten zwischen den Kicks – schnell und hypnotisch.',descEn:'Short bass notes between kicks – fast and hypnotic.'},

  'acid-303':{cat:'acid',target:'acid',trackType:'acid',color:'#36f0c0',bars:1,bpm:154,engine:'acid',steps:[2,5,7,10,14],offsets:[0,3,7,10,12],nameDe:'303 Acid Linie',nameEn:'303 Acid Line',descDe:'Resonante, kurze Acid-Figur als sofortige Grundlage.',descEn:'Resonant short acid figure as an instant foundation.'},
  'acid-minimal':{cat:'acid',target:'acid',trackType:'acid',color:'#26d9ae',bars:2,bpm:150,engine:'acid',steps:[2,6,10,14,18,23,27,30],offsets:[0,0,3,7,0,5,3,10],nameDe:'Minimal Acid Puls',nameEn:'Minimal Acid Pulse',descDe:'Weniger 303-Gefrickel, mehr hypnotischer Filter-Puls.',descEn:'Less busy 303 movement, more hypnotic filter pulse.'},
  'acid-psy':{cat:'acid',tags:['psy'],target:'acid',trackType:'acid',color:'#51e0b9',bars:1,bpm:148,engine:'acid',steps:[3,7,11,15],offsets:[0,7,3,10],nameDe:'Psy Acid Akzente',nameEn:'Psy Acid Accents',descDe:'Acid-Akzente zwischen einem rollenden Psy-Bass.',descEn:'Acid accents between a rolling psy bass.'},

  'synth-hypnotic':{cat:'synth',target:'synth',trackType:'synth',color:'#7edfff',bars:2,bpm:147,engine:'synth',steps:[0,6,11,16,22,27],offsets:[12,12,15,12,19,15],nameDe:'Hypnotischer Puls',nameEn:'Hypnotic Pulse',descDe:'Wiederholender Puls mit kleinen Tonabweichungen.',descEn:'Repeating pulse with small pitch changes.'},
  'synth-darkstab':{cat:'synth',target:'synth',trackType:'synth',color:'#63ccec',bars:1,bpm:150,engine:'stab',steps:[0,7,12],offsets:[12,15,10],nameDe:'Dunkler Stab',nameEn:'Dark Stab',descDe:'Kurze dunkle Stabs für Raum und Spannung.',descEn:'Short dark stabs for space and tension.'},
  'synth-psy':{cat:'synth',tags:['psy'],target:'synth',trackType:'synth',color:'#a979ff',bars:2,bpm:148,engine:'synth',steps:[4,12,20,28],offsets:[12,19,15,22],nameDe:'Psy Tunnel Puls',nameEn:'Psy Tunnel Pulse',descDe:'Wenig Melodie, mehr psychedelischer Tunnel-Sog.',descEn:'Less melody, more psychedelic tunnel pull.'},

  'melody-dark':{cat:'melody',target:'melody',trackType:'melody',color:'#8fe8ff',bars:2,bpm:147,engine:'melody',steps:[0,4,8,12,20,24,28],offsets:[12,15,19,15,12,10,15],nameDe:'Dunkle 4-Noten-Melodie',nameEn:'Dark 4-Note Melody',descDe:'Einfache, merkbare Moll-Figur – leicht weiterzubauen.',descEn:'Simple memorable minor figure – easy to build on.'},
  'melody-glass':{cat:'melody',target:'melody',trackType:'melody',color:'#74ddff',bars:2,bpm:150,engine:'glass',steps:[0,7,16,23],offsets:[12,19,15,22],nameDe:'Glas-Hook',nameEn:'Glass Hook',descDe:'Wenige klare Noten als Hook, nicht zu melodisch.',descEn:'A few clear hook notes without becoming too melodic.'},

  'vocals-chop':{cat:'vocals',target:'vocal',trackType:'vocal',color:'#ff83b6',bars:2,bpm:150,engine:'vocal',steps:[6,14,22,30],offsets:[12,15,12,19],nameDe:'Vocal-Chop (synthetisch)',nameEn:'Vocal Chop (synthetic)',descDe:'Synthetischer Vokal-ähnlicher Chop als Demo-Platzhalter.',descEn:'Synthetic vocal-like chop as a demo placeholder.'},
  'vocals-air':{cat:'vocals',target:'vocal',trackType:'vocal',color:'#d988b1',bars:2,bpm:147,engine:'vocalAir',steps:[0,16],offsets:[12,15],nameDe:'Luftiger Vocal-Hauch',nameEn:'Airy Vocal Breath',descDe:'Luftige Textur für Breaks – später durch echte Vocals ersetzbar.',descEn:'Airy break texture – replaceable with real vocals later.'},

  'fx-riser':{cat:'fx',target:'fx',trackType:'fx',color:'#9bb7ca',bars:1,bpm:150,engine:'riser',steps:[0],nameDe:'Riser',nameEn:'Riser',descDe:'Kurzer Anstieg vor einem neuen Abschnitt.',descEn:'Short rise before a new section.'},
  'fx-down':{cat:'fx',target:'fx',trackType:'fx',color:'#879bad',bars:1,bpm:150,engine:'downfx',steps:[0],nameDe:'Downlifter',nameEn:'Downlifter',descDe:'Abwärts-FX nach Peak oder Übergang.',descEn:'Downward FX after a peak or transition.'},
  'fx-atmo':{cat:'fx',target:'fx',trackType:'fx',color:'#7d91a6',bars:2,bpm:147,engine:'atmo',steps:[0,16],nameDe:'Dunkle Atmosphäre',nameEn:'Dark Atmosphere',descDe:'Leise Textur unter Breaks und Übergängen.',descEn:'Quiet texture under breaks and transitions.'}
};

const DEMO_TEMPLATES = {
  minimal:{nameDe:'MINIMAL 146',nameEn:'MINIMAL 146',descDe:'Trocken · wenig Melodie · viel Groove',descEn:'Dry · little melody · lots of groove',bpm:146,swing:20,key:'D3',preset:'minimal',blocks:[
    ['kick-driving',0,16],['drums-minimal',0,16],['bass-minimal',0,8],['bass-minimal',8,8],['synth-darkstab',4,4],['synth-hypnotic',10,6],['fx-riser',7,1],['fx-down',15,1]
  ]},
  acid:{nameDe:'ACID 154',nameEn:'ACID 154',descDe:'303 · trockene Drums · Peak-Schub',descEn:'303 · dry drums · peak push',bpm:154,swing:14,key:'C#3',preset:'acid',blocks:[
    ['kick-raw',0,16],['drums-rolling',0,16],['bass-deep',0,16],['acid-303',4,8],['acid-minimal',12,4],['synth-darkstab',8,4],['fx-riser',7,1],['fx-down',15,1]
  ]},
  psy:{nameDe:'PSY-TECH 148',nameEn:'PSY-TECH 148',descDe:'Rollender Bass · Tunnel-Puls · wenig Goa',descEn:'Rolling bass · tunnel pulse · restrained psy',bpm:148,swing:8,key:'D3',preset:'hypnotic',blocks:[
    ['kick-psy',0,16],['bass-psy',0,16],['drums-psy',0,16],['acid-psy',4,12],['synth-psy',8,8],['fx-riser',7,1],['fx-down',15,1]
  ]},
  coronita:{nameDe:'CORONITA BASS 150',nameEn:'CORONITA BASS 150',descDe:'Rollender Minimal-Bass · trocken · hypnotisch',descEn:'Rolling minimal bass · dry · hypnotic',bpm:150,swing:22,key:'D3',preset:'driving',blocks:[
    ['kick-driving',0,16],['bass-coronita',0,16],['drums-tribal',0,8],['drums-rolling',8,8],['synth-hypnotic',4,12],['melody-glass',12,4],['fx-riser',7,1],['fx-down',15,1]
  ]},
  dark:{nameDe:'DARK HYPNOTIC 147',nameEn:'DARK HYPNOTIC 147',descDe:'Dunkel · monotoner Sog · viel Raum',descEn:'Dark · monotone pull · more space',bpm:147,swing:24,key:'F3',preset:'hypnotic',blocks:[
    ['kick-deep',0,16],['drums-minimal',0,16],['bass-deep',0,16],['synth-hypnotic',4,12],['melody-dark',8,8],['vocals-air',8,8],['fx-atmo',6,9],['fx-riser',15,1]
  ]}
};

function loopItemName(item){return currentLang==='en'?(item.nameEn||item.nameDe):(item.nameDe||item.nameEn)}
function loopItemDesc(item){return currentLang==='en'?(item.descEn||item.descDe):(item.descDe||item.descEn)}
function templateName(item){return currentLang==='en'?(item.nameEn||item.nameDe):(item.nameDe||item.nameEn)}
function templateDesc(item){return currentLang==='en'?(item.descEn||item.descDe):(item.descDe||item.descEn)}
function makeLibraryClip(loopKey,start=0,len=null){const item=LOOP_LIBRARY[loopKey];return{id:uid(),start,len:len??item.bars,name:item.nameEn||item.nameDe,nameDe:item.nameDe,nameEn:item.nameEn,loop:true,loopKey,sourceSteps:item.bars*16}}
function baseTrackForTarget(target,item){const defs={kick:['KICK','#ffb55e','kick'],bass:['BASS','#54d8ff','bass'],acid:['ACID','#36f0c0','acid'],synth:['SYNTH','#7edfff','synth'],perc:['PERCUSSION','#ffcc84','perc'],melody:['MELODIE','#8fe8ff','melody'],vocal:['VOCALS','#ff83b6','vocal'],fx:['EFFEKTE','#9bb7ca','fx']};const d=defs[target]||[target.toUpperCase(),item?.color||'#7edfff',item?.trackType||'synth'];return{id:target,name:d[0],nameDe:d[0],nameEn:target==='perc'?'PERCUSSION':target==='melody'?'MELODY':target==='vocal'?'VOCALS':target==='fx'?'FX':d[0],color:d[1],type:d[2],mute:false,solo:false,clips:[]}}
function findLoopTrack(item){return tracks.find(t=>t.id===item.target)||tracks.find(t=>t.type===item.trackType)}
function firstFreeBar(track,len){for(let start=0;start<=TOTAL_BARS-len;start++){const overlap=track.clips.some(c=>start<c.start+c.len&&start+len>c.start);if(!overlap)return start}return -1}
function addLoopToArranger(loopKey){const item=LOOP_LIBRARY[loopKey];if(!item)return;let tr=findLoopTrack(item);if(!tr){tr=baseTrackForTarget(item.target,item);tracks.push(tr)}let start=firstFreeBar(tr,item.bars);if(start<0){tr=baseTrackForTarget(item.target+'-'+uid(),item);tr.id=item.target+'-'+uid();tracks.push(tr);start=0}tr.clips.push(makeLibraryClip(loopKey,start,item.bars));renderTracks();setStatus(audioReady,t('loopAdded'),`${loopItemName(item)} · ${barText(item.bars)}`)}
function clearArrangementForTemplate(){tracks.length=0;['kick','bass','acid','synth','perc','melody','vocal','fx'].forEach(id=>tracks.push(baseTrackForTarget(id,{})))}
function loadDemoTemplate(key){if(key==='empty'){if(!confirm(t('overwriteQuestion')))return;clearArrangementForTemplate();renderTracks();setStatus(audioReady,t('emptyTemplate'),'');return}const d=DEMO_TEMPLATES[key];if(!d)return;if(!confirm(t('overwriteQuestion')))return;clearArrangementForTemplate();$('#bpm').value=d.bpm;refreshSongLengthLimit(false);$('#loopStart').value='1';$('#loopEnd').value='16';$('#swing').value=d.swing;$('#swingValue').textContent=d.swing+'%';$('#keySelect').value=d.key;$('#rootNote').value=d.key;applyPreset(d.preset);$('#bpm').value=d.bpm;$('#swing').value=d.swing;$('#swingValue').textContent=d.swing+'%';d.blocks.forEach(([loopKey,start,len])=>{const item=LOOP_LIBRARY[loopKey],tr=findLoopTrack(item);tr.clips.push(makeLibraryClip(loopKey,start,len))});renderTracks();refreshSafeNotes();setStatus(audioReady,t('templateLoaded'),`${templateName(d)} · ${d.bpm} BPM`)}
function renderDemoTemplates(){const g=$('#demoTemplateGrid');if(!g)return;g.innerHTML='';Object.entries(DEMO_TEMPLATES).forEach(([key,d])=>{const b=document.createElement('button');b.className='demo-template-card';b.innerHTML=`<span class="template-bpm">${d.bpm} BPM</span><strong>${templateName(d)}</strong><small>${templateDesc(d)}</small><em>${t('templateLoad')} →</em>`;b.onclick=()=>loadDemoTemplate(key);longPress(b,()=>showHelp('library'));g.appendChild(b)});const empty=document.createElement('button');empty.className='demo-template-card empty';empty.innerHTML=`<span class="template-bpm">0</span><strong>${t('emptyTemplate')}</strong><small>${currentLang==='de'?'Leere Spuren – alles selbst bauen.':'Empty tracks – build everything yourself.'}</small><em>${t('templateLoad')} →</em>`;empty.onclick=()=>loadDemoTemplate('empty');g.appendChild(empty)}
function renderLoopCategories(){const box=$('#loopCategoryTabs');if(!box)return;box.innerHTML='';LOOP_CATEGORIES.forEach(([key,de,en])=>{const b=document.createElement('button');b.className='loop-tab'+(activeLoopCategory===key?' active':'');b.textContent=currentLang==='en'?en:de;b.onclick=()=>{activeLoopCategory=key;renderLoopCategories();renderLoopLibrary()};box.appendChild(b)})}
function renderLoopLibrary(){const g=$('#loopLibraryGrid');if(!g)return;renderLoopCategories();g.innerHTML='';Object.entries(LOOP_LIBRARY).filter(([k,item])=>activeLoopCategory==='all'||item.cat===activeLoopCategory||(item.tags||[]).includes(activeLoopCategory)).forEach(([key,item])=>{const card=document.createElement('div');card.className='loop-card';card.style.setProperty('--loop-color',item.color||'#54d8ff');card.innerHTML=`<div class="loop-card-top"><span class="loop-type">${item.cat.toUpperCase()}</span><span>${item.bpm} BPM · ${barText(item.bars)}</span></div><strong>${loopItemName(item)}</strong><p>${loopItemDesc(item)}</p><div class="loop-card-actions"><button class="btn small preview-loop">${t('audition')}</button><button class="btn small add-loop">${t('addLoop')}</button></div>`;card.querySelector('.preview-loop').onclick=()=>previewLibraryLoop(key);card.querySelector('.add-loop').onclick=()=>addLoopToArranger(key);longPress(card,()=>showHelp('libraryLoop',[{label:t('audition'),run:()=>previewLibraryLoop(key)},{label:t('addLoop'),run:()=>addLoopToArranger(key)}]));g.appendChild(card)})}

const tracks = [
  {id:'kick',name:'KICK',nameDe:'KICK',nameEn:'KICK',color:'#ffb55e',type:'kick',mute:false,solo:false,clips:[{id:uid(),start:0,len:8,name:'Driving Kick',nameDe:'Treibende Kick',nameEn:'Driving Kick',loop:true},{id:uid(),start:8,len:8,name:'Peak Kick',nameDe:'Peak-Kick',nameEn:'Peak Kick',loop:true}]},
  {id:'bass',name:'BASS',nameDe:'BASS',nameEn:'BASS',color:'#54d8ff',type:'bass',mute:false,solo:false,clips:[{id:uid(),start:0,len:6,name:'Dark Bass',nameDe:'Dunkler Bass',nameEn:'Dark Bass',loop:true},{id:uid(),start:8,len:8,name:'Bass Peak',nameDe:'Bass-Peak',nameEn:'Bass Peak',loop:true}]},
  {id:'acid',name:'ACID',nameDe:'ACID',nameEn:'ACID',color:'#36f0c0',type:'acid',mute:false,solo:false,clips:[{id:uid(),start:4,len:4,name:'Acid Texture',nameDe:'Acid-Textur',nameEn:'Acid Texture',loop:true},{id:uid(),start:12,len:4,name:'Acid Push',nameDe:'Acid-Schub',nameEn:'Acid Push',loop:true}]},
  {id:'synth',name:'SYNTH',nameDe:'SYNTH',nameEn:'SYNTH',color:'#7edfff',type:'synth',mute:false,solo:false,clips:[{id:uid(),start:2,len:4,name:'Hypnotic Pulse',nameDe:'Hypnotischer Puls',nameEn:'Hypnotic Pulse',loop:true},{id:uid(),start:10,len:6,name:'Dark Stab',nameDe:'Dunkler Stab',nameEn:'Dark Stab',loop:true}]},
  {id:'perc',name:'PERC',nameDe:'PERCUSSION',nameEn:'PERCUSSION',color:'#ffcc84',type:'perc',mute:false,solo:false,clips:[{id:uid(),start:0,len:16,name:'Hat Groove',nameDe:'Hi-Hat-Groove',nameEn:'Hat Groove',loop:true}]},
  {id:'fx',name:'FX',nameDe:'EFFEKTE',nameEn:'FX',color:'#9bb7ca',type:'fx',mute:false,solo:false,clips:[{id:uid(),start:7,len:1,name:'Riser',nameDe:'Anstieg',nameEn:'Riser',loop:false},{id:uid(),start:15,len:1,name:'Down FX',nameDe:'Abwärts-FX',nameEn:'Down FX',loop:false}]}
];
const audioBuffers = new Map();
const arrangerAudioSources = new Set();

let ctx,master,filter,driveNode,dryGain,delay,delayFeedback,delayWet,convolver,reverbWet,mediaDest,analyser,noiseBuffer;
let voices=new Map(),audioReady=false,isPlaying=false,seqTimer=null,nextStepTime=0,globalStep=0,recorder=null,recChunks=[],meterRAF=null;
let groovePlaying=false,grooveTimer=null,grooveStep=0,grooveNextTime=0;
let midiTake=null,midiTakeCount=Number(localStorage.getItem('nevoMidiTakeCount')||0);
let pianoTrack=null,pianoClip=null,pianoSelectedNote=null,pianoPitches=[];
let helpMode=false,safeNotes=true;
let keyboardPlayMode=localStorage.getItem('nevoKeyboardMode')||'natural';
let sustainPedal=localStorage.getItem('nevoSustain')==='true';
let keyboardOctave=clamp(Number(localStorage.getItem('nevoKeyboardOctave')||0),-2,2);
const sustainedNotes=new Set();
if(keyboardPlayMode==='direct')sustainPedal=false;
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
function stopVoice(note,immediate=false){if(!ctx||!voices.has(note))return;const now=ctx.currentTime,r=immediate?.018:params.release.value;voices.get(note).forEach(v=>{const g=v.g.gain;g.cancelScheduledValues(now);if(typeof g.cancelAndHoldAtTime==='function'){try{g.cancelAndHoldAtTime(now)}catch{}}g.setTargetAtTime(.0001,now,immediate?.003:Math.max(.005,r/5));v.o1.stop(now+r+.08);v.o2.stop(now+r+.08)});voices.delete(note)}
function allKeyboardNotesOff(immediate=false){[...voices.keys()].forEach(n=>stopVoice(n,immediate));sustainedNotes.clear();$$('.key').forEach(k=>{k.classList.remove('active','sustained','releasing')})}
function kick(t){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.connect(g);g.connect(filter);o.frequency.setValueAtTime(155,t);o.frequency.exponentialRampToValueAtTime(43,t+.17);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.start(t);o.stop(t+.31)}
function hat(t,open=false){const src=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;hp.type='highpass';hp.frequency.value=7000;src.connect(hp);hp.connect(g);g.connect(filter);const dur=open?.18:.07;g.gain.setValueAtTime(open?.24:.18,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.start(t);src.stop(t+dur+.02)}
function fxNoise(t){const src=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;bp.type='bandpass';bp.frequency.setValueAtTime(500,t);bp.frequency.exponentialRampToValueAtTime(9000,t+.45);src.connect(bp);bp.connect(g);g.connect(filter);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+.48);src.start(t);src.stop(t+.5)}
function kickVariant(t,kind='normal'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.connect(g);g.connect(filter);const start=kind==='raw'?185:kind==='deep'?125:kind==='psy'?165:155,end=kind==='deep'?39:43,dur=kind==='raw'?.34:kind==='psy'?.25:.3,amp=kind==='raw'?1.0:kind==='deep'?.82:.9;o.frequency.setValueAtTime(start,t);o.frequency.exponentialRampToValueAtTime(end,t+Math.min(.18,dur*.6));g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.start(t);o.stop(t+dur+.02)}
function clapHit(t){const src=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;bp.type='bandpass';bp.frequency.value=1800;bp.Q.value=.8;src.connect(bp);bp.connect(g);g.connect(filter);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.22,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.12);src.start(t);src.stop(t+.14)}
function percHit(t,low=false){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(low?150:280,t);o.frequency.exponentialRampToValueAtTime(low?95:180,t+.08);o.connect(g);g.connect(filter);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.0001,t+.12);o.start(t);o.stop(t+.13)}
function downFx(t){const src=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;bp.type='bandpass';bp.frequency.setValueAtTime(8500,t);bp.frequency.exponentialRampToValueAtTime(280,t+.55);src.connect(bp);bp.connect(g);g.connect(filter);g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+.58);src.start(t);src.stop(t+.6)}
function atmoHit(t){const src=ctx.createBufferSource(),lp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noiseBuffer;lp.type='lowpass';lp.frequency.value=1100;src.connect(lp);lp.connect(g);g.connect(reverbWet||master);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.045,t+.12);g.gain.exponentialRampToValueAtTime(.0001,t+1.2);src.start(t);src.stop(t+1.25)}
function vocalChop(t,note,airy=false){const f=noteFreq(note),o=ctx.createOscillator(),g=ctx.createGain(),bp1=ctx.createBiquadFilter(),bp2=ctx.createBiquadFilter();o.type=airy?'triangle':'sawtooth';o.frequency.value=f;bp1.type='bandpass';bp1.frequency.value=airy?850:720;bp1.Q.value=5;bp2.type='bandpass';bp2.frequency.value=airy?2100:1350;bp2.Q.value=7;o.connect(bp1);o.connect(bp2);bp1.connect(g);bp2.connect(g);g.connect(filter);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(airy?.07:.11,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+(airy?.48:.22));o.start(t);o.stop(t+(airy?.52:.25))}
function glassNote(t,note,dur){startVoice(note,t,dur,{wave:'sine',amp:.14,width:16,attack:.004,decay:.12,sustain:.45,release:.35})}
function itemOffset(item,rel){const i=(item.steps||[]).indexOf(rel);return i>=0?(item.offsets?.[i]||0):0}
function scheduleLibraryItem(item,rel,t,sd=stepDur()){
  if(!(item.steps||[]).includes(rel))return;
  const root=$('#keySelect').value,off=itemOffset(item,rel);
  switch(item.engine){
    case'kick':kickVariant(t,'normal');break;case'kickDeep':kickVariant(t,'deep');break;case'kickPsy':kickVariant(t,'psy');break;case'kickRaw':kickVariant(t,'raw');break;
    case'hats':hat(t,(item.openSteps||[]).includes(rel));break;
    case'drums':hat(t,(item.openSteps||[]).includes(rel));if((item.clapSteps||[]).includes(rel))clapHit(t+.01);break;
    case'tribal':percHit(t,rel%8>4);break;
    case'bass':startVoice(transpose(root,-12+off),t,sd*.52,{wave:'sawtooth',amp:.19,width:2,attack:.003,decay:.08,sustain:.55,release:.1});break;
    case'bassDeep':startVoice(transpose(root,-12+off),t,sd*.62,{wave:'triangle',amp:.22,width:1,attack:.004,decay:.1,sustain:.62,release:.13});break;
    case'psyBass':startVoice(transpose(root,-12+off),t,sd*.68,{wave:'sawtooth',amp:.16,width:1,attack:.002,decay:.05,sustain:.46,release:.055});break;
    case'acid':startVoice(transpose(root,off),t,sd*.36,{wave:'sawtooth',amp:.13,width:1,attack:.002,decay:.05,sustain:.42,release:.07});break;
    case'synth':startVoice(transpose(root,off),t,sd*.58,{wave:'sawtooth',amp:.15,width:11,attack:.008,decay:.12,sustain:.42,release:.28});break;
    case'stab':startVoice(transpose(root,off),t,sd*.32,{wave:'square',amp:.13,width:8,attack:.004,decay:.09,sustain:.3,release:.22});break;
    case'melody':startVoice(transpose(root,off),t,sd*.82,{wave:'triangle',amp:.13,width:7,attack:.01,decay:.16,sustain:.55,release:.35});break;
    case'glass':glassNote(t,transpose(root,off),sd*.75);break;
    case'vocal':vocalChop(t,transpose(root,off),false);break;case'vocalAir':vocalChop(t,transpose(root,off),true);break;
    case'riser':fxNoise(t);break;case'downfx':downFx(t);break;case'atmo':atmoHit(t);break;
  }
}
async function previewLibraryLoop(key){const item=LOOP_LIBRARY[key];if(!item)return;await initAudio();const sd=60/item.bpm/4,t0=ctx.currentTime+.06,maxSteps=Math.min(16,item.bars*16);for(let i=0;i<maxSteps;i++){if(item.steps.includes(i))scheduleLibraryItem(item,i,t0+i*sd,sd)}setStatus(true,t('loopPreview'),`${loopItemName(item)} · ${item.bpm} BPM`)}

function valueToNorm(p){return p.curve==='log'?Math.log(p.value/p.min)/Math.log(p.max/p.min):(p.value-p.min)/(p.max-p.min)}
function normToValue(p,n){let v=p.curve==='log'?p.min*Math.pow(p.max/p.min,n):p.min+(p.max-p.min)*n;return Math.round(v/p.step)*p.step}
function bindKnob(knob,p,onChange){let sy,sn,timer,moved=false;knob.addEventListener('pointerdown',e=>{e.preventDefault();knob.setPointerCapture(e.pointerId);sy=e.clientY;sn=valueToNorm(p);moved=false;timer=setTimeout(()=>{if(!moved)showHelp(p.help||'clip')},650)});knob.addEventListener('pointermove',e=>{if(sy===undefined)return;const dy=sy-e.clientY;if(Math.abs(dy)>4)moved=true;if(moved)clearTimeout(timer);p.value=normToValue(p,clamp(sn+dy/220,0,1));p.render();onChange()});const end=()=>{clearTimeout(timer);sy=undefined};knob.addEventListener('pointerup',end);knob.addEventListener('pointercancel',end);knob.addEventListener('dblclick',()=>{p.value=p.def;p.render();onChange()})}
function buildKnobCard(target,key,p,onChange){const card=document.createElement('div');card.className=target.id==='macroGrid'?'macro-card':'knob-card';card.innerHTML=`<div class="knob-label">${p.label}</div><div class="knob" tabindex="0"></div><div class="knob-value clickable"></div><div class="knob-sub">${t('knobHint')}</div>`;target.appendChild(card);const knob=card.querySelector('.knob'),val=card.querySelector('.knob-value');const ring=p.color==='amber'?'#ffb55e':p.color==='green'?'#62f58b':'#54d8ff';knob.style.setProperty('--ring',ring);p.render=()=>{const n=clamp(valueToNorm(p),0,1);knob.style.setProperty('--fill',n*270+'deg');knob.style.setProperty('--angle',-135+n*270+'deg');val.textContent=p.fmt(p.value)};val.onclick=()=>{const x=prompt(`${p.label}: ${t('valueBetween')} ${p.min} – ${p.max}`,p.value);if(x!==null&&!isNaN(Number(x))){p.value=clamp(Number(x),p.min,p.max);p.render();onChange()}};bindKnob(knob,p,onChange);p.render()}
function buildKnobs(){const g=$('#knobGrid');g.innerHTML='';Object.entries(params).forEach(([k,p])=>buildKnobCard(g,k,p,updateAudioParams))}
function applyMacros(){const pu=macros.punch.value/100,to=macros.tone.value/100,sp=macros.space.value/100,sh=macros.shimmer.value/100;params.drive.value=.04+.48*pu;params.attack.value=.06*Math.pow(.0025/.06,pu);params.decay.value=.3-.19*pu;params.cutoff.value=450*Math.pow(18000/450,to);params.resonance.value=.8+6.8*to;params.delay.value=.03+.42*sp;params.reverb.value=.03+.5*sp;params.release.value=.16+1.5*sp;params.width.value=26*sh;params.sustain.value=.38+.48*sh;Object.values(params).forEach(p=>p.render?.());updateAudioParams()}
function buildMacros(apply=true){const g=$('#macroGrid');g.innerHTML='';Object.entries(macros).forEach(([k,p])=>buildKnobCard(g,k,p,applyMacros));if(apply)applyMacros()}


function recordNoteOn(note){
  if(!midiTake||!ctx)return;
  if(midiTake.open.has(note))return;
  midiTake.open.set(note,{note,on:ctx.currentTime});
}
function recordNoteOff(note){
  if(!midiTake||!ctx)return;
  const ev=midiTake.open.get(note);if(!ev)return;
  midiTake.open.delete(note);
  const step=stepDur();
  const rawStart=(ev.on-midiTake.origin)/step;
  const rawDur=Math.max(.12,(ctx.currentTime-ev.on)/step);
  const startStep=Math.max(0,Math.round(rawStart));
  const durationSteps=Math.max(.25,Math.round(rawDur*4)/4);
  midiTake.notes.push({note,startStep,durationSteps});
}
function finishOpenMidiNotes(){if(!midiTake||!ctx)return;[...midiTake.open.keys()].forEach(recordNoteOff)}
function commitMidiTake(){
  if(!midiTake)return false;
  finishOpenMidiNotes();
  const notes=midiTake.notes.filter(n=>Number.isFinite(n.startStep)&&Number.isFinite(n.durationSteps));
  if(!notes.length){midiTake=null;document.body.classList.remove('note-recording');return false}
  const maxEnd=Math.max(...notes.map(n=>n.startStep+n.durationSteps));
  const sourceBars=clamp(Math.max(1,Math.ceil(maxEnd/16)),1,TOTAL_BARS-midiTake.startBar);
  const takeNo=++midiTakeCount;localStorage.setItem('nevoMidiTakeCount',String(midiTakeCount));
  const tr={id:'midi-'+uid(),name:'KEYS '+takeNo,nameDe:'KLAVIATUR '+takeNo,nameEn:'KEYS '+takeNo,color:'#62f58b',type:'midi',mute:false,solo:false,clips:[]};
  tr.clips.push({id:uid(),start:midiTake.startBar,len:sourceBars,name:'Keyboard Take '+takeNo,nameDe:'Klavier-Aufnahme '+takeNo,nameEn:'Keyboard Take '+takeNo,loop:false,sourceSteps:sourceBars*16,notes});
  tracks.push(tr);renderTracks();
  midiTake=null;document.body.classList.remove('note-recording');
  return true;
}
function startMidiTake(){
  const startBar=clamp(Number($('#loopStart').value)-1,0,TOTAL_BARS-1);
  midiTake={origin:ctx.currentTime+.06,startBar,notes:[],open:new Map()};
  document.body.classList.add('note-recording');
}

const baseKeyboardNotes=['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5'];
function currentKeyboardNotes(){return baseKeyboardNotes.map(n=>transpose(n,keyboardOctave*12))}
function safePitchClasses(){const root=$('#keySelect').value.match(/^([A-G]#?)/)[1],names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],ri=names.indexOf(root),minor=[0,2,3,5,7,8,10];return new Set(minor.map(x=>names[(ri+x)%12]))}
function refreshSafeNotes(){const safe=safePitchClasses();$$('.key').forEach(k=>{const pc=k.dataset.note.match(/^([A-G]#?)/)[1];k.classList.toggle('safe',safeNotes&&safe.has(pc))})}
function beginReleaseVisual(el){if(!el)return;el.classList.remove('active','sustained');if(keyboardPlayMode==='direct'){el.classList.remove('releasing');return}const ms=Math.max(80,params.release.value*1000);el.style.setProperty('--release-ms',ms+'ms');el.classList.add('releasing');setTimeout(()=>el.classList.remove('releasing'),ms+80)}
function releaseSustainedNotes(){const notes=[...sustainedNotes];sustainedNotes.clear();notes.forEach(note=>{stopVoice(note,false);beginReleaseVisual(document.querySelector(`.key[data-note="${note}"]`))})}
function updateKeyboardControls(){
  const d=$('#modeDirect'),n=$('#modeNatural'),s=$('#sustainBtn');
  if(d)d.classList.toggle('active',keyboardPlayMode==='direct');
  if(n)n.classList.toggle('active',keyboardPlayMode==='natural');
  if(s){s.classList.toggle('on',sustainPedal);s.classList.toggle('primary',sustainPedal)}
  if($('#sustainState'))$('#sustainState').textContent=sustainPedal?t('on'):t('off');
  if($('#octaveValue'))$('#octaveValue').textContent=(keyboardOctave>0?'+':'')+keyboardOctave;
}
function setKeyboardMode(mode){
  keyboardPlayMode=mode==='direct'?'direct':'natural';
  localStorage.setItem('nevoKeyboardMode',keyboardPlayMode);
  if(keyboardPlayMode==='direct'&&sustainPedal){sustainPedal=false;localStorage.setItem('nevoSustain','false');releaseSustainedNotes()}
  updateKeyboardControls();
}
function toggleSustain(){
  if(keyboardPlayMode==='direct')setKeyboardMode('natural');
  sustainPedal=!sustainPedal;localStorage.setItem('nevoSustain',String(sustainPedal));
  if(!sustainPedal)releaseSustainedNotes();
  updateKeyboardControls();
}
function changeKeyboardOctave(delta){
  allKeyboardNotesOff(true);keyboardOctave=clamp(keyboardOctave+delta,-2,2);localStorage.setItem('nevoKeyboardOctave',keyboardOctave);buildKeyboard();updateKeyboardControls();
}
function buildKeyboard(){
  const kb=$('#keyboard');kb.innerHTML='';const keyboardNotes=currentKeyboardNotes();const whites=keyboardNotes.filter(n=>!n.includes('#'));
  whites.forEach(n=>{const e=document.createElement('div');e.className='key';e.dataset.note=n;e.textContent=n;kb.appendChild(e)});
  const ww=100/whites.length;let wi=0;
  keyboardNotes.forEach(n=>{if(!n.includes('#')){wi++;return}const e=document.createElement('div');e.className='key black';e.dataset.note=n;e.textContent=n;e.style.left=`calc(${wi*ww}% - 22px)`;kb.appendChild(e)});
  kb.querySelectorAll('.key').forEach(el=>{
    const held=new Set();
    const down=async e=>{
      e.preventDefault();held.add(e.pointerId);try{el.setPointerCapture(e.pointerId)}catch{}
      sustainedNotes.delete(el.dataset.note);el.classList.remove('sustained','releasing');el.classList.add('active');
      await initAudio();if(held.has(e.pointerId)){if(voices.has(el.dataset.note))stopVoice(el.dataset.note,true);startVoice(el.dataset.note);recordNoteOn(el.dataset.note)}
    };
    const up=e=>{
      e.preventDefault();if(!held.has(e.pointerId))return;held.delete(e.pointerId);if(held.size!==0)return;
      const note=el.dataset.note;recordNoteOff(note);
      if(keyboardPlayMode==='natural'&&sustainPedal){el.classList.remove('active','releasing');el.classList.add('sustained');sustainedNotes.add(note);return}
      stopVoice(note,keyboardPlayMode==='direct');beginReleaseVisual(el)
    };
    el.addEventListener('pointerdown',down);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up)
  });
  refreshSafeNotes();updateKeyboardControls()
}

const pcKeyMap={a:'C3',w:'C#3',s:'D3',e:'D#3',d:'E3',f:'F3',t:'F#3',g:'G3',y:'G#3',h:'A3',u:'A#3',j:'B3',k:'C4'};
const pcKeysHeld=new Set();
window.addEventListener('keydown',async e=>{
  const k=e.key.toLowerCase();if(e.repeat||!pcKeyMap[k]||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
  await initAudio();const note=transpose(pcKeyMap[k],keyboardOctave*12);pcKeysHeld.add(k);
  if(voices.has(note))stopVoice(note,true);startVoice(note);recordNoteOn(note);document.querySelector(`.key[data-note="${note}"]`)?.classList.add('active');
});
window.addEventListener('keyup',e=>{
  const k=e.key.toLowerCase();if(!pcKeysHeld.has(k))return;pcKeysHeld.delete(k);const note=transpose(pcKeyMap[k],keyboardOctave*12);recordNoteOff(note);
  const el=document.querySelector(`.key[data-note="${note}"]`);
  if(keyboardPlayMode==='natural'&&sustainPedal){el?.classList.remove('active','releasing');el?.classList.add('sustained');sustainedNotes.add(note);return}
  stopVoice(note,keyboardPlayMode==='direct');beginReleaseVisual(el);
});

function buildTimeline(){const t=$('#timeline');if(!t)return;t.innerHTML='';t.style.gridTemplateColumns=`repeat(${TOTAL_BARS}, ${BAR_W}px)`;t.style.width=`${TOTAL_BARS*BAR_W}px`;for(let i=1;i<=TOTAL_BARS;i++){const e=document.createElement('div');e.className='bar-num';e.textContent=i;t.appendChild(e)}}
function anySolo(){return tracks.some(t=>t.solo)}
function trackAudible(track){return !track.mute&&(!anySolo()||track.solo)}
function activeClip(track,bar){return track.clips.find(c=>bar>=c.start&&bar<c.start+c.len)}
function clipHelp(track,clip){
  const actions=[];
  if(Array.isArray(clip.notes))actions.push({label:t('editNotes'),run:()=>openPianoRoll(track,clip)});
  if(track.type==='audio'&&clip.audioId)actions.push({label:currentLang==='de'?'AUDIO BEARBEITEN':'EDIT AUDIO',run:()=>openAudioEditor(track,clip)});
  actions.push(
    {label:clip.loop?t('loopOff'):t('loopOn'),run:()=>{clip.loop=!clip.loop;renderTracks()}},
    {label:t('duplicate'),run:()=>{const copy={...clip,id:uid(),start:clamp(clip.start+clip.len,0,TOTAL_BARS-1),notes:Array.isArray(clip.notes)?clip.notes.map(n=>({...n})):clip.notes};copy.len=Math.min(copy.len,TOTAL_BARS-copy.start);track.clips.push(copy);renderTracks()}},
    {label:t('delete'),run:()=>{track.clips=track.clips.filter(c=>c.id!==clip.id);renderTracks()}}
  );
  showHelp(Array.isArray(clip.notes)?'piano':'clip',actions)
}
function renderTracks(){const list=$('#trackList');list.innerHTML='';tracks.forEach(track=>{const row=document.createElement('div');row.className='track-row';const lab=document.createElement('div');lab.className='track-label';lab.innerHTML=`<span class="track-color" style="color:${track.color};background:${track.color}"></span><div class="track-meta"><strong>${localName(track)}</strong><small>${track.type==='fx'?t('effects'):track.type.toUpperCase()}</small></div><button class="track-btn mute ${track.mute?'on':''}">M</button><button class="track-btn solo ${track.solo?'on':''}">S</button>`;row.appendChild(lab);const lane=document.createElement('div');lane.className='track-lane';lane.dataset.track=track.id;row.appendChild(lane);lab.querySelector('.mute').onclick=e=>{e.stopPropagation();track.mute=!track.mute;renderTracks()};lab.querySelector('.solo').onclick=e=>{e.stopPropagation();track.solo=!track.solo;renderTracks()};longPress(lab,()=>showHelp('arranger'));
    lane.addEventListener('click',e=>{if(e.target!==lane)return;const r=lane.getBoundingClientRect(),bar=clamp(Math.floor((e.clientX-r.left)/BAR_W),0,TOTAL_BARS-1);track.clips.push({id:uid(),start:bar,len:2,name:track.name+' Clip',nameDe:localName(track)+' '+t('clipSuffix'),nameEn:(track.nameEn||track.name)+' Clip',loop:true});renderTracks()});
    track.clips.forEach(clip=>lane.appendChild(makeClip(track,clip,lane)));
    list.appendChild(row)
  })}
function makeClip(track,clip,lane){
  const el=document.createElement('div');
  const isAudio=track.type==='audio'&&clip.audioId;
  el.className='clip'+(clip.loop?' looped':'')+(clip.notes?' midi-clip':'')+(isAudio?' audio-clip':'');
  el.style.color=track.color;
  el.style.left=clip.start*BAR_W+'px';
  el.style.width=Math.max(BAR_W,clip.len*BAR_W-4)+'px';
  const editButton=clip.notes?'<button class="clip-edit" type="button" aria-label="Edit">✎</button>':isAudio?'<button class="clip-edit audio-edit" type="button" aria-label="Audio Edit">✂</button>':'';
  const wave=isAudio?'<canvas class="clip-waveform" width="800" height="100"></canvas>':'';
  el.innerHTML=`${wave}<div class="${isAudio?'clip-text':''}"><strong>${localName(clip)}${clip.notes?`<span class="clip-note-count">${clip.notes.length} ${currentLang==='de'?'NOTEN':'NOTES'}</span>`:''}${clip.loopKey?'<span class="clip-note-count library-badge">LOOP</span>':''}</strong><small>${barText(clip.len)}</small></div>${editButton}<span class="resize-handle"></span>`;
  if(clip.notes){const edit=el.querySelector('.clip-edit');edit.onclick=e=>{e.stopPropagation();openPianoRoll(track,clip)}}
  if(isAudio){
    const edit=el.querySelector('.audio-edit');edit.onclick=e=>{e.stopPropagation();openAudioEditor(track,clip)};
    setTimeout(()=>{const buffer=audioBuffers.get(clip.audioId),canvas=el.querySelector('.clip-waveform');if(buffer&&canvas)drawBufferWaveform(buffer,canvas,track.color,clip.trimStart||0,clip.trimEnd||buffer.duration)},0);
  }
  let mode=null,sx=0,start=0,len=0,moved=false;
  el.addEventListener('pointerdown',e=>{
    if(e.target.closest('.clip-edit'))return;
    e.stopPropagation();mode=e.target.classList.contains('resize-handle')?'resize':'move';sx=e.clientX;start=clip.start;len=clip.len;moved=false;el.setPointerCapture(e.pointerId)
  });
  el.addEventListener('pointermove',e=>{if(!mode)return;const dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;const bars=Math.round(dx/BAR_W);if(mode==='move'){clip.start=clamp(start+bars,0,TOTAL_BARS-clip.len);el.style.left=clip.start*BAR_W+'px'}else{clip.len=clamp(len+bars,1,TOTAL_BARS-clip.start);el.style.width=Math.max(BAR_W,clip.len*BAR_W-4)+'px';el.querySelector('small').textContent=barText(clip.len)}});
  const end=()=>{mode=null};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  longPress(el,()=>{if(!moved)clipHelp(track,clip)});
  return el
}

function noteToMidi(note){const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];const m=note.match(/^([A-G]#?)(-?\d)$/);return (Number(m[2])+1)*12+names.indexOf(m[1])}
function midiToNote(midi){const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];return names[(midi%12+12)%12]+(Math.floor(midi/12)-1)}
function buildPianoPitches(){
  const noteMidis=(pianoClip?.notes||[]).map(n=>noteToMidi(n.note));
  let min=48,max=72;
  if(noteMidis.length){min=Math.min(min,Math.min(...noteMidis)-3);max=Math.max(max,Math.max(...noteMidis)+3)}
  min=clamp(min,24,96);max=clamp(max,36,108);
  if(max-min<24)max=Math.min(108,min+24);
  const out=[];for(let m=max;m>=min;m--)out.push(midiToNote(m));return out
}
function pianoSnapValue(){return Math.max(1,Number($('#pianoSnap')?.value||1))}
function snapStep(v){const q=pianoSnapValue();return Math.round(v/q)*q}
function pianoSafe(note){const pc=note.match(/^([A-G]#?)/)[1];return safePitchClasses().has(pc)}
function updatePianoInfo(){if(!pianoClip)return;const steps=Math.max(16,pianoClip.sourceSteps||pianoClip.len*16);const bars=Math.ceil(steps/16);$('#pianoLengthInfo').textContent=`${barText(bars)} · ${steps} ${t('stepsWord')}`;$('#pianoDeleteNote').disabled=!pianoSelectedNote}
function openPianoRoll(track,clip){
  if(!Array.isArray(clip.notes))return;
  pianoTrack=track;pianoClip=clip;pianoSelectedNote=null;
  if(!pianoClip.sourceSteps)pianoClip.sourceSteps=Math.max(16,pianoClip.len*16);
  $('#pianoClipTitle').textContent=localName(clip);
  $('#pianoModal').classList.remove('hidden');
  renderPianoRoll();
  setTimeout(()=>{const sc=$('#pianoRollScroll');if(sc){sc.scrollTop=Math.max(0,(pianoPitches.findIndex(n=>n==='C4')-4)*PIANO_ROW_H)}},30)
}
function closePianoRoll(){pianoTrack=null;pianoClip=null;pianoSelectedNote=null;$('#pianoModal').classList.add('hidden');renderTracks()}
function renderPianoRoll(){
  if(!pianoClip)return;
  $('#pianoClipTitle').textContent=localName(pianoClip);
  pianoPitches=buildPianoPitches();
  const labels=$('#pianoPitchLabels'),grid=$('#pianoGrid');labels.innerHTML='';grid.innerHTML='';
  const steps=Math.max(16,pianoClip.sourceSteps||pianoClip.len*16),width=steps*PIANO_STEP_W,height=pianoPitches.length*PIANO_ROW_H;
  labels.style.height=height+'px';grid.style.width=width+'px';grid.style.height=height+'px';
  grid.style.setProperty('--piano-step',PIANO_STEP_W+'px');grid.style.setProperty('--piano-row',PIANO_ROW_H+'px');
  pianoPitches.forEach((note,i)=>{const r=document.createElement('div');r.className='piano-pitch'+(note.includes('#')?' black':'')+(safeNotes&&pianoSafe(note)?' safe':'');r.style.top=i*PIANO_ROW_H+'px';r.textContent=note;labels.appendChild(r)});
  for(let b=0;b<=Math.ceil(steps/16);b++){const line=document.createElement('div');line.className='piano-bar-line';line.style.left=(b*16*PIANO_STEP_W)+'px';grid.appendChild(line);if(b<Math.ceil(steps/16)){const num=document.createElement('span');num.className='piano-bar-num';num.style.left=(b*16*PIANO_STEP_W+6)+'px';num.textContent=(b+1);grid.appendChild(num)}}
  pianoClip.notes.forEach(note=>grid.appendChild(makePianoNote(note)));
  grid.onclick=e=>{
    if(e.target!==grid)return;
    const r=grid.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,row=clamp(Math.floor(y/PIANO_ROW_H),0,pianoPitches.length-1),step=clamp(snapStep(Math.floor(x/PIANO_STEP_W)),0,steps-1);
    const n={note:pianoPitches[row],startStep:step,durationSteps:pianoSnapValue()};pianoClip.notes.push(n);pianoSelectedNote=n;previewPianoNote(n);renderPianoRoll();
  };
  updatePianoInfo();
}
function makePianoNote(note){
  const el=document.createElement('div'),steps=Math.max(16,pianoClip.sourceSteps||pianoClip.len*16);let row=pianoPitches.indexOf(note.note);if(row<0)row=0;
  el.className='piano-note'+(note===pianoSelectedNote?' selected':'');
  el.style.left=(note.startStep*PIANO_STEP_W+1)+'px';el.style.top=(row*PIANO_ROW_H+2)+'px';el.style.width=Math.max(16,note.durationSteps*PIANO_STEP_W-2)+'px';el.style.height=(PIANO_ROW_H-4)+'px';
  el.innerHTML=`<span>${note.note}</span><i class="piano-note-handle"></i>`;
  let mode=null,sx=0,sy=0,start=0,dur=0,startRow=0,moved=false;
  el.addEventListener('pointerdown',e=>{e.stopPropagation();mode=e.target.classList.contains('piano-note-handle')?'resize':'move';sx=e.clientX;sy=e.clientY;start=note.startStep;dur=note.durationSteps;startRow=pianoPitches.indexOf(note.note);moved=false;el.setPointerCapture(e.pointerId);pianoSelectedNote=note;updatePianoInfo()});
  el.addEventListener('pointermove',e=>{if(!mode)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>5||Math.abs(dy)>5)moved=true;if(mode==='move'){const delta=snapStep(dx/PIANO_STEP_W);note.startStep=clamp(snapStep(start+delta),0,Math.max(0,steps-note.durationSteps));const ri=clamp(startRow+Math.round(dy/PIANO_ROW_H),0,pianoPitches.length-1);note.note=pianoPitches[ri];el.style.left=(note.startStep*PIANO_STEP_W+1)+'px';el.style.top=(ri*PIANO_ROW_H+2)+'px';el.querySelector('span').textContent=note.note}else{const q=pianoSnapValue();note.durationSteps=clamp(Math.max(q,snapStep(dur+dx/PIANO_STEP_W)),q,steps-note.startStep);el.style.width=Math.max(16,note.durationSteps*PIANO_STEP_W-2)+'px'}});
  el.addEventListener('pointerup',()=>{mode=null;if(!moved){pianoSelectedNote=note;previewPianoNote(note);renderPianoRoll()}});el.addEventListener('pointercancel',()=>mode=null);
  longPress(el,()=>{pianoSelectedNote=note;showHelp('piano',[{label:t('deleteNote'),run:()=>{pianoClip.notes=pianoClip.notes.filter(n=>n!==note);pianoSelectedNote=null;renderPianoRoll()}}])});
  return el
}
async function previewPianoNote(note){await initAudio();startVoice(note.note,ctx.currentTime+.01,Math.max(.05,note.durationSteps*stepDur()),{amp:.28,width:params.width.value})}
async function previewPianoClip(){if(!pianoClip)return;await initAudio();const t0=ctx.currentTime+.06;for(const n of pianoClip.notes)startVoice(n.note,t0+n.startStep*stepDur(),Math.max(.05,n.durationSteps*stepDur()),{amp:.28,width:params.width.value})}
function changePianoBars(delta){if(!pianoClip)return;let steps=Math.max(16,pianoClip.sourceSteps||pianoClip.len*16);steps=clamp(steps+delta*16,16,TOTAL_BARS*16);pianoClip.sourceSteps=steps;pianoClip.len=Math.max(1,Math.ceil(steps/16));pianoClip.notes=pianoClip.notes.filter(n=>n.startStep<steps).map(n=>({...n,durationSteps:Math.min(n.durationSteps,steps-n.startStep)}));pianoSelectedNote=null;renderPianoRoll();renderTracks()}
function deleteSelectedPianoNote(){if(!pianoClip||!pianoSelectedNote){alert(t('noNoteSelected'));return}pianoClip.notes=pianoClip.notes.filter(n=>n!==pianoSelectedNote);pianoSelectedNote=null;renderPianoRoll();renderTracks()}


function auditionGrooveStep(kind,i){
  initAudio().then(()=>{const t0=ctx.currentTime+.015,sd=stepDur();if(kind==='synth')startVoice($('#rootNote').value,t0,sd*.55,{amp:.22,width:params.width.value});if(kind==='kick')kick(t0);if(kind==='hat')hat(t0,i===14||i===15)})
}
function buildSteps(){[['synthSteps',synthPattern,'synth'],['kickSteps',kickPattern,'kick'],['hatSteps',hatPattern,'hat']].forEach(([id,a,kind])=>{const e=$('#'+id);e.innerHTML='';a.forEach((v,i)=>{const b=document.createElement('button');b.className='step'+(v?' on':'');b.textContent=i+1;b.onclick=()=>{a[i]=!a[i];b.classList.toggle('on',a[i]);if(a[i])auditionGrooveStep(kind,i)};e.appendChild(b)})})}
function scheduleGrooveOnlyStep(i,t0){const st=t0+swingOffset(i);if(synthPattern[i])startVoice($('#rootNote').value,st,stepDur()*.62,{amp:.22,width:params.width.value});if(kickPattern[i])kick(st);if(hatPattern[i])hat(st,i===14||i===15);markStep(i,st)}
function grooveScheduler(){while(grooveNextTime<ctx.currentTime+.12){scheduleGrooveOnlyStep(grooveStep,grooveNextTime);grooveNextTime+=stepDur();grooveStep=(grooveStep+1)%16}}
async function playGrooveOnly(){await initAudio();if(isPlaying)stop();if(groovePlaying)return;groovePlaying=true;grooveStep=0;grooveNextTime=ctx.currentTime+.05;grooveScheduler();grooveTimer=setInterval(grooveScheduler,25);$('#groovePlayBtn')?.classList.add('primary');setStatus(true,'Groove läuft',`${$('#bpm').value} BPM · Swing ${$('#swing').value}%`)}
function stopGrooveOnly(){groovePlaying=false;clearInterval(grooveTimer);grooveTimer=null;$$('.step').forEach(x=>x.classList.remove('playing'));$('#groovePlayBtn')?.classList.remove('primary');if(audioReady&&!isPlaying)setStatus(true,t('audioActive'),'Groove gestoppt.')}
function grooveIntoArranger(){const start=Math.max(0,Number($('#loopStart').value)-1),len=Math.max(1,Number($('#loopEnd').value)-Number($('#loopStart').value)+1);const defs=[['my-groove-kick','MEIN KICK','MY KICK','#ffb55e','kick'],['my-groove-synth','MEIN SYNTH','MY SYNTH','#54d8ff','synth'],['my-groove-hat','MEINE HATS','MY HATS','#ffcc84','perc']];defs.forEach(([id,de,en,color,type])=>{let tr=tracks.find(x=>x.id===id);if(!tr){tr={id,name:de,nameDe:de,nameEn:en,color,type,mute:false,solo:false,clips:[]};tracks.push(tr)}tr.clips=[{id:uid(),start,len,name:de,nameDe:de,nameEn:en,loop:true,sourceSteps:16}]});renderTracks();setStatus(audioReady,'Groove übernommen',`${len} ${len===1?'Takt':'Takte'} ab Takt ${start+1}`)}
function stepDur(){return 60/Number($('#bpm').value)/4}
function swingOffset(local){return local%2?stepDur()*(Number($('#swing').value)/100)*.5:0}
function scheduleTrack(track,bar,local,t){if(!trackAudible(track))return;const c=activeClip(track,bar);if(!c)return;const root=$('#keySelect').value;if(c.loopKey&&LOOP_LIBRARY[c.loopKey]){const item=LOOP_LIBRARY[c.loopKey],sourceSteps=Math.max(1,c.sourceSteps||item.bars*16);let rel=(bar-c.start)*16+local;if(c.loop)rel=((rel%sourceSteps)+sourceSteps)%sourceSteps;if(!c.loop&&rel>=sourceSteps)return;scheduleLibraryItem(item,rel,t,stepDur());return}switch(track.type){case'kick':if(kickPattern[local])kick(t);break;case'perc':if(hatPattern[local])hat(t,local===14);break;case'synth':if(synthPattern[local])startVoice(transpose(root,12),t,stepDur()*.65,{amp:.18,width:12});break;case'bass':if([0,3,6,10,12,14].includes(local))startVoice(transpose(root,-12+(local===10?3:0)),t,stepDur()*.55,{wave:'sawtooth',amp:.2,width:2,attack:.004,release:.12});break;case'acid':if([2,5,7,10,14].includes(local))startVoice(transpose(root,[0,3,7,10,12][[2,5,7,10,14].indexOf(local)]),t,stepDur()*.38,{wave:'sawtooth',amp:.14,width:1,attack:.003,release:.08});break;case'melody':if(synthPattern[local])startVoice(transpose(root,12),t,stepDur()*.7,{wave:'triangle',amp:.14,width:8});break;case'vocal':if([6,14].includes(local))vocalChop(t,transpose(root,12),false);break;case'fx':if(local===0)fxNoise(t);break;case'midi':{if(c&&Array.isArray(c.notes)){const sourceSteps=Math.max(1,c.sourceSteps||c.len*16);let rel=(bar-c.start)*16+local;if(c.loop)rel=((rel%sourceSteps)+sourceSteps)%sourceSteps;if(!c.loop&&rel>=sourceSteps)break;c.notes.forEach(n=>{if(Math.round(n.startStep)===rel)startVoice(n.note,t,Math.max(.03,n.durationSteps*stepDur()),{amp:.28,width:params.width.value})})}break}case'audio':if(local===0){if(c&&c.audioId&&bar===c.start)playImportedAudio(c,t)}break}}
function playImportedAudio(clip,t){
  const buffer=audioBuffers.get(clip.audioId);if(!buffer)return;
  const src=ctx.createBufferSource(),g=ctx.createGain();
  const trimStart=clamp(Number(clip.trimStart)||0,0,Math.max(0,buffer.duration-.01));
  const trimEnd=clamp(Number(clip.trimEnd)||buffer.duration,trimStart+.01,buffer.duration);
  const segmentDur=Math.max(.01,trimEnd-trimStart);
  const maxDur=Math.min(MAX_SONG_SECONDS,clip.len*stepDur()*16);
  const totalDur=clip.loop?maxDur:Math.min(segmentDur,maxDur);
  const gain=clamp(Number(clip.gain??1),0,1.5),fadeIn=clamp(Number(clip.fadeIn)||0,0,totalDur/2),fadeOut=clamp(Number(clip.fadeOut)||0,0,totalDur/2);
  src.buffer=buffer;src.connect(g);g.connect(master);src.loop=!!clip.loop;
  if(src.loop){src.loopStart=trimStart;src.loopEnd=trimEnd;src.start(t,trimStart);try{src.stop(t+totalDur)}catch{}}
  else{src.start(t,trimStart,totalDur)}
  if(fadeIn>0){g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(gain,t+fadeIn)}else g.gain.setValueAtTime(gain,t);
  if(fadeOut>0){const fs=Math.max(t,t+totalDur-fadeOut);g.gain.setValueAtTime(gain,fs);g.gain.linearRampToValueAtTime(.0001,t+totalDur)}
  arrangerAudioSources.add(src);src.onended=()=>arrangerAudioSources.delete(src);
}

function markStep(local,t){setTimeout(()=>{$$('.step').forEach(x=>x.classList.remove('playing'));$$('.steps').forEach(r=>r.children[local]?.classList.add('playing'))},Math.max(0,(t-ctx.currentTime)*1000))}
function updatePlayhead(bar,local,t){const pos=bar+local/16;setTimeout(()=>{const offset=(window.innerWidth<=760?126:150),left=offset+(pos*BAR_W);$('#playhead').style.left=left+'px';updateSongTimeLabel(bar,local);const sc=$('#arrangerScroll');if(sc){const target=pos*BAR_W;const viewLeft=sc.scrollLeft,viewRight=viewLeft+sc.clientWidth-offset;if(target>viewRight-120||target<viewLeft+30)sc.scrollTo({left:Math.max(0,target-180),behavior:'smooth'})}},Math.max(0,(t-ctx.currentTime)*1000))}
function scheduleStep(global,t){const bar=Math.floor(global/16),local=global%16,st=t+swingOffset(local);tracks.forEach(tr=>scheduleTrack(tr,bar,local,st));markStep(local,st);updatePlayhead(bar,local,st)}
function scheduler(){const loopStart=(Number($('#loopStart').value)-1)*16,loopEnd=Number($('#loopEnd').value)*16;while(nextStepTime<ctx.currentTime+.12){scheduleStep(globalStep,nextStepTime);nextStepTime+=stepDur();globalStep++;if(globalStep>=loopEnd)globalStep=loopStart}}
async function play(){await initAudio();if(groovePlaying)stopGrooveOnly();if(isPlaying)return;isPlaying=true;globalStep=(Number($('#loopStart').value)-1)*16;nextStepTime=ctx.currentTime+.06;scheduler();seqTimer=setInterval(scheduler,25);$('#playBtn').classList.add('primary');$('#arrPlayBtn')?.classList.add('playing');$('#arrBottomPlayBtn')?.classList.add('playing');$('#playhead').classList.add('on');updateSongTimeLabel();setStatus(true,t('songRunning'),`${$('#bpm').value} BPM · ${t('loop')} ${$('#loopStart').value}–${$('#loopEnd').value}`)}
function stop(){isPlaying=false;clearInterval(seqTimer);seqTimer=null;arrangerAudioSources.forEach(src=>{try{src.stop()}catch{}});arrangerAudioSources.clear();$$('.step').forEach(x=>x.classList.remove('playing'));$('#playBtn').classList.remove('primary');$('#arrPlayBtn')?.classList.remove('playing');$('#arrBottomPlayBtn')?.classList.remove('playing');$('#playhead').classList.remove('on');updateSongTimeLabel();if(audioReady)setStatus(true,t('audioActive'),t('songStopped'))}

const presets={
 driving:{bpm:150,swing:18,cutoff:5200,drive:.22,reverb:.08,delay:.1},hypnotic:{bpm:147,swing:24,cutoff:3900,drive:.14,reverb:.2,delay:.2},acid:{bpm:154,swing:14,cutoff:7600,drive:.26,reverb:.1,delay:.22},minimal:{bpm:146,swing:20,cutoff:4600,drive:.12,reverb:.08,delay:.12},raw:{bpm:152,swing:10,cutoff:6800,drive:.38,reverb:.06,delay:.08}
};
function applyPreset(name){const p=presets[name];$('#bpm').value=p.bpm;refreshSongLengthLimit(true);$('#swing').value=p.swing;$('#swingValue').textContent=p.swing+'%';params.cutoff.value=p.cutoff;params.drive.value=p.drive;params.reverb.value=p.reverb;params.delay.value=p.delay;Object.values(params).forEach(x=>x.render?.());updateAudioParams();$$('.preset-card').forEach(x=>x.classList.toggle('active',x.dataset.preset===name));setStatus(audioReady,`${t('preset')}: ${presetCopy[name]?.[currentLang]?.[0]||name.toUpperCase()}`,`${p.bpm} BPM · ${t('swing')} ${p.swing}%`)}
$$('.preset-card').forEach(b=>b.onclick=()=>applyPreset(b.dataset.preset));

function projectData(){return{version:2.7,language:currentLang,keyboardPlayMode,sustainPedal,keyboardOctave,bpm:Number($('#bpm').value),loopStart:Number($('#loopStart').value),loopEnd:Number($('#loopEnd').value),songLengthPreset:$('#songLengthPreset')?.value||'16',waveform:$('#waveform').value,key:$('#keySelect').value,safeNotes,swing:Number($('#swing').value),params:Object.fromEntries(Object.entries(params).map(([k,p])=>[k,p.value])),macros:Object.fromEntries(Object.entries(macros).map(([k,p])=>[k,p.value])),patterns:{synth:[...synthPattern],kick:[...kickPattern],hat:[...hatPattern]},tracks:tracks.map(t=>({...t,clips:t.clips.map(c=>({...c,audioId:c.audioId?null:undefined}))}))}}
function applyProject(d){if(!d)return;if(d.language)setLanguage(d.language);if(d.keyboardPlayMode)keyboardPlayMode=d.keyboardPlayMode==='direct'?'direct':'natural';if(typeof d.sustainPedal==='boolean')sustainPedal=d.sustainPedal;if(Number.isFinite(Number(d.keyboardOctave)))keyboardOctave=clamp(Number(d.keyboardOctave),-2,2);$('#bpm').value=d.bpm||150;refreshSongLengthLimit(false);if(d.loopStart)$('#loopStart').value=String(clamp(Number(d.loopStart),1,TOTAL_BARS));if(d.loopEnd)$('#loopEnd').value=String(clamp(Number(d.loopEnd),1,TOTAL_BARS));if(d.songLengthPreset&&$('#songLengthPreset'))$('#songLengthPreset').value=d.songLengthPreset;updateSongTimeLabel();$('#waveform').value=d.waveform||'sawtooth';$('#keySelect').value=d.key||'D3';safeNotes=d.safeNotes!==false;$('#safeNotesBtn').classList.toggle('on',safeNotes);$('#safeNotesBtn').textContent=safeNotes?t('safeOn'):t('safeOff');$('#swing').value=d.swing??20;$('#swingValue').textContent=$('#swing').value+'%';if(d.params)Object.entries(d.params).forEach(([k,v])=>{if(params[k]){params[k].value=clamp(Number(v),params[k].min,params[k].max);params[k].render?.()}});if(d.macros)Object.entries(d.macros).forEach(([k,v])=>{if(macros[k]){macros[k].value=clamp(Number(v),macros[k].min,macros[k].max);macros[k].render?.()}});if(d.patterns){['synth','kick','hat'].forEach(n=>{const arr=n==='synth'?synthPattern:n==='kick'?kickPattern:hatPattern;if(Array.isArray(d.patterns[n]))d.patterns[n].slice(0,16).forEach((v,i)=>arr[i]=!!v)})}if(Array.isArray(d.tracks)){tracks.length=0;d.tracks.forEach(t=>tracks.push({...t,clips:(t.clips||[]).map(c=>({...c,id:c.id||uid()}))}))}buildSteps();renderTracks();buildKeyboard();refreshSafeNotes();updateKeyboardControls();updateAudioParams()}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}

async function toggleRecord(){
  await initAudio();
  if(!recorder||recorder.state==='inactive'){
    recChunks=[];
    recorder=new MediaRecorder(mediaDest.stream);
    recorder.ondataavailable=e=>{if(e.data.size)recChunks.push(e.data)};
    recorder.onstop=()=>downloadBlob(new Blob(recChunks,{type:recorder.mimeType}),'NEVO-recording.webm');
    recorder.start();
    if(!isPlaying)await play();
    startMidiTake();
    $('#recBtn').classList.add('active');$('#recBtn').textContent=t('stopRecord');
    setStatus(true,t('recording'),currentLang==='de'?'Master + Klavierspiel werden aufgenommen.':'Master + keyboard performance are being recorded.');
  }else{
    recorder.stop();
    const madeClip=commitMidiTake();
    $('#recBtn').classList.remove('active');$('#recBtn').textContent=t('record');
    setStatus(true,madeClip?t('noteClipSaved'):t('recordingSaved'),madeClip?t('noteClipSavedSub'):t('recordingSavedSub'));
  }
}
function encodeWav(buffer){const nCh=buffer.numberOfChannels,rate=buffer.sampleRate,len=buffer.length*nCh*2+44,ab=new ArrayBuffer(len),view=new DataView(ab);let p=0;const str=s=>{for(let i=0;i<s.length;i++)view.setUint8(p++,s.charCodeAt(i))},u16=v=>{view.setUint16(p,v,true);p+=2},u32=v=>{view.setUint32(p,v,true);p+=4};str('RIFF');u32(len-8);str('WAVE');str('fmt ');u32(16);u16(1);u16(nCh);u32(rate);u32(rate*nCh*2);u16(nCh*2);u16(16);str('data');u32(len-44);const ch=[];for(let c=0;c<nCh;c++)ch.push(buffer.getChannelData(c));for(let i=0;i<buffer.length;i++)for(let c=0;c<nCh;c++){let s=clamp(ch[c][i],-1,1);view.setInt16(p,s<0?s*0x8000:s*0x7fff,true);p+=2}return ab}
async function exportWav(){await initAudio();setStatus(true,t('wavExporting'),t('wavExportingSub'));const bpm=Number($('#bpm').value),sd=60/bpm/4,total=sd*16+2,sr=44100,off=new OfflineAudioContext(2,Math.ceil(total*sr),sr),out=off.createGain();out.gain.value=params.volume.value;out.connect(off.destination);const synth=(note,t)=>{const o=off.createOscillator(),g=off.createGain();o.type=$('#waveform').value;o.frequency.value=noteFreq(note);o.connect(g);g.connect(out);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+sd*.7);o.start(t);o.stop(t+sd*.75)},kk=t=>{const o=off.createOscillator(),g=off.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.16);o.connect(g);g.connect(out);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.start(t);o.stop(t+.3)};for(let i=0;i<16;i++){const t=.05+i*sd+(i%2?sd*(Number($('#swing').value)/100)*.5:0);if(kickPattern[i])kk(t);if(synthPattern[i])synth($('#keySelect').value,t)}const r=await off.startRendering();downloadBlob(new Blob([encodeWav(r)],{type:'audio/wav'}),'NEVO-groove.wav');setStatus(true,t('wavDone'),t('wavDoneSub'))}

$('#audioImport').onchange=async e=>{const f=e.target.files[0];if(!f)return;await initAudio();const arr=await f.arrayBuffer(),buf=await ctx.decodeAudioData(arr.slice(0)),audioId=uid();audioBuffers.set(audioId,buf);let tr=tracks.find(t=>t.type==='audio');if(!tr){tr={id:'audio-'+uid(),name:'AUDIO',color:'#ffffff',type:'audio',mute:false,solo:false,clips:[]};tracks.push(tr)}const barDur=60/Number($('#bpm').value)*4,len=clamp(Math.ceil(Math.min(buf.duration,MAX_SONG_SECONDS)/barDur),1,TOTAL_BARS);tr.clips.push({id:uid(),start:0,len,name:f.name.replace(/\.[^.]+$/,''),loop:false,audioId,trimStart:0,trimEnd:Math.min(buf.duration,MAX_SONG_SECONDS),fadeIn:0,fadeOut:0,gain:1});renderTracks();setStatus(true,t('imported'),`${f.name} · ${buf.duration.toFixed(1)} s`);e.target.value=''};
$('#addTrackBtn').onclick=()=>{tracks.push({id:'track-'+uid(),name:'SYNTH '+(tracks.length+1),nameDe:'SYNTH '+(tracks.length+1),nameEn:'SYNTH '+(tracks.length+1),color:'#54d8ff',type:'synth',mute:false,solo:false,clips:[]});renderTracks()};
$('#audioBtn').onclick=initAudio;$('#playBtn').onclick=play;$('#stopBtn').onclick=()=>{stop();stopGrooveOnly()};$('#recBtn').onclick=toggleRecord;$('#exportBtn').onclick=exportWav;
if($('#arrPlayBtn'))$('#arrPlayBtn').onclick=play;if($('#arrStopBtn'))$('#arrStopBtn').onclick=()=>{stop();stopGrooveOnly()};if($('#arrBottomPlayBtn'))$('#arrBottomPlayBtn').onclick=play;if($('#arrBottomStopBtn'))$('#arrBottomStopBtn').onclick=()=>{stop();stopGrooveOnly()};if($('#groovePlayBtn'))$('#groovePlayBtn').onclick=playGrooveOnly;if($('#grooveStopBtn'))$('#grooveStopBtn').onclick=stopGrooveOnly;if($('#grooveToArrangerBtn'))$('#grooveToArrangerBtn').onclick=grooveIntoArranger;
$('#saveBtn').onclick=()=>{localStorage.setItem('nevoStudioProject',JSON.stringify(projectData()));setStatus(audioReady,t('projectSaved'),t('projectSavedSub'))};
$('#loadBtn').onclick=()=>{const d=localStorage.getItem('nevoStudioProject');if(d)applyProject(JSON.parse(d));else alert(t('noProject'))};
$('#downloadProjectBtn').onclick=()=>downloadBlob(new Blob([JSON.stringify(projectData(),null,2)],{type:'application/json'}),'NEVO-Studio-project.json');
$('#importProject').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{applyProject(JSON.parse(await f.text()));setStatus(audioReady,t('projectImported'),f.name)}catch{alert(t('invalidProject'))}};
$('#clearSeq').onclick=()=>{synthPattern.fill(false);kickPattern.fill(false);hatPattern.fill(false);buildSteps()};
$('#fillSeq').onclick=()=>{synthPattern.fill(false);kickPattern.fill(false);hatPattern.fill(false);[0,3,6,10,12,14].forEach(i=>synthPattern[i]=true);[0,4,8,12].forEach(i=>kickPattern[i]=true);[2,6,10,14,15].forEach(i=>hatPattern[i]=true);$('#swing').value=22;$('#swingValue').textContent='22%';buildSteps()};
$('#swing').oninput=()=>$('#swingValue').textContent=$('#swing').value+'%';
$('#bpm').onchange=()=>{ $('#bpm').value=clamp(Number($('#bpm').value)||150,60,220); refreshSongLengthLimit(true); };
$('#loopStart').onchange=()=>{if(Number($('#loopEnd').value)<Number($('#loopStart').value))$('#loopEnd').value=$('#loopStart').value;updateSongTimeLabel()};
$('#loopEnd').onchange=()=>{if(Number($('#loopEnd').value)<Number($('#loopStart').value))$('#loopStart').value=$('#loopEnd').value;updateSongTimeLabel()};
$('#songLengthPreset').onchange=()=>{
  const v=$('#songLengthPreset').value,bd=barDurationSeconds();
  let bars=Number(v);
  if(v==='5m')bars=Math.floor(300/bd);
  if(v==='10m')bars=TOTAL_BARS;
  bars=clamp(Math.max(1,bars||16),1,TOTAL_BARS);
  $('#loopStart').value='1';$('#loopEnd').value=String(bars);updateSongTimeLabel();
};

$('#safeNotesBtn').onclick=()=>{safeNotes=!safeNotes;$('#safeNotesBtn').classList.toggle('on',safeNotes);$('#safeNotesBtn').textContent=safeNotes?t('safeOn'):t('safeOff');refreshSafeNotes()};longPress($('#safeNotesBtn'),()=>showHelp('safe'));$('#keySelect').onchange=()=>{$('#rootNote').value=$('#keySelect').value;refreshSafeNotes()};
$('#helpBtn').onclick=()=>{helpMode=!helpMode;document.body.classList.toggle('help-mode',helpMode);$('#helpBtn').classList.toggle('primary',helpMode);setStatus(audioReady,helpMode?t('helpModeOn'):t('helpModeOff'),helpMode?t('helpModeOnSub'):t('helpModeOffSub'))};
longPress($('.arranger-panel'),()=>showHelp('arranger'));longPress($('.swing-box'),()=>showHelp('swing'));
$('#langDe').onclick=()=>setLanguage('de');$('#langEn').onclick=()=>setLanguage('en');
$('#modeDirect').onclick=()=>setKeyboardMode('direct');$('#modeNatural').onclick=()=>setKeyboardMode('natural');$('#sustainBtn').onclick=toggleSustain;$('#octaveDown').onclick=()=>changeKeyboardOctave(-1);$('#octaveUp').onclick=()=>changeKeyboardOctave(1);
longPress($('#modeDirect'),()=>showHelp('playMode'));longPress($('#modeNatural'),()=>showHelp('playMode'));longPress($('#sustainBtn'),()=>showHelp('sustain'));

$('#pianoClose').onclick=closePianoRoll;$('#pianoModal').addEventListener('pointerdown',e=>{if(e.target===$('#pianoModal'))closePianoRoll()});$('#pianoPreview').onclick=previewPianoClip;$('#pianoPlusBar').onclick=()=>changePianoBars(1);$('#pianoMinusBar').onclick=()=>changePianoBars(-1);$('#pianoDeleteNote').onclick=deleteSelectedPianoNote;$('#pianoClear').onclick=()=>{if(pianoClip){pianoClip.notes=[];pianoSelectedNote=null;renderPianoRoll();renderTracks()}};$('#pianoSnap').onchange=()=>{if(pianoClip)renderPianoRoll()};

refreshSongLengthLimit(false);renderDemoTemplates();renderLoopLibrary();buildMacros();buildKnobs();buildKeyboard();buildSteps();updateKeyboardControls();applyLanguageToUI(true);applyPreset('driving');if(!audioReady)setStatus(false,t('audioInactive'),t('audioInactiveSub'));
setInterval(()=>{try{localStorage.setItem('nevoStudioAutosave',JSON.stringify(projectData()))}catch{}},15000);

// ===== v2.7: AUDIO-WELLENFORM / AUDIO-EDITOR =====
function drawBufferWaveform(buffer,canvas,color='#54d8ff',trimStart=0,trimEnd=null){
  if(!buffer||!canvas)return;
  const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1)),rect=canvas.getBoundingClientRect();
  const cssW=Math.max(160,Math.round(rect.width||canvas.width||800)),cssH=Math.max(60,Math.round(rect.height||canvas.height||100));
  canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
  const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,cssW,cssH);
  const data=buffer.getChannelData(0),duration=buffer.duration,end=trimEnd==null?duration:trimEnd;
  c.fillStyle='rgba(255,255,255,.025)';c.fillRect(0,0,cssW,cssH);
  c.strokeStyle=color;c.lineWidth=1.1;c.globalAlpha=.9;c.beginPath();
  const samples=Math.max(1,Math.floor(data.length/cssW));
  for(let x=0;x<cssW;x++){
    const i0=x*samples,i1=Math.min(data.length,i0+samples);let lo=1,hi=-1;
    for(let i=i0;i<i1;i++){const v=data[i];if(v<lo)lo=v;if(v>hi)hi=v}
    const y1=(1-hi)*cssH/2,y2=(1-lo)*cssH/2;c.moveTo(x+.5,y1);c.lineTo(x+.5,y2);
  }
  c.stroke();c.globalAlpha=1;
  if(duration>0&&(trimStart>0||end<duration)){
    c.fillStyle='rgba(0,0,0,.46)';c.fillRect(0,0,cssW*(trimStart/duration),cssH);c.fillRect(cssW*(end/duration),0,cssW*(1-end/duration),cssH)
  }
}

let audioEditTrack=null,audioEditClip=null,audioEditPreviewSource=null,audioEditCursor=0;
function audioEditBuffer(){return audioEditClip?audioBuffers.get(audioEditClip.audioId):null}
function stopAudioEditPreview(){if(audioEditPreviewSource){try{audioEditPreviewSource.stop()}catch{}audioEditPreviewSource=null}}
function openAudioEditor(track,clip){
  const buffer=audioBuffers.get(clip.audioId);if(!buffer)return;
  audioEditTrack=track;audioEditClip=clip;
  clip.trimStart=clamp(Number(clip.trimStart)||0,0,Math.max(0,buffer.duration-.01));
  clip.trimEnd=clamp(Number(clip.trimEnd)||buffer.duration,clip.trimStart+.01,buffer.duration);
  clip.fadeIn=Number(clip.fadeIn)||0;clip.fadeOut=Number(clip.fadeOut)||0;clip.gain=Number(clip.gain??1);
  audioEditCursor=clip.trimStart;
  $('#audioEditorTitle').textContent=localName(clip);$('#audioEditorModal').classList.remove('hidden');
  $('#audioFadeIn').value=clip.fadeIn;$('#audioFadeOut').value=clip.fadeOut;$('#audioClipGain').value=clip.gain;
  $('#audioLoopToggleBtn').classList.toggle('on',!!clip.loop);$('#audioLoopToggleBtn').textContent=clip.loop?(currentLang==='de'?'LOOP AN':'LOOP ON'):(currentLang==='de'?'LOOP AUS':'LOOP OFF');
  setTimeout(()=>{drawBufferWaveform(buffer,$('#audioEditorWaveform'),'#54d8ff');updateAudioEditorVisuals()},20)
}
function closeAudioEditor(){stopAudioEditPreview();$('#audioEditorModal').classList.add('hidden');audioEditTrack=null;audioEditClip=null;renderTracks()}
function updateAudioEditorVisuals(){
  const buffer=audioEditBuffer();if(!buffer||!audioEditClip)return;const d=buffer.duration,s=audioEditClip.trimStart,e=audioEditClip.trimEnd,len=e-s;
  const sp=s/d*100,ep=e/d*100,cp=clamp(audioEditCursor/d*100,0,100);
  $('#audioTrimStartHandle').style.left=`calc(${sp}% - 2px)`;$('#audioTrimEndHandle').style.left=`calc(${ep}% - 22px)`;
  $('#audioTrimShadeLeft').style.width=sp+'%';$('#audioTrimShadeRight').style.width=(100-ep)+'%';$('#audioCutCursor').style.left=cp+'%';
  const fi=Math.min(audioEditClip.fadeIn,len/2),fo=Math.min(audioEditClip.fadeOut,len/2);audioEditClip.fadeIn=fi;audioEditClip.fadeOut=fo;
  $('#audioFadeInVisual').style.left=sp+'%';$('#audioFadeInVisual').style.width=(fi/d*100)+'%';$('#audioFadeOutVisual').style.right=(100-ep)+'%';$('#audioFadeOutVisual').style.width=(fo/d*100)+'%';
  $('#audioStartReadout').textContent=s.toFixed(2)+' s';$('#audioEndReadout').textContent=e.toFixed(2)+' s';$('#audioLengthReadout').textContent=len.toFixed(2)+' s';$('#audioCursorReadout').textContent=audioEditCursor.toFixed(2)+' s';
  $('#audioFadeInValue').textContent=fi.toFixed(2)+' s';$('#audioFadeOutValue').textContent=fo.toFixed(2)+' s';$('#audioClipGainValue').textContent=Math.round(audioEditClip.gain*100)+'%';
  $('#audioFadeIn').max=Math.max(.01,len/2);$('#audioFadeOut').max=Math.max(.01,len/2)
}
async function previewAudioEdit(){
  const buffer=audioEditBuffer();if(!buffer||!audioEditClip)return;await initAudio();stopAudioEditPreview();
  const src=ctx.createBufferSource(),g=ctx.createGain(),s=audioEditClip.trimStart,e=audioEditClip.trimEnd,d=e-s,gain=audioEditClip.gain,fi=Math.min(audioEditClip.fadeIn,d/2),fo=Math.min(audioEditClip.fadeOut,d/2);
  src.buffer=buffer;src.connect(g);g.connect(master);src.loop=!!audioEditClip.loop;if(src.loop){src.loopStart=s;src.loopEnd=e}
  const t0=ctx.currentTime+.02;if(fi>0){g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(gain,t0+fi)}else g.gain.setValueAtTime(gain,t0);
  if(!src.loop&&fo>0){g.gain.setValueAtTime(gain,t0+d-fo);g.gain.linearRampToValueAtTime(.0001,t0+d)}
  src.start(t0,s);if(!src.loop)src.stop(t0+d);audioEditPreviewSource=src;src.onended=()=>{if(audioEditPreviewSource===src)audioEditPreviewSource=null}
}
function splitAudioAtCursor(){
  const buffer=audioEditBuffer(),clip=audioEditClip,track=audioEditTrack;if(!buffer||!clip||!track)return;
  const cut=clamp(audioEditCursor,clip.trimStart+.05,clip.trimEnd-.05);if(!(cut>clip.trimStart&&cut<clip.trimEnd))return;
  const barDur=barDurationSeconds(),leftDur=cut-clip.trimStart,rightDur=clip.trimEnd-cut,leftBars=Math.max(1,Math.ceil(leftDur/barDur)),rightBars=Math.max(1,Math.ceil(rightDur/barDur));
  const oldEnd=clip.trimEnd;clip.trimEnd=cut;clip.len=Math.min(leftBars,TOTAL_BARS-clip.start);clip.fadeOut=0;
  const copy={...clip,id:uid(),start:clamp(clip.start+clip.len,0,TOTAL_BARS-1),len:Math.min(rightBars,Math.max(1,TOTAL_BARS-(clip.start+clip.len))),trimStart:cut,trimEnd:oldEnd,fadeIn:0,name:localName(clip)+' B',nameDe:(clip.nameDe||clip.name)+' B',nameEn:(clip.nameEn||clip.name)+' B'};
  if(copy.start<TOTAL_BARS)track.clips.push(copy);closeAudioEditor();renderTracks()
}
function bindAudioEditor(){
  if(!$('#audioEditorModal'))return;
  $('#audioEditorClose').onclick=closeAudioEditor;$('#audioApplyBtn').onclick=closeAudioEditor;$('#audioPreviewBtn').onclick=previewAudioEdit;$('#audioStopPreviewBtn').onclick=stopAudioEditPreview;$('#audioSplitBtn').onclick=splitAudioAtCursor;
  $('#audioLoopToggleBtn').onclick=()=>{if(!audioEditClip)return;audioEditClip.loop=!audioEditClip.loop;$('#audioLoopToggleBtn').classList.toggle('on',audioEditClip.loop);$('#audioLoopToggleBtn').textContent=audioEditClip.loop?(currentLang==='de'?'LOOP AN':'LOOP ON'):(currentLang==='de'?'LOOP AUS':'LOOP OFF')};
  $('#audioResetEditsBtn').onclick=()=>{const b=audioEditBuffer();if(!b||!audioEditClip)return;audioEditClip.trimStart=0;audioEditClip.trimEnd=b.duration;audioEditClip.fadeIn=0;audioEditClip.fadeOut=0;audioEditClip.gain=1;audioEditCursor=0;$('#audioFadeIn').value=0;$('#audioFadeOut').value=0;$('#audioClipGain').value=1;updateAudioEditorVisuals()};
  $('#audioFadeIn').oninput=e=>{if(audioEditClip){audioEditClip.fadeIn=Number(e.target.value);updateAudioEditorVisuals()}};$('#audioFadeOut').oninput=e=>{if(audioEditClip){audioEditClip.fadeOut=Number(e.target.value);updateAudioEditorVisuals()}};$('#audioClipGain').oninput=e=>{if(audioEditClip){audioEditClip.gain=Number(e.target.value);updateAudioEditorVisuals()}};
  const wrap=$('#audioWaveEditorWrap');wrap.addEventListener('pointerdown',e=>{if(!audioEditClip||e.target.closest('.audio-trim-handle'))return;const b=audioEditBuffer(),r=wrap.getBoundingClientRect();audioEditCursor=clamp((e.clientX-r.left)/r.width,0,1)*b.duration;updateAudioEditorVisuals()});
  const bindHandle=(el,key)=>{let active=false;el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();active=true;el.setPointerCapture(e.pointerId)});el.addEventListener('pointermove',e=>{if(!active||!audioEditClip)return;const b=audioEditBuffer(),r=wrap.getBoundingClientRect(),v=clamp((e.clientX-r.left)/r.width,0,1)*b.duration;if(key==='trimStart')audioEditClip.trimStart=clamp(v,0,audioEditClip.trimEnd-.05);else audioEditClip.trimEnd=clamp(v,audioEditClip.trimStart+.05,b.duration);audioEditCursor=clamp(audioEditCursor,audioEditClip.trimStart,audioEditClip.trimEnd);updateAudioEditorVisuals()});const end=()=>active=false;el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end)};
  bindHandle($('#audioTrimStartHandle'),'trimStart');bindHandle($('#audioTrimEndHandle'),'trimEnd');
}

// ===== v2.7: NÉVO PLAYER / DJ-DECKS =====
const djLibrary=[];
function makeDjDeck(letter){
  const audio=new Audio();audio.preload='auto';audio.preservesPitch=true;audio.mozPreservesPitch=true;audio.webkitPreservesPitch=true;
  return {letter,audio,item:null,source:null,gainNode:null,cue:0,keyLock:true,loopBeats:0,loopStart:0,buffer:null}
}
const djDecks={A:makeDjDeck('A'),B:makeDjDeck('B')};
function fmtDeckTime(sec){sec=Math.max(0,Number(sec)||0);const m=Math.floor(sec/60),s=Math.floor(sec%60),d=Math.floor((sec%1)*10);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${d}`}
async function ensureDeckConnected(deck){await initAudio();if(!deck.source){deck.source=ctx.createMediaElementSource(deck.audio);deck.gainNode=ctx.createGain();deck.source.connect(deck.gainNode);deck.gainNode.connect(master)}updateCrossfaderGains()}
async function ensureDjItemBuffer(item){if(item.buffer)return item.buffer;await initAudio();const arr=await item.file.arrayBuffer();item.buffer=await ctx.decodeAudioData(arr.slice(0));item.duration=item.buffer.duration;renderDjLibrary();return item.buffer}
function renderDjLibrary(){
  const box=$('#djLibraryList');if(!box)return;if(!djLibrary.length){box.innerHTML=`<div class="dj-empty">${t('djEmpty')}</div>`;return}
  box.innerHTML='';djLibrary.forEach((item,i)=>{const el=document.createElement('div');el.className='dj-lib-item';el.innerHTML=`<div><strong>${item.name}</strong><small>${item.duration?fmtDeckTime(item.duration):((item.file.size/1048576).toFixed(1)+' MB')}</small></div><div class="dj-lib-actions"><button class="btn small">A</button><button class="btn small">B</button></div>`;const [a,b]=el.querySelectorAll('button');a.onclick=()=>loadItemToDeck(item,'A');b.onclick=()=>loadItemToDeck(item,'B');box.appendChild(el)})
}
async function loadItemToDeck(item,letter){
  const deck=djDecks[letter];await ensureDeckConnected(deck);const buffer=await ensureDjItemBuffer(item);deck.item=item;deck.buffer=buffer;deck.cue=0;deck.loopBeats=0;deck.loopStart=0;deck.audio.pause();deck.audio.src=item.url;deck.audio.currentTime=0;deck.audio.load();
  const guessed=(item.name.match(/(?:^|\D)(1[2-8]\d)(?:\D|$)/)||[])[1];const bpm=guessed?Number(guessed):Number($('#bpm').value)||150;$(`#deck${letter}Bpm`).value=bpm;$(`#deck${letter}Pitch`).value=0;deck.audio.playbackRate=1;
  $(`#deck${letter}Title`).textContent=item.name;$(`#deck${letter}Duration`).textContent=fmtDeckTime(buffer.duration);$(`#deck${letter}Time`).textContent='00:00.0';$(`#deck${letter}Playhead`).style.left='0%';$(`#deck${letter}Loop`).value='0';
  drawBufferWaveform(buffer,$(`#deck${letter}Wave`),letter==='A'?'#54d8ff':'#ffb55e');refreshDeckUi(letter);setStatus(true,t('djLoaded'),`${item.name} → DECK ${letter}`)
}
function refreshDeckUi(letter){const d=djDecks[letter];const play=$(`#deck${letter}Play`),key=$(`#deck${letter}KeyLock`);if(play)play.textContent=d.audio&&!d.audio.paused?'❚❚ PAUSE':'▶ PLAY';if(key){key.classList.toggle('on',d.keyLock);key.textContent=currentLang==='de'?(d.keyLock?'TONHALTE AN':'TONHALTE AUS'):(d.keyLock?'KEY LOCK ON':'KEY LOCK OFF')}const st=$(`#deck${letter}Status`);if(st)st.textContent=d.item?(d.audio.paused?'READY':'PLAY'):'EMPTY'}
function refreshAllDeckUi(){refreshDeckUi('A');refreshDeckUi('B');for(const L of ['A','B']){const sel=$(`#deck${L}Loop`);if(sel&&sel.options.length){sel.options[0].textContent=currentLang==='de'?'AUS':'OFF'}}}
async function toggleDeck(letter){const d=djDecks[letter];if(!d.item)return;await ensureDeckConnected(d);if(d.audio.paused){try{await d.audio.play()}catch(e){console.warn(e)}}else d.audio.pause();refreshDeckUi(letter)}
function stopDeck(letter){const d=djDecks[letter];d.audio.pause();try{d.audio.currentTime=0}catch{}refreshDeckUi(letter)}
function cueDeck(letter){const d=djDecks[letter];if(!d.item)return;d.audio.pause();d.audio.currentTime=clamp(d.cue,0,d.audio.duration||0);refreshDeckUi(letter)}
function setDeckCue(letter){const d=djDecks[letter];if(!d.item)return;d.cue=d.audio.currentTime;setStatus(true,currentLang==='de'?'Cue gesetzt':'Cue set',`DECK ${letter} · ${fmtDeckTime(d.cue)}`)}
function updateDeckRate(letter){const d=djDecks[letter],pct=Number($(`#deck${letter}Pitch`).value)||0;d.audio.playbackRate=clamp(1+pct/100,.5,2);$(`#deck${letter}PitchValue`).textContent=(pct>=0?'+':'')+pct.toFixed(1)+'%'}
function syncDeck(letter){const trackBpm=clamp(Number($(`#deck${letter}Bpm`).value)||150,60,220),masterBpm=clamp(Number($('#bpm').value)||150,60,220),pct=clamp((masterBpm/trackBpm-1)*100,-16,16);$(`#deck${letter}Pitch`).value=pct.toFixed(1);updateDeckRate(letter);setStatus(true,'SYNC',`DECK ${letter}: ${trackBpm} → ${masterBpm} BPM`)}
function toggleDeckKeyLock(letter){const d=djDecks[letter];d.keyLock=!d.keyLock;d.audio.preservesPitch=d.keyLock;d.audio.mozPreservesPitch=d.keyLock;d.audio.webkitPreservesPitch=d.keyLock;refreshDeckUi(letter)}
function setDeckLoop(letter){const d=djDecks[letter],beats=Number($(`#deck${letter}Loop`).value)||0;d.loopBeats=beats;if(beats){d.loopStart=d.audio.currentTime;setStatus(true,currentLang==='de'?'Deck-Loop gesetzt':'Deck loop set',`DECK ${letter} · ${beats} beats`)}}
function updateCrossfaderGains(){const x=Number($('#djCrossfader')?.value||0),theta=(x+1)*Math.PI/4,a=Math.cos(theta),b=Math.sin(theta);for(const [L,f] of [['A',a],['B',b]]){const d=djDecks[L],vol=Number($(`#deck${L}Volume`)?.value||.9);if(d.gainNode)d.gainNode.gain.setTargetAtTime(vol*f,ctx?.currentTime||0,.01)}}
function deckSeekFromWave(letter,e){const d=djDecks[letter];if(!d.item||!Number.isFinite(d.audio.duration))return;const wrap=e.currentTarget,r=wrap.getBoundingClientRect(),ratio=clamp((e.clientX-r.left)/r.width,0,1);d.audio.currentTime=ratio*d.audio.duration}
async function addDeckToArranger(letter){
  const d=djDecks[letter];if(!d.item)return;const buffer=await ensureDjItemBuffer(d.item),audioId=uid();audioBuffers.set(audioId,buffer);let tr=tracks.find(t=>t.type==='audio');if(!tr){tr={id:'audio-'+uid(),name:'AUDIO',nameDe:'AUDIO',nameEn:'AUDIO',color:'#ffffff',type:'audio',mute:false,solo:false,clips:[]};tracks.push(tr)}
  const start=clamp(Number($('#loopStart').value||1)-1,0,TOTAL_BARS-1),barDur=barDurationSeconds(),len=clamp(Math.ceil(Math.min(buffer.duration,MAX_SONG_SECONDS)/barDur),1,TOTAL_BARS-start);tr.clips.push({id:uid(),start,len,name:d.item.name.replace(/\.[^.]+$/,''),loop:false,audioId,trimStart:0,trimEnd:Math.min(buffer.duration,MAX_SONG_SECONDS),fadeIn:0,fadeOut:0,gain:1});renderTracks();setStatus(true,t('djAddedArranger'),`${d.item.name} · ${len} ${len===1?t('barOne'):t('barMany')}`);document.querySelector('.arranger-panel')?.scrollIntoView({behavior:'smooth',block:'start'})
}
function startDjTicker(){
  const tick=()=>{for(const L of ['A','B']){const d=djDecks[L];if(d.item){const dur=d.audio.duration||d.buffer?.duration||0,cur=d.audio.currentTime||0;$(`#deck${L}Time`).textContent=fmtDeckTime(cur);$(`#deck${L}Duration`).textContent=fmtDeckTime(dur);$(`#deck${L}Playhead`).style.left=(dur?clamp(cur/dur*100,0,100):0)+'%';if(d.loopBeats&&dur){const bpm=clamp(Number($(`#deck${L}Bpm`).value)||150,60,220),loopEnd=d.loopStart+d.loopBeats*60/bpm;if(cur>=loopEnd-.02){d.audio.currentTime=d.loopStart}}refreshDeckUi(L)}}requestAnimationFrame(tick)};requestAnimationFrame(tick)
}
function bindDjPlayer(){
  if(!$('#djImport'))return;$('#djImport').onchange=e=>{for(const f of [...e.target.files]){djLibrary.push({id:uid(),file:f,name:f.name,url:URL.createObjectURL(f),buffer:null,duration:0})}renderDjLibrary();e.target.value=''};
  for(const L of ['A','B']){$(`#deck${L}Play`).onclick=()=>toggleDeck(L);$(`#deck${L}Stop`).onclick=()=>stopDeck(L);$(`#deck${L}Cue`).onclick=()=>cueDeck(L);$(`#deck${L}SetCue`).onclick=()=>setDeckCue(L);$(`#deck${L}Sync`).onclick=()=>syncDeck(L);$(`#deck${L}KeyLock`).onclick=()=>toggleDeckKeyLock(L);$(`#deck${L}Pitch`).oninput=()=>updateDeckRate(L);$(`#deck${L}Volume`).oninput=updateCrossfaderGains;$(`#deck${L}Loop`).onchange=()=>setDeckLoop(L);$(`#deck${L}AddArranger`).onclick=()=>addDeckToArranger(L);document.querySelector(`.dj-wave-wrap[data-deck="${L}"]`).onclick=e=>deckSeekFromWave(L,e);djDecks[L].audio.addEventListener('play',()=>refreshDeckUi(L));djDecks[L].audio.addEventListener('pause',()=>refreshDeckUi(L));djDecks[L].audio.addEventListener('ended',()=>refreshDeckUi(L))}
  $('#djCrossfader').oninput=updateCrossfaderGains;longPress($('.dj-panel'),()=>showHelp('djPlayer'));renderDjLibrary();refreshAllDeckUi();startDjTicker()
}


// ===== v2.8: DJ PRO VIEW / BPM ANALYSIS / BEATGRID / HOT CUES / PERSISTENT LIBRARY =====
const DJ_DB_NAME='nevo-studio-dj-library';
const DJ_DB_STORE='songs';
let djDbPromise=null;
let djAnalysisQueue=Promise.resolve();

function openDjDb(){
  if(!('indexedDB' in window))return Promise.resolve(null);
  if(djDbPromise)return djDbPromise;
  djDbPromise=new Promise(resolve=>{
    try{
      const req=indexedDB.open(DJ_DB_NAME,1);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(DJ_DB_STORE))db.createObjectStore(DJ_DB_STORE,{keyPath:'id'})};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);
    }catch{resolve(null)}
  });
  return djDbPromise;
}
async function saveDjItem(item){
  const db=await openDjDb();if(!db||!item)return;
  const blob=item.blob||item.file;if(!blob)return;
  const row={id:item.id,name:item.name,title:item.title||cleanDjTitle(item.name),bpm:Number(item.bpm)||0,duration:Number(item.duration)||0,beatOffset:Number(item.beatOffset)||0,confidence:Number(item.confidence)||0,key:item.key||'—',phrases:Array.isArray(item.phrases)?item.phrases:[],hotCues:Array.isArray(item.hotCues)?item.hotCues:[null,null,null,null,null,null,null,null],cue:Number(item.cue)||0,blob,type:blob.type||'audio/*',addedAt:item.addedAt||Date.now()};
  try{await new Promise((resolve,reject)=>{const tx=db.transaction(DJ_DB_STORE,'readwrite');tx.objectStore(DJ_DB_STORE).put(row);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch(e){console.warn('DJ library save failed',e)}
}
async function deleteDjItemPersisted(id){const db=await openDjDb();if(!db)return;try{await new Promise((resolve,reject)=>{const tx=db.transaction(DJ_DB_STORE,'readwrite');tx.objectStore(DJ_DB_STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch{}}
async function clearDjDb(){const db=await openDjDb();if(!db)return;try{await new Promise((resolve,reject)=>{const tx=db.transaction(DJ_DB_STORE,'readwrite');tx.objectStore(DJ_DB_STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch{}}
async function loadPersistedDjLibrary(){
  const db=await openDjDb();if(!db)return;
  let rows=[];try{rows=await new Promise((resolve,reject)=>{const tx=db.transaction(DJ_DB_STORE,'readonly'),r=tx.objectStore(DJ_DB_STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}catch{return}
  for(const row of rows){if(djLibrary.some(x=>x.id===row.id))continue;const blob=row.blob,url=URL.createObjectURL(blob);djLibrary.push({id:row.id,file:blob,blob,name:row.name,title:row.title||cleanDjTitle(row.name),url,buffer:null,duration:row.duration||0,bpm:row.bpm||0,beatOffset:row.beatOffset||0,confidence:row.confidence||0,key:row.key||'—',phrases:Array.isArray(row.phrases)?row.phrases:[],hotCues:Array.isArray(row.hotCues)?row.hotCues:[null,null,null,null,null,null,null,null],cue:row.cue||0,addedAt:row.addedAt||Date.now()})}
  renderDjLibrary();
}
function cleanDjTitle(name=''){return String(name).replace(/\.[^.]+$/,'').replace(/[_]+/g,' ').replace(/\s+/g,' ').trim()||'Unbenannter Song'}
function makeDjDeck(letter){
  const audio=new Audio();audio.preload='auto';audio.preservesPitch=true;audio.mozPreservesPitch=true;audio.webkitPreservesPitch=true;
  return {letter,audio,item:null,source:null,gainNode:null,cue:0,keyLock:true,loopBeats:0,loopStart:0,buffer:null,hotCues:[null,null,null,null,null,null,null,null],beatOffset:0,detectedBpm:0,confidence:0,key:'—',phrases:[],quantize:true,manualLoopIn:null,manualLoopOut:null,manualLoopActive:false,lastZoomDraw:-1,tapTimes:[]}
}
function djDeckBpm(letter){return clamp(Number($(`#deck${letter}Bpm`)?.value)||djDecks[letter].detectedBpm||150,60,220)}
function djBeatPeriod(letter){return 60/djDeckBpm(letter)}
function djNormalizeOffset(offset,period){if(!Number.isFinite(period)||period<=0)return 0;return ((offset%period)+period)%period}

function djColumnStats(data,i0,i1){
  if(i1<=i0)return {peak:0,mean:0,z:0};
  const stride=Math.max(1,Math.floor((i1-i0)/18));let peak=0,sum=0,n=0,zc=0,last=0,have=false;
  for(let i=i0;i<i1;i+=stride){const v=data[i]||0,a=Math.abs(v);peak=Math.max(peak,a);sum+=a;n++;if(have&&((v>=0)!==(last>=0)))zc++;last=v;have=true}
  return {peak,mean:n?sum/n:0,z:n>1?zc/(n-1):0};
}
function djWaveColor(stats,alpha=1){
  const hi=clamp(stats.z*4.5,0,1),body=clamp(stats.mean*3.2,0,1),r=Math.round(50+205*hi),g=Math.round(150+85*body),b=Math.round(245-115*hi+10*body);return `rgba(${r},${g},${clamp(b,70,255)},${alpha})`;
}
function drawDjWaveRange(buffer,canvas,startSec=0,endSec=null,letter='A',showGrid=true){
  if(!buffer||!canvas)return;
  const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1)),rect=canvas.getBoundingClientRect(),w=Math.max(220,Math.round(rect.width||900)),h=Math.max(70,Math.round(rect.height||130));canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  const dur=buffer.duration,end=clamp(endSec==null?dur:endSec,0,dur),start=clamp(startSec,0,Math.max(0,end-.001)),data=buffer.getChannelData(0),sr=buffer.sampleRate;
  const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#020609');bg.addColorStop(.5,'#07141d');bg.addColorStop(1,'#020609');c.fillStyle=bg;c.fillRect(0,0,w,h);
  c.fillStyle='rgba(255,255,255,.025)';c.fillRect(0,h/2-1,w,2);
  if(showGrid){
    const bpm=djDeckBpm(letter),period=60/bpm,off=djNormalizeOffset(djDecks[letter].beatOffset||0,period);if(period>0){let n=Math.ceil((start-off)/period);for(let tt=off+n*period;tt<=end;tt+=period,n++){const x=(tt-start)/(end-start)*w,strong=((n%4)+4)%4===0;c.strokeStyle=strong?'rgba(255,181,94,.30)':'rgba(255,255,255,.10)';c.lineWidth=strong?1.5:1;c.beginPath();c.moveTo(x+.5,0);c.lineTo(x+.5,h);c.stroke();if(strong&&w/(Math.max(1,(end-start)/period))>16){c.fillStyle='rgba(255,205,145,.45)';c.font='8px system-ui';c.fillText(String(Math.floor(n/4)+1),x+3,10)}}}
  }
  const mid=h/2;for(let x=0;x<w;x++){const t0=start+(x/w)*(end-start),t1=start+((x+1)/w)*(end-start),i0=clamp(Math.floor(t0*sr),0,data.length-1),i1=clamp(Math.ceil(t1*sr),i0+1,data.length),st=djColumnStats(data,i0,i1),amp=Math.max(1.5,st.peak*(h*.47));c.strokeStyle=djWaveColor(st,.94);c.lineWidth=1;c.beginPath();c.moveTo(x+.5,mid-amp);c.lineTo(x+.5,mid+amp);c.stroke()}
  const glow=c.createLinearGradient(0,0,w,0);glow.addColorStop(0,letter==='A'?'rgba(84,216,255,.10)':'rgba(255,181,94,.10)');glow.addColorStop(.5,'rgba(177,107,255,.05)');glow.addColorStop(1,letter==='A'?'rgba(255,181,94,.06)':'rgba(84,216,255,.06)');c.fillStyle=glow;c.fillRect(0,0,w,h);
}
function deckZoomRange(letter){const d=djDecks[letter],dur=d.audio.duration||d.buffer?.duration||0,bpm=djDeckBpm(letter),period=60/bpm,span=period*16,cur=clamp(d.audio.currentTime||0,0,dur);let start=cur-span/2,end=cur+span/2;if(start<0){end-=start;start=0}if(end>dur){start=Math.max(0,start-(end-dur));end=dur}return {start,end,cur,dur,span:Math.max(.001,end-start)}}
function drawDeckOverview(letter){const d=djDecks[letter];if(!d.buffer)return;drawDjWaveRange(d.buffer,$(`#deck${letter}Wave`),0,d.buffer.duration,letter,true);updateDeckZoomWindow(letter)}
function drawDeckZoom(letter,force=false){const d=djDecks[letter];if(!d.buffer)return;const cur=d.audio.currentTime||0;if(!force&&Math.abs(cur-d.lastZoomDraw)<.075)return;d.lastZoomDraw=cur;const r=deckZoomRange(letter);drawDjWaveRange(d.buffer,$(`#deck${letter}ZoomWave`),r.start,r.end,letter,true);$(`#deck${letter}ZoomInfo`).textContent=`${fmtDeckTime(r.start)} – ${fmtDeckTime(r.end)}`;updateDeckZoomWindow(letter)}
function updateDeckZoomWindow(letter){const d=djDecks[letter],r=deckZoomRange(letter),el=$(`#deck${letter}ZoomWindow`);if(!el||!r.dur)return;const left=(r.start/r.dur)*100,width=((r.end-r.start)/r.dur)*100;el.style.left=(left+width/2)+'%';el.style.width=Math.max(.8,width)+'%'}

function analyzeBpmBuffer(buffer){
  const data=buffer.getChannelData(0),sr=buffer.sampleRate,maxSec=Math.min(buffer.duration,240),hop=1024,maxFrame=Math.min(Math.floor(maxSec*sr/hop),Math.floor(data.length/hop));if(maxFrame<50)return {bpm:0,beatOffset:0,confidence:0};
  const env=new Float32Array(maxFrame);for(let f=0;f<maxFrame;f++){const base=f*hop,end=Math.min(data.length,base+hop);let sum=0,n=0;for(let i=base;i<end;i+=16){sum+=Math.abs(data[i]);n++}env[f]=n?sum/n:0}
  const novelty=new Float32Array(maxFrame);let running=0;const win=8;for(let i=0;i<maxFrame;i++){const avg=i?running/Math.min(i,win):0;novelty[i]=Math.max(0,env[i]-avg);running+=env[i];if(i>=win)running-=env[i-win]}
  const sorted=Array.from(novelty).sort((a,b)=>a-b),thr=sorted[Math.floor(sorted.length*.82)]||0;const peaks=[];const minFrames=Math.max(2,Math.floor(.18*sr/hop));let last=-9999;for(let i=1;i<maxFrame-1;i++){const v=novelty[i];if(v>thr&&v>=novelty[i-1]&&v>=novelty[i+1]&&i-last>=minFrames){peaks.push({i,v});last=i}}
  if(peaks.length<6)return {bpm:0,beatOffset:0,confidence:0};
  const hist=new Map();let totalW=0;for(let a=0;a<peaks.length;a++){for(let b=a+1;b<Math.min(peaks.length,a+9);b++){const dt=(peaks[b].i-peaks[a].i)*hop/sr;if(dt<.25||dt>1.5)continue;let bpm=60/dt;while(bpm<80)bpm*=2;while(bpm>190)bpm/=2;if(bpm<80||bpm>190)continue;const bin=Math.round(bpm*2)/2,w=(peaks[a].v+peaks[b].v)/(b-a);hist.set(bin,(hist.get(bin)||0)+w);totalW+=w}}
  let bestBpm=0,best=0;for(const [b,w] of hist){const techWeight=(b>=115&&b<=175)?1.08:1;if(w*techWeight>best){best=w*techWeight;bestBpm=b}}
  if(!bestBpm)return {bpm:0,beatOffset:0,confidence:0};
  const period=60/bestBpm,bins=64,phase=new Float64Array(bins);for(const p of peaks){const tm=p.i*hop/sr,ph=((tm%period)+period)%period,bi=Math.min(bins-1,Math.floor(ph/period*bins));phase[bi]+=p.v}let bi=0;for(let i=1;i<bins;i++)if(phase[i]>phase[bi])bi=i;const offset=(bi+.5)/bins*period,confidence=clamp(best/(totalW*.12||1),0,1);return {bpm:Math.round(bestBpm*10)/10,beatOffset:offset,confidence}
}
async function analyzeDjItem(item,showStatus=true){
  if(!item)return null;item.analyzing=true;renderDjLibrary();if(showStatus)setStatus(true,currentLang==='de'?'BPM-Analyse läuft':'BPM analysis running',item.title||item.name);
  try{const buffer=await ensureDjItemBuffer(item),r=analyzeBpmBuffer(buffer);item.bpm=r.bpm||item.bpm||150;item.beatOffset=r.beatOffset||0;item.confidence=r.confidence||0;item.duration=buffer.duration;item.analyzing=false;await saveDjItem(item);renderDjLibrary();for(const L of ['A','B'])if(djDecks[L].item?.id===item.id){djDecks[L].detectedBpm=item.bpm;djDecks[L].beatOffset=item.beatOffset;$(`#deck${L}Bpm`).value=item.bpm;refreshDeckUi(L);drawDeckOverview(L);drawDeckZoom(L,true)}if(showStatus)setStatus(true,currentLang==='de'?'Analyse fertig':'Analysis ready',`${item.bpm.toFixed(1)} BPM · ${Math.round(item.confidence*100)}%`);return r}catch(e){item.analyzing=false;console.warn(e);renderDjLibrary();return null}
}
function queueDjAnalysis(item){djAnalysisQueue=djAnalysisQueue.then(()=>analyzeDjItem(item,false)).catch(()=>null);return djAnalysisQueue}
async function ensureDjItemBuffer(item){if(item.buffer)return item.buffer;await initAudio();const blob=item.file||item.blob;if(!blob)throw new Error('Audio file missing');const arr=await blob.arrayBuffer();item.buffer=await ctx.decodeAudioData(arr.slice(0));item.duration=item.buffer.duration;if(!item.title)item.title=cleanDjTitle(item.name);renderDjLibrary();return item.buffer}

function renderDjLibrary(){
  const box=$('#djLibraryList');if(!box)return;const q=($('#djLibrarySearch')?.value||'').trim().toLowerCase(),items=djLibrary.filter(item=>!q||`${item.title||''} ${item.name||''}`.toLowerCase().includes(q)).sort((a,b)=>(b.addedAt||0)-(a.addedAt||0));if(!items.length){box.innerHTML=`<div class="dj-empty">${djLibrary.length?(currentLang==='de'?'Keine Treffer.':'No matches.'):t('djEmpty')}</div>`;return}
  box.innerHTML='';items.forEach(item=>{const el=document.createElement('div');el.className='dj-lib-item';const bpmText=item.analyzing?(currentLang==='de'?'ANALYSE…':'ANALYZING…'):(item.bpm?Number(item.bpm).toFixed(1):'—'),dur=item.duration?fmtDeckTime(item.duration):'—';el.innerHTML=`<div class="dj-lib-title"><strong>${item.title||cleanDjTitle(item.name)}</strong><small>${item.name}</small></div><div class="dj-lib-bpm ${item.analyzing?'analyzing':''}">${bpmText}</div><div class="dj-lib-duration">${dur}</div><div class="dj-lib-actions"><button class="btn small analyze-mini" title="BPM">⚡</button><button class="btn small">A</button><button class="btn small">B</button></div>`;const title=el.querySelector('.dj-lib-title strong'),[an,a,b]=el.querySelectorAll('button');title.onclick=async()=>{const v=prompt(currentLang==='de'?'Titel':'Title',item.title||cleanDjTitle(item.name));if(v&&v.trim()){item.title=v.trim();await saveDjItem(item);renderDjLibrary()}};an.onclick=()=>analyzeDjItem(item,true);a.onclick=()=>loadItemToDeck(item,'A');b.onclick=()=>loadItemToDeck(item,'B');box.appendChild(el)})
}
async function loadItemToDeck(item,letter){
  const deck=djDecks[letter];await ensureDeckConnected(deck);const buffer=await ensureDjItemBuffer(item);deck.item=item;deck.buffer=buffer;deck.cue=Number(item.cue)||0;deck.hotCues=Array.isArray(item.hotCues)?[...item.hotCues]:[null,null,null,null,null,null,null,null];deck.beatOffset=Number(item.beatOffset)||0;deck.detectedBpm=Number(item.bpm)||0;deck.confidence=Number(item.confidence)||0;deck.key=item.key||'—';deck.phrases=Array.isArray(item.phrases)?item.phrases:[];deck.quantize=true;deck.manualLoopIn=null;deck.manualLoopOut=null;deck.manualLoopActive=false;deck.loopBeats=0;deck.loopStart=0;deck.lastZoomDraw=-1;deck.audio.pause();deck.audio.src=item.url||(item.url=URL.createObjectURL(item.file||item.blob));deck.audio.currentTime=0;deck.audio.load();
  const guessed=(item.name.match(/(?:^|\D)(1[2-8]\d)(?:\D|$)/)||[])[1],bpm=item.bpm||Number(guessed)||Number($('#bpm').value)||150;$(`#deck${letter}Bpm`).value=Number(bpm).toFixed(1);$(`#deck${letter}Pitch`).value=0;deck.audio.playbackRate=1;$(`#deck${letter}Title`).textContent=item.title||cleanDjTitle(item.name);$(`#deck${letter}Duration`).textContent=fmtDeckTime(buffer.duration);$(`#deck${letter}Time`).textContent='00:00.0';$(`#deck${letter}Playhead`).style.left='0%';$(`#deck${letter}Loop`).value='0';drawDeckOverview(letter);drawDeckZoom(letter,true);renderHotCues(letter);refreshDeckUi(letter);setStatus(true,t('djLoaded'),`${item.title||item.name} → DECK ${letter}`);if(!item.bpm)queueDjAnalysis(item)
}
function refreshDeckUi(letter){const d=djDecks[letter],play=$(`#deck${letter}Play`),key=$(`#deck${letter}KeyLock`);if(play)play.textContent=d.audio&&!d.audio.paused?'❚❚ PAUSE':'▶ PLAY';if(key){key.classList.toggle('on',d.keyLock);key.textContent=currentLang==='de'?(d.keyLock?'TONHALTE AN':'TONHALTE AUS'):(d.keyLock?'KEY LOCK ON':'KEY LOCK OFF')}const st=$(`#deck${letter}Status`);if(st)st.textContent=d.item?(d.audio.paused?'READY':'PLAY'):'EMPTY';const bpmEl=$(`#deck${letter}DetectedBpm`),phase=$(`#deck${letter}BeatPhase`);if(bpmEl)bpmEl.textContent=d.item?`${djDeckBpm(letter).toFixed(1)} BPM`:'— BPM';if(phase)phase.textContent=d.item?`GRID ${Math.round((d.beatOffset||0)*1000)} ms`:'GRID —';renderHotCues(letter)}
function renderHotCues(letter){const d=djDecks[letter],box=$(`#deck${letter}HotCues`);if(!box)return;[...box.querySelectorAll('.hotcue')].forEach((b,i)=>{const v=d.hotCues?.[i];b.classList.toggle('set',Number.isFinite(v));b.querySelector('span').textContent=Number.isFinite(v)?fmtDeckTime(v):'HOT CUE'})}
async function persistDeckMeta(letter){const d=djDecks[letter];if(!d.item)return;d.item.bpm=djDeckBpm(letter);d.item.beatOffset=d.beatOffset||0;d.item.hotCues=[...(d.hotCues||[])];d.item.cue=d.cue||0;d.item.confidence=d.confidence||0;await saveDjItem(d.item);renderDjLibrary()}
function hotCueAction(letter,index){const d=djDecks[letter];if(!d.item)return;const v=d.hotCues[index];if(Number.isFinite(v)){d.audio.currentTime=clamp(v,0,d.audio.duration||0);setStatus(true,`HOT CUE ${index+1}`,`${fmtDeckTime(v)} · DECK ${letter}`)}else{d.hotCues[index]=d.audio.currentTime||0;persistDeckMeta(letter);renderHotCues(letter);setStatus(true,currentLang==='de'?'Hot Cue gesetzt':'Hot Cue set',`HOT ${index+1} · ${fmtDeckTime(d.hotCues[index])}`)}}
function clearHotCue(letter,index){const d=djDecks[letter];if(!d.item)return;d.hotCues[index]=null;persistDeckMeta(letter);renderHotCues(letter);setStatus(true,currentLang==='de'?'Hot Cue gelöscht':'Hot Cue cleared',`HOT ${index+1}`)}
function bindHotCueButton(btn){let timer=null,long=false;const L=btn.dataset.deck,i=Number(btn.dataset.hotcue);btn.onpointerdown=()=>{long=false;timer=setTimeout(()=>{long=true;clearHotCue(L,i)},650)};btn.onpointerup=()=>clearTimeout(timer);btn.onpointercancel=()=>clearTimeout(timer);btn.onclick=e=>{if(long){e.preventDefault();long=false;return}hotCueAction(L,i)}}
function nudgeBeatgrid(letter,delta){const d=djDecks[letter],period=djBeatPeriod(letter);d.beatOffset=djNormalizeOffset((d.beatOffset||0)+delta,period);persistDeckMeta(letter);drawDeckOverview(letter);drawDeckZoom(letter,true);refreshDeckUi(letter)}
function gridHere(letter){const d=djDecks[letter],period=djBeatPeriod(letter);d.beatOffset=djNormalizeOffset(d.audio.currentTime||0,period);persistDeckMeta(letter);drawDeckOverview(letter);drawDeckZoom(letter,true);refreshDeckUi(letter);setStatus(true,'BEATGRID',currentLang==='de'?'Aktuelle Position liegt jetzt auf einem Beat.':'Current position is now on a beat.')}
function tapBpm(letter){const d=djDecks[letter],now=performance.now()/1000;if(d.tapTimes.length&&now-d.tapTimes.at(-1)>2.5)d.tapTimes=[];d.tapTimes.push(now);if(d.tapTimes.length>8)d.tapTimes.shift();if(d.tapTimes.length>=2){const ints=[];for(let i=1;i<d.tapTimes.length;i++)ints.push(d.tapTimes[i]-d.tapTimes[i-1]);const avg=ints.reduce((a,b)=>a+b,0)/ints.length,bpm=clamp(60/avg,60,220);$(`#deck${letter}Bpm`).value=bpm.toFixed(1);d.detectedBpm=bpm;d.beatOffset=djNormalizeOffset(d.audio.currentTime||0,60/bpm);persistDeckMeta(letter);drawDeckOverview(letter);drawDeckZoom(letter,true);refreshDeckUi(letter);setStatus(true,'TAP BPM',`${bpm.toFixed(1)} BPM`)}}
function setDeckCue(letter){const d=djDecks[letter];if(!d.item)return;d.cue=d.audio.currentTime;persistDeckMeta(letter);setStatus(true,currentLang==='de'?'Cue gesetzt':'Cue set',`DECK ${letter} · ${fmtDeckTime(d.cue)}`)}
function updateDeckRate(letter){const d=djDecks[letter],pct=Number($(`#deck${letter}Pitch`).value)||0;d.audio.playbackRate=clamp(1+pct/100,.5,2);$(`#deck${letter}PitchValue`).textContent=(pct>=0?'+':'')+pct.toFixed(1)+'%';refreshDeckUi(letter)}
function syncDeck(letter){const trackBpm=djDeckBpm(letter),masterBpm=clamp(Number($('#bpm').value)||150,60,220),pct=clamp((masterBpm/trackBpm-1)*100,-16,16);$(`#deck${letter}Pitch`).value=pct.toFixed(1);updateDeckRate(letter);setStatus(true,'SYNC',`DECK ${letter}: ${trackBpm.toFixed(1)} → ${masterBpm.toFixed(1)} BPM`)}
function deckSeekFromWave(letter,e){const d=djDecks[letter];if(!d.item||!Number.isFinite(d.audio.duration))return;const wrap=e.currentTarget,r=wrap.getBoundingClientRect(),ratio=clamp((e.clientX-r.left)/r.width,0,1);if(wrap.dataset.wave==='zoom'){const zr=deckZoomRange(letter);d.audio.currentTime=zr.start+ratio*(zr.end-zr.start)}else d.audio.currentTime=ratio*d.audio.duration;drawDeckZoom(letter,true)}
function updateCrossfaderGains(){const x=Number($('#djCrossfader')?.value||0),theta=(x+1)*Math.PI/4,a=Math.cos(theta),b=Math.sin(theta);for(const [L,f] of [['A',a],['B',b]]){const d=djDecks[L],vol=Number($(`#deck${L}Volume`)?.value||.9);if(d.gainNode)d.gainNode.gain.setTargetAtTime(vol*f,ctx?.currentTime||0,.01)}}
function startDjTicker(){
  let lastUi=0;const tick=ts=>{const scrolling=!!window.__nevoScrolling;for(const L of ['A','B']){const d=djDecks[L];if(d.item){const dur=d.audio.duration||d.buffer?.duration||0,cur=d.audio.currentTime||0;if(!scrolling&&ts-lastUi>50){$(`#deck${L}Time`).textContent=fmtDeckTime(cur);$(`#deck${L}Duration`).textContent=fmtDeckTime(dur);$(`#deck${L}Playhead`).style.left=(dur?clamp(cur/dur*100,0,100):0)+'%';updateDeckZoomWindow(L)}if(d.loopBeats&&dur){const bpm=djDeckBpm(L),loopEnd=d.loopStart+d.loopBeats*60/bpm;if(cur>=loopEnd-.015)d.audio.currentTime=d.loopStart}if(!scrolling)drawDeckZoom(L,false)}}if(!scrolling&&ts-lastUi>50){lastUi=ts;refreshDeckUi('A');refreshDeckUi('B')}requestAnimationFrame(tick)};requestAnimationFrame(tick)
}
function refreshDjV28Labels(){
  const de=currentLang==='de';if($('#djLibrarySearch'))$('#djLibrarySearch').placeholder=de?'Titel suchen …':'Search title …';if($('#djAnalyzeAll'))$('#djAnalyzeAll').textContent=de?'⚡ ALLE ANALYSIEREN':'⚡ ANALYZE ALL';if($('#djClearLibrary'))$('#djClearLibrary').textContent=de?'BIBLIOTHEK LEEREN':'CLEAR LIBRARY';const cols=$$('.dj-library-columns span'),names=de?['TITEL','BPM','LÄNGE','AKTION']:['TITLE','BPM','LENGTH','ACTION'];cols.forEach((x,i)=>x.textContent=names[i]||x.textContent);for(const L of ['A','B']){const deck=document.querySelector(`.dj-deck[data-deck="${L}"]`);if(!deck)continue;const ov=deck.querySelector('.dj-overview-label'),zo=deck.querySelector('.dj-zoom-label');if(ov){ov.querySelector('span').textContent=de?'GESAMT-WELLENFORM':'OVERVIEW WAVEFORM';ov.querySelector('small').textContent=de?'Tippen = springen':'Tap = seek'}if(zo)zo.querySelector('span').textContent=de?'ZOOM-WELLENFORM':'ZOOM WAVEFORM';$(`#deck${L}Analyze`).textContent=de?'⚡ BPM ANALYSE':'⚡ BPM ANALYSIS';$(`#deck${L}TapBpm`).textContent='TAP BPM';$(`#deck${L}GridHere`).textContent=de?'GRID HIER':'GRID HERE';const gt=deck.querySelector('.dj-grid-tools>span');if(gt)gt.textContent='BEATGRID';renderHotCues(L)}renderDjLibrary()
}
function setLanguage(lang){currentLang=lang==='en'?'en':'de';applyLanguageToUI(true);refreshDjV28Labels();setStatus(audioReady,t('languageChanged'),currentLang==='de'?'Die App ist jetzt auf Deutsch.':'The app is now in English.');setTimeout(()=>{try{refreshAllDeckUi()}catch{}},0)}
async function clearDjLibraryAll(){if(!confirm(currentLang==='de'?'Player-Bibliothek wirklich leeren?':'Clear the player library?'))return;for(const d of Object.values(djDecks)){d.audio.pause();d.item=null;d.buffer=null;d.hotCues=[null,null,null,null,null,null,null,null]}for(const item of djLibrary){try{if(item.url)URL.revokeObjectURL(item.url)}catch{}}djLibrary.splice(0);await clearDjDb();renderDjLibrary();refreshAllDeckUi();setStatus(audioReady,currentLang==='de'?'Bibliothek geleert':'Library cleared','')}
function bindDjPlayer(){
  if(!$('#djImport'))return;
  $('#djImport').onchange=async e=>{const files=[...e.target.files];for(const f of files){const item={id:uid()+Date.now().toString(36),file:f,blob:f,name:f.name,title:cleanDjTitle(f.name),url:URL.createObjectURL(f),buffer:null,duration:0,bpm:0,beatOffset:0,confidence:0,key:'—',phrases:[],hotCues:[null,null,null,null,null,null,null,null],cue:0,addedAt:Date.now()};djLibrary.push(item);await saveDjItem(item);queueDjAnalysis(item)}renderDjLibrary();e.target.value=''};
  $('#djLibrarySearch').oninput=renderDjLibrary;$('#djAnalyzeAll').onclick=()=>{for(const item of djLibrary)queueDjAnalysis(item)};$('#djClearLibrary').onclick=clearDjLibraryAll;
  for(const L of ['A','B']){
    $(`#deck${L}Play`).onclick=()=>toggleDeck(L);$(`#deck${L}Stop`).onclick=()=>stopDeck(L);$(`#deck${L}Cue`).onclick=()=>cueDeck(L);$(`#deck${L}SetCue`).onclick=()=>setDeckCue(L);$(`#deck${L}Sync`).onclick=()=>syncDeck(L);$(`#deck${L}Analyze`).onclick=()=>djDecks[L].item&&analyzeDjItem(djDecks[L].item,true);$(`#deck${L}KeyLock`).onclick=()=>toggleDeckKeyLock(L);$(`#deck${L}Pitch`).oninput=()=>updateDeckRate(L);$(`#deck${L}Volume`).oninput=updateCrossfaderGains;$(`#deck${L}Loop`).onchange=()=>setDeckLoop(L);$(`#deck${L}AddArranger`).onclick=()=>addDeckToArranger(L);$(`#deck${L}GridMinus`).onclick=()=>nudgeBeatgrid(L,-.01);$(`#deck${L}GridPlus`).onclick=()=>nudgeBeatgrid(L,.01);$(`#deck${L}GridHere`).onclick=()=>gridHere(L);$(`#deck${L}TapBpm`).onclick=()=>tapBpm(L);$(`#deck${L}Bpm`).onchange=()=>{const d=djDecks[L],v=djDeckBpm(L);d.detectedBpm=v;if(d.item){d.item.bpm=v;persistDeckMeta(L)}drawDeckOverview(L);drawDeckZoom(L,true);refreshDeckUi(L)};document.querySelectorAll(`.dj-wave-wrap[data-deck="${L}"]`).forEach(w=>w.onclick=e=>deckSeekFromWave(L,e));document.querySelectorAll(`.hotcue[data-deck="${L}"]`).forEach(bindHotCueButton);djDecks[L].audio.addEventListener('play',()=>refreshDeckUi(L));djDecks[L].audio.addEventListener('pause',()=>refreshDeckUi(L));djDecks[L].audio.addEventListener('ended',()=>refreshDeckUi(L))
  }
  $('#djCrossfader').oninput=updateCrossfaderGains;longPress($('.dj-panel'),()=>showHelp('djPlayer'));refreshDjV28Labels();renderDjLibrary();refreshAllDeckUi();loadPersistedDjLibrary();startDjTicker();
}

bindAudioEditor();bindDjPlayer();

// ===== v2.9: DDJ-FLX4 MODE + GENERIC WEB MIDI LEARN =====
const FLX_MIDI_STORAGE='nevo-flx4-midi-mappings-v1';
const FLX_DEFAULT_MAPPING_URL='./flx4-default-mapping.json';
const FLX_MODE_STORAGE='nevo-dj-view-mode-v1';
const flxState={mode:'pro',midiAccess:null,learn:false,target:null,mappings:{},lastMidi:new Map(),monitor:false,lastRawMidi:''};
try{flxState.mappings=JSON.parse(localStorage.getItem(FLX_MIDI_STORAGE)||'{}')||{}}catch{flxState.mappings={}}

function flxIsContinuous(action){return /\.(pitch|volume|trim|eqHigh|eqMid|eqLow|filter)$/.test(action)||action==='crossfader'||action==='master.level'||action==='cue.level'||action==='mic.level'||action==='headphones.mix'||action==='fx.level'}
function flxActionLabel(action){
  const map={
    'A.play':'Deck A Play/Pause','A.cue':'Deck A Cue','A.sync':'Deck A Sync','A.keylock':'Deck A Key Lock',
    'B.play':'Deck B Play/Pause','B.cue':'Deck B Cue','B.sync':'Deck B Sync','B.keylock':'Deck B Key Lock',
    'A.pitch':'Deck A Tempo','B.pitch':'Deck B Tempo','A.volume':'Deck A Lautstärke','B.volume':'Deck B Lautstärke',
    'A.trim':'Deck A Trim / Gain','B.trim':'Deck B Trim / Gain',
    'A.eqHigh':'Deck A High','A.eqMid':'Deck A Mid','A.eqLow':'Deck A Low','A.filter':'Deck A CFX / Filter',
    'B.eqHigh':'Deck B High','B.eqMid':'Deck B Mid','B.eqLow':'Deck B Low','B.filter':'Deck B CFX / Filter','crossfader':'Crossfader'
  };
  if(map[action])return map[action];
  const m=action.match(/^([AB])\.hot([1-4])$/);if(m)return `Deck ${m[1]} Hot Cue ${m[2]}`;
  const l=action.match(/^([AB])\.loop(4|8|16|32)$/);if(l)return `Deck ${l[1]} Loop ${l[2]}`;
  return action;
}
function flxStatus(text,kind=''){
  const el=$('#flxMidiStatus');if(!el)return;el.textContent=text;el.classList.toggle('connected',kind==='connected');el.classList.toggle('error',kind==='error');
}
function setDjViewMode(mode){
  flxState.mode=mode==='flx4'?'flx4':'pro';
  const panel=$('.dj-panel');if(panel)panel.classList.toggle('flx4-active',flxState.mode==='flx4');
  const surf=$('#flx4Surface');if(surf)surf.hidden=flxState.mode!=='flx4';
  $('#djModePro')?.classList.toggle('active',flxState.mode==='pro');$('#djModeFlx4')?.classList.toggle('active',flxState.mode==='flx4');
  try{localStorage.setItem(FLX_MODE_STORAGE,flxState.mode)}catch{}
}

// Enhanced deck audio graph: 3-band EQ + DJ filter before channel gain.
async function ensureDeckConnected(deck){
  await initAudio();
  if(!deck.source){
    deck.source=ctx.createMediaElementSource(deck.audio);
    deck.trimGainNode=ctx.createGain();
    deck.eqLowNode=ctx.createBiquadFilter();deck.eqLowNode.type='lowshelf';deck.eqLowNode.frequency.value=180;
    deck.eqMidNode=ctx.createBiquadFilter();deck.eqMidNode.type='peaking';deck.eqMidNode.frequency.value=1000;deck.eqMidNode.Q.value=.8;
    deck.eqHighNode=ctx.createBiquadFilter();deck.eqHighNode.type='highshelf';deck.eqHighNode.frequency.value=6000;
    deck.colorFilterNode=ctx.createBiquadFilter();deck.colorFilterNode.type='lowpass';deck.colorFilterNode.frequency.value=20000;deck.colorFilterNode.Q.value=.75;
    deck.gainNode=ctx.createGain();
    deck.source.connect(deck.trimGainNode);deck.trimGainNode.connect(deck.eqLowNode);deck.eqLowNode.connect(deck.eqMidNode);deck.eqMidNode.connect(deck.eqHighNode);deck.eqHighNode.connect(deck.colorFilterNode);deck.colorFilterNode.connect(deck.gainNode);deck.gainNode.connect(master);
    deck.trimValue=Number.isFinite(deck.trimValue)?deck.trimValue:0;deck.eqLow=deck.eqLow||0;deck.eqMid=deck.eqMid||0;deck.eqHigh=deck.eqHigh||0;deck.filterValue=deck.filterValue||0;
    flxApplyEq(deck.letter);
  }
  updateCrossfaderGains();
}
function flxApplyEq(letter){
  const d=djDecks[letter];if(!d)return;
  const t=ctx?.currentTime||0;
  if(d.trimGainNode){const tv=clamp(d.trimValue||0,-1,1),db=tv<0?tv*24:tv*12;d.trimGainNode.gain.setTargetAtTime(Math.pow(10,db/20),t,.015)}
  if(d.eqLowNode)d.eqLowNode.gain.setTargetAtTime((d.eqLow||0)*12,t,.015);
  if(d.eqMidNode)d.eqMidNode.gain.setTargetAtTime((d.eqMid||0)*12,t,.015);
  if(d.eqHighNode)d.eqHighNode.gain.setTargetAtTime((d.eqHigh||0)*12,t,.015);
  if(d.colorFilterNode){
    const v=clamp(d.filterValue||0,-1,1);
    if(Math.abs(v)<.02){d.colorFilterNode.type='lowpass';d.colorFilterNode.frequency.setTargetAtTime(20000,t,.02);d.colorFilterNode.Q.setTargetAtTime(.75,t,.02)}
    else if(v<0){d.colorFilterNode.type='lowpass';const f=200*Math.pow(100,1+v);d.colorFilterNode.frequency.setTargetAtTime(clamp(f,180,20000),t,.02);d.colorFilterNode.Q.setTargetAtTime(1+Math.abs(v)*5,t,.02)}
    else{d.colorFilterNode.type='highpass';const f=22*Math.pow(230,v);d.colorFilterNode.frequency.setTargetAtTime(clamp(f,22,5500),t,.02);d.colorFilterNode.Q.setTargetAtTime(1+v*4,t,.02)}
  }
}
function flxSetContinuous(action,norm,fromMidi=false){
  norm=clamp(Number(norm)||0,0,1);
  if(action==='crossfader'){
    const v=norm*2-1;if($('#djCrossfader'))$('#djCrossfader').value=v;if($('#flxCrossfader'))$('#flxCrossfader').value=v;updateCrossfaderGains();return;
  }
  const m=action.match(/^([AB])\.(.+)$/);if(!m)return;const L=m[1],kind=m[2],d=djDecks[L];
  if(kind==='pitch'){
    const v=-16+norm*32;if($(`#deck${L}Pitch`))$(`#deck${L}Pitch`).value=v;if($(`#flx${L}Pitch`))$(`#flx${L}Pitch`).value=v;updateDeckRate(L);return;
  }
  if(kind==='volume'){
    const v=norm;if($(`#deck${L}Volume`))$(`#deck${L}Volume`).value=v;const flx=document.querySelector(`[data-flx-action="${L}.volume"]`);if(flx)flx.value=v;updateCrossfaderGains();return;
  }
  const v=norm*2-1;
  if(kind==='trim')d.trimValue=v;if(kind==='eqHigh')d.eqHigh=v;if(kind==='eqMid')d.eqMid=v;if(kind==='eqLow')d.eqLow=v;if(kind==='filter')d.filterValue=v;
  const input=document.querySelector(`[data-flx-action="${action}"]`);if(input&&!fromMidi)input.value=v;else if(input)input.value=v;
  flxApplyEq(L);
}
function flxTriggerAction(action){
  const m=action.match(/^([AB])\.(.+)$/);if(!m)return;const L=m[1],kind=m[2];
  if(kind==='play')return toggleDeck(L);if(kind==='cue')return cueDeck(L);if(kind==='sync')return syncDeck(L);if(kind==='keylock')return toggleDeckKeyLock(L);
  let hot=kind.match(/^hot([1-8])$/);if(hot)return hotCueAction(L,Number(hot[1])-1);
  let loop=kind.match(/^loop(4|8|16|32)$/);if(loop){const beats=Number(loop[1]);const sel=$(`#deck${L}Loop`);if(sel)sel.value=String(beats);return setDeckLoop(L)}
}
function flxRunAction(action,norm=1,fromMidi=false){if(flxIsContinuous(action))return flxSetContinuous(action,norm,fromMidi);if(norm>.45)flxTriggerAction(action)}

function bindFlxRange(input){
  if(!input)return;const action=input.dataset.flxAction;if(!action)return;
  input.addEventListener('input',()=>{
    if(flxState.learn)return;
    let norm;
    if(action.endsWith('.pitch'))norm=(Number(input.value)+16)/32;
    else if(action.endsWith('.volume')||action==='cue.level'||action==='mic.level'||action==='headphones.mix'||action==='fx.level')norm=Number(input.value);
    else if(action==='master.level')norm=clamp(Number(input.value)/1.25,0,1);
    else norm=(Number(input.value)+1)/2;
    flxRunAction(action,norm,false);
  });
}
function bindFlxJog(letter){
  const el=$(`#flx${letter}Jog`);if(!el)return;let active=false,lastX=0,moved=false;
  el.addEventListener('pointerdown',e=>{if(flxState.learn)return;active=true;moved=false;lastX=e.clientX;el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(!active)return;const d=djDecks[letter];if(!d.item)return;const dx=e.clientX-lastX;lastX=e.clientX;if(Math.abs(dx)>.5)moved=true;try{d.audio.currentTime=clamp((d.audio.currentTime||0)+dx*.012,0,d.audio.duration||0)}catch{}});
  const end=()=>{active=false};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
}

function refreshFlx4Ui(){
  for(const L of ['A','B']){
    const d=djDecks[L],dur=d.audio?.duration||d.buffer?.duration||0,cur=d.audio?.currentTime||0;
    const title=$(`#flx${L}Title`),meta=$(`#flx${L}Meta`),prog=$(`#flx${L}Progress`),jog=$(`#flx${L}Jog`),pitch=$(`#flx${L}Pitch`),pv=$(`#flx${L}PitchVal`);
    if(title)title.textContent=d.item?(d.item.title||cleanDjTitle(d.item.name)):(currentLang==='de'?'Kein Song':'No track');
    if(meta)meta.textContent=`${d.item?djDeckBpm(L).toFixed(1):'—'} BPM · ${fmtDeckTime(cur)}`;if(prog)prog.style.width=(dur?clamp(cur/dur*100,0,100):0)+'%';
    if(jog)jog.style.setProperty('--jog-angle',`${(cur*72)%360}deg`);
    const stdPitch=Number($(`#deck${L}Pitch`)?.value||0);if(pitch&&document.activeElement!==pitch)pitch.value=stdPitch;if(pv)pv.textContent=(stdPitch>=0?'+':'')+stdPitch.toFixed(1)+'%';
    const play=document.querySelector(`[data-flx-action="${L}.play"]`);if(play){play.classList.toggle('playing',!!d.item&&!d.audio.paused);play.textContent=!!d.item&&!d.audio.paused?'❚❚ PAUSE':'▶ PLAY'}
    for(let i=0;i<8;i++){const p=document.querySelector(`[data-hot="${L}-${i}"]`);if(p)p.classList.toggle('hot-set',Number.isFinite(d.hotCues?.[i]))}
  }
  if($('#flxCrossfader')&&document.activeElement!==$('#flxCrossfader'))$('#flxCrossfader').value=$('#djCrossfader')?.value||0;
}
function startFlxTicker(){let last=0;const tick=ts=>{if(!window.__nevoScrolling&&ts-last>80){last=ts;refreshFlx4Ui()}requestAnimationFrame(tick)};requestAnimationFrame(tick)}

function flxMidiMessageKey(data){
  const status=data[0]||0,type=status&0xF0,ch=status&0x0F,d1=data[1]||0,d2=data[2]||0;
  if(type===0xE0)return {key:`e0:${ch}:pitch`,norm:clamp(((d2<<7)|d1)/16383,0,1)};
  return {key:`${type.toString(16)}:${ch}:${d1}`,norm:clamp(d2/127,0,1)};
}
function saveFlxMappings(){try{localStorage.setItem(FLX_MIDI_STORAGE,JSON.stringify(flxState.mappings))}catch{};refreshFlxMappingSummary()}
function refreshFlxMappingSummary(){const entries=Object.entries(flxState.mappings||{}),n=entries.length,targets=new Set(entries.map(([,v])=>v)).size;const hint=$('#flxLearnHint');if(hint&&!flxState.learn)hint.textContent=`${n} MIDI-Signale · ${targets} Funktionen gespeichert`}
function flxMappingPayload(){return {app:'NÉVO Studio',version:'4.0.5',profile:'DDJ-FLX4',createdAt:new Date().toISOString(),mappings:flxState.mappings}}
function exportFlxMappings(){
  downloadBlob(new Blob([JSON.stringify(flxMappingPayload(),null,2)],{type:'application/json'}),'NEVO-DDJ-FLX4-Mapping.json');
  flxStatus(currentLang==='de'?'MIDI-Mapping als Backup gesichert':'MIDI mapping backup exported','connected');
}
function exportDefaultFlxMappings(){
  downloadBlob(new Blob([JSON.stringify(flxMappingPayload(),null,2)],{type:'application/json'}),'flx4-default-mapping.json');
  flxStatus(currentLang==='de'?'Standardprofil exportiert – diese Datei später ins GitHub-Hauptverzeichnis legen':'Default profile exported – place this file in the GitHub root later','connected');
}
function cleanFlxMappingCandidate(candidate){const clean={};if(!candidate||typeof candidate!=='object'||Array.isArray(candidate))return clean;for(const [k,v] of Object.entries(candidate))if(typeof k==='string'&&typeof v==='string'&&k&&v)clean[k]=v;return clean}
async function loadBundledFlxProfile(force=false){
  try{
    const res=await fetch(FLX_DEFAULT_MAPPING_URL,{cache:'no-store'});if(!res.ok)throw new Error('profile missing');
    const data=await res.json(),clean=cleanFlxMappingCandidate(data&&data.mappings?data.mappings:data);if(!Object.keys(clean).length)throw new Error('empty profile');
    if(!force&&Object.keys(flxState.mappings||{}).length)return false;
    flxState.mappings=clean;saveFlxMappings();flxStatus(`${Object.keys(clean).length} MIDI-Signale aus DDJ-FLX4-Standardprofil geladen`,'connected');return true;
  }catch(e){if(force)flxStatus(currentLang==='de'?'Noch kein fertiges Standardprofil hinterlegt':'No finished default profile is bundled yet','error');return false}
}
async function importFlxMappings(file){
  if(!file)return;
  try{
    const data=JSON.parse(await file.text()),candidate=data&&data.mappings?data.mappings:data;
    const clean=cleanFlxMappingCandidate(candidate);
    if(!Object.keys(clean).length)throw new Error('empty');
    flxState.mappings=clean;saveFlxMappings();flxStatus(`${Object.keys(clean).length} MIDI-Mappings geladen`,'connected');
  }catch(e){console.warn(e);flxStatus(currentLang==='de'?'Mapping-Datei ungültig':'Invalid mapping file','error')}
}
function toggleFlxMidiMonitor(){
  flxState.monitor=!flxState.monitor;const b=$('#flxMidiMonitorBtn');if(b){b.textContent=flxState.monitor?(currentLang==='de'?'MIDI MONITOR AN':'MIDI MONITOR ON'):(currentLang==='de'?'MIDI MONITOR AUS':'MIDI MONITOR OFF');b.classList.toggle('active',flxState.monitor)}
  const el=$('#flxMidiMonitor');if(el){el.classList.toggle('active',flxState.monitor);el.textContent=flxState.monitor?(flxState.lastRawMidi||'Warte auf MIDI-Signal …'):'MIDI Monitor aus'}
}
function clearFlxLearnTarget(){document.querySelectorAll('.learn-target').forEach(x=>x.classList.remove('learn-target'));flxState.target=null}
function selectFlxLearnTarget(el){
  clearFlxLearnTarget();
  const action=el.dataset.flxAction;
  if(/\.jog$/.test(action)){
    $('#flxLearnHint').textContent=currentLang==='de'?'JOG: MONITOR NUTZEN':'JOG: USE MONITOR';
    flxStatus(currentLang==='de'?'Jogwheel wird separat gemappt. MIDI MONITOR einschalten und Jogwheel bewegen.':'Jog wheel uses a separate mapping. Turn on MIDI MONITOR and move the jog wheel.','error');
    return;
  }
  flxState.target=action;el.classList.add('learn-target');$('#flxLearnHint').textContent=`Warte: ${flxActionLabel(flxState.target)}`;flxStatus(`Bewege jetzt am Controller: ${flxActionLabel(flxState.target)}`,'connected')
}
function updateFlxMidiMonitor(raw,key,norm){
  flxState.lastRawMidi=`${key} · ${Math.round(norm*127)}/127 · RAW ${[...raw].join(' ')}`;
  if(flxState.monitor){const el=$('#flxMidiMonitor');if(el){el.textContent=flxState.lastRawMidi;el.classList.add('active')}}
}
function handleFlxMidiMessage(e){
  const raw=e.data||[];const {key,norm}=flxMidiMessageKey(raw);if(!key)return;updateFlxMidiMonitor(raw,key,norm);
  if(flxState.learn&&flxState.target){if(norm<=.01)return;const target=flxState.target,already=Object.values(flxState.mappings).filter(v=>v===target).length;flxState.mappings[key]=target;saveFlxMappings();const label=flxActionLabel(target);clearFlxLearnTarget();$('#flxLearnHint').textContent=`Gelernt: ${label}`;flxStatus(`MIDI gelernt: ${label}${already?' · zusätzliche Pad-Bank/Belegung':''}`,'connected');return}
  const action=flxState.mappings[key];if(!action)return;
  const prev=flxState.lastMidi.get(key)??0;flxState.lastMidi.set(key,norm);
  if(flxIsContinuous(action))flxRunAction(action,norm,true);else if(norm>.45&&prev<=.45)flxRunAction(action,1,true);
}
function attachFlxMidiInputs(){
  if(!flxState.midiAccess)return;let count=0,names=[];for(const input of flxState.midiAccess.inputs.values()){count++;names.push(input.name||'MIDI');input.onmidimessage=handleFlxMidiMessage}
  if(count)flxStatus(`${count} MIDI-Gerät${count===1?'':'e'}: ${names.join(', ')}`,'connected');else flxStatus(currentLang==='de'?'MIDI bereit – noch kein Gerät gefunden':'MIDI ready – no device found','error')
}
async function connectFlxMidi(){
  if(!navigator.requestMIDIAccess){flxStatus(currentLang==='de'?'Dieser Browser bietet hier kein Web MIDI. FLX4-Modus am Bildschirm funktioniert trotzdem.':'This browser does not provide Web MIDI here. On-screen FLX4 mode still works.','error');return}
  try{flxState.midiAccess=await navigator.requestMIDIAccess({sysex:false});attachFlxMidiInputs();flxState.midiAccess.onstatechange=attachFlxMidiInputs}catch(e){console.warn(e);flxStatus(currentLang==='de'?'MIDI-Verbindung nicht erlaubt oder fehlgeschlagen':'MIDI connection denied or failed','error')}
}
function toggleFlxMidiLearn(){flxState.learn=!flxState.learn;clearFlxLearnTarget();$('#flxMidiLearn').textContent=flxState.learn?(currentLang==='de'?'MIDI LEARN AN':'MIDI LEARN ON'):(currentLang==='de'?'MIDI LEARN AUS':'MIDI LEARN OFF');$('#flxMidiLearn').classList.toggle('active',flxState.learn);$('#flxLearnHint').textContent=flxState.learn?(currentLang==='de'?'Ziel antippen':'Tap a target'):(currentLang==='de'?'AUS':'OFF')}
function resetFlxMixer(){
  for(const L of ['A','B']){const d=djDecks[L];d.trimValue=d.eqLow=d.eqMid=d.eqHigh=d.filterValue=0;['trim','eqLow','eqMid','eqHigh','filter'].forEach(k=>{const el=document.querySelector(`[data-flx-action="${L}.${k}"]`);if(el)el.value=0});const vol=document.querySelector(`[data-flx-action="${L}.volume"]`);if(vol)vol.value=.9;if($(`#deck${L}Volume`))$(`#deck${L}Volume`).value=.9;flxApplyEq(L)}if($('#flxCrossfader'))$('#flxCrossfader').value=0;if($('#djCrossfader'))$('#djCrossfader').value=0;updateCrossfaderGains();
}
function bindFlx4Mode(){
  if(!$('#flx4Surface'))return;
  $('#djModePro').onclick=()=>setDjViewMode('pro');$('#djModeFlx4').onclick=()=>setDjViewMode('flx4');$('#flxMidiConnect').onclick=connectFlxMidi;$('#flxMidiLearn').onclick=toggleFlxMidiLearn;$('#flxMidiExport').onclick=exportFlxMappings;$('#flxMidiExportDefault').onclick=exportDefaultFlxMappings;$('#flxMidiLoadDefault').onclick=()=>loadBundledFlxProfile(true);$('#flxMidiImport').onchange=e=>{const f=e.target.files?.[0];if(f)importFlxMappings(f);e.target.value=''};$('#flxMidiMonitorBtn').onclick=toggleFlxMidiMonitor;$('#flxMidiReset').onclick=()=>{if(confirm(currentLang==='de'?'Alle MIDI-Zuweisungen löschen?':'Clear all MIDI mappings?')){flxState.mappings={};saveFlxMappings();flxStatus(currentLang==='de'?'MIDI-Zuweisungen gelöscht':'MIDI mappings cleared','')}};$('#flxResetMixer').onclick=resetFlxMixer;
  document.querySelectorAll('#flx4Surface [data-flx-action]').forEach(el=>{
    el.addEventListener('click',e=>{if(flxState.learn){e.preventDefault();e.stopPropagation();selectFlxLearnTarget(el);return}if(el.matches('button'))flxTriggerAction(el.dataset.flxAction)},true);
    if(el.matches('input[type="range"]'))bindFlxRange(el);
  });
  bindFlxJog('A');bindFlxJog('B');
  const mode=localStorage.getItem(FLX_MODE_STORAGE)||'pro';setDjViewMode(mode);refreshFlxMappingSummary();loadBundledFlxProfile(false);startFlxTicker();
}

bindFlx4Mode();

// ===== v3.0: PRO DJ ENGINE / KEY + PHRASE ANALYSIS / MASTER SYNC =====
var nevoV3={masterDeck:'A',globalQuantize:true};

function v3Pad8(arr){const out=Array.isArray(arr)?arr.slice(0,8):[];while(out.length<8)out.push(null);return out}
function v3SnapTime(letter,time){
  const d=djDecks[letter]; if(!d?.quantize||!nevoV3.globalQuantize)return clamp(time,0,d.audio.duration||d.buffer?.duration||0);
  const p=djBeatPeriod(letter),off=djNormalizeOffset(d.beatOffset||0,p); if(!p)return time;
  return clamp(off+Math.round((time-off)/p)*p,0,d.audio.duration||d.buffer?.duration||0);
}
function v3EffectiveBpm(letter){const d=djDecks[letter];return djDeckBpm(letter)*(d.audio?.playbackRate||1)}
function v3PhaseFraction(letter){const d=djDecks[letter],p=djBeatPeriod(letter),off=djNormalizeOffset(d.beatOffset||0,p);if(!d.item||!p)return 0;const raw=((d.audio.currentTime||0)-off)/p;return ((raw%1)+1)%1}
function v3SetMaster(letter){
  nevoV3.masterDeck=letter==='B'?'B':'A';
  for(const L of ['A','B']){
    $(`#deck${L}Master`)?.classList.toggle('active',L===nevoV3.masterDeck);
    $(`#masterDeck${L}`)?.classList.toggle('active',L===nevoV3.masterDeck);
  }
  setStatus(true,'MASTER DECK',`DECK ${nevoV3.masterDeck}`);
}
function v3SetQuantize(letter,on){
  const d=djDecks[letter]; if(!d)return; d.quantize=on;
  const b=$(`#deck${letter}Quantize`);if(b){b.classList.toggle('on',on);b.textContent=on?(currentLang==='de'?'QUANTIZE AN':'QUANTIZE ON'):(currentLang==='de'?'QUANTIZE AUS':'QUANTIZE OFF')}
}
function v3ToggleGlobalQuantize(){
  nevoV3.globalQuantize=!nevoV3.globalQuantize;const b=$('#globalQuantize');if(b){b.classList.toggle('on',nevoV3.globalQuantize);b.textContent=nevoV3.globalQuantize?(currentLang==='de'?'QUANTIZE AN':'QUANTIZE ON'):(currentLang==='de'?'QUANTIZE AUS':'QUANTIZE OFF')}
}
function v3BeatJump(letter,beats){const d=djDecks[letter];if(!d?.item)return;const target=(d.audio.currentTime||0)+beats*djBeatPeriod(letter);d.audio.currentTime=v3SnapTime(letter,target);drawDeckZoom(letter,true)}
function v3LoopIn(letter){const d=djDecks[letter];if(!d?.item)return;d.manualLoopIn=v3SnapTime(letter,d.audio.currentTime||0);d.manualLoopOut=null;d.manualLoopActive=false;setStatus(true,'LOOP IN',`DECK ${letter} · ${fmtDeckTime(d.manualLoopIn)}`)}
function v3LoopOut(letter){const d=djDecks[letter];if(!d?.item)return;let out=v3SnapTime(letter,d.audio.currentTime||0);if(!Number.isFinite(d.manualLoopIn))d.manualLoopIn=v3SnapTime(letter,Math.max(0,out-4*djBeatPeriod(letter)));if(out<=d.manualLoopIn+.02)out=d.manualLoopIn+4*djBeatPeriod(letter);d.manualLoopOut=clamp(out,0,d.audio.duration||out);d.manualLoopActive=true;d.loopBeats=0;if($(`#deck${letter}Loop`))$(`#deck${letter}Loop`).value='0';setStatus(true,'LOOP',`DECK ${letter} · ${fmtDeckTime(d.manualLoopIn)} → ${fmtDeckTime(d.manualLoopOut)}`)}
function v3Reloop(letter){const d=djDecks[letter];if(!d?.item||!Number.isFinite(d.manualLoopIn)||!Number.isFinite(d.manualLoopOut))return;d.manualLoopActive=!d.manualLoopActive;if(d.manualLoopActive&&(d.audio.currentTime<d.manualLoopIn||d.audio.currentTime>d.manualLoopOut))d.audio.currentTime=d.manualLoopIn;const b=$(`#deck${letter}Reloop`);b?.classList.toggle('active',d.manualLoopActive);setStatus(true,'RELOOP',d.manualLoopActive?'AN':'AUS')}

// Best-effort musical-key analysis using Goertzel pitch-class energy + Krumhansl profiles.
function v3Goertzel(data,start,len,sr,freq){const w=2*Math.PI*freq/sr,coeff=2*Math.cos(w);let s0=0,s1=0,s2=0;const end=Math.min(data.length,start+len);for(let i=start;i<end;i+=2){s0=data[i]+coeff*s1-s2;s2=s1;s1=s0}return Math.max(0,s1*s1+s2*s2-coeff*s1*s2)}
function v3RotateProfile(profile,root){const out=[];for(let i=0;i<12;i++)out[i]=profile[(i-root+12)%12];return out}
function v3Corr(a,b){const am=a.reduce((x,y)=>x+y,0)/a.length,bm=b.reduce((x,y)=>x+y,0)/b.length;let n=0,da=0,db=0;for(let i=0;i<a.length;i++){const x=a[i]-am,y=b[i]-bm;n+=x*y;da+=x*x;db+=y*y}return n/Math.sqrt((da||1)*(db||1))}
function v3AnalyzeKey(buffer){
  const data=buffer.getChannelData(0),sr=buffer.sampleRate,dur=buffer.duration,pc=new Float64Array(12),segments=10,segLen=Math.min(8192,Math.floor(sr*.22));
  const baseMidi=36; // C2
  for(let seg=0;seg<segments;seg++){
    const t=dur*(.08+.84*(seg+.5)/segments),start=clamp(Math.floor(t*sr-segLen/2),0,Math.max(0,data.length-segLen));
    for(let midi=baseMidi;midi<=83;midi++){
      const f=440*Math.pow(2,(midi-69)/12);pc[midi%12]+=Math.sqrt(v3Goertzel(data,start,segLen,sr,f));
    }
  }
  const sum=pc.reduce((a,b)=>a+b,0)||1,vec=Array.from(pc,x=>x/sum),maj=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],min=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17],names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];let best={score:-9,key:'—'};
  for(let r=0;r<12;r++){const a=v3Corr(vec,v3RotateProfile(maj,r));if(a>best.score)best={score:a,key:names[r]};const m=v3Corr(vec,v3RotateProfile(min,r));if(m>best.score)best={score:m,key:names[r]+'m'}}return best;
}
function v3AnalyzePhrases(buffer,bpm){
  const data=buffer.getChannelData(0),sr=buffer.sampleRate,dur=buffer.duration,bar=60/bpm*4,chunkBars=8,chunk=Math.max(4,bar*chunkBars),count=Math.max(1,Math.ceil(dur/chunk)),energies=[];
  for(let c=0;c<count;c++){const s=Math.floor(c*chunk*sr),e=Math.min(data.length,Math.floor(Math.min(dur,(c+1)*chunk)*sr)),stride=Math.max(1,Math.floor((e-s)/5000));let sum=0,n=0;for(let i=s;i<e;i+=stride){sum+=data[i]*data[i];n++}energies.push(Math.sqrt(sum/Math.max(1,n)))}
  const sorted=[...energies].sort((a,b)=>a-b),lo=sorted[Math.floor(sorted.length*.25)]||0,hi=sorted[Math.floor(sorted.length*.72)]||0;
  const parts=[];for(let i=0;i<count;i++){let label='GROOVE';if(i===0)label='INTRO';else if(i===count-1)label='OUTRO';else if(energies[i]>=hi)label='PEAK';else if(energies[i]<=lo)label='BREAK';else if(i>0&&energies[i]>energies[i-1]*1.16)label='BUILD';parts.push({start:i*chunk,end:Math.min(dur,(i+1)*chunk),label,energy:energies[i]})}
  // Merge adjacent identical labels.
  const merged=[];for(const p of parts){const last=merged.at(-1);if(last&&last.label===p.label)last.end=p.end;else merged.push({...p})}return merged;
}
function v3PhraseColor(label){return {INTRO:'#54d8ff',GROOVE:'#28e7b2',BUILD:'#ffb55e',PEAK:'#ff5d78',BREAK:'#9a79ff',OUTRO:'#7c8b98'}[label]||'#708494'}
function v3RenderPhrases(letter){const d=djDecks[letter],box=$(`#deck${letter}Phrases`);if(!box)return;const dur=d.buffer?.duration||d.audio?.duration||0,phr=Array.isArray(d.phrases)?d.phrases:[];if(!phr.length||!dur){box.innerHTML=`<span class="phrase-empty">${currentLang==='de'?'TRACK ANALYSIEREN → PHRASES':'ANALYZE TRACK → PHRASES'}</span>`;return}box.innerHTML='';for(const p of phr){const el=document.createElement('button');el.className='phrase-block';el.style.width=Math.max(1,(p.end-p.start)/dur*100)+'%';el.style.setProperty('--phrase-color',v3PhraseColor(p.label));el.textContent=p.label;el.title=`${fmtDeckTime(p.start)} – ${fmtDeckTime(p.end)}`;el.onclick=()=>{d.audio.currentTime=clamp(p.start,0,dur);drawDeckZoom(letter,true)};box.appendChild(el)}}

async function v3AnalyzeTrack(item,showStatus=true){
  if(!item)return null;item.analyzing=true;renderDjLibrary();if(showStatus)setStatus(true,currentLang==='de'?'Track-Analyse läuft':'Track analysis running',item.title||item.name);
  try{
    const buffer=await ensureDjItemBuffer(item),r=analyzeBpmBuffer(buffer),keyResult=v3AnalyzeKey(buffer);item.bpm=r.bpm||item.bpm||150;item.beatOffset=r.beatOffset||0;item.confidence=r.confidence||0;item.duration=buffer.duration;item.key=keyResult.key||item.key||'—';item.keyConfidence=keyResult.score||0;item.phrases=v3AnalyzePhrases(buffer,item.bpm);item.analyzing=false;await saveDjItem(item);
    for(const L of ['A','B'])if(djDecks[L].item?.id===item.id){const d=djDecks[L];d.detectedBpm=item.bpm;d.beatOffset=item.beatOffset;d.key=item.key;d.phrases=item.phrases;$(`#deck${L}Bpm`).value=item.bpm;$(`#deck${L}KeySelect`).value=item.key;drawDeckOverview(L);drawDeckZoom(L,true);v3RenderPhrases(L);refreshDeckUi(L)}
    renderDjLibrary();if(showStatus)setStatus(true,currentLang==='de'?'Analyse fertig':'Analysis ready',`${item.bpm.toFixed(1)} BPM · ${item.key} · ${Math.round(item.confidence*100)}%`);return {...r,key:item.key,phrases:item.phrases}
  }catch(e){item.analyzing=false;console.warn(e);renderDjLibrary();return null}
}
analyzeDjItem=v3AnalyzeTrack;

var v29RenderDjLibrary=renderDjLibrary;
renderDjLibrary=function(){
  const box=$('#djLibraryList');if(!box)return;const q=($('#djLibrarySearch')?.value||'').trim().toLowerCase(),items=djLibrary.filter(item=>!q||`${item.title||''} ${item.name||''} ${item.key||''}`.toLowerCase().includes(q)).sort((a,b)=>(b.addedAt||0)-(a.addedAt||0));if(!items.length){box.innerHTML=`<div class="dj-empty">${djLibrary.length?(currentLang==='de'?'Keine Treffer.':'No matches.'):t('djEmpty')}</div>`;return}
  box.innerHTML='';items.forEach(item=>{const el=document.createElement('div');el.className='dj-lib-item';const bpmText=item.analyzing?(currentLang==='de'?'ANALYSE…':'ANALYZING…'):(item.bpm?Number(item.bpm).toFixed(1):'—'),dur=item.duration?fmtDeckTime(item.duration):'—',key=item.key||'—';el.innerHTML=`<div class="dj-lib-title"><strong>${item.title||cleanDjTitle(item.name)}</strong><small>${item.name}</small></div><div class="dj-lib-bpm ${item.analyzing?'analyzing':''}">${bpmText}</div><div class="dj-lib-key">${key}</div><div class="dj-lib-duration">${dur}</div><div class="dj-lib-actions"><button class="btn small analyze-mini" title="Analyse">⚡</button><button class="btn small">A</button><button class="btn small">B</button></div>`;const title=el.querySelector('.dj-lib-title strong'),[an,a,b]=el.querySelectorAll('button');title.onclick=async()=>{const v=prompt(currentLang==='de'?'Titel':'Title',item.title||cleanDjTitle(item.name));if(v&&v.trim()){item.title=v.trim();await saveDjItem(item);renderDjLibrary()}};an.onclick=()=>v3AnalyzeTrack(item,true);a.onclick=()=>loadItemToDeck(item,'A');b.onclick=()=>loadItemToDeck(item,'B');box.appendChild(el)})
};

var v29LoadItemToDeck=loadItemToDeck;
loadItemToDeck=async function(item,letter){await v29LoadItemToDeck(item,letter);const d=djDecks[letter];d.hotCues=v3Pad8(d.hotCues);d.key=item.key||'—';d.phrases=Array.isArray(item.phrases)?item.phrases:[];d.quantize=true;d.manualLoopIn=null;d.manualLoopOut=null;d.manualLoopActive=false;if($(`#deck${letter}KeySelect`))$(`#deck${letter}KeySelect`).value=d.key;v3SetQuantize(letter,true);v3RenderPhrases(letter);refreshDeckUi(letter)};

var v29PersistDeckMeta=persistDeckMeta;
persistDeckMeta=async function(letter){const d=djDecks[letter];if(d?.item){d.item.key=d.key||'—';d.item.phrases=Array.isArray(d.phrases)?d.phrases:[];d.item.hotCues=v3Pad8(d.hotCues)}return v29PersistDeckMeta(letter)};

var v29RefreshDeckUi=refreshDeckUi;
refreshDeckUi=function(letter){
  v29RefreshDeckUi(letter);const d=djDecks[letter],dur=d.audio.duration||d.buffer?.duration||0,cur=d.audio.currentTime||0,bpm=d.item?v3EffectiveBpm(letter):0;
  if($(`#deck${letter}BigBpm`))$(`#deck${letter}BigBpm`).textContent=d.item?bpm.toFixed(2):'—';
  if($(`#deck${letter}Remain`))$(`#deck${letter}Remain`).textContent=d.item?'-'+fmtDeckTime(Math.max(0,dur-cur)):'-00:00.0';
  if($(`#deck${letter}Key`))$(`#deck${letter}Key`).textContent=d.key||'—';
  if($(`#deck${letter}KeySelect`)&&document.activeElement!==$(`#deck${letter}KeySelect`))$(`#deck${letter}KeySelect`).value=d.key||'—';
  if($(`#deck${letter}Phase`)){
    if(!d.item)$(`#deck${letter}Phase`).textContent='—';else if(nevoV3.masterDeck===letter)$(`#deck${letter}Phase`).textContent='MASTER';else{const master=djDecks[nevoV3.masterDeck];if(master?.item){let diff=v3PhaseFraction(letter)-v3PhaseFraction(nevoV3.masterDeck);if(diff>.5)diff-=1;if(diff<-.5)diff+=1;$(`#deck${letter}Phase`).textContent=(diff>=0?'+':'')+Math.round(diff*100)+'%'}else $(`#deck${letter}Phase`).textContent=Math.round(v3PhaseFraction(letter)*100)+'%'}
  }
  $(`#deck${letter}Master`)?.classList.toggle('active',nevoV3.masterDeck===letter);
  if(d.manualLoopActive)$(`#deck${letter}Reloop`)?.classList.add('active');else $(`#deck${letter}Reloop`)?.classList.remove('active');
  renderHotCues(letter);
};

var v29SyncDeck=syncDeck;
syncDeck=function(letter){
  const d=djDecks[letter],M=nevoV3.masterDeck,master=djDecks[M];if(!d?.item)return;
  if(M===letter||!master?.item)return v29SyncDeck(letter);
  const target=v3EffectiveBpm(M),base=djDeckBpm(letter),rate=clamp(target/base,.84,1.16),pct=(rate-1)*100;$(`#deck${letter}Pitch`).value=pct.toFixed(1);updateDeckRate(letter);
  if(d.quantize&&nevoV3.globalQuantize){const p=djBeatPeriod(letter),off=djNormalizeOffset(d.beatOffset||0,p),phase=v3PhaseFraction(M),cur=d.audio.currentTime||0,beatFloat=(cur-off)/p,beatIndex=Math.round(beatFloat-phase);d.audio.currentTime=clamp(off+(beatIndex+phase)*p,0,d.audio.duration||0)}
  setStatus(true,'BEAT SYNC',`DECK ${letter} → MASTER ${M} · ${target.toFixed(2)} BPM`);drawDeckZoom(letter,true);refreshDeckUi(letter)
};

var v29SetDeckLoop=setDeckLoop;
setDeckLoop=function(letter){const d=djDecks[letter],beats=Number($(`#deck${letter}Loop`).value)||0;d.manualLoopActive=false;d.loopBeats=beats;if(beats){d.loopStart=v3SnapTime(letter,d.audio.currentTime||0);setStatus(true,currentLang==='de'?'Auto-Loop gesetzt':'Auto loop set',`DECK ${letter} · ${beats} Beats`)}};

var v29HotCueAction=hotCueAction;
hotCueAction=function(letter,index){const d=djDecks[letter];if(!d?.item)return;const v=d.hotCues[index];if(Number.isFinite(v)){d.audio.currentTime=v3SnapTime(letter,v);setStatus(true,`HOT CUE ${index+1}`,`${fmtDeckTime(v)} · DECK ${letter}`)}else{d.hotCues[index]=v3SnapTime(letter,d.audio.currentTime||0);persistDeckMeta(letter);renderHotCues(letter);setStatus(true,currentLang==='de'?'Hot Cue gesetzt':'Hot Cue set',`HOT ${index+1} · ${fmtDeckTime(d.hotCues[index])}`)}};

// More informative FLX4 actions, while keeping MIDI Learn generic.
var v29FlxActionLabel=flxActionLabel;
flxActionLabel=function(action){const m=action.match(/^([AB])\.hot([1-8])$/);if(m)return `Deck ${m[1]} Hot Cue ${m[2]}`;return v29FlxActionLabel(action)};

function v3BindControls(){
  $('#masterDeckA')?.addEventListener('click',()=>v3SetMaster('A'));$('#masterDeckB')?.addEventListener('click',()=>v3SetMaster('B'));$('#globalQuantize')?.addEventListener('click',v3ToggleGlobalQuantize);
  for(const L of ['A','B']){
    const d=djDecks[L];d.hotCues=v3Pad8(d.hotCues);d.quantize=true;d.key=d.key||'—';d.phrases=d.phrases||[];
    $(`#deck${L}Master`)?.addEventListener('click',()=>v3SetMaster(L));$(`#deck${L}Quantize`)?.addEventListener('click',()=>v3SetQuantize(L,!d.quantize));$(`#deck${L}LoopIn`)?.addEventListener('click',()=>v3LoopIn(L));$(`#deck${L}LoopOut`)?.addEventListener('click',()=>v3LoopOut(L));$(`#deck${L}Reloop`)?.addEventListener('click',()=>v3Reloop(L));
    $(`#deck${L}KeySelect`)?.addEventListener('change',async e=>{d.key=e.target.value; if(d.item){d.item.key=d.key;await saveDjItem(d.item);renderDjLibrary()}refreshDeckUi(L)});
    document.querySelectorAll(`[data-beatjump^="${L}:"]`).forEach(b=>b.addEventListener('click',()=>v3BeatJump(L,Number(b.dataset.beatjump.split(':')[1]))));
    v3RenderPhrases(L);v3SetQuantize(L,true);
  }
  v3SetMaster('A');renderDjLibrary();refreshDeckUi('A');refreshDeckUi('B');
}

function v3Ticker(){for(const L of ['A','B']){const d=djDecks[L];if(d?.item&&d.manualLoopActive&&Number.isFinite(d.manualLoopIn)&&Number.isFinite(d.manualLoopOut)&&d.audio.currentTime>=d.manualLoopOut-.012)d.audio.currentTime=d.manualLoopIn}requestAnimationFrame(v3Ticker)}

function refreshV3Labels(){
  const de=currentLang==='de';const cols=$$('.dj-library-columns span'),names=de?['TITEL','BPM','TONART','LÄNGE','AKTION']:['TITLE','BPM','KEY','LENGTH','ACTION'];cols.forEach((x,i)=>x.textContent=names[i]||x.textContent);for(const L of ['A','B']){if($(`#deck${L}Analyze`))$(`#deck${L}Analyze`).textContent=de?'⚡ TRACK ANALYSE':'⚡ TRACK ANALYSIS';const q=$(`#deck${L}Quantize`);if(q)q.textContent=djDecks[L].quantize?(de?'QUANTIZE AN':'QUANTIZE ON'):(de?'QUANTIZE AUS':'QUANTIZE OFF');v3RenderPhrases(L)}const g=$('#globalQuantize');if(g)g.textContent=nevoV3.globalQuantize?(de?'QUANTIZE AN':'QUANTIZE ON'):(de?'QUANTIZE AUS':'QUANTIZE OFF');renderDjLibrary()}
var v29SetLanguageV3=setLanguage;setLanguage=function(lang){v29SetLanguageV3(lang);refreshV3Labels()};

v3BindControls();refreshV3Labels();v3Ticker();

// ===== v3.1: LIVE DJ CORE / SYNC LOCK / AUTO MASTER / PFL / GRID TOOLS =====
const V31_STORAGE='nevo-v31-live-dj-core';
const nevoV31={
  autoMaster:true,
  autoAnalyze:true,
  syncLock:{A:false,B:false},
  pfl:{A:false,B:false},
  cueLevel:.75,
  cueOutputId:'',
  lastPhaseFix:{A:0,B:0},
  libraryCursor:0
};
try{Object.assign(nevoV31,JSON.parse(localStorage.getItem(V31_STORAGE)||'{}')||{});nevoV31.syncLock={A:!!nevoV31.syncLock?.A,B:!!nevoV31.syncLock?.B};nevoV31.pfl={A:false,B:false}}catch{}
function saveV31(){try{localStorage.setItem(V31_STORAGE,JSON.stringify({autoMaster:nevoV31.autoMaster,autoAnalyze:nevoV31.autoAnalyze,syncLock:nevoV31.syncLock,cueLevel:nevoV31.cueLevel,cueOutputId:nevoV31.cueOutputId}))}catch{}}

// Wider range so 1/2 and x2 BPM corrections are useful.
djDeckBpm=function(letter){return clamp(Number($(`#deck${letter}Bpm`)?.value)||djDecks[letter].detectedBpm||150,50,300)};
for(const L of ['A','B']){const el=$(`#deck${L}Bpm`);if(el){el.min='50';el.max='300'}}

function v31SetSyncLock(letter,on){
  if(letter===nevoV3.masterDeck&&on){setStatus(true,'SYNC LOCK',currentLang==='de'?`Deck ${letter} ist MASTER und folgt keinem anderen Deck.`:`Deck ${letter} is MASTER and does not follow another deck.`);on=false}
  nevoV31.syncLock[letter]=!!on;saveV31();
  const b=$(`#deck${letter}SyncLock`);if(b){b.classList.toggle('active',!!on);b.textContent=currentLang==='de'?(on?'SYNC LOCK AN':'SYNC LOCK AUS'):(on?'SYNC LOCK ON':'SYNC LOCK OFF')}
  document.querySelector(`.dj-deck[data-deck="${letter}"]`)?.classList.toggle('sync-locked',!!on);
  const fb=document.querySelector(`[data-flx-action="${letter}.synclock"]`);if(fb)fb.classList.toggle('active',!!on);
  if(on)syncDeck(letter)
}
function v31ToggleSyncLock(letter){v31SetSyncLock(letter,!nevoV31.syncLock[letter])}

function v31SetAutoMaster(on){
  nevoV31.autoMaster=!!on;saveV31();const b=$('#autoMasterBtn');if(b){b.classList.toggle('active',nevoV31.autoMaster);b.textContent=currentLang==='de'?(nevoV31.autoMaster?'AUTO MASTER AN':'AUTO MASTER AUS'):(nevoV31.autoMaster?'AUTO MASTER ON':'AUTO MASTER OFF')}
}
function v31SetAutoAnalyze(on){
  nevoV31.autoAnalyze=!!on;saveV31();const b=$('#autoAnalyzeBtn');if(b){b.classList.toggle('active',nevoV31.autoAnalyze);b.textContent=currentLang==='de'?(nevoV31.autoAnalyze?'AUTO ANALYSE AN':'AUTO ANALYSE AUS'):(nevoV31.autoAnalyze?'AUTO ANALYSIS ON':'AUTO ANALYSIS OFF')}
}
function v31AutoMasterOnPlay(letter){
  if(!nevoV31.autoMaster)return;const other=letter==='A'?'B':'A',m=djDecks[nevoV3.masterDeck];
  if(!m?.item||m.audio.paused||!djDecks[other]?.item||djDecks[other].audio.paused)v3SetMaster(letter)
}
function v31AutoMasterOnPause(letter){
  if(!nevoV31.autoMaster||nevoV3.masterDeck!==letter)return;const other=letter==='A'?'B':'A';if(djDecks[other]?.item&&!djDecks[other].audio.paused)v3SetMaster(other)
}

// Make master switching safe for sync-lock: the master itself never follows.
const v31OldSetMaster=v3SetMaster;
v3SetMaster=function(letter){v31OldSetMaster(letter);if(nevoV31.syncLock[letter])v31SetSyncLock(letter,false);const other=letter==='A'?'B':'A';if(nevoV31.syncLock[other])syncDeck(other);v31RefreshControls()};

function v31ScaleGridBpm(letter,factor){
  const d=djDecks[letter];if(!d?.item)return;const old=djDeckBpm(letter),v=clamp(old*factor,50,300);$(`#deck${letter}Bpm`).value=v.toFixed(1);d.detectedBpm=v;const p=60/v;d.beatOffset=djNormalizeOffset(d.beatOffset||0,p);if(d.item){d.item.bpm=v;d.item.beatOffset=d.beatOffset;persistDeckMeta(letter)}drawDeckOverview(letter);drawDeckZoom(letter,true);refreshDeckUi(letter);setStatus(true,'BEATGRID',`${old.toFixed(1)} → ${v.toFixed(1)} BPM`);if(nevoV31.syncLock[letter])syncDeck(letter)
}
function v31SetDownbeat(letter){gridHere(letter);setStatus(true,currentLang==='de'?'DOWNBEAT GESETZT':'DOWNBEAT SET',`DECK ${letter} · ${fmtDeckTime(djDecks[letter].audio.currentTime||0)}`)}

function v31CueAudio(letter){
  const d=djDecks[letter];if(!d.cueAudio){const a=new Audio();a.preload='auto';a.preservesPitch=true;a.mozPreservesPitch=true;a.webkitPreservesPitch=true;d.cueAudio=a}return d.cueAudio
}
async function v31ApplyCueSink(audio){
  if(!audio||!nevoV31.cueOutputId||typeof audio.setSinkId!=='function')return false;
  try{await audio.setSinkId(nevoV31.cueOutputId);return true}catch(e){console.warn('Cue sink failed',e);return false}
}
async function v31TogglePfl(letter){
  const d=djDecks[letter];if(!d?.item)return;const a=v31CueAudio(letter);nevoV31.pfl[letter]=!nevoV31.pfl[letter];
  if(nevoV31.pfl[letter]){
    if(a.src!==d.item.url)a.src=d.item.url;a.currentTime=clamp(d.audio.currentTime||0,0,d.audio.duration||d.buffer?.duration||0);a.playbackRate=d.audio.playbackRate||1;a.preservesPitch=d.keyLock;a.mozPreservesPitch=d.keyLock;a.webkitPreservesPitch=d.keyLock;a.volume=v35CueDeckVolume(letter);await v31ApplyCueSink(a);try{await a.play()}catch(e){console.warn(e)}
  }else a.pause();
  v31RefreshPfl(letter)
}
function v31RefreshPfl(letter){
  const on=!!nevoV31.pfl[letter],b=$(`#deck${letter}Pfl`);if(b){b.classList.toggle('active',on);b.textContent=currentLang==='de'?(on?'🎧 PFL AN':'🎧 PFL AUS'):(on?'🎧 PFL ON':'🎧 PFL OFF')}
  document.querySelector(`.dj-deck[data-deck="${letter}"]`)?.classList.toggle('pfl-on',on);const fb=document.querySelector(`[data-flx-action="${letter}.pfl"]`);if(fb)fb.classList.toggle('active',on)
}
async function v31LoadCueOutputs(){
  const sel=$('#cueOutputSelect');if(!sel)return;sel.innerHTML='<option value="">Systemausgang</option>';
  if(!navigator.mediaDevices?.enumerateDevices){$('#cueRoutingStatus').textContent=currentLang==='de'?'Ausgangswahl in diesem Browser nicht verfügbar':'Output selection unavailable in this browser';return}
  try{
    const list=(await navigator.mediaDevices.enumerateDevices()).filter(x=>x.kind==='audiooutput');for(const d of list){const o=document.createElement('option');o.value=d.deviceId;o.textContent=d.label||`Audio-Ausgang ${sel.options.length}`;sel.appendChild(o)}if(nevoV31.cueOutputId&&[...sel.options].some(o=>o.value===nevoV31.cueOutputId))sel.value=nevoV31.cueOutputId;
    const supported=typeof v31CueAudio('A').setSinkId==='function';$('#cueRoutingStatus').textContent=supported?(currentLang==='de'?'Separater Browser-Ausgang möglich':'Separate browser output available'):(currentLang==='de'?'Systemausgang · separater Ausgang braucht Desktop-Unterstützung':'System output · separate output needs desktop support')
  }catch(e){console.warn(e);$('#cueRoutingStatus').textContent=currentLang==='de'?'Audio-Ausgänge konnten nicht gelesen werden':'Could not read audio outputs'}
}
async function v31SetCueOutput(id){nevoV31.cueOutputId=id||'';saveV31();for(const L of ['A','B']){const a=v31CueAudio(L);if(typeof a.setSinkId==='function')try{await a.setSinkId(id||'default')}catch(e){console.warn(e)}}}

function v31SyncFollower(letter){
  if(!nevoV31.syncLock[letter]||letter===nevoV3.masterDeck)return;const d=djDecks[letter],m=djDecks[nevoV3.masterDeck];if(!d?.item||!m?.item)return;
  const target=v3EffectiveBpm(nevoV3.masterDeck),base=djDeckBpm(letter);if(!base)return;const desired=clamp(target/base,.84,1.16),pct=(desired-1)*100;
  const pitch=$(`#deck${letter}Pitch`);if(pitch&&document.activeElement!==pitch)pitch.value=pct.toFixed(1);const fp=$(`#flx${letter}Pitch`);if(fp&&document.activeElement!==fp)fp.value=pct;
  let actual=desired;
  if(!d.audio.paused&&!m.audio.paused&&d.quantize&&nevoV3.globalQuantize){let diff=v3PhaseFraction(letter)-v3PhaseFraction(nevoV3.masterDeck);if(diff>.5)diff-=1;if(diff<-.5)diff+=1;const now=performance.now();if(Math.abs(diff)>.20&&now-nevoV31.lastPhaseFix[letter]>550){const p=djBeatPeriod(letter);try{d.audio.currentTime=clamp((d.audio.currentTime||0)-diff*p,0,d.audio.duration||0)}catch{}nevoV31.lastPhaseFix[letter]=now}else actual=clamp(desired*(1+clamp(-diff*.035,-.008,.008)),.5,2)}
  if(Math.abs((d.audio.playbackRate||1)-actual)>.0002)d.audio.playbackRate=actual;$(`#deck${letter}PitchValue`).textContent=(pct>=0?'+':'')+pct.toFixed(1)+'%';
  if(nevoV31.pfl[letter]){const a=v31CueAudio(letter);a.playbackRate=d.audio.playbackRate}
}

function v31BrowseMove(delta){
  if(!djLibrary.length)return;nevoV31.libraryCursor=(nevoV31.libraryCursor+delta+djLibrary.length)%djLibrary.length;v31UpdateBrowseTitle()
}
function v31BrowseItem(){return djLibrary[clamp(nevoV31.libraryCursor,0,Math.max(0,djLibrary.length-1))]||null}
function v31UpdateBrowseTitle(){const el=$('#flxBrowseTitle'),item=v31BrowseItem();if(el)el.textContent=item?(item.title||cleanDjTitle(item.name)):(currentLang==='de'?'BIBLIOTHEK LEER':'LIBRARY EMPTY')}
async function v31BrowseLoad(letter){const item=v31BrowseItem();if(item)await loadItemToDeck(item,letter)}

// Auto-analyze before loading a new deck when requested.
const v31OldLoadItemToDeck=loadItemToDeck;
loadItemToDeck=async function(item,letter){
  if(nevoV31.autoAnalyze&&item&&!item.analyzing&&(!item.bpm||!item.key||item.key==='—'))await v3AnalyzeTrack(item,false);
  await v31OldLoadItemToDeck(item,letter);const d=djDecks[letter],a=v31CueAudio(letter);a.pause();nevoV31.pfl[letter]=false;a.src=item.url;a.load();if(nevoV31.cueOutputId)await v31ApplyCueSink(a);v31RefreshPfl(letter);v31UpdateBrowseTitle();
};

// FLX4 MIDI Learn gets the new actions too.
const v31OldFlxTrigger=flxTriggerAction;
flxTriggerAction=function(action){
  if(action==='library.prev')return v31BrowseMove(-1);if(action==='library.next')return v31BrowseMove(1);if(action==='library.loadA')return v31BrowseLoad('A');if(action==='library.loadB')return v31BrowseLoad('B');
  const m=action.match(/^([AB])\.(pfl|synclock)$/);if(m)return m[2]==='pfl'?v31TogglePfl(m[1]):v31ToggleSyncLock(m[1]);return v31OldFlxTrigger(action)
};
const v31OldFlxLabel=flxActionLabel;
flxActionLabel=function(action){const map={'A.pfl':'Deck A Kopfhörer/PFL','B.pfl':'Deck B Kopfhörer/PFL','A.synclock':'Deck A Sync Lock','B.synclock':'Deck B Sync Lock','library.prev':'Bibliothek vorheriger Song','library.next':'Bibliothek nächster Song','library.loadA':'Bibliothek Load A','library.loadB':'Bibliothek Load B'};return map[action]||v31OldFlxLabel(action)};

function v31RefreshControls(){
  v31SetAutoMaster(nevoV31.autoMaster);v31SetAutoAnalyze(nevoV31.autoAnalyze);for(const L of ['A','B']){const b=$(`#deck${L}SyncLock`);if(b){b.classList.toggle('active',nevoV31.syncLock[L]);b.textContent=currentLang==='de'?(nevoV31.syncLock[L]?'SYNC LOCK AN':'SYNC LOCK AUS'):(nevoV31.syncLock[L]?'SYNC LOCK ON':'SYNC LOCK OFF')}v31RefreshPfl(L)}
  if($('#cueLevel'))$('#cueLevel').value=nevoV31.cueLevel;if($('#cueLevelValue'))$('#cueLevelValue').textContent=Math.round(nevoV31.cueLevel*100)+'%';v31UpdateBrowseTitle()
}

function v31Bind(){
  $('#autoMasterBtn')?.addEventListener('click',()=>v31SetAutoMaster(!nevoV31.autoMaster));$('#autoAnalyzeBtn')?.addEventListener('click',()=>v31SetAutoAnalyze(!nevoV31.autoAnalyze));
  for(const L of ['A','B']){
    $(`#deck${L}SyncLock`)?.addEventListener('click',()=>v31ToggleSyncLock(L));$(`#deck${L}Pfl`)?.addEventListener('click',()=>v31TogglePfl(L));$(`#deck${L}HalfBpm`)?.addEventListener('click',()=>v31ScaleGridBpm(L,.5));$(`#deck${L}DoubleBpm`)?.addEventListener('click',()=>v31ScaleGridBpm(L,2));
    // Replace GRID HIER's old click result with a clearer downbeat action; both use the same underlying beat anchor.
    const gh=$(`#deck${L}GridHere`);if(gh)gh.addEventListener('click',()=>setTimeout(()=>v31SetDownbeat(L),0));
    const d=djDecks[L];d.audio.addEventListener('play',()=>v31AutoMasterOnPlay(L));d.audio.addEventListener('pause',()=>v31AutoMasterOnPause(L));d.audio.addEventListener('ended',()=>v31AutoMasterOnPause(L));
  }
  $('#cueLevel')?.addEventListener('input',e=>{nevoV31.cueLevel=clamp(Number(e.target.value)||0,0,1);$('#cueLevelValue').textContent=Math.round(nevoV31.cueLevel*100)+'%';for(const L of ['A','B'])v31CueAudio(L).volume=nevoV31.cueLevel;saveV31()});
  $('#cueRefreshOutputs')?.addEventListener('click',v31LoadCueOutputs);$('#cueOutputSelect')?.addEventListener('change',e=>v31SetCueOutput(e.target.value));
  v31RefreshControls();v31LoadCueOutputs();
}

let v31LastTick=0;
function v31Ticker(ts){
  if(ts-v31LastTick>55){v31LastTick=ts;for(const L of ['A','B']){
    v31SyncFollower(L);const d=djDecks[L];if(nevoV31.pfl[L]&&d?.item){const a=v31CueAudio(L);a.volume=v35CueDeckVolume(L);a.playbackRate=d.audio.playbackRate||1;if(!d.audio.paused&&Math.abs((a.currentTime||0)-(d.audio.currentTime||0))>.12)try{a.currentTime=d.audio.currentTime||0}catch{};if(d.audio.paused&&a.paused===false&&Math.abs((a.currentTime||0)-(d.audio.currentTime||0))>.35)try{a.currentTime=d.audio.currentTime||0}catch{}}}
  }requestAnimationFrame(v31Ticker)
}

// Extend language refresh.
const v31OldSetLanguage=setLanguage;
setLanguage=function(lang){v31OldSetLanguage(lang);v31RefreshControls();for(const L of ['A','B']){const h=$(`#deck${L}GridHere`);if(h)h.textContent=currentLang==='de'?'DOWNBEAT HIER':'DOWNBEAT HERE'}const r=$('#cueRefreshOutputs');if(r)r.textContent=currentLang==='de'?'AUSGÄNGE LADEN':'LOAD OUTPUTS'};

v31Bind();requestAnimationFrame(v31Ticker);

// ===== v3.2: SMART ANALYSIS / LIBRARY METADATA / AUDIO TOOLS / DJ→STUDIO =====
const V32_STORAGE='nevo-v32-smart-workflow';
const nevoV32={analysisProfile:'techno',sort:'added',crate:'all'};
try{Object.assign(nevoV32,JSON.parse(localStorage.getItem(V32_STORAGE)||'{}')||{})}catch{}
function v32SavePrefs(){try{localStorage.setItem(V32_STORAGE,JSON.stringify(nevoV32))}catch{}}
const V32_BPM_PROFILES={techno:{min:125,max:165,center:150,label:'TECHNO 125–165'},minimal:{min:135,max:160,center:147,label:'MINIMAL 135–160'},psy:{min:138,max:158,center:148,label:'PSY 138–158'},wide:{min:80,max:190,center:140,label:'WEIT 80–190'}};
function v32Profile(){return V32_BPM_PROFILES[nevoV32.analysisProfile]||V32_BPM_PROFILES.techno}
function v32Esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function v32Stars(n){n=clamp(Number(n)||0,0,5);return '★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n)}

function v32SmartBpm(buffer){
  const profile=v32Profile(),data=buffer.getChannelData(0),sr=buffer.sampleRate,maxSec=Math.min(buffer.duration,180),hop=2048,frames=Math.min(Math.floor(maxSec*sr/hop),Math.floor(data.length/hop));
  if(frames<80)return {bpm:0,beatOffset:0,confidence:0};
  const env=new Float32Array(frames);for(let f=0;f<frames;f++){const a=f*hop,b=Math.min(data.length,a+hop);let sum=0,n=0;for(let i=a;i<b;i+=8){const v=data[i]||0;sum+=v*v;n++}env[f]=n?Math.sqrt(sum/n):0}
  const novelty=new Float32Array(frames);let ema=env[0]||0;for(let i=1;i<frames;i++){ema=ema*.92+env[i]*.08;novelty[i]=Math.max(0,env[i]-ema)}
  let mean=0;for(const v of novelty)mean+=v;mean/=frames||1;for(let i=0;i<frames;i++)novelty[i]=Math.max(0,novelty[i]-mean*.7);
  const corrAt=lag=>{lag=Math.max(1,Math.round(lag));let a=0,b=0,c=0;for(let i=lag;i<frames;i++){const x=novelty[i],y=novelty[i-lag];a+=x*y;b+=x*x;c+=y*y}return a/Math.sqrt((b*c)||1)};
  let best={bpm:0,score:-1},second={score:-1};
  for(let bpm=profile.min;bpm<=profile.max;bpm+=.5){const lag=60/bpm*sr/hop;const fundamental=corrAt(lag),barSupport=corrAt(lag*2),subSupport=corrAt(lag/2);const centerWeight=1-.055*Math.min(1,Math.abs(bpm-profile.center)/Math.max(1,(profile.max-profile.min)/2));const score=(fundamental+.28*barSupport+.08*subSupport)*centerWeight;if(score>best.score){second=best;best={bpm,score}}else if(score>second.score)second={bpm,score}}
  if(!best.bpm||best.score<=0)return analyzeBpmBuffer(buffer);
  const bpm=Math.round(best.bpm*10)/10,period=60/bpm,bins=96,phase=new Float64Array(bins);for(let i=1;i<frames;i++){const v=novelty[i];if(v<=0)continue;const tm=i*hop/sr,ph=((tm%period)+period)%period,bi=Math.min(bins-1,Math.floor(ph/period*bins));phase[bi]+=v}
  let bi=0;for(let i=1;i<bins;i++)if(phase[i]>phase[bi])bi=i;const beatOffset=(bi+.5)/bins*period;const confidence=clamp((best.score-.35*Math.max(0,second.score))/.75,0,1);
  return {bpm,beatOffset,confidence,profile:nevoV32.analysisProfile}
}

async function v32AnalyzeTrack(item,showStatus=true){
  if(!item)return null;item.analyzing=true;renderDjLibrary();const prof=v32Profile();if(showStatus)setStatus(true,currentLang==='de'?'SMART ANALYSE LÄUFT':'SMART ANALYSIS RUNNING',`${item.title||item.name} · ${prof.label}`);
  const badge=$('#djSmartAnalysisStatus');if(badge)badge.textContent=currentLang==='de'?'SMART ANALYSE LÄUFT …':'SMART ANALYSIS RUNNING …';
  try{
    const buffer=await ensureDjItemBuffer(item),r=v32SmartBpm(buffer),keyResult=v3AnalyzeKey(buffer);item.bpm=r.bpm||item.bpm||150;item.beatOffset=r.beatOffset||0;item.confidence=r.confidence||0;item.analysisProfile=nevoV32.analysisProfile;item.duration=buffer.duration;item.key=keyResult.key||item.key||'—';item.keyConfidence=keyResult.score||0;item.phrases=v3AnalyzePhrases(buffer,item.bpm);item.analyzing=false;await saveDjItem(item);
    for(const L of ['A','B'])if(djDecks[L].item?.id===item.id){const d=djDecks[L];d.detectedBpm=item.bpm;d.beatOffset=item.beatOffset;d.key=item.key;d.phrases=item.phrases;$(`#deck${L}Bpm`).value=item.bpm;$(`#deck${L}KeySelect`).value=item.key;drawDeckOverview(L);drawDeckZoom(L,true);v3RenderPhrases(L);refreshDeckUi(L)}
    renderDjLibrary();if(badge)badge.textContent=`SMART · ${prof.label}`;if(showStatus)setStatus(true,currentLang==='de'?'Smart-Analyse fertig':'Smart analysis ready',`${item.bpm.toFixed(1)} BPM · ${item.key} · ${Math.round(item.confidence*100)}%`);return {...r,key:item.key,phrases:item.phrases}
  }catch(e){item.analyzing=false;console.warn(e);renderDjLibrary();if(badge)badge.textContent='SMART ANALYSE';return null}
}
v3AnalyzeTrack=v32AnalyzeTrack;analyzeDjItem=v32AnalyzeTrack;

// Persist v3.2 library metadata without changing the existing IndexedDB schema.
saveDjItem=async function(item){
  const db=await openDjDb();if(!db||!item)return;const blob=item.blob||item.file;if(!blob)return;
  const row={id:item.id,name:item.name,title:item.title||cleanDjTitle(item.name),artist:item.artist||'',crate:item.crate||'',rating:clamp(Number(item.rating)||0,0,5),comment:item.comment||'',bpm:Number(item.bpm)||0,duration:Number(item.duration)||0,beatOffset:Number(item.beatOffset)||0,confidence:Number(item.confidence)||0,analysisProfile:item.analysisProfile||'',key:item.key||'—',phrases:Array.isArray(item.phrases)?item.phrases:[],hotCues:Array.isArray(item.hotCues)?item.hotCues:[null,null,null,null,null,null,null,null],cue:Number(item.cue)||0,blob,type:blob.type||'audio/*',addedAt:item.addedAt||Date.now()};
  try{await new Promise((resolve,reject)=>{const tx=db.transaction(DJ_DB_STORE,'readwrite');tx.objectStore(DJ_DB_STORE).put(row);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch(e){console.warn('DJ library save failed',e)}
};
async function v32MergePersistedMeta(){
  const db=await openDjDb();if(!db)return;let rows=[];try{rows=await new Promise((resolve,reject)=>{const tx=db.transaction(DJ_DB_STORE,'readonly'),r=tx.objectStore(DJ_DB_STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}catch{return}
  for(const row of rows){const item=djLibrary.find(x=>x.id===row.id);if(!item)continue;item.artist=row.artist||item.artist||'';item.crate=row.crate||item.crate||'';item.rating=Number(row.rating)||item.rating||0;item.comment=row.comment||item.comment||'';item.analysisProfile=row.analysisProfile||item.analysisProfile||''}
  renderDjLibrary();v32RefreshCrateOptions()
}

function v32RefreshCrateOptions(){
  const sel=$('#djCrateFilter');if(!sel)return;const keep=nevoV32.crate||'all',crates=[...new Set(djLibrary.map(x=>(x.crate||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));sel.innerHTML=`<option value="all">${currentLang==='de'?'ALLE':'ALL'}</option><option value="favorites">★ ${currentLang==='de'?'FAVORITEN':'FAVORITES'}</option>`+crates.map(x=>`<option value="crate:${v32Esc(x)}">${v32Esc(x)}</option>`).join('');if([...sel.options].some(o=>o.value===keep))sel.value=keep;else{sel.value='all';nevoV32.crate='all'}
}
let v32MetaItem=null;
function v32OpenMeta(item){v32MetaItem=item;$('#djMetaHeading').textContent=item.title||cleanDjTitle(item.name);$('#djMetaTitle').value=item.title||cleanDjTitle(item.name);$('#djMetaArtist').value=item.artist||'';$('#djMetaCrate').value=item.crate||'';$('#djMetaRating').value=String(Number(item.rating)||0);$('#djMetaComment').value=item.comment||'';$('#djMetaModal').classList.remove('hidden')}
function v32CloseMeta(){v32MetaItem=null;$('#djMetaModal')?.classList.add('hidden')}
async function v32SaveMeta(){if(!v32MetaItem)return;v32MetaItem.title=$('#djMetaTitle').value.trim()||cleanDjTitle(v32MetaItem.name);v32MetaItem.artist=$('#djMetaArtist').value.trim();v32MetaItem.crate=$('#djMetaCrate').value.trim();v32MetaItem.rating=clamp(Number($('#djMetaRating').value)||0,0,5);v32MetaItem.comment=$('#djMetaComment').value.trim();await saveDjItem(v32MetaItem);v32CloseMeta();v32RefreshCrateOptions();renderDjLibrary()}
async function v32DeleteItem(item){if(!item||!confirm(currentLang==='de'?`„${item.title||item.name}“ aus der Bibliothek löschen?`:`Delete “${item.title||item.name}” from library?`))return;for(const L of ['A','B'])if(djDecks[L].item?.id===item.id){stopDeck(L);djDecks[L].item=null;djDecks[L].buffer=null}const i=djLibrary.findIndex(x=>x.id===item.id);if(i>=0)djLibrary.splice(i,1);try{URL.revokeObjectURL(item.url)}catch{}await deleteDjItemPersisted(item.id);v32CloseMeta();v32RefreshCrateOptions();renderDjLibrary();refreshAllDeckUi()}

renderDjLibrary=function(){
  const box=$('#djLibraryList');if(!box)return;v32RefreshCrateOptions();const q=($('#djLibrarySearch')?.value||'').trim().toLowerCase();let items=djLibrary.filter(item=>!q||`${item.title||''} ${item.name||''} ${item.artist||''} ${item.crate||''} ${item.comment||''}`.toLowerCase().includes(q));
  const f=nevoV32.crate||'all';if(f==='favorites')items=items.filter(x=>(Number(x.rating)||0)>=4);else if(f.startsWith('crate:'))items=items.filter(x=>(x.crate||'')===f.slice(6));
  const sort=nevoV32.sort||'added';items.sort((a,b)=>sort==='title'?(a.title||a.name).localeCompare(b.title||b.name):sort==='bpm'?(Number(a.bpm)||999)-(Number(b.bpm)||999):sort==='key'?String(a.key||'').localeCompare(String(b.key||'')):sort==='rating'?(Number(b.rating)||0)-(Number(a.rating)||0):(b.addedAt||0)-(a.addedAt||0));
  if(!items.length){box.innerHTML=`<div class="dj-empty">${djLibrary.length?(currentLang==='de'?'Keine Treffer in diesem Filter.':'No tracks in this filter.'):t('djEmpty')}</div>`;return}
  box.innerHTML='';items.forEach(item=>{const el=document.createElement('div');el.className='dj-lib-item';const bpm=item.analyzing?(currentLang==='de'?'ANALYSE…':'ANALYZING…'):(item.bpm?Number(item.bpm).toFixed(1):'—'),dur=item.duration?fmtDeckTime(item.duration):'—',artist=item.artist||item.name,crate=item.crate?`<span class="v32-crate">${v32Esc(item.crate)}</span>`:'';el.innerHTML=`<div class="dj-lib-title"><strong>${v32Esc(item.title||cleanDjTitle(item.name))}</strong><small class="v32-artist">${v32Esc(artist)}</small>${crate}</div><div class="dj-lib-bpm ${item.analyzing?'analyzing':''}">${bpm}</div><div class="dj-lib-key">${v32Esc(item.key||'—')}</div><div class="dj-lib-duration">${dur}</div><div class="dj-lib-rating" title="Bewertung">${v32Stars(item.rating)}</div><div class="dj-lib-actions"><button class="btn small fav-mini ${(Number(item.rating)||0)>=4?'active':''}" title="Favorit">★</button><button class="btn small meta-mini" title="Track Info">⚙</button><button class="btn small analyze-mini" title="Smart Analyse">⚡</button><button class="btn small">A</button><button class="btn small">B</button></div>`;
    const [fav,meta,an,a,b]=el.querySelectorAll('button');fav.onclick=async()=>{item.rating=(Number(item.rating)||0)>=4?0:5;await saveDjItem(item);renderDjLibrary()};meta.onclick=()=>v32OpenMeta(item);an.onclick=()=>v32AnalyzeTrack(item,true);a.onclick=()=>loadItemToDeck(item,'A');b.onclick=()=>loadItemToDeck(item,'B');el.querySelector('.dj-lib-title strong').ondblclick=()=>v32OpenMeta(item);longPress(el,()=>v32OpenMeta(item));box.appendChild(el)
  })
};

async function v32NormalizeAudio(){const b=audioEditBuffer(),c=audioEditClip;if(!b||!c)return;const s=Math.floor(c.trimStart*b.sampleRate),e=Math.min(b.length,Math.ceil(c.trimEnd*b.sampleRate)),stride=Math.max(1,Math.floor((e-s)/600000));let peak=0;for(let ch=0;ch<b.numberOfChannels;ch++){const d=b.getChannelData(ch);for(let i=s;i<e;i+=stride)peak=Math.max(peak,Math.abs(d[i]||0))}if(peak<.00001)return;c.gain=clamp(.96/peak,.05,1.5);$('#audioClipGain').value=c.gain;updateAudioEditorVisuals();setStatus(audioReady,currentLang==='de'?'Clip normalisiert':'Clip normalized',`${Math.round(c.gain*100)}%`)}
async function v32ReverseSelection(){const old=audioEditBuffer(),c=audioEditClip;if(!old||!c)return;const dur=c.trimEnd-c.trimStart;if(dur>180&&!confirm(currentLang==='de'?'Die Auswahl ist länger als 3 Minuten. Reverse kann auf dem Handy viel Speicher brauchen. Trotzdem fortfahren?':'Selection is longer than 3 minutes. Reverse can use a lot of memory. Continue?'))return;await initAudio();stopAudioEditPreview();const sr=old.sampleRate,s=Math.floor(c.trimStart*sr),e=Math.min(old.length,Math.ceil(c.trimEnd*sr)),len=Math.max(1,e-s),neo=ctx.createBuffer(old.numberOfChannels,len,sr);for(let ch=0;ch<old.numberOfChannels;ch++){const src=old.getChannelData(ch),dst=neo.getChannelData(ch);for(let i=0;i<len;i++)dst[i]=src[e-1-i]||0}const id=uid();audioBuffers.set(id,neo);c.audioId=id;c.trimStart=0;c.trimEnd=neo.duration;audioEditCursor=0;drawBufferWaveform(neo,$('#audioEditorWaveform'),'#b16bff');updateAudioEditorVisuals();setStatus(audioReady,currentLang==='de'?'Auswahl umgekehrt':'Selection reversed',fmtDeckTime(neo.duration))}
function v32DuplicateAudio(){const tr=audioEditTrack,c=audioEditClip;if(!tr||!c)return;const start=clamp(c.start+c.len,0,TOTAL_BARS-1),copy={...c,id:uid(),start,name:localName(c)+' Copy',nameDe:(c.nameDe||c.name)+' Kopie',nameEn:(c.nameEn||c.name)+' Copy'};if(start+c.len>TOTAL_BARS)copy.len=Math.max(1,TOTAL_BARS-start);tr.clips.push(copy);renderTracks();setStatus(audioReady,currentLang==='de'?'Clip dupliziert':'Clip duplicated',localName(copy))}

async function v32LoopToArranger(letter){const d=djDecks[letter];if(!d?.item)return;const buffer=await ensureDjItemBuffer(d.item),period=djBeatPeriod(letter);let start,end,label='8 Beat';if(d.manualLoopActive&&Number.isFinite(d.manualLoopIn)&&Number.isFinite(d.manualLoopOut)){start=d.manualLoopIn;end=d.manualLoopOut;label='Manual Loop'}else if(d.loopBeats){start=d.loopStart;end=start+d.loopBeats*period;label=`${d.loopBeats} Beat`}else{start=v3SnapTime(letter,d.audio.currentTime||0);end=start+8*period}start=clamp(start,0,buffer.duration);end=clamp(end,start+.03,buffer.duration);const audioId=uid();audioBuffers.set(audioId,buffer);let tr=tracks.find(t=>t.type==='audio');if(!tr){tr={id:'audio-'+uid(),name:'AUDIO',nameDe:'AUDIO',nameEn:'AUDIO',color:'#ffffff',type:'audio',mute:false,solo:false,clips:[]};tracks.push(tr)}const arrangerStart=clamp(Number($('#loopStart').value||1)-1,0,TOTAL_BARS-1),len=clamp(Math.max(1,Math.ceil((end-start)/barDurationSeconds())),1,TOTAL_BARS-arrangerStart),title=`${d.item.title||cleanDjTitle(d.item.name)} · ${label}`;tr.clips.push({id:uid(),start:arrangerStart,len,name:title,nameDe:title,nameEn:title,loop:true,audioId,trimStart:start,trimEnd:end,fadeIn:0,fadeOut:0,gain:1});renderTracks();setStatus(true,currentLang==='de'?'DJ-Loop im Arranger':'DJ loop in arranger',`${fmtDeckTime(start)} – ${fmtDeckTime(end)}`);document.querySelector('.arranger-panel')?.scrollIntoView({behavior:'smooth',block:'start'})}

function v32RefreshLanguage(){const de=currentLang==='de';if($('#djSmartAnalysisStatus'))$('#djSmartAnalysisStatus').textContent=`SMART · ${v32Profile().label}`;if($('#deckALoopToArranger'))$('#deckALoopToArranger').textContent=de?'↻ LOOP → ARRANGER':'↻ LOOP → ARRANGER';if($('#deckBLoopToArranger'))$('#deckBLoopToArranger').textContent=de?'↻ LOOP → ARRANGER':'↻ LOOP → ARRANGER';v32RefreshCrateOptions();renderDjLibrary()}
const v32OldSetLanguage=setLanguage;setLanguage=function(lang){v32OldSetLanguage(lang);v32RefreshLanguage()};

function v32Bind(){
  const profile=$('#djAnalysisProfile'),sort=$('#djLibrarySort'),crate=$('#djCrateFilter');if(profile){profile.value=nevoV32.analysisProfile;profile.onchange=e=>{nevoV32.analysisProfile=e.target.value;v32SavePrefs();v32RefreshLanguage();setStatus(audioReady,currentLang==='de'?'Analyseprofil geändert':'Analysis profile changed',v32Profile().label)}}if(sort){sort.value=nevoV32.sort;sort.onchange=e=>{nevoV32.sort=e.target.value;v32SavePrefs();renderDjLibrary()}}if(crate){crate.onchange=e=>{nevoV32.crate=e.target.value;v32SavePrefs();renderDjLibrary()}}
  if($('#djLibrarySearch'))$('#djLibrarySearch').oninput=renderDjLibrary;
  $('#djMetaClose')?.addEventListener('click',v32CloseMeta);$('#djMetaSave')?.addEventListener('click',v32SaveMeta);$('#djMetaDelete')?.addEventListener('click',()=>v32MetaItem&&v32DeleteItem(v32MetaItem));$('#djMetaModal')?.addEventListener('click',e=>{if(e.target.id==='djMetaModal')v32CloseMeta()});
  $('#audioNormalizeBtn')?.addEventListener('click',v32NormalizeAudio);$('#audioReverseBtn')?.addEventListener('click',v32ReverseSelection);$('#audioDuplicateBtn')?.addEventListener('click',v32DuplicateAudio);$('#deckALoopToArranger')?.addEventListener('click',()=>v32LoopToArranger('A'));$('#deckBLoopToArranger')?.addEventListener('click',()=>v32LoopToArranger('B'));
  v32RefreshLanguage();setTimeout(v32MergePersistedMeta,450);setTimeout(v32MergePersistedMeta,1400)
}
v32Bind();


// ===== v3.4: COMPLETE FLX4 SURFACE + PARALLEL DECK WAVE =====
const V34_STORAGE='nevo-flx4-v34-state';
const nevoV34={padMode:{A:'hotcue',B:'hotcue'},shift:{A:false,B:false},waveBeats:8,smartCfx:false,smartFader:false,masterLevel:.85,micLevel:0,headphonesMix:.5,fx:{name:'ECHO',channel:'A',beat:1,level:.55,on:false}};
try{Object.assign(nevoV34,JSON.parse(localStorage.getItem(V34_STORAGE)||'{}')||{});nevoV34.padMode={A:nevoV34.padMode?.A||'hotcue',B:nevoV34.padMode?.B||'hotcue'};nevoV34.shift={A:!!nevoV34.shift?.A,B:!!nevoV34.shift?.B};nevoV34.fx={name:nevoV34.fx?.name||'ECHO',channel:nevoV34.fx?.channel||'A',beat:Number(nevoV34.fx?.beat)||1,level:Number(nevoV34.fx?.level)??.55,on:!!nevoV34.fx?.on}}catch{}
function v34Save(){try{localStorage.setItem(V34_STORAGE,JSON.stringify(nevoV34))}catch{}}
function v34PadLabels(mode){if(mode==='beatjump')return ['-16','-8','-4','-1','+1','+4','+8','+16'];if(mode==='padfx')return ['LP','HP','CUT','PUNCH','BACK','FWD','HALF','DOUBLE'];if(mode==='sampler')return ['KICK','BASS','HAT','ACID','SYNTH','VOCAL','RISER','FX'];return ['HOT 1','HOT 2','HOT 3','HOT 4','HOT 5','HOT 6','HOT 7','HOT 8']}
function v34SetPadMode(letter,mode){nevoV34.padMode[letter]=mode;v34Save();const box=document.querySelector(`[data-padmode-deck="${letter}"]`);box?.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.flxAction===`${letter}.mode${mode==='hotcue'?'Hotcue':mode==='padfx'?'Padfx':mode==='beatjump'?'Beatjump':'Sampler'}`));const labels=v34PadLabels(mode);for(let i=1;i<=8;i++){const b=document.querySelector(`[data-pad="${letter}-${i}"]`);if(b)b.querySelector('span').textContent=labels[i-1]}}
function v34PadAction(letter,index){const d=djDecks[letter],mode=nevoV34.padMode[letter]||'hotcue';const b=document.querySelector(`[data-pad="${letter}-${index}"]`);b?.classList.add('pad-active');setTimeout(()=>b?.classList.remove('pad-active'),120);
  if(mode==='hotcue')return hotCueAction(letter,index-1);
  if(mode==='beatjump'){const jumps=[-16,-8,-4,-1,1,4,8,16];return v3BeatJump(letter,jumps[index-1])}
  if(mode==='sampler'){const keys=Object.keys(LOOP_LIBRARY||{});if(keys.length)return previewLibraryLoop(keys[(index-1)%keys.length])}
  if(mode==='padfx'){
    if(!d?.item)return;const oldFilter=d.filterValue||0,oldTrim=d.trimValue||0;
    const reset=()=>{d.filterValue=oldFilter;d.trimValue=oldTrim;const fi=document.querySelector(`[data-flx-action="${letter}.filter"]`),tr=document.querySelector(`[data-flx-action="${letter}.trim"]`);if(fi)fi.value=oldFilter;if(tr)tr.value=oldTrim;flxApplyEq(letter)};
    if(index===1)d.filterValue=-.68;else if(index===2)d.filterValue=.68;else if(index===3){const vol=$(`#deck${letter}Volume`);if(vol){const old=vol.value;vol.value=.12;updateCrossfaderGains();setTimeout(()=>{vol.value=old;updateCrossfaderGains()},160);return}}else if(index===4)d.trimValue=.35;else if(index===5){d.audio.currentTime=clamp((d.audio.currentTime||0)-4*djBeatPeriod(letter),0,d.audio.duration||0);return}else if(index===6){d.audio.currentTime=clamp((d.audio.currentTime||0)+4*djBeatPeriod(letter),0,d.audio.duration||0);return}else if(index===7){const bpm=djDeckBpm(letter);$(`#deck${letter}Bpm`).value=(bpm/2).toFixed(1);return refreshDeckUi(letter)}else if(index===8){const bpm=djDeckBpm(letter);$(`#deck${letter}Bpm`).value=(bpm*2).toFixed(1);return refreshDeckUi(letter)}
    flxApplyEq(letter);setTimeout(reset,220)
  }
}
function v34ToggleLoop4(letter){const d=djDecks[letter];if(!d?.item)return;if(d.loopBeats===4){d.loopBeats=0;if($(`#deck${letter}Loop`))$(`#deck${letter}Loop`).value='0';setStatus(true,'4 BEAT/EXIT',`DECK ${letter} · AUS`)}else{const sel=$(`#deck${letter}Loop`);if(sel)sel.value='4';setDeckLoop(letter);setStatus(true,'4 BEAT',`DECK ${letter} · 4 Beats`)}}
function v34CueCall(letter,dir){const d=djDecks[letter];if(!d?.item)return;const cues=(d.hotCues||[]).filter(Number.isFinite).sort((a,b)=>a-b);if(!cues.length)return;const cur=d.audio.currentTime||0;let t;if(dir<0){const p=cues.filter(x=>x<cur-.02);t=p.length?p.at(-1):cues.at(-1)}else{const n=cues.find(x=>x>cur+.02);t=Number.isFinite(n)?n:cues[0]}d.audio.currentTime=v3SnapTime(letter,t);drawDeckZoom(letter,true)}
function v34ToggleShift(letter){nevoV34.shift[letter]=!nevoV34.shift[letter];v34Save();document.querySelector(`[data-flx-action="${letter}.shift"]`)?.classList.toggle('active',nevoV34.shift[letter])}
function v34FxCycle(){const list=['ECHO','REVERB','FILTER','FLANGER','ROLL'];const i=list.indexOf(nevoV34.fx.name);nevoV34.fx.name=list[(i+1)%list.length];v34Save();v34RefreshFx()}
function v34FxChannel(){nevoV34.fx.channel=nevoV34.fx.channel==='A'?'B':nevoV34.fx.channel==='B'?'AB':'A';v34Save();v34RefreshFx()}
function v34FxBeat(dir){const list=[.25,.5,1,2,4,8,16];let i=list.findIndex(x=>x===nevoV34.fx.beat);if(i<0)i=2;i=clamp(i+dir,0,list.length-1);nevoV34.fx.beat=list[i];v34Save();v34RefreshFx()}
function v34FxOn(){nevoV34.fx.on=!nevoV34.fx.on;v34Save();v34RefreshFx();setStatus(true,'BEAT FX',`${nevoV34.fx.name} · ${nevoV34.fx.on?'AN':'AUS'} · ${nevoV34.fx.channel}`)}
function v34RefreshFx(){if($('#flxFxName'))$('#flxFxName').textContent=nevoV34.fx.name;if($('#flxFxChannel'))$('#flxFxChannel').textContent=nevoV34.fx.channel==='AB'?'1 & 2':`CH ${nevoV34.fx.channel==='A'?'1':'2'}`;if($('#flxFxBeat'))$('#flxFxBeat').textContent=String(nevoV34.fx.beat);$('#flxFxOn')?.classList.toggle('active',nevoV34.fx.on);const lev=document.querySelector('[data-flx-action="fx.level"]');if(lev&&document.activeElement!==lev)lev.value=nevoV34.fx.level}
function v34SmartCfx(){nevoV34.smartCfx=!nevoV34.smartCfx;v34Save();document.querySelector('[data-flx-action="smart.cfx"]')?.classList.toggle('active',nevoV34.smartCfx);setStatus(true,'SMART CFX',nevoV34.smartCfx?'AN':'AUS')}
function v34SmartFader(){nevoV34.smartFader=!nevoV34.smartFader;v34Save();document.querySelector('[data-flx-action="smart.fader"]')?.classList.toggle('active',nevoV34.smartFader);setStatus(true,'SMART FADER',nevoV34.smartFader?'AN':'AUS')}

const v34OldFlxSetContinuous=flxSetContinuous;
flxSetContinuous=function(action,norm,fromMidi=false){
  norm=clamp(Number(norm)||0,0,1);
  if(action==='master.level'){nevoV34.masterLevel=norm*1.25;const el=document.querySelector('[data-flx-action="master.level"]');if(el)el.value=nevoV34.masterLevel;if(master?.gain)master.gain.setTargetAtTime(nevoV34.masterLevel,ctx?.currentTime||0,.015);v34Save();return}
  if(action==='mic.level'){nevoV34.micLevel=norm;const el=document.querySelector('[data-flx-action="mic.level"]');if(el)el.value=norm;v34Save();return}
  if(action==='headphones.mix'){nevoV34.headphonesMix=norm;const el=document.querySelector('[data-flx-action="headphones.mix"]');if(el)el.value=norm;v34Save();return}
  if(action==='cue.level'){nevoV31.cueLevel=norm;const el=document.querySelector('[data-flx-action="cue.level"]');if(el)el.value=norm;if($('#cueLevel'))$('#cueLevel').value=norm;if($('#cueLevelValue'))$('#cueLevelValue').textContent=Math.round(norm*100)+'%';for(const L of ['A','B'])v31CueAudio(L).volume=norm;saveV31();return}
  if(action==='fx.level'){nevoV34.fx.level=norm;const el=document.querySelector('[data-flx-action="fx.level"]');if(el)el.value=norm;v34Save();return}
  return v34OldFlxSetContinuous(action,norm,fromMidi)
};
const v34OldFlxTrigger=flxTriggerAction;
flxTriggerAction=function(action){
  let m=action.match(/^([AB])\.(loopIn|loopOut|loop4exit|cuePrev|cueNext|shift)$/);if(m){const L=m[1],k=m[2];if(k==='loopIn')return v3LoopIn(L);if(k==='loopOut')return v3LoopOut(L);if(k==='loop4exit')return v34ToggleLoop4(L);if(k==='cuePrev')return v34CueCall(L,-1);if(k==='cueNext')return v34CueCall(L,1);if(k==='shift')return v34ToggleShift(L)}
  m=action.match(/^([AB])\.mode(Hotcue|Padfx|Beatjump|Sampler)$/);if(m)return v34SetPadMode(m[1],m[2].toLowerCase());
  m=action.match(/^([AB])\.pad([1-8])$/);if(m)return v34PadAction(m[1],Number(m[2]));
  if(action==='library.back'){document.querySelector('.dj-library')?.scrollIntoView({behavior:'smooth',block:'start'});return}if(action==='library.view'){setDjViewMode(flxState.mode==='flx4'?'pro':'flx4');return}
  if(action==='smart.cfx')return v34SmartCfx();if(action==='smart.fader')return v34SmartFader();if(action==='fx.channel')return v34FxChannel();if(action==='fx.select')return v34FxCycle();if(action==='fx.beatDown')return v34FxBeat(-1);if(action==='fx.beatUp')return v34FxBeat(1);if(action==='fx.on')return v34FxOn();
  return v34OldFlxTrigger(action)
};
const v34OldFlxLabel=flxActionLabel;
flxActionLabel=function(action){const map={'master.level':'Master Level','cue.level':'Kopfhörer Cue Level','mic.level':'Mic Level','headphones.mix':'Headphones Mix','library.back':'Browser Back','library.view':'Browser View','smart.cfx':'Smart CFX','smart.fader':'Smart Fader','fx.channel':'Beat FX Kanal','fx.select':'Beat FX Select','fx.beatDown':'Beat FX Beat -','fx.beatUp':'Beat FX Beat +','fx.level':'Beat FX Level/Depth','fx.on':'Beat FX On/Off'};if(map[action])return map[action];let m=action.match(/^([AB])\.(loopIn|loopOut|loop4exit|cuePrev|cueNext|shift)$/);if(m)return `Deck ${m[1]} ${m[2]}`;m=action.match(/^([AB])\.pad([1-8])$/);if(m)return `Deck ${m[1]} Pad ${m[2]}`;m=action.match(/^([AB])\.mode(.+)$/);if(m)return `Deck ${m[1]} Pad Mode ${m[2]}`;return v34OldFlxLabel(action)};

function v34StackRange(letter){const d=djDecks[letter],dur=d.audio?.duration||d.buffer?.duration||0,bpm=Math.max(1,djDeckBpm(letter)),period=60/bpm,beats=clamp(Number(nevoV34.waveBeats)||8,2,32),span=period*beats,cur=clamp(d.audio?.currentTime||0,0,dur);let start=cur-span/2,end=cur+span/2;if(start<0){end-=start;start=0}if(end>dur){start=Math.max(0,start-(end-dur));end=dur}return {start,end,cur,dur,period,beats,span:Math.max(.001,end-start)}}
function v34BeatOverlay(letter,r){const box=$(`#flx${letter}StackBeats`);if(!box)return;box.innerHTML='';if(!r.dur||!r.period)return;const d=djDecks[letter],off=djNormalizeOffset(d.beatOffset||0,r.period);let n=Math.ceil((r.start-off)/r.period),count=0;for(let tt=off+n*r.period;tt<=r.end+.0001;tt+=r.period,n++,count++){const x=(tt-r.start)/(r.end-r.start)*100,sp=document.createElement('span');sp.style.left=x+'%';const beat=((n%4)+4)%4+1;sp.textContent=String(beat);if(beat===1)sp.classList.add('major');if(Math.abs(tt-r.cur)<r.period*.35)sp.classList.add('center');box.appendChild(sp)}}
function v34DrawStack(letter,force=false){const d=djDecks[letter],cv=$(`#flx${letter}StackWave`);if(!d?.buffer||!cv)return;const r=v34StackRange(letter),key=`${r.start.toFixed(2)}:${r.end.toFixed(2)}:${nevoV34.waveBeats}`;if(!force&&d.v34StackKey===key)return;d.v34StackKey=key;drawDjWaveRange(d.buffer,cv,r.start,r.end,letter,true);v34BeatOverlay(letter,r);const title=$(`#flx${letter}StackTitle`),meta=$(`#flx${letter}StackMeta`);if(title)title.textContent=d.item?(d.item.title||cleanDjTitle(d.item.name)):(currentLang==='de'?'Kein Song':'No track');if(meta)meta.textContent=`${d.item?djDeckBpm(letter).toFixed(1):'—'} BPM · ${fmtDeckTime(r.cur)}`}
function v34SeekStack(letter,e){const d=djDecks[letter];if(!d?.item)return;const r=v34StackRange(letter),box=e.currentTarget.getBoundingClientRect(),ratio=clamp((e.clientX-box.left)/box.width,0,1);d.audio.currentTime=clamp(r.start+ratio*(r.end-r.start),0,r.dur);v34DrawStack(letter,true);drawDeckZoom(letter,true)}

const v34OldRefreshFlx=refreshFlx4Ui;
refreshFlx4Ui=function(){v34OldRefreshFlx();for(const L of ['A','B']){const d=djDecks[L];v34DrawStack(L,false);document.querySelector(`[data-flx-action="${L}.shift"]`)?.classList.toggle('active',!!nevoV34.shift[L]);const pfl=document.querySelector(`[data-flx-action="${L}.pfl"]`);pfl?.classList.toggle('active',!!nevoV31.pfl[L]);const mode=nevoV34.padMode[L]||'hotcue';const labels=v34PadLabels(mode);for(let i=1;i<=8;i++){const pad=document.querySelector(`[data-pad="${L}-${i}"]`);if(!pad)continue;pad.querySelector('span').textContent=labels[i-1];pad.classList.toggle('hot-set',mode==='hotcue'&&Number.isFinite(d.hotCues?.[i-1]))}}
  const ml=document.querySelector('[data-flx-action="master.level"]');if(ml&&document.activeElement!==ml)ml.value=nevoV34.masterLevel;const mic=document.querySelector('[data-flx-action="mic.level"]');if(mic&&document.activeElement!==mic)mic.value=nevoV34.micLevel;const hm=document.querySelector('[data-flx-action="headphones.mix"]');if(hm&&document.activeElement!==hm)hm.value=nevoV34.headphonesMix;const cl=document.querySelector('[data-flx-action="cue.level"]');if(cl&&document.activeElement!==cl)cl.value=nevoV31.cueLevel;document.querySelector('[data-flx-action="smart.cfx"]')?.classList.toggle('active',nevoV34.smartCfx);document.querySelector('[data-flx-action="smart.fader"]')?.classList.toggle('active',nevoV34.smartFader);v34RefreshFx()
};

function v34Bind(){
  const z=$('#flxWaveBeats');if(z){z.value=String(nevoV34.waveBeats||8);z.addEventListener('change',e=>{nevoV34.waveBeats=Number(e.target.value)||8;v34Save();v34DrawStack('A',true);v34DrawStack('B',true)})}
  document.querySelectorAll('[data-flx-stack-seek]').forEach(el=>el.addEventListener('click',e=>v34SeekStack(el.dataset.flxStackSeek,e)));
  for(const L of ['A','B'])v34SetPadMode(L,nevoV34.padMode[L]||'hotcue');
  document.querySelector(`[data-flx-action="A.shift"]`)?.classList.toggle('active',nevoV34.shift.A);document.querySelector(`[data-flx-action="B.shift"]`)?.classList.toggle('active',nevoV34.shift.B);
  v34RefreshFx();refreshFlx4Ui();
  setTimeout(()=>{v34DrawStack('A',true);v34DrawStack('B',true)},300)
}
v34Bind();


// ===== v3.5: FLX4 LOOP WORKFLOW + MASTER CUE + REAL-TIME BEAT FX =====
const V35_FX_NAMES=['ECHO','REVERB','DELAY','FLANGER','PHASER','FILTER','ROLL'];
nevoV34.masterCue=!!nevoV34.masterCue;
let v35MasterCueAudio=null;
const v35Fx={ready:false,input:null,wetBus:null,outputs:{},echoDelay:null,echoFeedback:null,delayNode:null,delayFeedback:null,flangerDelay:null,flangerLfo:null,flangerDepth:null,phaser1:null,phaser2:null,phaserLfo:null,phaserDepth:null,filterNode:null,rollGain:null,rollLfo:null,rollDepth:null};

function v35CueDeckVolume(letter){
  const level=clamp(Number(nevoV31?.cueLevel)||0,0,1),mix=clamp(Number(nevoV34?.headphonesMix)||0,0,1);
  return level*(nevoV34?.masterCue?(1-mix):1);
}
function v35MasterCueVolume(){const level=clamp(Number(nevoV31?.cueLevel)||0,0,1),mix=clamp(Number(nevoV34?.headphonesMix)||0,0,1);return nevoV34?.masterCue?level*mix:0}
async function v35MasterCueAudioNode(){
  await initAudio();
  if(!v35MasterCueAudio){v35MasterCueAudio=new Audio();v35MasterCueAudio.autoplay=false;v35MasterCueAudio.playsInline=true}
  if(mediaDest?.stream&&v35MasterCueAudio.srcObject!==mediaDest.stream)v35MasterCueAudio.srcObject=mediaDest.stream;
  if(nevoV31?.cueOutputId&&typeof v35MasterCueAudio.setSinkId==='function')try{await v35MasterCueAudio.setSinkId(nevoV31.cueOutputId)}catch(e){console.warn(e)}
  return v35MasterCueAudio
}
function v35UpdateHeadphoneVolumes(){
  for(const L of ['A','B']){const a=v31CueAudio(L);a.volume=v35CueDeckVolume(L)}
  if(v35MasterCueAudio)v35MasterCueAudio.volume=v35MasterCueVolume();
  $('#flxMasterCue')?.classList.toggle('active',!!nevoV34.masterCue);
}
async function v35ToggleMasterCue(){
  nevoV34.masterCue=!nevoV34.masterCue;v34Save();const a=await v35MasterCueAudioNode();v35UpdateHeadphoneVolumes();
  if(nevoV34.masterCue){try{await a.play()}catch(e){console.warn(e)}}else a.pause();
  setStatus(true,'MASTER CUE',nevoV34.masterCue?(currentLang==='de'?'Master-Mix im Kopfhörer AN':'Master mix in headphones ON'):(currentLang==='de'?'AUS':'OFF'));
}
const v35OldSetCueOutput=v31SetCueOutput;
v31SetCueOutput=async function(id){await v35OldSetCueOutput(id);if(v35MasterCueAudio&&typeof v35MasterCueAudio.setSinkId==='function')try{await v35MasterCueAudio.setSinkId(id||'default')}catch(e){console.warn(e)};v35UpdateHeadphoneVolumes()};

function v35LoopBeats(letter){const d=djDecks[letter];if(!d?.item)return 0;const p=djBeatPeriod(letter);if(d.manualLoopActive&&Number.isFinite(d.manualLoopIn)&&Number.isFinite(d.manualLoopOut)&&p)return Math.max(.25,(d.manualLoopOut-d.manualLoopIn)/p);return Number(d.loopBeats)||0}
function v35SetLoopSize(letter,beats,activate=true){
  const d=djDecks[letter];if(!d?.item)return;beats=clamp(Number(beats)||4,.25,64);const p=djBeatPeriod(letter),wasActive=!!v35LoopBeats(letter);
  if(d.manualLoopActive&&Number.isFinite(d.manualLoopIn)){d.manualLoopOut=clamp(d.manualLoopIn+beats*p,d.manualLoopIn+.02,d.audio.duration||Infinity);d.manualLoopActive=activate;d.loopBeats=0}
  else{d.manualLoopActive=false;if(activate&&!wasActive)d.loopStart=v3SnapTime(letter,d.audio.currentTime||0);d.loopBeats=activate?beats:0;if(activate&&!Number.isFinite(d.loopStart))d.loopStart=v3SnapTime(letter,d.audio.currentTime||0)}
  const sel=$(`#flx${letter}LoopSize`);if(sel)sel.value=String(beats);const std=$(`#deck${letter}Loop`);if(std&&[...std.options].some(o=>Number(o.value)===beats))std.value=String(beats);
  setStatus(true,'LOOP',`DECK ${letter} · ${beats} Beat${beats===1?'':'s'}`);v35RefreshLoopUi(letter)
}
function v35ResizeLoop(letter,factor){const d=djDecks[letter];if(!d?.item)return;let b=v35LoopBeats(letter)||Number($(`#flx${letter}LoopSize`)?.value)||4;b=clamp(b*factor,.25,64);const friendly=[.25,.5,1,2,3,4,6,8,12,16,24,32,64];b=friendly.reduce((a,x)=>Math.abs(x-b)<Math.abs(a-b)?x:a,friendly[0]);v35SetLoopSize(letter,b,true)}
function v35ExitLoop(letter){const d=djDecks[letter];if(!d)return;d.manualLoopActive=false;d.loopBeats=0;const std=$(`#deck${letter}Loop`);if(std)std.value='0';v35RefreshLoopUi(letter);setStatus(true,'LOOP EXIT',`DECK ${letter}`)}
function v35RefreshLoopUi(letter){const d=djDecks[letter],b=v35LoopBeats(letter),strip=document.querySelector(`[data-loop-strip="${letter}"]`),state=$(`#flx${letter}LoopState`),sel=$(`#flx${letter}LoopSize`);strip?.classList.toggle('active',!!b);if(state)state.textContent=b?`${Number.isInteger(b)?b:b.toFixed(2)} BEAT${b===1?'':'S'} · AN`:'LOOP AUS';if(sel&&b&&document.activeElement!==sel){const opts=[...sel.options].map(o=>Number(o.value));const near=opts.reduce((a,x)=>Math.abs(x-b)<Math.abs(a-b)?x:a,opts[0]);sel.value=String(near)}}
// Hardware behavior: 4 BEAT creates a 4-beat loop, while pressing it during a loop exits it.
v34ToggleLoop4=function(letter){const d=djDecks[letter];if(!d?.item)return;if(v35LoopBeats(letter))return v35ExitLoop(letter);d.manualLoopActive=false;d.loopStart=v3SnapTime(letter,d.audio.currentTime||0);d.loopBeats=4;const sel=$(`#flx${letter}LoopSize`);if(sel)sel.value='4';v35RefreshLoopUi(letter);setStatus(true,'4 BEAT',`DECK ${letter} · 4 Beats`)};
// CUE/LOOP CALL acts as 1/2X and 2X while a loop is active; otherwise it still calls saved cues.
const v35OldCueCall=v34CueCall;
v34CueCall=function(letter,dir){if(v35LoopBeats(letter))return v35ResizeLoop(letter,dir<0?.5:2);return v35OldCueCall(letter,dir)};

async function v35EnsureFxEngine(){
  await initAudio();if(v35Fx.ready)return;
  v35Fx.input=ctx.createGain();v35Fx.input.gain.value=1;v35Fx.wetBus=ctx.createGain();v35Fx.wetBus.gain.value=1;v35Fx.wetBus.connect(master);
  const mkOut=name=>{const g=ctx.createGain();g.gain.value=0;g.connect(v35Fx.wetBus);v35Fx.outputs[name]=g;return g};
  // Echo
  v35Fx.echoDelay=ctx.createDelay(4);v35Fx.echoFeedback=ctx.createGain();v35Fx.echoFeedback.gain.value=.35;v35Fx.input.connect(v35Fx.echoDelay);v35Fx.echoDelay.connect(v35Fx.echoFeedback);v35Fx.echoFeedback.connect(v35Fx.echoDelay);v35Fx.echoDelay.connect(mkOut('ECHO'));
  // Hall / reverb
  const conv=ctx.createConvolver();conv.buffer=makeImpulse(2.6,2.2);v35Fx.input.connect(conv);conv.connect(mkOut('REVERB'));
  // Delay
  v35Fx.delayNode=ctx.createDelay(4);v35Fx.delayFeedback=ctx.createGain();v35Fx.delayFeedback.gain.value=.18;v35Fx.input.connect(v35Fx.delayNode);v35Fx.delayNode.connect(v35Fx.delayFeedback);v35Fx.delayFeedback.connect(v35Fx.delayNode);v35Fx.delayNode.connect(mkOut('DELAY'));
  // Flanger
  v35Fx.flangerDelay=ctx.createDelay(.05);v35Fx.flangerDelay.delayTime.value=.006;v35Fx.flangerLfo=ctx.createOscillator();v35Fx.flangerDepth=ctx.createGain();v35Fx.flangerDepth.gain.value=.0035;v35Fx.flangerLfo.connect(v35Fx.flangerDepth);v35Fx.flangerDepth.connect(v35Fx.flangerDelay.delayTime);v35Fx.flangerLfo.start();v35Fx.input.connect(v35Fx.flangerDelay);v35Fx.flangerDelay.connect(mkOut('FLANGER'));
  // Phaser
  v35Fx.phaser1=ctx.createBiquadFilter();v35Fx.phaser1.type='allpass';v35Fx.phaser1.frequency.value=500;v35Fx.phaser1.Q.value=1.5;v35Fx.phaser2=ctx.createBiquadFilter();v35Fx.phaser2.type='allpass';v35Fx.phaser2.frequency.value=1300;v35Fx.phaser2.Q.value=1.2;v35Fx.phaserLfo=ctx.createOscillator();v35Fx.phaserDepth=ctx.createGain();v35Fx.phaserDepth.gain.value=380;v35Fx.phaserLfo.connect(v35Fx.phaserDepth);v35Fx.phaserDepth.connect(v35Fx.phaser1.frequency);v35Fx.phaserLfo.start();v35Fx.input.connect(v35Fx.phaser1);v35Fx.phaser1.connect(v35Fx.phaser2);v35Fx.phaser2.connect(mkOut('PHASER'));
  // Beat filter
  v35Fx.filterNode=ctx.createBiquadFilter();v35Fx.filterNode.type='bandpass';v35Fx.filterNode.frequency.value=1000;v35Fx.filterNode.Q.value=3;v35Fx.input.connect(v35Fx.filterNode);v35Fx.filterNode.connect(mkOut('FILTER'));
  // Roll approximation: beat-synced gate on a wet duplicate.
  v35Fx.rollGain=ctx.createGain();v35Fx.rollGain.gain.value=.5;v35Fx.rollLfo=ctx.createOscillator();v35Fx.rollLfo.type='square';v35Fx.rollDepth=ctx.createGain();v35Fx.rollDepth.gain.value=.5;v35Fx.rollLfo.connect(v35Fx.rollDepth);v35Fx.rollDepth.connect(v35Fx.rollGain.gain);v35Fx.rollLfo.start();v35Fx.input.connect(v35Fx.rollGain);v35Fx.rollGain.connect(mkOut('ROLL'));
  v35Fx.ready=true;
}
async function v35AttachDeckFx(deck){await v35EnsureFxEngine();if(!deck?.gainNode||deck.v35FxSend)return;deck.v35FxSend=ctx.createGain();deck.v35FxSend.gain.value=0;deck.gainNode.connect(deck.v35FxSend);deck.v35FxSend.connect(v35Fx.input)}
const v35OldEnsureDeckConnected=ensureDeckConnected;
ensureDeckConnected=async function(deck){await v35OldEnsureDeckConnected(deck);await v35AttachDeckFx(deck);v35ApplyFx()};
function v35FxReferenceDeck(){if(nevoV34.fx.channel==='B')return 'B';if(nevoV34.fx.channel==='A')return 'A';return nevoV3?.masterDeck||'A'}
function v35ApplyFx(){
  if(!ctx||!v35Fx.ready)return;const t=ctx.currentTime,name=V35_FX_NAMES.includes(nevoV34.fx.name)?nevoV34.fx.name:'ECHO',on=!!nevoV34.fx.on,level=clamp(Number(nevoV34.fx.level)||0,0,1);
  for(const L of ['A','B']){const d=djDecks[L];if(d?.v35FxSend){const selected=nevoV34.fx.channel==='AB'||nevoV34.fx.channel===L;d.v35FxSend.gain.setTargetAtTime(on&&selected?1:0,t,.015)}}
  for(const [n,g] of Object.entries(v35Fx.outputs))g.gain.setTargetAtTime(on&&n===name?level*1.15:0,t,.02);
  const ref=v35FxReferenceDeck(),bpm=Math.max(60,v3EffectiveBpm(ref)||Number($('#bpm')?.value)||150),period=60/bpm,beats=Math.max(.0625,Number(nevoV34.fx.beat)||1),time=clamp(period*beats,.02,3.8);
  if(v35Fx.echoDelay)v35Fx.echoDelay.delayTime.setTargetAtTime(time,t,.02);if(v35Fx.delayNode)v35Fx.delayNode.delayTime.setTargetAtTime(clamp(time*.5,.02,2.5),t,.02);
  if(v35Fx.echoFeedback)v35Fx.echoFeedback.gain.setTargetAtTime(.20+level*.48,t,.02);if(v35Fx.delayFeedback)v35Fx.delayFeedback.gain.setTargetAtTime(.08+level*.28,t,.02);
  const hz=clamp(1/Math.max(.08,time),.08,12);if(v35Fx.flangerLfo)v35Fx.flangerLfo.frequency.setTargetAtTime(hz,t,.02);if(v35Fx.phaserLfo)v35Fx.phaserLfo.frequency.setTargetAtTime(clamp(hz*.5,.05,6),t,.02);if(v35Fx.rollLfo)v35Fx.rollLfo.frequency.setTargetAtTime(clamp(hz,1,24),t,.02);
  if(v35Fx.filterNode){const sweep=600+level*5200;v35Fx.filterNode.frequency.setTargetAtTime(sweep,t,.03);v35Fx.filterNode.Q.setTargetAtTime(1.2+level*7,t,.03)}
}
function v35OpenFxMenu(){const m=$('#flxFxMenu');if(!m)return;m.hidden=!m.hidden;v35RefreshFxMenu()}
function v35RefreshFxMenu(){document.querySelectorAll('#flxFxMenu [data-fx-name]').forEach(b=>b.classList.toggle('active',b.dataset.fxName===nevoV34.fx.name))}
function v35SelectFx(name){if(!V35_FX_NAMES.includes(name))return;nevoV34.fx.name=name;v34Save();$('#flxFxMenu').hidden=true;v34RefreshFx();v35RefreshFxMenu();v35ApplyFx();setStatus(true,'FX SELECT',name==='REVERB'?'REVERB / HALL':name)}
// Screen FX SELECT opens the menu; MIDI can still choose from the menu afterwards.
v34FxCycle=function(){v35OpenFxMenu()};
const v35OldFxChannel=v34FxChannel;v34FxChannel=function(){v35OldFxChannel();v35ApplyFx()};
const v35OldFxBeat=v34FxBeat;v34FxBeat=function(dir){v35OldFxBeat(dir);v35ApplyFx()};
const v35OldFxOn=v34FxOn;v34FxOn=function(){v35OldFxOn();v35ApplyFx()};

const v35OldFlxSetContinuous=flxSetContinuous;
flxSetContinuous=function(action,norm,fromMidi=false){const r=v35OldFlxSetContinuous(action,norm,fromMidi);if(action==='fx.level')v35ApplyFx();if(action==='cue.level'||action==='headphones.mix')v35UpdateHeadphoneVolumes();return r};
const v35OldFlxTrigger=flxTriggerAction;
flxTriggerAction=function(action){
  let m=action.match(/^([AB])\.(loopHalf|loopDouble)$/);if(m)return v35ResizeLoop(m[1],m[2]==='loopHalf'?.5:2);
  if(action==='master.cue')return v35ToggleMasterCue();
  return v35OldFlxTrigger(action)
};
const v35OldFlxLabel=flxActionLabel;
flxActionLabel=function(action){const map={'master.cue':'Master Cue / Kopfhörer','A.loopHalf':'Deck A Loop halbieren','A.loopDouble':'Deck A Loop verdoppeln','B.loopHalf':'Deck B Loop halbieren','B.loopDouble':'Deck B Loop verdoppeln'};return map[action]||v35OldFlxLabel(action)};

const v35OldRefreshFlx=refreshFlx4Ui;
refreshFlx4Ui=function(){v35OldRefreshFlx();for(const L of ['A','B'])v35RefreshLoopUi(L);$('#flxMasterCue')?.classList.toggle('active',!!nevoV34.masterCue);v35RefreshFxMenu()};

function v35Bind(){
  document.querySelectorAll('[data-loop-size]').forEach(sel=>{sel.addEventListener('change',e=>{const L=e.currentTarget.dataset.loopSize;v35SetLoopSize(L,Number(e.currentTarget.value)||4,true)})});
  document.querySelectorAll('#flxFxMenu [data-fx-name]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();v35SelectFx(b.dataset.fxName)}));
  document.addEventListener('click',e=>{const m=$('#flxFxMenu');if(m&&!m.hidden&&!e.target.closest('.flx4-beatfx'))m.hidden=true});
  v35UpdateHeadphoneVolumes();for(const L of ['A','B'])v35RefreshLoopUi(L);v35RefreshFxMenu();
  setTimeout(async()=>{try{await v35EnsureFxEngine();for(const L of ['A','B'])if(djDecks[L]?.source)await v35AttachDeckFx(djDecks[L]);v35ApplyFx()}catch(e){console.warn('v3.6 FX init',e)}},600);
}
let v35Last=0;function v35Ticker(ts){if(ts-v35Last>70){v35Last=ts;v35UpdateHeadphoneVolumes();if(v35Fx.ready&&nevoV34.fx.on)v35ApplyFx()}requestAnimationFrame(v35Ticker)}
v35Bind();requestAnimationFrame(v35Ticker);

// ===== v3.6: FLX4 MEMORY CUES/LOOPS + CHANNEL/MASTER VU METERS =====
nevoV34.memory = nevoV34.memory && typeof nevoV34.memory==='object' ? nevoV34.memory : {};
function v36TrackKey(letter){const d=djDecks[letter];return d?.item?.id||null}
function v36MemList(letter){const key=v36TrackKey(letter);if(!key)return [];if(!Array.isArray(nevoV34.memory[key]))nevoV34.memory[key]=[];return nevoV34.memory[key]}
function v36SortMem(list){list.sort((a,b)=>(a.time||0)-(b.time||0));return list}
function v36SaveMemory(letter){const d=djDecks[letter];if(!d?.item)return;const list=v36MemList(letter),cur=clamp(d.audio.currentTime||0,0,d.audio.duration||d.buffer?.duration||0),beats=v35LoopBeats(letter);let mem;
  if(beats){const start=Number.isFinite(d.manualLoopIn)&&Number.isFinite(d.manualLoopOut)?d.manualLoopIn:(Number.isFinite(d.loopStart)?d.loopStart:cur);const end=Number.isFinite(d.manualLoopOut)&&d.manualLoopOut>start?d.manualLoopOut:start+beats*djBeatPeriod(letter);mem={id:uid(),type:'loop',time:start,start,end,beats,label:`${Number.isInteger(beats)?beats:beats.toFixed(2)} BEAT LOOP`}}
  else mem={id:uid(),type:'cue',time:v3SnapTime(letter,cur),label:'MEMORY CUE'};
  const near=list.findIndex(x=>Math.abs((x.time||0)-mem.time)<.08);if(near>=0)list[near]=mem;else list.push(mem);v36SortMem(list);v34Save();v36RefreshMemoryUi(letter);setStatus(true,'MEMORY',`DECK ${letter} · ${mem.label} · ${fmtDeckTime(mem.time)}`)
}
function v36DeleteMemory(letter){const d=djDecks[letter],list=v36MemList(letter);if(!d?.item||!list.length)return;const cur=d.audio.currentTime||0;let idx=0,best=Infinity;list.forEach((m,i)=>{const dist=Math.abs((m.time||0)-cur);if(dist<best){best=dist;idx=i}});const gone=list.splice(idx,1)[0];v34Save();v36RefreshMemoryUi(letter);setStatus(true,'MEMORY DEL',`DECK ${letter} · ${gone?.label||'PUNKT'}`)
}
function v36RecallMemory(letter,dir){const d=djDecks[letter],list=v36SortMem(v36MemList(letter));if(!d?.item||!list.length)return false;const cur=d.audio.currentTime||0;let mem;if(dir<0){const prev=list.filter(x=>(x.time||0)<cur-.03);mem=prev.length?prev.at(-1):list.at(-1)}else{mem=list.find(x=>(x.time||0)>cur+.03)||list[0]};if(!mem)return false;d.audio.currentTime=clamp(mem.time||0,0,d.audio.duration||d.buffer?.duration||0);
  if(mem.type==='loop'){d.manualLoopIn=mem.start;d.manualLoopOut=mem.end;d.manualLoopActive=true;d.loopStart=mem.start;d.loopBeats=mem.beats||Math.max(.25,(mem.end-mem.start)/djBeatPeriod(letter))}else{d.manualLoopActive=false;d.loopBeats=0}
  v35RefreshLoopUi(letter);drawDeckZoom(letter,true);v34DrawStack(letter,true);setStatus(true,'MEMORY CALL',`DECK ${letter} · ${mem.label||mem.type} · ${fmtDeckTime(mem.time)}`);return true
}
function v36RefreshMemoryUi(letter){const list=v36MemList(letter),el=$(`#flx${letter}MemoryState`);if(el){el.textContent=`MEM ${list.length}`;el.classList.toggle('has-memory',list.length>0)}}
const v36OldCueCall=v34CueCall;
v34CueCall=function(letter,dir){if(nevoV34.shift?.[letter])return dir>0?v36SaveMemory(letter):v36DeleteMemory(letter);if(v35LoopBeats(letter))return v35ResizeLoop(letter,dir<0?.5:2);if(v36RecallMemory(letter,dir))return;return v36OldCueCall(letter,dir)};
const v36OldShift=v34ToggleShift;
v34ToggleShift=function(letter){v36OldShift(letter);const on=!!nevoV34.shift[letter];setStatus(true,'SHIFT',`DECK ${letter} · ${on?'AN · CUE/LOOP: DEL / MEMORY':'AUS'}`)};

function v36AttachAnalyser(deck){if(!ctx||!deck?.gainNode||deck.v36Analyser)return;deck.v36Analyser=ctx.createAnalyser();deck.v36Analyser.fftSize=256;deck.v36Analyser.smoothingTimeConstant=.72;deck.gainNode.connect(deck.v36Analyser);deck.v36VuData=new Uint8Array(deck.v36Analyser.fftSize)}
const v36OldEnsureDeckConnected=ensureDeckConnected;
ensureDeckConnected=async function(deck){await v36OldEnsureDeckConnected(deck);v36AttachAnalyser(deck)};
function v36MeterLevel(an,data){if(!an)return 0;if(!data||data.length!==an.fftSize)data=new Uint8Array(an.fftSize);an.getByteTimeDomainData(data);let sum=0;for(let i=0;i<data.length;i++){const v=(data[i]-128)/128;sum+=v*v}const rms=Math.sqrt(sum/data.length);if(rms<=.0001)return 0;const db=20*Math.log10(rms);return clamp((db+48)/48,0,1)}
let v36MasterData=null;
function v36UpdateMeters(){for(const L of ['A','B']){const d=djDecks[L];if(d?.source)v36AttachAnalyser(d);const level=d?.v36Analyser?v36MeterLevel(d.v36Analyser,d.v36VuData):0;const el=$(`#flxVu${L}`);if(el)el.style.height=(level*100).toFixed(1)+'%'}if(analyser){if(!v36MasterData||v36MasterData.length!==analyser.fftSize)v36MasterData=new Uint8Array(analyser.fftSize);const m=v36MeterLevel(analyser,v36MasterData),el=$('#flxVuM');if(el)el.style.height=(m*100).toFixed(1)+'%'}}
const v36OldRefreshFlx=refreshFlx4Ui;
refreshFlx4Ui=function(){v36OldRefreshFlx();for(const L of ['A','B'])v36RefreshMemoryUi(L)};
for(const L of ['A','B'])v36RefreshMemoryUi(L);
let v36Last=0;function v36Ticker(ts){if(!window.__nevoScrolling&&ts-v36Last>55){v36Last=ts;v36UpdateMeters()}requestAnimationFrame(v36Ticker)}requestAnimationFrame(v36Ticker);

// ===== v3.7: COMPLETE FLX4 PERFORMANCE PADS + SHIFT SECOND LAYER =====
const V37_SECONDARY={hotcue:'keyboard',padfx:'padfx2',beatjump:'beatloop',sampler:'keyshift'};
const V37_PRIMARY={keyboard:'hotcue',padfx2:'padfx',beatloop:'beatjump',keyshift:'sampler'};
const V37_MODE_NAMES={hotcue:'HOT CUE',keyboard:'KEYBOARD',padfx:'PAD FX1',padfx2:'PAD FX2',beatjump:'BEAT JUMP',beatloop:'BEAT LOOP',sampler:'SAMPLER',keyshift:'KEY SHIFT'};
const V37_PAD_LABELS={
  hotcue:['HOT 1','HOT 2','HOT 3','HOT 4','HOT 5','HOT 6','HOT 7','HOT 8'],
  keyboard:['1','2','♭3','4','5','♭6','♭7','8'],
  padfx:['ECHO ½','ECHO 1','HALL','FILTER','FLANGER','PHASER','ROLL ½','ROLL ¼'],
  padfx2:['DELAY ¼','DELAY ½','HALL BIG','FILTER +','FLANGE +','PHASE +','ROLL ⅛','ROLL 1/16'],
  beatjump:['-16','-8','-4','-1','+1','+4','+8','+16'],
  beatloop:['⅛','¼','½','1','2','4','8','16'],
  sampler:['KICK','BASS','HAT','ACID','SYNTH','VOCAL','RISER','DOWN FX'],
  keyshift:['-3','-2','-1','0','+1','+2','+3','+4']
};
const V37_SAMPLER_KEYS=['kick-driving','bass-coronita','drums-minimal','acid-303','synth-darkstab','vocals-chop','fx-riser','fx-down'];
const V37_BEAT_LOOPS=[.125,.25,.5,1,2,4,8,16];
const V37_KEY_SHIFTS=[-3,-2,-1,0,1,2,3,4];
const v37HeldPads=new Map();
const v37PadFxSnapshots=new Map();
const v37SuppressClick=new Map();

function v37BaseMode(mode){return V37_PRIMARY[mode]||mode}
function v37SecondaryMode(mode){return V37_SECONDARY[mode]||mode}
function v37IsSecondary(mode){return Object.hasOwn(V37_PRIMARY,mode)}
function v37DeckRoot(letter){
  const d=djDecks[letter],raw=(d?.key&&d.key!=='—'?d.key:'D').replace(/m$/i,'');
  const m=raw.match(/^([A-G](?:#|b)?)/i),root=(m?.[1]||'D').replace('b','#');
  return root.toUpperCase()+'3'
}
function v37ScaleOffsets(letter){const key=djDecks[letter]?.key||'';return /m$/i.test(key)?[0,2,3,5,7,8,10,12]:[0,2,4,5,7,9,11,12]}
function v37PadNote(letter,index){return transpose(v37DeckRoot(letter),v37ScaleOffsets(letter)[index-1]||0)}
function v37RefreshPadMode(letter){
  const mode=nevoV34.padMode?.[letter]||'hotcue',base=v37BaseMode(mode),secondary=v37IsSecondary(mode),state=$(`#flx${letter}PadModeState`),hint=$(`#flx${letter}PadModeHint`),box=document.querySelector(`[data-padmode-deck="${letter}"]`),pads=document.querySelector(`[data-performance-pads="${letter}"]`);
  if(state)state.textContent=V37_MODE_NAMES[mode]||mode.toUpperCase();
  if(hint){if(mode==='keyshift')hint.textContent=`SHIFT ${djDecks[letter]?.v37KeyShift||0} HT`;else if(mode==='keyboard')hint.textContent=`${v37DeckRoot(letter)} · passende Tonleiter`;else hint.textContent=secondary?'SHIFT-Ebene aktiv':'SHIFT + Modus = zweite Ebene'}
  state?.parentElement?.classList.toggle('secondary',secondary);
  box?.querySelectorAll('button').forEach(b=>{const a=b.dataset.flxAction||'',is=(base==='hotcue'&&a.endsWith('.modeHotcue'))||(base==='padfx'&&a.endsWith('.modePadfx'))||(base==='beatjump'&&a.endsWith('.modeBeatjump'))||(base==='sampler'&&a.endsWith('.modeSampler'));b.classList.toggle('active',is);b.classList.toggle('secondary-active',is&&secondary)});
  if(pads){pads.className='flx4-pads v34-pads mode-'+mode;const labels=V37_PAD_LABELS[mode]||V37_PAD_LABELS.hotcue;for(let i=1;i<=8;i++){const p=document.querySelector(`[data-pad="${letter}-${i}"]`);if(!p)continue;p.querySelector('span').textContent=labels[i-1];p.classList.toggle('hot-set',mode==='hotcue'&&Number.isFinite(djDecks[letter]?.hotCues?.[i-1]));p.classList.toggle('selected-shift',mode==='keyshift'&&V37_KEY_SHIFTS[i-1]===(djDecks[letter]?.v37KeyShift||0))}}
}
function v37SelectMode(letter,base){const mode=nevoV34.shift?.[letter]?v37SecondaryMode(base):base;nevoV34.padMode[letter]=mode;v34Save();v37RefreshPadMode(letter);setStatus(true,'PAD MODE',`DECK ${letter} · ${V37_MODE_NAMES[mode]}`)}

async function v37SamplerHit(index){const key=V37_SAMPLER_KEYS[index-1],item=LOOP_LIBRARY[key];if(!item)return;await initAudio();const sd=60/Math.max(60,item.bpm||150)/4,rel=Array.isArray(item.steps)&&item.steps.length?item.steps[0]:0;scheduleLibraryItem(item,rel,ctx.currentTime+.012,sd)}
function v37KeyShift(letter,semis){const d=djDecks[letter];if(!d?.item)return;d.v37KeyShift=clamp(Number(semis)||0,-12,12);updateDeckRate(letter);v37RefreshPadMode(letter);setStatus(true,'KEY SHIFT',`DECK ${letter} · ${d.v37KeyShift>0?'+':''}${d.v37KeyShift} HT`)}
function v37ApplyBeatLoop(letter,index){const beats=V37_BEAT_LOOPS[index-1],active=v35LoopBeats(letter);if(active&&Math.abs(active-beats)<.0001)return v35ExitLoop(letter);v35SetLoopSize(letter,beats,true)}
function v37FxPreset(mode,index){
  const a=mode==='padfx2';
  const p=a?[
    ['DELAY',.25,.72],['DELAY',.5,.62],['REVERB',2,.9],['FILTER',.5,.88],['FLANGER',.25,.82],['PHASER',.25,.82],['ROLL',.125,.72],['ROLL',.0625,.78]
  ]:[
    ['ECHO',.5,.58],['ECHO',1,.52],['REVERB',1,.58],['FILTER',1,.62],['FLANGER',.5,.58],['PHASER',.5,.58],['ROLL',.5,.58],['ROLL',.25,.62]
  ];return p[index-1]
}
function v37PadFxDown(letter,index,mode){const k=`${letter}-${index}`;if(v37PadFxSnapshots.has(k))return;v37PadFxSnapshots.set(k,{name:nevoV34.fx.name,channel:nevoV34.fx.channel,beat:nevoV34.fx.beat,level:nevoV34.fx.level,on:nevoV34.fx.on});const [name,beat,level]=v37FxPreset(mode,index);nevoV34.fx.name=name;nevoV34.fx.channel=letter;nevoV34.fx.beat=beat;nevoV34.fx.level=level;nevoV34.fx.on=true;v34RefreshFx();v35ApplyFx()}
function v37PadFxUp(letter,index){const k=`${letter}-${index}`,old=v37PadFxSnapshots.get(k);if(!old)return;v37PadFxSnapshots.delete(k);Object.assign(nevoV34.fx,old);v34RefreshFx();v35ApplyFx()}
function v37SetPadVisual(letter,index,on){document.querySelector(`[data-pad="${letter}-${index}"]`)?.classList.toggle('pad-active',!!on)}

async function v37PadDown(letter,index,source='screen'){
  const mode=nevoV34.padMode?.[letter]||'hotcue',key=`${letter}-${index}`;if(v37HeldPads.has(key))return;v37HeldPads.set(key,{mode,source});v37SetPadVisual(letter,index,true);
  if(mode==='hotcue')return hotCueAction(letter,index-1);
  if(mode==='beatjump')return v3BeatJump(letter,[-16,-8,-4,-1,1,4,8,16][index-1]);
  if(mode==='sampler')return v37SamplerHit(index);
  if(mode==='beatloop')return v37ApplyBeatLoop(letter,index);
  if(mode==='keyshift')return v37KeyShift(letter,V37_KEY_SHIFTS[index-1]);
  if(mode==='keyboard'){await initAudio();const note=v37PadNote(letter,index);const held=v37HeldPads.get(key);if(!held)return;held.note=note;if(voices.has(note))stopVoice(note,true);startVoice(note);return}
  if(mode==='padfx'||mode==='padfx2'){await initAudio();await v35EnsureFxEngine();v37PadFxDown(letter,index,mode)}
}
function v37PadUp(letter,index){const key=`${letter}-${index}`,held=v37HeldPads.get(key);if(!held){v37SetPadVisual(letter,index,false);return}v37HeldPads.delete(key);v37SetPadVisual(letter,index,false);if(held.mode==='keyboard'&&held.note)stopVoice(held.note,false);if(held.mode==='padfx'||held.mode==='padfx2')v37PadFxUp(letter,index)}

// Extend deck rate with browser key-shift. At non-zero shift this intentionally changes pitch + tempo.
const v37OldUpdateDeckRate=updateDeckRate;
updateDeckRate=function(letter){
  const d=djDecks[letter],semis=Number(d?.v37KeyShift)||0,pct=Number($(`#deck${letter}Pitch`)?.value)||0,base=clamp(1+pct/100,.5,2),rate=clamp(base*Math.pow(2,semis/12),.5,2);
  if(!d?.audio)return v37OldUpdateDeckRate(letter);d.audio.preservesPitch=semis===0?!!d.keyLock:false;d.audio.mozPreservesPitch=d.audio.preservesPitch;d.audio.webkitPreservesPitch=d.audio.preservesPitch;d.audio.playbackRate=rate;if($(`#deck${letter}PitchValue`))$(`#deck${letter}PitchValue`).textContent=(pct>=0?'+':'')+pct.toFixed(1)+'%';refreshDeckUi(letter);v37RefreshPadMode(letter)
};
const v37OldToggleKeyLock=toggleDeckKeyLock;
toggleDeckKeyLock=function(letter){const d=djDecks[letter];v37OldToggleKeyLock(letter);if((d?.v37KeyShift||0)!==0)updateDeckRate(letter)};

// Override old pad-mode/pad click actions. SHIFT chooses the printed lower function.
const v37OldFlxTrigger=flxTriggerAction;
flxTriggerAction=function(action){
  let m=action.match(/^([AB])\.mode(Hotcue|Padfx|Beatjump|Sampler)$/);if(m){const base=m[2].toLowerCase();return v37SelectMode(m[1],base)}
  m=action.match(/^([AB])\.pad([1-8])$/);if(m){const k=`${m[1]}-${m[2]}`;if((v37SuppressClick.get(k)||0)>performance.now())return;v37PadDown(m[1],Number(m[2]),'click');setTimeout(()=>v37PadUp(m[1],Number(m[2])),90);return}
  return v37OldFlxTrigger(action)
};

// On-screen pads need genuine press/release for keyboard + pad FX.
function v37BindScreenPads(){for(const L of ['A','B'])for(let i=1;i<=8;i++){const b=document.querySelector(`[data-pad="${L}-${i}"]`);if(!b||b.dataset.v37Bound)return;b.dataset.v37Bound='1';b.addEventListener('pointerdown',e=>{if(flxState.learn)return;e.preventDefault();const k=`${L}-${i}`;v37SuppressClick.set(k,performance.now()+600);try{b.setPointerCapture(e.pointerId)}catch{}v37PadDown(L,i,'screen')});const up=e=>{if(flxState.learn)return;v37PadUp(L,i)};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up)}}

// Hardware pads: consume Note-On and Note-Off so held effects/notes really release.
const v37OldHandleMidi=handleFlxMidiMessage;
handleFlxMidiMessage=function(e){
  const raw=e.data||[],parsed=flxMidiMessageKey(raw);if(!parsed?.key)return v37OldHandleMidi(e);const {key,norm}=parsed;
  if(flxState.learn)return v37OldHandleMidi(e);
  const action=flxState.mappings[key];
  if(/^([AB])\.pad[1-8]$/.test(action||'')){updateFlxMidiMonitor(raw,key,norm);const m=action.match(/^([AB])\.pad([1-8])$/),prev=flxState.lastMidi.get(key)??0;flxState.lastMidi.set(key,norm);if(norm>.45&&prev<=.45)v37PadDown(m[1],Number(m[2]),'midi');else if(norm<=.45&&prev>.45)v37PadUp(m[1],Number(m[2]));return}
  if(/^([AB])\.shift$/.test(action||'')){updateFlxMidiMonitor(raw,key,norm);const m=action.match(/^([AB])\.shift$/),on=norm>.45;nevoV34.shift[m[1]]=on;v34Save();document.querySelector(`[data-flx-action="${m[1]}.shift"]`)?.classList.toggle('active',on);return}
  return v37OldHandleMidi(e)
};

const v37OldRefreshFlx=refreshFlx4Ui;
refreshFlx4Ui=function(){v37OldRefreshFlx();for(const L of ['A','B'])v37RefreshPadMode(L)};

function v37Bind(){
  for(const L of ['A','B']){const stored=nevoV34.padMode?.[L]||'hotcue';if(!V37_PAD_LABELS[stored])nevoV34.padMode[L]='hotcue';const d=djDecks[L];if(!Number.isFinite(d.v37KeyShift))d.v37KeyShift=0;v37RefreshPadMode(L)}
  v37BindScreenPads();v34Save();refreshFlx4Ui();
}
v37Bind();

// ===== v3.8: FLX4 BROWSER/LOAD + SMART CFX/FADER + TEMPO RANGE =====
const V38_STORAGE='nevo-studio-v3.8-ui';
let nevoV38={browserFocus:'tracks',browserCrate:'all',browserCursor:0,browserExpanded:false,smartCfxOn:false,smartCfxPreset:1,smartFaderOn:false,smartFaderPreset:1,tempoRange:{A:16,B:16}};
try{const x=JSON.parse(localStorage.getItem(V38_STORAGE)||'null');if(x&&typeof x==='object')nevoV38={...nevoV38,...x,tempoRange:{...nevoV38.tempoRange,...(x.tempoRange||{})}}}catch{}
function v38Save(){try{localStorage.setItem(V38_STORAGE,JSON.stringify({browserFocus:nevoV38.browserFocus,browserCrate:nevoV38.browserCrate,browserCursor:nevoV38.browserCursor,browserExpanded:nevoV38.browserExpanded,smartCfxOn:nevoV38.smartCfxOn,smartCfxPreset:nevoV38.smartCfxPreset,smartFaderOn:nevoV38.smartFaderOn,smartFaderPreset:nevoV38.smartFaderPreset,tempoRange:nevoV38.tempoRange}))}catch{}}
function v38Esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function v38Crates(){const names=[...new Set(djLibrary.map(x=>String(x.crate||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));return [{id:'all',label:currentLang==='de'?'ALLE SONGS':'ALL TRACKS'},{id:'favorites',label:currentLang==='de'?'FAVORITEN':'FAVORITES'},...names.map(n=>({id:'crate:'+n,label:n}))]}
function v38CrateLabel(id){return v38Crates().find(x=>x.id===id)?.label||(currentLang==='de'?'ALLE SONGS':'ALL TRACKS')}
function v38BrowserItems(){let items=[...djLibrary];const q=($('#djLibrarySearch')?.value||'').trim().toLowerCase();if(q)items=items.filter(item=>`${item.title||''} ${item.name||''} ${item.artist||''} ${item.crate||''} ${item.comment||''}`.toLowerCase().includes(q));const f=nevoV38.browserCrate||'all';if(f==='favorites')items=items.filter(x=>(Number(x.rating)||0)>=4);else if(f.startsWith('crate:'))items=items.filter(x=>(x.crate||'')===f.slice(6));const sort=nevoV32?.sort||'added';items.sort((a,b)=>sort==='title'?(a.title||a.name).localeCompare(b.title||b.name):sort==='bpm'?(Number(a.bpm)||999)-(Number(b.bpm)||999):sort==='key'?String(a.key||'').localeCompare(String(b.key||'')):sort==='rating'?(Number(b.rating)||0)-(Number(a.rating)||0):(b.addedAt||0)-(a.addedAt||0));return items}
function v38ClampCursor(){const n=v38BrowserItems().length;nevoV38.browserCursor=n?clamp(Number(nevoV38.browserCursor)||0,0,n-1):0}
function v38BrowseItem(){const items=v38BrowserItems();v38ClampCursor();return items[nevoV38.browserCursor]||null}
function v38RenderBrowser(){const panel=$('#flxBrowserPanel'),box=$('#flxBrowserList');if(!panel||!box)return;panel.classList.toggle('expanded',!!nevoV38.browserExpanded);panel.classList.toggle('crate-focus',nevoV38.browserFocus==='crates');const focus=$('#flxBrowserFocus'),crate=$('#flxBrowserCrate'),count=$('#flxBrowserCount');if(focus)focus.textContent=nevoV38.browserFocus==='crates'?(currentLang==='de'?'PLAYLISTS':'PLAYLISTS'):(currentLang==='de'?'TRACKS':'TRACKS');if(crate)crate.textContent=v38CrateLabel(nevoV38.browserCrate);
  box.innerHTML='';if(nevoV38.browserFocus==='crates'){const crates=v38Crates();let idx=Math.max(0,crates.findIndex(x=>x.id===nevoV38.browserCrate));if(count)count.textContent=`${idx+1} / ${crates.length}`;for(const [i,c] of crates.entries()){const row=document.createElement('button');row.type='button';row.className='flx4-browser-crate'+(c.id===nevoV38.browserCrate?' selected':'');row.innerHTML=`<b>${v38Esc(c.label)}</b><span>${c.id==='all'?djLibrary.length:c.id==='favorites'?djLibrary.filter(x=>(Number(x.rating)||0)>=4).length:djLibrary.filter(x=>(x.crate||'')===c.id.slice(6)).length}</span>`;row.onclick=()=>{nevoV38.browserCrate=c.id;nevoV38.browserCursor=0;v38Save();v38RenderBrowser()};row.ondblclick=()=>{nevoV38.browserFocus='tracks';v38Save();v38RenderBrowser()};box.appendChild(row)}return}
  const items=v38BrowserItems();v38ClampCursor();if(count)count.textContent=items.length?`${nevoV38.browserCursor+1} / ${items.length}`:'0 / 0';if(!items.length){box.innerHTML=`<div class="flx4-browser-empty">${currentLang==='de'?'Keine Songs in dieser Auswahl.':'No tracks in this selection.'}</div>`;v31UpdateBrowseTitle();return}items.forEach((item,i)=>{const row=document.createElement('button');row.type='button';row.className='flx4-browser-track'+(i===nevoV38.browserCursor?' selected':'');row.dataset.id=item.id;row.innerHTML=`<span><b>${v38Esc(item.title||cleanDjTitle(item.name))}</b><small>${v38Esc(item.artist||item.name||'')}</small></span><em>${item.bpm?Number(item.bpm).toFixed(1):'—'}</em><em>${v38Esc(item.key||'—')}</em><em>${item.duration?fmtDeckTime(item.duration):'—'}</em>`;row.onclick=()=>{nevoV38.browserCursor=i;v38Save();v38RenderBrowser()};box.appendChild(row)});requestAnimationFrame(()=>{const sel=box.querySelector('.selected');if(!sel)return;const top=sel.offsetTop,bottom=top+sel.offsetHeight,viewTop=box.scrollTop,viewBottom=viewTop+box.clientHeight;if(top<viewTop)box.scrollTop=top;else if(bottom>viewBottom)box.scrollTop=Math.max(0,bottom-box.clientHeight)});v31UpdateBrowseTitle()}
function v38BrowseMove(delta){if(nevoV38.browserFocus==='crates'){const list=v38Crates();let i=Math.max(0,list.findIndex(x=>x.id===nevoV38.browserCrate));i=(i+delta+list.length)%list.length;nevoV38.browserCrate=list[i].id;nevoV38.browserCursor=0}else{const n=v38BrowserItems().length;if(n)nevoV38.browserCursor=(nevoV38.browserCursor+delta+n)%n}v38Save();v38RenderBrowser()}
function v38BrowseOpen(){nevoV38.browserFocus=nevoV38.browserFocus==='crates'?'tracks':'crates';v38Save();v38RenderBrowser();setStatus(true,'BROWSE',nevoV38.browserFocus==='tracks'?(currentLang==='de'?'Track-Liste':'Track list'):(currentLang==='de'?'Playlists':'Playlists'))}
function v38BrowseBack(){if(nevoV38.browserFocus==='tracks'){nevoV38.browserFocus='crates'}else{nevoV38.browserCrate='all';nevoV38.browserCursor=0}v38Save();v38RenderBrowser()}
function v38BrowseView(){nevoV38.browserExpanded=!nevoV38.browserExpanded;v38Save();v38RenderBrowser()}
let v38LastLoad={A:0,B:0};
async function v38InstantDouble(letter){const other=letter==='A'?'B':'A',src=djDecks[other];if(!src?.item)return false;const wasPlaying=!src.audio.paused,cur=src.audio.currentTime||0,rate=src.audio.playbackRate||1;await loadItemToDeck(src.item,letter);const d=djDecks[letter];try{d.audio.currentTime=clamp(cur,0,d.audio.duration||d.buffer?.duration||0)}catch{};d.audio.playbackRate=rate;const pct=(rate-1)*100;if($(`#deck${letter}Pitch`))$(`#deck${letter}Pitch`).value=pct.toFixed(1);if(wasPlaying)try{await d.audio.play()}catch{};setStatus(true,'INSTANT DOUBLES',`DECK ${other} → DECK ${letter}`);return true}
async function v38BrowseLoad(letter){const now=performance.now();if(now-v38LastLoad[letter]<430){v38LastLoad[letter]=0;if(await v38InstantDouble(letter))return}else v38LastLoad[letter]=now;const item=v38BrowseItem();if(item){await loadItemToDeck(item,letter);setStatus(true,'LOAD',`${item.title||cleanDjTitle(item.name)} → DECK ${letter}`)}}
// Replace the older raw-library browser with the FLX4 browser model.
v31BrowseMove=v38BrowseMove;v31BrowseItem=v38BrowseItem;v31BrowseLoad=v38BrowseLoad;v31UpdateBrowseTitle=function(){const el=$('#flxBrowseTitle'),item=v38BrowseItem();if(el)el.textContent=nevoV38.browserFocus==='crates'?v38CrateLabel(nevoV38.browserCrate):(item?(item.title||cleanDjTitle(item.name)):(currentLang==='de'?'BIBLIOTHEK LEER':'LIBRARY EMPTY'))};
const v38OldRenderLibrary=renderDjLibrary;renderDjLibrary=function(){v38OldRenderLibrary();v38RenderBrowser()};
const v38OldLoadDeck=loadItemToDeck;loadItemToDeck=async function(item,letter){await v38OldLoadDeck(item,letter);v38RenderBrowser()};

// Per-deck smart-effect send used by Smart CFX and Smart Fader echo-out.
async function v38EnsureSmartFx(letter){await initAudio();const d=djDecks[letter];if(!d?.gainNode||d.v38SmartInput)return;d.v38SmartInput=ctx.createGain();d.v38SmartInput.gain.value=1;d.v38SmartDelay=ctx.createDelay(2.5);d.v38SmartDelay.delayTime.value=.32;d.v38SmartFeedback=ctx.createGain();d.v38SmartFeedback.gain.value=.32;d.v38SmartEchoWet=ctx.createGain();d.v38SmartEchoWet.gain.value=0;d.v38SmartVerb=ctx.createConvolver();d.v38SmartVerb.buffer=makeImpulse(2.4,2.1);d.v38SmartVerbWet=ctx.createGain();d.v38SmartVerbWet.gain.value=0;d.gainNode.connect(d.v38SmartInput);d.v38SmartInput.connect(d.v38SmartDelay);d.v38SmartDelay.connect(d.v38SmartFeedback);d.v38SmartFeedback.connect(d.v38SmartDelay);d.v38SmartDelay.connect(d.v38SmartEchoWet);d.v38SmartEchoWet.connect(master);d.v38SmartInput.connect(d.v38SmartVerb);d.v38SmartVerb.connect(d.v38SmartVerbWet);d.v38SmartVerbWet.connect(master);d.v38SmartCfxAmount=0;d.v38SmartFaderEcho=0;d.v38ManualFilter=Number.isFinite(d.filterValue)?d.filterValue:0}
function v38SmartFxApply(letter){const d=djDecks[letter];if(!ctx||!d?.v38SmartInput)return;const t=ctx.currentTime,cfx=nevoV38.smartCfxOn?Math.abs(Number(d.v38SmartCfxAmount)||0):0,echoF=nevoV38.smartFaderOn?(Number(d.v38SmartFaderEcho)||0):0;const cEcho=nevoV38.smartCfxPreset===1?cfx*(.18+.30*cfx):0,cVerb=nevoV38.smartCfxPreset===2?cfx*(.16+.42*cfx):0;const e=Math.max(cEcho,echoF);d.v38SmartEchoWet.gain.setTargetAtTime(clamp(e,0,.9),t,.025);d.v38SmartVerbWet.gain.setTargetAtTime(clamp(cVerb,0,.8),t,.03);d.v38SmartFeedback.gain.setTargetAtTime(clamp(.18+e*.58,.18,.72),t,.03);const bpm=Math.max(60,v3EffectiveBpm(letter)||djDeckBpm(letter)||150),beat=60/bpm;d.v38SmartDelay.delayTime.setTargetAtTime(clamp(beat*(nevoV38.smartCfxPreset===2?.75:.5),.05,1.4),t,.03)}
function v38AnyShift(){return !!(nevoV34.shift?.A||nevoV34.shift?.B)}
function v38SmartCfxToggle(preset=1){preset=preset===2?2:1;if(nevoV38.smartCfxOn&&nevoV38.smartCfxPreset===preset)nevoV38.smartCfxOn=false;else{nevoV38.smartCfxOn=true;nevoV38.smartCfxPreset=preset}nevoV34.smartCfx=nevoV38.smartCfxOn;for(const L of ['A','B']){const d=djDecks[L];if(!nevoV38.smartCfxOn&&d){d.v38SmartCfxAmount=0;d.filterValue=Number.isFinite(d.v38ManualFilter)?d.v38ManualFilter:0;flxApplyEq(L)}v38SmartFxApply(L)}v38Save();v34Save();v38RefreshSmartUi();setStatus(true,'SMART CFX',nevoV38.smartCfxOn?`P${preset} · ${preset===1?'ECHO FILTER':'SPACE WASH'}`:'AUS')}

let v38SmartSnapshot=null,v38SmartLastP=.5,v38SmartDirection='AB',v38SmartDriver='cross';
function v38TempoLimit(letter){const r=Number(nevoV38.tempoRange?.[letter])||16;return r>=99?100:r}
function v38SetPitchPct(letter,pct){pct=clamp(Number(pct)||0,-v38TempoLimit(letter),v38TempoLimit(letter));const d=djDecks[letter];if($(`#deck${letter}Pitch`))$(`#deck${letter}Pitch`).value=pct.toFixed(2);if(d?.audio){d.audio.playbackRate=clamp(1+pct/100,.5,2);const key=d.keyLock;d.audio.preservesPitch=key;d.audio.mozPreservesPitch=key;d.audio.webkitPreservesPitch=key}if($(`#deck${letter}PitchValue`))$(`#deck${letter}PitchValue`).textContent=(pct>=0?'+':'')+pct.toFixed(1)+'%';const fp=$(`#flx${letter}Pitch`);if(fp&&document.activeElement!==fp){const r=v38TempoLimit(letter);fp.value=clamp(pct/r*16,-16,16)}refreshDeckUi(letter)}
function v38SmartFaderRestore(){if(!v38SmartSnapshot)return;for(const L of ['A','B']){const d=djDecks[L],s=v38SmartSnapshot[L];if(!d||!s)continue;d.eqLow=s.low;d.v38SmartFaderEcho=0;if(!nevoV38.smartCfxOn)d.filterValue=s.filter;v38SetPitchPct(L,s.pitch);flxApplyEq(L);v38SmartFxApply(L)}v38SmartSnapshot=null}
function v38SmartFaderToggle(preset=1){preset=preset===2?2:1;if(nevoV38.smartFaderOn&&nevoV38.smartFaderPreset===preset){nevoV38.smartFaderOn=false;v38SmartFaderRestore()}else{if(nevoV38.smartFaderOn)v38SmartFaderRestore();nevoV38.smartFaderOn=true;nevoV38.smartFaderPreset=preset;v38SmartSnapshot={};for(const L of ['A','B']){const d=djDecks[L];v38SmartSnapshot[L]={low:Number(d.eqLow)||0,filter:Number(d.filterValue)||0,pitch:(Number($(`#deck${L}Pitch`)?.value)||0),rate:d.audio?.playbackRate||1};d.v38SmartFaderEcho=0}const x=Number($('#djCrossfader')?.value||0);v38SmartLastP=(x+1)/2;v38SmartDirection=v38SmartLastP<=.5?'AB':'BA'}nevoV34.smartFader=nevoV38.smartFaderOn;v38Save();v34Save();v38RefreshSmartUi();setStatus(true,'SMART FADER',nevoV38.smartFaderOn?`P${preset} · BPM + BASS + ECHO`:'AUS')}
function v38SmartProgress(){if(v38SmartDriver==='channels'){const a=Number($(`#deckAVolume`)?.value||0),b=Number($(`#deckBVolume`)?.value||0),sum=a+b;return sum>.001?clamp(b/sum,0,1):.5}return clamp((Number($('#djCrossfader')?.value||0)+1)/2,0,1)}
function v38SmartFaderApply(){if(!nevoV38.smartFaderOn||!v38SmartSnapshot||!djDecks.A?.item||!djDecks.B?.item)return;const p=v38SmartProgress();if(Math.abs(p-v38SmartLastP)>.002)v38SmartDirection=p>v38SmartLastP?'AB':'BA';v38SmartLastP=p;const q=v38SmartDirection==='AB'?p:1-p,from=v38SmartDirection==='AB'?'A':'B',to=from==='A'?'B':'A',sFrom=v38SmartSnapshot[from],sTo=v38SmartSnapshot[to];if(!sFrom||!sTo)return;const fromBase=djDeckBpm(from),toBase=djDeckBpm(to),fromOrig=fromBase*(1+sFrom.pitch/100),toOrig=toBase*(1+sTo.pitch/100),target=fromOrig+(toOrig-fromOrig)*q;v38SetPitchPct(from,(target/fromBase-1)*100);v38SetPitchPct(to,(target/toBase-1)*100);
  const depth=nevoV38.smartFaderPreset===2?1:.78;djDecks[from].eqLow=sFrom.low+(-1-sFrom.low)*q*depth;djDecks[to].eqLow=-depth+(sTo.low+depth)*q;const lowFrom=document.querySelector(`[data-flx-action="${from}.eqLow"]`),lowTo=document.querySelector(`[data-flx-action="${to}.eqLow"]`);if(lowFrom&&document.activeElement!==lowFrom)lowFrom.value=djDecks[from].eqLow;if(lowTo&&document.activeElement!==lowTo)lowTo.value=djDecks[to].eqLow;const echo=clamp((q-.68)/.32,0,1)*(nevoV38.smartFaderPreset===2?.72:.46);djDecks[from].v38SmartFaderEcho=echo;djDecks[to].v38SmartFaderEcho=0;if(nevoV38.smartFaderPreset===2&&!nevoV38.smartCfxOn){djDecks[from].filterValue=clamp(sFrom.filter+Math.max(0,q-.72)*1.7, -1,1);djDecks[to].filterValue=sTo.filter}flxApplyEq(from);flxApplyEq(to);v38SmartFxApply(from);v38SmartFxApply(to);if(q>.985)v3SetMaster(to)}
function v38RefreshSmartUi(){const c=document.querySelector('[data-flx-action="smart.cfx"]'),f=document.querySelector('[data-flx-action="smart.fader"]');c?.classList.toggle('active',nevoV38.smartCfxOn);f?.classList.toggle('active',nevoV38.smartFaderOn);if($('#flxSmartCfxState'))$('#flxSmartCfxState').textContent=`P${nevoV38.smartCfxPreset} · ${nevoV38.smartCfxOn?'AN':'AUS'}`;if($('#flxSmartFaderState'))$('#flxSmartFaderState').textContent=`P${nevoV38.smartFaderPreset} · ${nevoV38.smartFaderOn?'AN':'AUS'}`}

function v38TempoRangeLabel(letter){const r=Number(nevoV38.tempoRange?.[letter])||16;return r>=99?'WIDE':`±${r}%`}
function v38CycleTempoRange(letter){const list=[6,10,16,100],cur=Number(nevoV38.tempoRange?.[letter])||16,i=list.indexOf(cur);nevoV38.tempoRange[letter]=list[(i+1+list.length)%list.length];v38Save();v38RefreshTempoRange(letter);setStatus(true,'TEMPO RANGE',`DECK ${letter} · ${v38TempoRangeLabel(letter)}`)}
function v38RefreshTempoRange(letter){const el=$(`#flx${letter}TempoRange`);if(el)el.textContent=v38TempoRangeLabel(letter)}

// Extend FLX4 continuous controls. Hardware pitch uses the selected tempo range.
const v38OldFlxSetContinuous=flxSetContinuous;
flxSetContinuous=function(action,norm,fromMidi=false){
  const m=action.match(/^([AB])\.pitch$/);if(m){const L=m[1],range=v38TempoLimit(L);let pct;if(fromMidi)pct=(clamp(Number(norm)||0,0,1)*2-1)*range;else{const fp=$(`#flx${L}Pitch`),visual=Number(fp?.value)||0;pct=visual/16*range}v38SetPitchPct(L,pct);if(nevoV38.smartFaderOn)v38SmartFaderApply();return}
  const fm=action.match(/^([AB])\.filter$/);if(fm&&nevoV38.smartCfxOn){const L=fm[1],d=djDecks[L],v=clamp(Number(norm)||0,0,1)*2-1;d.v38SmartCfxAmount=v;d.filterValue=clamp(v*(nevoV38.smartCfxPreset===1?.86:.58),-1,1);const input=document.querySelector(`[data-flx-action="${action}"]`);if(input)input.value=v;flxApplyEq(L);v38EnsureSmartFx(L).then(()=>v38SmartFxApply(L));return}
  const rv=v38OldFlxSetContinuous(action,norm,fromMidi);const em=action.match(/^([AB])\.(filter|eqLow|volume)$/);if(em){const L=em[1],kind=em[2],d=djDecks[L];if(kind==='filter'&&d&&!nevoV38.smartCfxOn)d.v38ManualFilter=d.filterValue;if(kind==='volume'&&nevoV38.smartFaderOn){v38SmartDriver='channels';v38SmartFaderApply()}}if(action==='crossfader'&&nevoV38.smartFaderOn){v38SmartDriver='cross';v38SmartFaderApply()}return rv
};

// Smart buttons, tempo range, browser controls, SHIFT+CUE tap BPM.
const v38OldFlxTrigger=flxTriggerAction;
flxTriggerAction=function(action){
  if(action==='library.open')return v38BrowseOpen();if(action==='library.back')return v38BrowseBack();if(action==='library.view')return v38BrowseView();if(action==='library.prev')return v38BrowseMove(-1);if(action==='library.next')return v38BrowseMove(1);if(action==='library.loadA')return v38BrowseLoad('A');if(action==='library.loadB')return v38BrowseLoad('B');
  if(action==='smart.cfx')return v38SmartCfxToggle(v38AnyShift()?2:1);if(action==='smart.fader')return v38SmartFaderToggle(v38AnyShift()?2:1);
  let m=action.match(/^([AB])\.sync$/);if(m&&nevoV34.shift?.[m[1]])return v38CycleTempoRange(m[1]);
  m=action.match(/^([AB])\.pfl$/);if(m&&nevoV34.shift?.[m[1]])return tapBpm(m[1]);
  return v38OldFlxTrigger(action)
};
const v38OldLabel=flxActionLabel;flxActionLabel=function(action){const map={'library.open':'Browser drücken / Fokus','library.back':'Browser Back','library.view':'Browser View','smart.cfx':'Smart CFX P1/P2','smart.fader':'Smart Fader P1/P2'};return map[action]||v38OldLabel(action)};

// Hot Cue + SHIFT deletes a cue without entering Keyboard mode first.
const v38OldPadDown=v37PadDown;v37PadDown=async function(letter,index,source='screen'){const mode=nevoV34.padMode?.[letter]||'hotcue';if(mode==='hotcue'&&nevoV34.shift?.[letter]){const d=djDecks[letter];if(d?.hotCues){d.hotCues[index-1]=null;persistDeckMeta(letter);renderHotCues(letter);v37RefreshPadMode(letter);setStatus(true,'HOT CUE DEL',`DECK ${letter} · HOT ${index}`)}return}return v38OldPadDown(letter,index,source)};

// Sync respects the selected tempo range instead of being fixed to ±16%.
const v38OldSyncDeck=syncDeck;syncDeck=function(letter){const d=djDecks[letter],M=nevoV3.masterDeck,master=djDecks[M];if(!d?.item)return;if(M===letter||!master?.item)return v38OldSyncDeck(letter);const target=v3EffectiveBpm(M),base=djDeckBpm(letter),limit=v38TempoLimit(letter),pct=clamp((target/base-1)*100,-limit,limit);v38SetPitchPct(letter,pct);if(d.quantize&&nevoV3.globalQuantize){const p=djBeatPeriod(letter),off=djNormalizeOffset(d.beatOffset||0,p),phase=v3PhaseFraction(M),cur=d.audio.currentTime||0,beatFloat=(cur-off)/p,beatIndex=Math.round(beatFloat-phase);d.audio.currentTime=clamp(off+(beatIndex+phase)*p,0,d.audio.duration||0)}setStatus(true,'BEAT SYNC',`DECK ${letter} → MASTER ${M} · ${target.toFixed(2)} BPM · ${v38TempoRangeLabel(letter)}`);drawDeckZoom(letter,true);refreshDeckUi(letter)};

const v38OldEnsureDeck=ensureDeckConnected;ensureDeckConnected=async function(deck){await v38OldEnsureDeck(deck);await v38EnsureSmartFx(deck.letter);v38SmartFxApply(deck.letter)};
const v38OldRefreshFlx=refreshFlx4Ui;refreshFlx4Ui=function(){v38OldRefreshFlx();v38RefreshSmartUi();v38RefreshTempoRange('A');v38RefreshTempoRange('B')};
const v38OldSetLanguage=setLanguage;setLanguage=function(lang){v38OldSetLanguage(lang);v38RenderBrowser();v38RefreshSmartUi()};

function v38Bind(){for(const L of ['A','B']){v38RefreshTempoRange(L);const d=djDecks[L];if(d&&!Number.isFinite(d.v38ManualFilter))d.v38ManualFilter=Number(d.filterValue)||0}v38RefreshSmartUi();v38RenderBrowser();v38Save();setTimeout(()=>{for(const L of ['A','B'])if(djDecks[L]?.source)v38EnsureSmartFx(L).then(()=>v38SmartFxApply(L))},500)}
v38Bind();

// ===== v3.9: PARALLEL WAVE LIVE BEAT/BAR + PHASE METER =====
function v39BeatInfo(letter){
  const d=djDecks[letter];
  if(!d?.item)return {bar:null,beat:null,index:null,phase:0};
  const p=djBeatPeriod(letter),off=djNormalizeOffset(d.beatOffset||0,p),cur=d.audio?.currentTime||0;
  if(!Number.isFinite(p)||p<=0)return {bar:null,beat:null,index:null,phase:0};
  const raw=(cur-off)/p,index=Math.floor(raw+1e-7),safe=Math.max(0,index),beat=((safe%4)+4)%4+1,bar=Math.floor(safe/4)+1,phase=((raw%1)+1)%1;
  return {bar,beat,index:safe,phase};
}
function v39PhaseDiff(letter){
  if(!djDecks[letter]?.item)return {beats:0,ms:0,hasMaster:false,locked:false};
  const M=nevoV3?.masterDeck||'A',master=djDecks[M];
  if(!master?.item||letter===M)return {beats:0,ms:0,hasMaster:!!master?.item,locked:letter===M};
  let diff=v3PhaseFraction(letter)-v3PhaseFraction(M);if(diff>.5)diff-=1;if(diff<-.5)diff+=1;
  const effective=Math.max(1,v3EffectiveBpm(letter)),ms=diff*(60/effective)*1000;
  return {beats:diff,ms,hasMaster:true,locked:Math.abs(diff)<=.035&&Math.abs(v3EffectiveBpm(letter)-v3EffectiveBpm(M))<=.12};
}
function v39SetText(id,value){const el=$(id);if(el)el.textContent=value}
function v39RefreshStackLive(letter){
  const d=djDecks[letter],row=document.querySelector(`[data-flx-stack="${letter}"]`),info=v39BeatInfo(letter),phase=v39PhaseDiff(letter),M=nevoV3?.masterDeck||'A',isMaster=letter===M&&!!d?.item,isPlaying=!!d?.item&&!d.audio.paused,isSync=!!nevoV31?.syncLock?.[letter],eff=d?.item?v3EffectiveBpm(letter):0;
  v39SetText(`#flx${letter}LiveBpm`,d?.item?eff.toFixed(2):'—');v39SetText(`#flx${letter}Bar`,info.bar??'—');v39SetText(`#flx${letter}Beat`,info.beat??'—');
  const phaseText=!d?.item?'—':isMaster?'MASTER':phase.hasMaster?`${phase.ms>=0?'+':''}${Math.round(phase.ms)} ms`:`${Math.round(info.phase*100)}%`;
  v39SetText(`#flx${letter}PhaseMs`,phaseText);v39SetText(`#flx${letter}GridReadout`,d?.item?`TAKT ${info.bar} · BEAT ${info.beat}`:'TAKT — · BEAT —');
  const masterBadge=$(`#flx${letter}MasterBadge`),syncBadge=$(`#flx${letter}SyncBadge`),playBadge=$(`#flx${letter}PlayBadge`);masterBadge?.classList.toggle('on',isMaster);masterBadge?.classList.toggle('master',isMaster);syncBadge?.classList.add('sync');syncBadge?.classList.toggle('on',isSync||phase.locked);syncBadge&&(syncBadge.textContent=phase.locked&&!isMaster?'PHASE LOCK':isSync?'SYNC LOCK':'SYNC');playBadge?.classList.add('play');playBadge?.classList.toggle('on',isPlaying);playBadge&&(playBadge.textContent=isPlaying?'PLAY':'PAUSE');
  const needle=$(`#flx${letter}PhaseNeedle`);if(needle){let pct=50;if(d?.item&&!isMaster&&phase.hasMaster)pct=clamp(50+phase.beats*80,10,90);needle.style.left=pct+'%';needle.classList.toggle('locked',phase.locked||isMaster)}
  row?.classList.toggle('master-row',isMaster);row?.classList.toggle('synced-row',phase.locked&&!isMaster);
}
// Improve the existing beat overlay: every downbeat also shows its bar number.
const v39OldBeatOverlay=v34BeatOverlay;
v34BeatOverlay=function(letter,r){
  v39OldBeatOverlay(letter,r);const box=$(`#flx${letter}StackBeats`);if(!box)return;const d=djDecks[letter],p=r?.period||djBeatPeriod(letter),off=djNormalizeOffset(d?.beatOffset||0,p);box.querySelectorAll('span.major').forEach(sp=>{const x=parseFloat(sp.style.left)||0,t=r.start+(x/100)*(r.end-r.start),idx=Math.max(0,Math.round((t-off)/p)),bar=Math.floor(idx/4)+1;sp.dataset.bar=`T${bar}`});
};
const v39OldRefreshFlx=refreshFlx4Ui;
refreshFlx4Ui=function(){v39OldRefreshFlx();v39RefreshStackLive('A');v39RefreshStackLive('B')};
const v39OldSetMaster=v3SetMaster;
v3SetMaster=function(letter){const r=v39OldSetMaster(letter);v39RefreshStackLive('A');v39RefreshStackLive('B');return r};
function v39Bind(){v39RefreshStackLive('A');v39RefreshStackLive('B');setTimeout(()=>{v34DrawStack('A',true);v34DrawStack('B',true);v39RefreshStackLive('A');v39RefreshStackLive('B')},350)}
v39Bind();


// ===== v4.0: AUTHENTIC FLX4 LOOP FLOW + LOOP/CUE OVERLAYS =====
function v40LoopBounds(letter){
  const d=djDecks[letter];if(!d?.item)return null;const p=djBeatPeriod(letter);
  if(d.manualLoopActive&&Number.isFinite(d.manualLoopIn)&&Number.isFinite(d.manualLoopOut)&&d.manualLoopOut>d.manualLoopIn)return {start:d.manualLoopIn,end:d.manualLoopOut,beats:(d.manualLoopOut-d.manualLoopIn)/p,manual:true};
  if(Number(d.loopBeats)>0&&Number.isFinite(d.loopStart))return {start:d.loopStart,end:d.loopStart+Number(d.loopBeats)*p,beats:Number(d.loopBeats),manual:false};
  return null;
}
function v40EnsureOverlay(letter){
  const wrap=document.querySelector(`[data-flx-stack-seek="${letter}"]`);if(!wrap)return null;
  let ov=$(`#flx${letter}LoopOverlay`);if(!ov){ov=document.createElement('div');ov.id=`flx${letter}LoopOverlay`;ov.className='flx4-loop-overlay';ov.innerHTML='<i class="loop-in">IN</i><i class="loop-out">OUT</i>';wrap.appendChild(ov)}
  let badge=$(`#flx${letter}LoopBadge`);if(!badge){badge=document.createElement('b');badge.id=`flx${letter}LoopBadge`;badge.className='flx4-loop-badge';wrap.appendChild(badge)}
  return {wrap,ov,badge};
}
function v40ClearMarkers(letter){const wrap=document.querySelector(`[data-flx-stack-seek="${letter}"]`);wrap?.querySelectorAll('.flx4-hotcue-marker,.flx4-memory-marker').forEach(x=>x.remove())}
function v40TimeToPct(t,r){return clamp((t-r.start)/Math.max(.001,r.end-r.start)*100,0,100)}
function v40RefreshMarkers(letter,r){
  const d=djDecks[letter],wrap=document.querySelector(`[data-flx-stack-seek="${letter}"]`);if(!d?.item||!wrap)return;v40ClearMarkers(letter);
  (d.hotCues||[]).forEach((t,i)=>{if(!Number.isFinite(t)||t<r.start||t>r.end)return;const m=document.createElement('i');m.className='flx4-hotcue-marker';m.style.left=v40TimeToPct(t,r)+'%';m.dataset.label=`H${i+1}`;wrap.appendChild(m)});
  const mem=typeof v36MemList==='function'?v36MemList(letter):[];(mem||[]).forEach((x,i)=>{const t=Number(x?.time);if(!Number.isFinite(t)||t<r.start||t>r.end)return;const m=document.createElement('i');m.className='flx4-memory-marker';m.style.left=v40TimeToPct(t,r)+'%';m.dataset.label=x.type==='loop'?`M${i+1}L`:`M${i+1}`;wrap.appendChild(m)});
}
function v40RefreshLoopOverlay(letter){
  const d=djDecks[letter],ui=v40EnsureOverlay(letter);if(!ui)return;if(!d?.item){ui.ov.classList.remove('on');ui.badge.classList.remove('on');v40ClearMarkers(letter);return}
  const r=v34StackRange(letter),bounds=v40LoopBounds(letter);v40RefreshMarkers(letter,r);if(!bounds){ui.ov.classList.remove('on');ui.badge.classList.remove('on');return}
  const visStart=Math.max(bounds.start,r.start),visEnd=Math.min(bounds.end,r.end);if(visEnd<=visStart){ui.ov.classList.remove('on')}else{ui.ov.classList.add('on');ui.ov.style.left=v40TimeToPct(visStart,r)+'%';ui.ov.style.width=Math.max(.4,v40TimeToPct(visEnd,r)-v40TimeToPct(visStart,r))+'%'}
  const b=bounds.beats,txt=`LOOP ${Math.abs(b-Math.round(b))<.01?Math.round(b):b.toFixed(2)} BEAT${Math.abs(b-1)<.01?'':'S'}`;ui.badge.textContent=txt;ui.badge.classList.add('on')
}
// Keep the FLX4 hardware semantics explicit: 4 BEAT starts a 4-beat loop; during an active loop it exits.
const v40OldToggleLoop4=v34ToggleLoop4;
v34ToggleLoop4=function(letter){const d=djDecks[letter];if(!d?.item)return;const was=!!v35LoopBeats(letter);const r=v40OldToggleLoop4(letter);v40RefreshLoopOverlay(letter);v34DrawStack(letter,true);setStatus(true,was?'4 BEAT / EXIT':'4 BEAT',was?`DECK ${letter} · LOOP AUS · Song läuft weiter`:`DECK ${letter} · 4 BEAT LOOP`);return r};
// While a loop is active, CUE/LOOP CALL follows the printed 1/2X and 2X labels. Outside a loop it recalls memory/cue points.
const v40OldCueCall=v34CueCall;
v34CueCall=function(letter,dir){const active=!!v35LoopBeats(letter),before=v35LoopBeats(letter),r=v40OldCueCall(letter,dir);if(active){const after=v35LoopBeats(letter);setStatus(true,dir<0?'1/2X':'2X',`DECK ${letter} · ${before} → ${after} BEATS`)}v40RefreshLoopOverlay(letter);v34DrawStack(letter,true);return r};
const v40OldLoopIn=v3LoopIn;v3LoopIn=function(letter){const r=v40OldLoopIn(letter);v40RefreshLoopOverlay(letter);v34DrawStack(letter,true);return r};
const v40OldLoopOut=v3LoopOut;v3LoopOut=function(letter){const r=v40OldLoopOut(letter);v40RefreshLoopOverlay(letter);v34DrawStack(letter,true);return r};
const v40OldSetLoopSize=v35SetLoopSize;v35SetLoopSize=function(letter,beats,activate=true){const r=v40OldSetLoopSize(letter,beats,activate);v40RefreshLoopOverlay(letter);v34DrawStack(letter,true);return r};
const v40OldExitLoop=v35ExitLoop;v35ExitLoop=function(letter){const r=v40OldExitLoop(letter);v40RefreshLoopOverlay(letter);v34DrawStack(letter,true);return r};
const v40OldDrawStack=v34DrawStack;v34DrawStack=function(letter,force=false){const r=v40OldDrawStack(letter,force);v40RefreshLoopOverlay(letter);return r};
const v40OldRefreshFlx=refreshFlx4Ui;refreshFlx4Ui=function(){v40OldRefreshFlx();v40RefreshLoopOverlay('A');v40RefreshLoopOverlay('B')};
function v40Bind(){for(const L of ['A','B']){v40EnsureOverlay(L);v40RefreshLoopOverlay(L)}setTimeout(()=>{v34DrawStack('A',true);v34DrawStack('B',true)},400)}
v40Bind();


// ===== v4.0.1: MOBILE SCROLL / OVERLAY PERFORMANCE FIX =====
// v4.0 rebuilt all hot-cue + memory marker DOM nodes every FLX refresh (~12x/s).
// On phones that created enough layout/paint churn to starve native scrolling.
const nevoV401={
  markerSig:{A:'',B:''},
  markerNodes:{A:[],B:[]},
  scrolling:false,
  scrollTimer:0
};
function v401MarkerData(letter){
  const d=djDecks[letter];if(!d?.item)return [];
  const out=[];
  (d.hotCues||[]).forEach((t,i)=>{if(Number.isFinite(t))out.push({kind:'hot',time:Number(t),label:`H${i+1}`})});
  const mem=typeof v36MemList==='function'?(v36MemList(letter)||[]):[];
  mem.forEach((x,i)=>{const t=Number(x?.time);if(Number.isFinite(t))out.push({kind:'mem',time:t,label:x?.type==='loop'?`M${i+1}L`:`M${i+1}`})});
  return out;
}
function v401MarkerSignature(data){return data.map(x=>`${x.kind}:${x.time.toFixed(3)}:${x.label}`).join('|')}
function v401BuildMarkers(letter,wrap,data){
  wrap.querySelectorAll('.flx4-hotcue-marker,.flx4-memory-marker').forEach(x=>x.remove());
  const nodes=[];
  for(const x of data){
    const m=document.createElement('i');
    m.className=x.kind==='hot'?'flx4-hotcue-marker':'flx4-memory-marker';
    m.dataset.label=x.label;m.dataset.time=String(x.time);m.style.display='none';wrap.appendChild(m);nodes.push(m)
  }
  nevoV401.markerNodes[letter]=nodes
}
// Replace the expensive v4.0 implementation with a cached one: create marker
// elements only when cues/memory change; while playing only move/hide them.
v40RefreshMarkers=function(letter,r){
  const d=djDecks[letter],wrap=document.querySelector(`[data-flx-stack-seek="${letter}"]`);if(!d?.item||!wrap)return;
  const data=v401MarkerData(letter),sig=v401MarkerSignature(data);
  if(sig!==nevoV401.markerSig[letter]){nevoV401.markerSig[letter]=sig;v401BuildMarkers(letter,wrap,data)}
  for(const m of nevoV401.markerNodes[letter]){
    const t=Number(m.dataset.time),inside=Number.isFinite(t)&&t>=r.start&&t<=r.end;
    if(!inside){if(m.style.display!=='none')m.style.display='none';continue}
    m.style.display='block';m.style.left=v40TimeToPct(t,r)+'%'
  }
};
const v401BaseClearMarkers=v40ClearMarkers;
v40ClearMarkers=function(letter){
  v401BaseClearMarkers(letter);nevoV401.markerSig[letter]='';nevoV401.markerNodes[letter]=[]
};

// While the user is physically scrolling the page, pause the expensive moving
// waveform redraws. Audio keeps playing; visual redraw resumes immediately after.
function v401ScrollingPulse(){
  nevoV401.scrolling=true;window.__nevoScrolling=true;document.body?.classList.add('nevo-scrolling');clearTimeout(nevoV401.scrollTimer);
  nevoV401.scrollTimer=setTimeout(()=>{
    nevoV401.scrolling=false;window.__nevoScrolling=false;document.body?.classList.remove('nevo-scrolling');
    try{v34DrawStack('A',true);v34DrawStack('B',true);v40RefreshLoopOverlay('A');v40RefreshLoopOverlay('B')}catch{}
  },220)
}
window.addEventListener('scroll',v401ScrollingPulse,{passive:true});
window.addEventListener('wheel',v401ScrollingPulse,{passive:true});
document.addEventListener('touchmove',v401ScrollingPulse,{passive:true,capture:true});
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&Math.abs(e.movementY||0)>1)v401ScrollingPulse()},{passive:true,capture:true});

const v401CurrentDrawStack=v34DrawStack;
v34DrawStack=function(letter,force=false){if(nevoV401.scrolling&&!force)return;return v401CurrentDrawStack(letter,force)};

// Do not let seek areas steal a normal vertical swipe. A tap still seeks, but a
// swipe is left to the browser's native scrolling gesture.
for(const el of document.querySelectorAll('[data-flx-stack-seek]')){
  if(el.dataset.v401TouchBound)continue;el.dataset.v401TouchBound='1';
  let sx=0,sy=0,moved=false;
  el.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;sx=e.clientX;sy=e.clientY;moved=false},{passive:true});
  el.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')return;if(Math.abs(e.clientY-sy)>8||Math.abs(e.clientX-sx)>12)moved=true},{passive:true});
  el.addEventListener('click',e=>{if(moved&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();moved=false}},true)
}

// ===== v4.0.2: HARD SCROLL FIX =====
console.info('NÉVO v4.0.2 scroll fix active: browser rebuild removed from FLX ticker');

// ===== v4.0.3: DEDICATED SCROLL SURFACE + RENDER BUDGET =====
(() => {
  const shell=document.querySelector('.app-shell');
  if(!shell)return;

  // The app shell is now the only vertical page scroller. Feed its scroll state
  // into the existing v4.0.1 render pause so waveforms never compete with scrolling.
  let endTimer=0;
  const beginScroll=()=>{
    window.__nevoScrolling=true;
    document.body?.classList.add('nevo-scrolling');
    clearTimeout(endTimer);
    endTimer=setTimeout(()=>{
      window.__nevoScrolling=false;
      document.body?.classList.remove('nevo-scrolling');
      // Redraw once, after the user has stopped moving the page.
      try{v34DrawStack('A',true);v34DrawStack('B',true);v40RefreshLoopOverlay('A');v40RefreshLoopOverlay('B')}catch{}
    },180);
  };
  shell.addEventListener('scroll',beginScroll,{passive:true});
  shell.addEventListener('wheel',beginScroll,{passive:true});
  shell.addEventListener('touchmove',beginScroll,{passive:true});

  // Move any accidental old window scroll position into the real app scroller.
  try{
    const oldY=window.scrollY||document.documentElement.scrollTop||0;
    if(oldY>0)shell.scrollTop=oldY;
    window.scrollTo(0,0);
  }catch{}

  // The zoom waveform used to be repainted many times per second from raw audio.
  // Keep it responsive, but cap expensive canvas work. The playhead/window itself
  // can still move between paints.
  if(typeof drawDeckZoom==='function'){
    const baseDrawDeckZoom=drawDeckZoom;
    drawDeckZoom=function(letter,force=false){
      const d=djDecks?.[letter];
      if(!d?.buffer)return;
      if(window.__nevoScrolling&&!force)return;
      const now=performance.now();
      if(!force){
        try{updateDeckZoomWindow(letter)}catch{}
        if(d.audio?.paused)return; // a paused deck does not need continuous repaint
        if(now-(d._v403ZoomPaint||0)<180)return;
        d._v403ZoomPaint=now;
      }
      return baseDrawDeckZoom(letter,force);
    };
  }

  // Same budget for the parallel FLX waveform. It still follows playback, but no
  // longer repaints at a rate that can starve wheel/touch input on slower laptops.
  if(typeof v34DrawStack==='function'){
    const baseDrawStack=v34DrawStack;
    v34DrawStack=function(letter,force=false){
      const d=djDecks?.[letter];
      if(window.__nevoScrolling&&!force)return;
      const now=performance.now();
      if(!force){
        if(d?.audio?.paused && d?._v403StackPaint)return;
        if(now-(d?._v403StackPaint||0)<160)return;
        if(d)d._v403StackPaint=now;
      }
      return baseDrawStack(letter,force);
    };
  }

  console.info('NÉVO v4.0.3 dedicated app scroller active');
})();


// ===== v4.0.5: MOMENTARY SHIFT + REAL CUE HOLD + SAFE PFL ROUTING =====
// FLX4 sends Note-Off as 0x80 on some controls. Normalize it to the same key as
// the Note-On so held controls (SHIFT, CUE and pads) get a reliable release event.
flxMidiMessageKey=function(data){
  const status=data[0]||0,type=status&0xF0,ch=status&0x0F,d1=data[1]||0,d2=data[2]||0;
  if(type===0xE0)return {key:`e0:${ch}:pitch`,norm:clamp(((d2<<7)|d1)/16383,0,1)};
  if(type===0x80)return {key:`90:${ch}:${d1}`,norm:0};
  if(type===0x90)return {key:`90:${ch}:${d1}`,norm:clamp(d2/127,0,1)};
  return {key:`${type.toString(16)}:${ch}:${d1}`,norm:clamp(d2/127,0,1)};
};

function v405SetShift(letter,on){
  on=!!on;nevoV34.shift[letter]=on;v34Save();
  document.querySelector(`[data-flx-action="${letter}.shift"]`)?.classList.toggle('active',on);
  try{v37RefreshPadMode(letter)}catch{}
}

// A quick CUE press returns to the stored cue point. Holding it turns it into a
// Cue Point Sampler: play from CUE only while held, then return to CUE on release.
function v405CuePress(letter){
  const d=djDecks[letter];if(!d?.item)return;
  clearTimeout(d._v405CueTimer);d._v405CueHeld=false;d._v405CueDown=true;
  const cue=clamp(Number(d.cue)||0,0,d.audio.duration||d.buffer?.duration||0);
  d.audio.pause();try{d.audio.currentTime=cue}catch{};refreshDeckUi(letter);
  d._v405CueTimer=setTimeout(async()=>{
    if(!d._v405CueDown)return;d._v405CueHeld=true;
    try{await ensureDeckConnected(d);await d.audio.play()}catch(e){console.warn(e)}
    refreshDeckUi(letter);
  },120);
}
function v405CueRelease(letter){
  const d=djDecks[letter];if(!d?.item)return;
  d._v405CueDown=false;clearTimeout(d._v405CueTimer);
  if(d._v405CueHeld){d.audio.pause();try{d.audio.currentTime=clamp(Number(d.cue)||0,0,d.audio.duration||0)}catch{};d._v405CueHeld=false;refreshDeckUi(letter)}
}

function v405DedicatedCueReady(){
  return !!(nevoV31?.cueOutputId && typeof v31CueAudio('A').setSinkId==='function');
}

// PFL/CUE must never suddenly appear on the master speakers. If no dedicated
// browser output is selected, arm the button visually but keep the cue audio muted
// and explain what to do. Once a headphone output is selected, CUE is independent
// from the channel fader and crossfader, as on a DJ mixer.
const v405OldTogglePfl=v31TogglePfl;
v31TogglePfl=async function(letter){
  const d=djDecks[letter];if(!d?.item)return;
  const turningOn=!nevoV31.pfl[letter];
  if(turningOn&&!v405DedicatedCueReady()){
    nevoV31.pfl[letter]=true;const a=v31CueAudio(letter);a.pause();a.volume=0;v31RefreshPfl(letter);
    setStatus(true,'KOPFHÖRER CUE',currentLang==='de'?'CUE ist vorgemerkt. Unter KOPFHÖRER / PFL zuerst AUSGÄNGE LADEN und den Kopfhörer-Ausgang wählen – sonst wird nichts auf die Boxen geschickt.':'CUE armed. Load outputs and select a headphone output first; it will not be sent to the speakers.');
    return;
  }
  return v405OldTogglePfl(letter);
};

// When a dedicated cue output is selected after CUE was armed, start that PFL path.
const v405OldSetCueOutput=v31SetCueOutput;
v31SetCueOutput=async function(id){
  await v405OldSetCueOutput(id);
  if(id){for(const L of ['A','B'])if(nevoV31.pfl[L]){const d=djDecks[L],a=v31CueAudio(L);if(d?.item){if(a.src!==d.item.url)a.src=d.item.url;try{a.currentTime=d.audio.currentTime||0}catch{};a.playbackRate=d.audio.playbackRate||1;a.volume=v35CueDeckVolume(L);try{await a.play()}catch(e){console.warn(e)}}}}
  else{for(const L of ['A','B']){const a=v31CueAudio(L);a.pause();a.volume=0}}
  v35UpdateHeadphoneVolumes();
};

// The screen SHIFT buttons are momentary too. Suppress their old click-toggle.
// The large deck CUE buttons also use press/release instead of a click toggle.
const v405OldFlxTrigger=flxTriggerAction;
flxTriggerAction=function(action){
  if(/^([AB])\.shift$/.test(action||''))return;
  if(/^([AB])\.cue$/.test(action||''))return;
  return v405OldFlxTrigger(action);
};

function v405BindMomentaryButtons(){
  for(const L of ['A','B']){
    const shift=document.querySelector(`[data-flx-action="${L}.shift"]`);
    if(shift&&!shift.dataset.v405Bound){shift.dataset.v405Bound='1';shift.addEventListener('pointerdown',e=>{if(flxState.learn)return;e.preventDefault();v405SetShift(L,true)});const up=e=>{if(flxState.learn)return;v405SetShift(L,false)};shift.addEventListener('pointerup',up);shift.addEventListener('pointercancel',up);shift.addEventListener('lostpointercapture',up)}
    const cue=document.querySelector(`#flx4Surface [data-flx-action="${L}.cue"]`);
    if(cue&&!cue.dataset.v405Bound){cue.dataset.v405Bound='1';cue.addEventListener('pointerdown',e=>{if(flxState.learn)return;e.preventDefault();try{cue.setPointerCapture(e.pointerId)}catch{};v405CuePress(L)});const cup=e=>{if(flxState.learn)return;v405CueRelease(L)};cue.addEventListener('pointerup',cup);cue.addEventListener('pointercancel',cup);cue.addEventListener('lostpointercapture',cup)}
  }
}

// Final MIDI handler: SHIFT and deck CUE need both press and release. Pad handling
// from v3.7 stays intact; all other controls continue through the existing chain.
const v405OldMidiHandler=handleFlxMidiMessage;
handleFlxMidiMessage=function(e){
  const raw=e.data||[],parsed=flxMidiMessageKey(raw);if(!parsed?.key)return v405OldMidiHandler(e);
  const {key,norm}=parsed;const action=flxState.mappings[key];
  if(flxState.learn)return v405OldMidiHandler(e);
  let m=action?.match(/^([AB])\.shift$/);if(m){updateFlxMidiMonitor(raw,key,norm);flxState.lastMidi.set(key,norm);v405SetShift(m[1],norm>.45);return}
  m=action?.match(/^([AB])\.cue$/);if(m){updateFlxMidiMonitor(raw,key,norm);const prev=flxState.lastMidi.get(key)??0;flxState.lastMidi.set(key,norm);if(norm>.45&&prev<=.45)v405CuePress(m[1]);else if(norm<=.45&&prev>.45)v405CueRelease(m[1]);return}
  return v405OldMidiHandler(e);
};

// Keep cue/master headphone labels and physical-control hints obvious.
function v405RefreshPhysicalUi(){
  document.querySelectorAll('.flx4-channel-cue').forEach(b=>{const L=b.dataset.flxAction?.startsWith('A.')?'A':'B';b.textContent=`CUE ${L==='A'?'1':'2'}`;b.title='PFL: nur Kopfhörer, unabhängig vom Kanal-Fader';});
  const hm=document.querySelector('[data-flx-action="headphones.mix"]');if(hm)hm.title='Links = CUE/PFL · Rechts = MASTER';
  const ml=document.querySelector('[data-flx-action="master.level"]');if(ml)ml.title='Gesamtlautstärke des Master-Ausgangs';
  const fx=document.querySelector('[data-flx-action="fx.level"]');if(fx)fx.title='Beat FX LEVEL / DEPTH: Effektstärke MIN ↔ MAX';
}

v405BindMomentaryButtons();v405RefreshPhysicalUi();
setTimeout(()=>{v405BindMomentaryButtons();v405RefreshPhysicalUi();},350);
console.info('NÉVO v4.0.5: momentary SHIFT, cue hold and safe PFL routing active');

// ===== v4.0.6: BEAT FX 3-POSITION CHANNEL + SELECT/BROWSE/CONFIRM =====
// The on-screen section now mirrors the physical workflow more clearly:
// channel target has three explicit positions (1 / 2 / 1&2). FX SELECT opens
// the effect list; while it is open, BEAT left/right browses the list and a
// second FX SELECT press confirms. Outside the menu, BEAT left/right still
// adjusts the effect's beat length so that function is not lost.
const nevoV406Fx={menuOpen:false,index:0};
function v406FxList(){return Array.isArray(V35_FX_NAMES)&&V35_FX_NAMES.length?V35_FX_NAMES:['ECHO','REVERB','DELAY','FLANGER','PHASER','FILTER','ROLL']}
function v406FxDisplayName(name){return name==='REVERB'?'REVERB / HALL':name}
function v406SetFxChannel(channel){
  if(!['A','B','AB'].includes(channel))return;
  nevoV34.fx.channel=channel;v34Save();v34RefreshFx();try{v35ApplyFx()}catch{}
  setStatus(true,'BEAT FX KANAL',channel==='A'?'KANAL 1':channel==='B'?'KANAL 2':'KANAL 1 & 2');
}
function v406RefreshChannelSegments(){
  document.querySelectorAll('#flxFxChannel [data-fx-channel]').forEach(b=>b.classList.toggle('active',b.dataset.fxChannel===nevoV34.fx.channel));
}
function v406RefreshFxBrowse(){
  const menu=$('#flxFxMenu'),list=v406FxList();if(!menu)return;
  menu.classList.toggle('fx-browse-open',nevoV406Fx.menuOpen);
  menu.querySelectorAll('[data-fx-name]').forEach((b,i)=>{
    b.classList.toggle('preview',nevoV406Fx.menuOpen&&i===nevoV406Fx.index);
    b.classList.toggle('active',!nevoV406Fx.menuOpen&&b.dataset.fxName===nevoV34.fx.name);
  });
  const select=$('#flxFxSelectBtn'),label=$('#flxFxCenterLabel'),readout=$('#flxFxBeat');
  if(nevoV406Fx.menuOpen){
    const candidate=list[nevoV406Fx.index]||nevoV34.fx.name;
    if(select)select.textContent='FX SELECT ✓';
    if(label)label.textContent='FX AUSWAHL';
    if(readout)readout.textContent=v406FxDisplayName(candidate);
  }else{
    if(select)select.textContent='FX SELECT';
    if(label)label.textContent='BEAT-LÄNGE';
    if(readout){const b=Number(nevoV34.fx.beat)||1;readout.textContent=`${b} ${b===1?'BEAT':'BEATS'}`}
  }
}
function v406OpenFxBrowse(){
  const list=v406FxList();nevoV406Fx.index=Math.max(0,list.indexOf(nevoV34.fx.name));nevoV406Fx.menuOpen=true;
  const menu=$('#flxFxMenu');if(menu)menu.hidden=false;v406RefreshFxBrowse();
}
function v406ConfirmFxBrowse(){
  const list=v406FxList(),name=list[nevoV406Fx.index]||nevoV34.fx.name;nevoV406Fx.menuOpen=false;
  v35SelectFx(name);v406RefreshFxBrowse();
}
function v406FxSelectPress(){if(nevoV406Fx.menuOpen)v406ConfirmFxBrowse();else v406OpenFxBrowse()}
function v406FxBrowseStep(dir){
  const list=v406FxList();if(!list.length)return;
  nevoV406Fx.index=(nevoV406Fx.index+(dir<0?-1:1)+list.length)%list.length;v406RefreshFxBrowse();
}

// Override the v3.5 select-cycle hook with the two-step open/confirm workflow.
v34FxCycle=function(){v406FxSelectPress()};
const v406AdjustBeat=v34FxBeat;
v34FxBeat=function(dir){if(nevoV406Fx.menuOpen)return v406FxBrowseStep(dir);const r=v406AdjustBeat(dir);v406RefreshFxBrowse();return r};

// Keep old on-screen cycling behavior available for the single generic mapping,
// but make the actual screen control explicit with 3 positions.
const v406RefreshFxBase=v34RefreshFx;
v34RefreshFx=function(){const r=v406RefreshFxBase();v406RefreshChannelSegments();v406RefreshFxBrowse();return r};

function v406BindFxUi(){
  document.querySelectorAll('#flxFxChannel [data-fx-channel]').forEach(btn=>{
    if(btn.dataset.v406Bound)return;btn.dataset.v406Bound='1';
    btn.addEventListener('click',e=>{if(flxState.learn)return;e.preventDefault();e.stopPropagation();v406SetFxChannel(btn.dataset.fxChannel)});
  });
  // Clicking an item with the mouse/touch is still a quick direct selection.
  document.querySelectorAll('#flxFxMenu [data-fx-name]').forEach(btn=>{
    btn.addEventListener('click',()=>{nevoV406Fx.menuOpen=false;setTimeout(v406RefreshFxBrowse,0)});
  });
  v406RefreshChannelSegments();v406RefreshFxBrowse();
}
v406BindFxUi();setTimeout(v406BindFxUi,350);
console.info('NÉVO v4.0.6: Beat FX channel 1/2/1&2 and FX browse/confirm workflow active');
