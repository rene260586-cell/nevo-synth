const $ = (s) => document.querySelector(s);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const lerpExp = (a, b, t) => a * Math.pow(b / a, t);

const params = {
  volume:     { label:'VOLUME', color:'green',  min:0, max:1, value:.78, def:.78, step:.01, fmt:v=>Math.round(v*100)+'%' },
  cutoff:     { label:'CUTOFF', color:'cyan',   min:80, max:18000, value:6200, def:6200, step:1, curve:'log', fmt:v=>v>=1000?(v/1000).toFixed(2)+' kHz':Math.round(v)+' Hz' },
  resonance:  { label:'RESONANCE', color:'cyan', min:.1, max:18, value:2.7, def:2.7, step:.1, fmt:v=>v.toFixed(1) },
  attack:     { label:'ATTACK', color:'orange', min:.002, max:2, value:.012, def:.012, step:.001, curve:'log', fmt:v=>v<1?Math.round(v*1000)+' ms':v.toFixed(2)+' s' },
  decay:      { label:'DECAY', color:'orange', min:.01, max:2, value:.21, def:.21, step:.01, curve:'log', fmt:v=>v<1?Math.round(v*1000)+' ms':v.toFixed(2)+' s' },
  sustain:    { label:'SUSTAIN', color:'orange', min:0, max:1, value:.66, def:.66, step:.01, fmt:v=>Math.round(v*100)+'%' },
  release:    { label:'RELEASE', color:'purple', min:.02, max:4, value:.56, def:.56, step:.01, curve:'log', fmt:v=>v<1?Math.round(v*1000)+' ms':v.toFixed(2)+' s' },
  drive:      { label:'DRIVE', color:'green',  min:0, max:1, value:.19, def:.19, step:.01, fmt:v=>Math.round(v*100)+'%' },
  delay:      { label:'DELAY', color:'purple', min:0, max:.75, value:.19, def:.19, step:.01, fmt:v=>Math.round(v*100)+'%' },
  delayTime:  { label:'DELAY TIME', color:'purple', min:.04, max:.7, value:.24, def:.24, step:.01, fmt:v=>Math.round(v*1000)+' ms' },
  reverb:     { label:'REVERB', color:'purple', min:0, max:.75, value:.18, def:.18, step:.01, fmt:v=>Math.round(v*100)+'%' },
  width:      { label:'DETUNE', color:'cyan',  min:0, max:28, value:9, def:9, step:1, fmt:v=>Math.round(v)+' ct' }
};

const macros = {
  punch:   { label:'PUNCH',   color:'orange', min:0, max:100, value:58, def:58, step:1, fmt:v=>Math.round(v)+'%' },
  tone:    { label:'TONE',    color:'cyan',   min:0, max:100, value:64, def:64, step:1, fmt:v=>Math.round(v)+'%' },
  space:   { label:'SPACE',   color:'purple', min:0, max:100, value:32, def:32, step:1, fmt:v=>Math.round(v)+'%' },
  shimmer: { label:'SHIMMER', color:'green',  min:0, max:100, value:44, def:44, step:1, fmt:v=>Math.round(v)+'%' }
};

let ctx, master, filter, driveNode, dryGain, delay, delayFeedback, delayWet, convolver, reverbWet, mediaDest, analyser, hatNoiseBuffer;
let voices = new Map();
let audioReady = false;
let isPlaying = false;
let seqTimer = null, stepIndex = 0, nextStepTime = 0;
let recorder = null, recChunks = [];
let meterRAF = null;

const synthPattern = Array(16).fill(false);
const kickPattern = Array(16).fill(false);
const hatPattern = Array(16).fill(false);

function setStatus(on, text, sub=''){
  $('#statusDot').classList.toggle('on', on);
  $('#statusText').textContent = text;
  $('#statusSub').textContent = sub;
}

function makeImpulse(seconds = 1.9, decay = 2.8){
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(2, len, rate);
  for(let c=0;c<2;c++){
    const d = buffer.getChannelData(c);
    for(let i=0;i<len;i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, decay);
  }
  return buffer;
}

function distortionCurve(amount){
  const n = 44100, curve = new Float32Array(n), k = amount * 180 + 1;
  for(let i=0;i<n;i++){
    const x = i * 2 / n - 1;
    curve[i] = ((3+k)*x*20*Math.PI/180)/(Math.PI+k*Math.abs(x));
  }
  return curve;
}

function createHatNoiseBuffer(audioCtx){
  const length = Math.floor(audioCtx.sampleRate * 0.14);
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<length;i++) data[i] = (Math.random()*2-1);
  return buffer;
}

function valueToNorm(p){
  return p.curve === 'log'
    ? Math.log(p.value / p.min) / Math.log(p.max / p.min)
    : (p.value - p.min) / (p.max - p.min);
}

function normToValue(p, n){
  let v = p.curve === 'log'
    ? p.min * Math.pow(p.max / p.min, n)
    : p.min + (p.max - p.min) * n;
  return Math.round(v / p.step) * p.step;
}

function applyMacros(){
  const punch = macros.punch.value / 100;
  const tone = macros.tone.value / 100;
  const space = macros.space.value / 100;
  const shimmer = macros.shimmer.value / 100;

  params.volume.value    = clamp(lerp(.66, .96, punch * .65 + shimmer * .15), params.volume.min, params.volume.max);
  params.drive.value     = clamp(lerp(.04, .52, punch), params.drive.min, params.drive.max);
  params.attack.value    = clamp(lerpExp(.06, .0025, punch), params.attack.min, params.attack.max);
  params.decay.value     = clamp(lerp(.3, .11, punch), params.decay.min, params.decay.max);

  params.cutoff.value    = clamp(lerpExp(500, 18000, tone), params.cutoff.min, params.cutoff.max);
  params.resonance.value = clamp(lerp(.9, 7.2, tone), params.resonance.min, params.resonance.max);

  params.delay.value     = clamp(lerp(.04, .44, space), params.delay.min, params.delay.max);
  params.delayTime.value = clamp(lerp(.12, .34, space), params.delayTime.min, params.delayTime.max);
  params.reverb.value    = clamp(lerp(.04, .54, space), params.reverb.min, params.reverb.max);
  params.release.value   = clamp(lerp(.18, 1.65, space), params.release.min, params.release.max);

  params.width.value     = clamp(lerp(0, 26, shimmer), params.width.min, params.width.max);
  params.sustain.value   = clamp(lerp(.34, .86, shimmer), params.sustain.min, params.sustain.max);

  Object.values(params).forEach(p => p.render?.());
  updateAudioParams();
}

function bindKnobBehavior(el, param, onChange){
  let startY, startN, longTimer, moved = false;

  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    startY = e.clientY;
    startN = valueToNorm(param);
    moved = false;
    longTimer = setTimeout(() => {
      if(!moved){
        const x = prompt(`${param.label}: Wert zwischen ${param.min} und ${param.max}`, String(param.value));
        if(x !== null && !isNaN(Number(x))){
          param.value = clamp(Number(x), param.min, param.max);
          param.render?.();
          onChange?.();
        }
      }
    }, 650);
  });

  el.addEventListener('pointermove', e => {
    if(startY === undefined) return;
    const dy = startY - e.clientY;
    if(Math.abs(dy) > 4) moved = true;
    clearTimeout(longTimer);
    param.value = normToValue(param, clamp(startN + dy / 220, 0, 1));
    param.render?.();
    onChange?.();
  });

  const end = () => { clearTimeout(longTimer); startY = undefined; };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('dblclick', () => { param.value = param.def; param.render?.(); onChange?.(); });
  el.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowRight'){
      param.value = clamp(param.value + param.step, param.min, param.max); param.render?.(); onChange?.(); e.preventDefault();
    }
    if(e.key === 'ArrowDown' || e.key === 'ArrowLeft'){
      param.value = clamp(param.value - param.step, param.min, param.max); param.render?.(); onChange?.(); e.preventDefault();
    }
  });
}

function buildKnobCard(target, key, param, changeHandler, subLabel = 'ziehen ↑ ↓'){
  const card = document.createElement('div');
  card.className = target.id === 'macroGrid' ? 'macro-card' : 'knob-card';
  card.dataset.color = param.color || 'cyan';
  card.innerHTML = `
    <div class="knob-label">${param.label}</div>
    <div class="knob" data-key="${key}" tabindex="0" role="slider"></div>
    <div class="knob-value"></div>
    <div class="knob-sub">${subLabel}</div>
  `;
  target.appendChild(card);
  const knob = card.querySelector('.knob');
  const val = card.querySelector('.knob-value');
  const ringColor = getComputedStyle(document.documentElement).getPropertyValue(`--${param.color || 'cyan'}`).trim() || '#4bc9ff';
  knob.style.setProperty('--ring-color', ringColor);

  param.render = () => {
    const n = clamp(valueToNorm(param), 0, 1);
    knob.style.setProperty('--fill', `${n * 270}deg`);
    knob.style.setProperty('--angle', `${-135 + n * 270}deg`);
    val.textContent = param.fmt(param.value);
    knob.setAttribute('aria-valuenow', param.value);
  };

  bindKnobBehavior(knob, param, changeHandler);
  param.render();
}

function buildKnobs(){
  const grid = $('#knobGrid');
  grid.innerHTML = '';
  Object.entries(params).forEach(([key, p]) => buildKnobCard(grid, key, p, updateAudioParams));
}

function buildMacros(){
  const grid = $('#macroGrid');
  grid.innerHTML = '';
  Object.entries(macros).forEach(([key, p]) => buildKnobCard(grid, key, p, applyMacros, 'macro')); 
  applyMacros();
}

const noteMap = {C:-9,'C#':-8,D:-7,'D#':-6,E:-5,F:-4,'F#':-3,G:-2,'G#':-1,A:0,'A#':1,B:2};
function noteFreq(note){
  const m = note.match(/^([A-G]#?)(-?\d)$/);
  const semi = noteMap[m[1]] + (Number(m[2]) - 4) * 12;
  return 440 * Math.pow(2, semi / 12);
}

async function initAudio(){
  if(!ctx){
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
    driveNode = ctx.createWaveShaper(); driveNode.oversample = '4x';
    dryGain = ctx.createGain();
    delay = ctx.createDelay(1.2);
    delayFeedback = ctx.createGain();
    delayWet = ctx.createGain();
    convolver = ctx.createConvolver(); convolver.buffer = makeImpulse();
    reverbWet = ctx.createGain();
    mediaDest = ctx.createMediaStreamDestination();
    analyser = ctx.createAnalyser(); analyser.fftSize = 256;
    hatNoiseBuffer = createHatNoiseBuffer(ctx);

    filter.connect(driveNode);
    driveNode.connect(dryGain); dryGain.connect(master);
    driveNode.connect(delay); delay.connect(delayWet); delayWet.connect(master); delay.connect(delayFeedback); delayFeedback.connect(delay);
    driveNode.connect(convolver); convolver.connect(reverbWet); reverbWet.connect(master);

    master.connect(ctx.destination);
    master.connect(mediaDest);
    master.connect(analyser);

    updateAudioParams();
    startMeter();
  }
  await ctx.resume();
  audioReady = true;
  setStatus(true, 'Audio aktiv', 'Du kannst jetzt spielen oder den Loop starten.');
  $('#audioBtn').textContent = 'AUDIO ON';
  $('#audioBtn').classList.add('ready');
}

function updateAudioParams(){
  if(!ctx) return;
  master.gain.setTargetAtTime(params.volume.value, ctx.currentTime, .01);
  filter.frequency.setTargetAtTime(params.cutoff.value, ctx.currentTime, .01);
  filter.Q.setTargetAtTime(params.resonance.value, ctx.currentTime, .01);
  driveNode.curve = distortionCurve(params.drive.value);
  delay.delayTime.setTargetAtTime(params.delayTime.value, ctx.currentTime, .01);
  delayFeedback.gain.setTargetAtTime(.34, ctx.currentTime, .01);
  delayWet.gain.setTargetAtTime(params.delay.value, ctx.currentTime, .01);
  reverbWet.gain.setTargetAtTime(params.reverb.value, ctx.currentTime, .01);
}

function startVoice(note, when = 0, duration = null, destination = filter){
  if(!ctx) return;
  const t = when || ctx.currentTime;
  const freq = noteFreq(note);
  const gain = ctx.createGain();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = $('#waveform').value;
  osc2.type = $('#waveform').value;
  osc1.frequency.value = freq;
  osc2.frequency.value = freq;
  osc1.detune.value = -params.width.value;
  osc2.detune.value = params.width.value;
  osc1.connect(gain); osc2.connect(gain); gain.connect(destination);

  const a = params.attack.value, d = params.decay.value, s = params.sustain.value, r = params.release.value;
  gain.gain.setValueAtTime(.0001, t);
  gain.gain.exponentialRampToValueAtTime(.44, t + a);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0001, .44 * s), t + a + d);
  osc1.start(t); osc2.start(t);

  const voice = {note, gain, osc1, osc2};
  if(duration != null){
    const off = t + Math.max(duration, a + d + .02);
    gain.gain.cancelScheduledValues(off);
    gain.gain.setValueAtTime(Math.max(.0001, .44 * s), off);
    gain.gain.exponentialRampToValueAtTime(.0001, off + r);
    osc1.stop(off + r + .03);
    osc2.stop(off + r + .03);
  } else {
    if(!voices.has(note)) voices.set(note, []);
    voices.get(note).push(voice);
  }
  return voice;
}

function stopVoice(note){
  if(!ctx || !voices.has(note)) return;
  const list = voices.get(note);
  const t = ctx.currentTime, r = params.release.value;
  list.forEach(v => {
    const g = v.gain.gain;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(.0001, t, Math.max(.005, r / 5));
    v.osc1.stop(t + r + .08);
    v.osc2.stop(t + r + .08);
  });
  voices.delete(note);
}

function kick(when = 0, destination = filter){
  if(!ctx) return;
  const t = when || ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine'; o.connect(g); g.connect(destination);
  o.frequency.setValueAtTime(155, t);
  o.frequency.exponentialRampToValueAtTime(45, t + .16);
  g.gain.setValueAtTime(.88, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .28);
  o.start(t); o.stop(t + .3);
}

function hat(when = 0, destination = filter){
  if(!ctx || !hatNoiseBuffer) return;
  const t = when || ctx.currentTime;
  const src = ctx.createBufferSource();
  const hp = ctx.createBiquadFilter();
  const bp = ctx.createBiquadFilter();
  const g = ctx.createGain();
  src.buffer = hatNoiseBuffer;
  hp.type = 'highpass'; hp.frequency.value = 6500;
  bp.type = 'bandpass'; bp.frequency.value = 8800; bp.Q.value = .8;
  g.gain.setValueAtTime(.24, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .075);
  src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(destination);
  src.start(t); src.stop(t + .09);
}

const keyboardNotes = ['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5'];
function buildKeyboard(){
  const kb = $('#keyboard');
  kb.innerHTML = '';
  const whites = keyboardNotes.filter(n => !n.includes('#'));
  whites.forEach(n => {
    const el = document.createElement('div');
    el.className = 'key';
    el.dataset.note = n;
    el.textContent = n;
    kb.appendChild(el);
  });
  const whiteWidth = 100 / whites.length;
  let wi = 0;
  keyboardNotes.forEach(n => {
    if(!n.includes('#')){ wi++; return; }
    const el = document.createElement('div');
    el.className = 'key black';
    el.dataset.note = n;
    el.textContent = n;
    el.style.left = `calc(${wi * whiteWidth}% - 22px)`;
    kb.appendChild(el);
  });
  kb.querySelectorAll('.key').forEach(el => {
    const down = async e => { e.preventDefault(); await initAudio(); if(!el.classList.contains('active')){ el.classList.add('active'); startVoice(el.dataset.note); } };
    const up = e => { e.preventDefault(); el.classList.remove('active'); stopVoice(el.dataset.note); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', e => { if(e.buttons) up(e); });
  });
}

const keyBind = {a:'C3',w:'C#3',s:'D3',e:'D#3',d:'E3',f:'F3',t:'F#3',g:'G3',y:'G#3',h:'A3',u:'A#3',j:'B3',k:'C4'};
const pressed = new Set();
window.addEventListener('keydown', async e => {
  if(e.repeat || !keyBind[e.key.toLowerCase()] || ['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)) return;
  await initAudio();
  const n = keyBind[e.key.toLowerCase()];
  pressed.add(e.key.toLowerCase());
  startVoice(n);
  document.querySelector(`.key[data-note="${n}"]`)?.classList.add('active');
});
window.addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if(!pressed.has(k)) return;
  pressed.delete(k);
  const n = keyBind[k];
  stopVoice(n);
  document.querySelector(`.key[data-note="${n}"]`)?.classList.remove('active');
});

function buildSteps(){
  [['synthSteps', synthPattern], ['kickSteps', kickPattern], ['hatSteps', hatPattern]].forEach(([id, arr]) => {
    const el = $('#' + id);
    el.innerHTML = '';
    arr.forEach((on, i) => {
      const b = document.createElement('button');
      b.className = 'step' + (on ? ' on' : '');
      b.textContent = i + 1;
      b.onclick = () => { arr[i] = !arr[i]; b.classList.toggle('on', arr[i]); };
      el.appendChild(b);
    });
  });
}

function secondsPerStep(){ return 60 / Number($('#bpm').value) / 4; }
function swingAmount(){ return Number($('#swing').value) / 100; }
function swingOffsetForStep(i){ return i % 2 ? secondsPerStep() * swingAmount() * .5 : 0; }

function markPlayingStep(i, time){
  const wait = Math.max(0, (time - ctx.currentTime) * 1000);
  setTimeout(() => {
    document.querySelectorAll('.step').forEach(x => x.classList.remove('playing'));
    document.querySelectorAll('.steps').forEach(r => r.children[i]?.classList.add('playing'));
  }, wait);
}

function scheduleStep(i, baseTime){
  const t = baseTime + swingOffsetForStep(i);
  if(synthPattern[i]) startVoice($('#rootNote').value, t, secondsPerStep() * .72);
  if(kickPattern[i]) kick(t);
  if(hatPattern[i]) hat(t);
  markPlayingStep(i, t);
}

function scheduler(){
  while(nextStepTime < ctx.currentTime + .12){
    scheduleStep(stepIndex, nextStepTime);
    nextStepTime += secondsPerStep();
    stepIndex = (stepIndex + 1) % 16;
  }
}

async function play(){
  await initAudio();
  if(isPlaying) return;
  isPlaying = true;
  stepIndex = 0;
  nextStepTime = ctx.currentTime + .05;
  scheduler();
  seqTimer = setInterval(scheduler, 25);
  $('#playBtn').classList.add('primary');
  setStatus(true, 'Loop läuft', `${$('#bpm').value} BPM · Swing ${$('#swing').value}%`);
}

function stop(){
  isPlaying = false;
  clearInterval(seqTimer);
  seqTimer = null;
  document.querySelectorAll('.step').forEach(x => x.classList.remove('playing'));
  $('#playBtn').classList.remove('primary');
  if(audioReady) setStatus(true, 'Audio aktiv', 'Loop gestoppt.');
}

function projectData(){
  return {
    version: 2,
    bpm: Number($('#bpm').value),
    waveform: $('#waveform').value,
    rootNote: $('#rootNote').value,
    swing: Number($('#swing').value),
    params: Object.fromEntries(Object.entries(params).map(([k,p]) => [k, p.value])),
    macros: Object.fromEntries(Object.entries(macros).map(([k,p]) => [k, p.value])),
    synthPattern: [...synthPattern],
    kickPattern: [...kickPattern],
    hatPattern: [...hatPattern]
  };
}

function applyProject(d){
  if(!d) return;
  $('#bpm').value = d.bpm || 150;
  $('#waveform').value = d.waveform || 'sawtooth';
  $('#rootNote').value = d.rootNote || 'C3';
  $('#swing').value = d.swing ?? 18;
  $('#swingValue').textContent = `${$('#swing').value}%`;

  if(d.macros){
    Object.entries(d.macros).forEach(([k,v]) => {
      if(macros[k]){ macros[k].value = clamp(Number(v), macros[k].min, macros[k].max); macros[k].render?.(); }
    });
    applyMacros();
  }

  if(d.params){
    Object.entries(d.params).forEach(([k,v]) => {
      if(params[k]){ params[k].value = clamp(Number(v), params[k].min, params[k].max); params[k].render?.(); }
    });
    updateAudioParams();
  }

  if(Array.isArray(d.synthPattern)) d.synthPattern.slice(0,16).forEach((v,i)=> synthPattern[i] = !!v);
  if(Array.isArray(d.kickPattern)) d.kickPattern.slice(0,16).forEach((v,i)=> kickPattern[i] = !!v);
  if(Array.isArray(d.hatPattern)) d.hatPattern.slice(0,16).forEach((v,i)=> hatPattern[i] = !!v);
  buildSteps();
}

function downloadBlob(blob, name){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1200);
}

async function toggleRecord(){
  await initAudio();
  if(!recorder || recorder.state === 'inactive'){
    recChunks = [];
    recorder = new MediaRecorder(mediaDest.stream);
    recorder.ondataavailable = e => { if(e.data.size) recChunks.push(e.data); };
    recorder.onstop = () => downloadBlob(new Blob(recChunks, {type: recorder.mimeType}), 'NEVO-recording.webm');
    recorder.start();
    $('#recBtn').classList.add('active');
    $('#recBtn').textContent = '■ STOP REC';
    setStatus(true, 'Aufnahme läuft', 'Master-Ausgang wird aufgenommen.');
  } else {
    recorder.stop();
    $('#recBtn').classList.remove('active');
    $('#recBtn').textContent = '● REC';
    setStatus(true, 'Aufnahme gespeichert', 'Browser lädt die Aufnahme als Datei.');
  }
}

function encodeWav(buffer){
  const nCh = buffer.numberOfChannels, rate = buffer.sampleRate, len = buffer.length * nCh * 2 + 44;
  const ab = new ArrayBuffer(len), view = new DataView(ab);
  let p = 0;
  const str = s => { for(let i=0;i<s.length;i++) view.setUint8(p++, s.charCodeAt(i)); };
  const u16 = v => { view.setUint16(p, v, true); p += 2; };
  const u32 = v => { view.setUint32(p, v, true); p += 4; };
  str('RIFF'); u32(len - 8); str('WAVE'); str('fmt '); u32(16); u16(1); u16(nCh); u32(rate); u32(rate * nCh * 2); u16(nCh * 2); u16(16); str('data'); u32(len - 44);
  const chans = [];
  for(let c=0;c<nCh;c++) chans.push(buffer.getChannelData(c));
  for(let i=0;i<buffer.length;i++) for(let c=0;c<nCh;c++){
    let s = clamp(chans[c][i], -1, 1);
    view.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    p += 2;
  }
  return ab;
}

async function exportWav(){
  const bpm = Number($('#bpm').value);
  const stepDur = 60 / bpm / 4;
  const total = stepDur * 16 + 2.6;
  const sr = 44100;
  const off = new OfflineAudioContext(2, Math.ceil(total * sr), sr);

  const out = off.createGain();
  const filt = off.createBiquadFilter();
  const shaper = off.createWaveShaper();
  const del = off.createDelay(1.2);
  const delWet = off.createGain();
  const delFb = off.createGain();
  const conv = off.createConvolver();
  const revWet = off.createGain();

  filt.type = 'lowpass';
  filt.frequency.value = params.cutoff.value;
  filt.Q.value = params.resonance.value;
  shaper.curve = distortionCurve(params.drive.value);
  out.gain.value = params.volume.value;
  del.delayTime.value = params.delayTime.value;
  delWet.gain.value = params.delay.value;
  delFb.gain.value = .34;
  conv.buffer = (() => {
    const rate = sr, len = Math.floor(rate * 1.9), buffer = off.createBuffer(2, len, rate);
    for(let c=0;c<2;c++){
      const d = buffer.getChannelData(c);
      for(let i=0;i<len;i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 2.8);
    }
    return buffer;
  })();
  revWet.gain.value = params.reverb.value;

  filt.connect(shaper);
  shaper.connect(out);
  shaper.connect(del); del.connect(delWet); delWet.connect(out); del.connect(delFb); delFb.connect(del);
  shaper.connect(conv); conv.connect(revWet); revWet.connect(out);
  out.connect(off.destination);

  const schedSynth = (note, t, dur) => {
    const f = noteFreq(note), g = off.createGain(), o1 = off.createOscillator(), o2 = off.createOscillator();
    o1.type = $('#waveform').value; o2.type = o1.type;
    o1.frequency.value = f; o2.frequency.value = f;
    o1.detune.value = -params.width.value; o2.detune.value = params.width.value;
    o1.connect(g); o2.connect(g); g.connect(filt);
    const a = params.attack.value, de = params.decay.value, s = params.sustain.value, r = params.release.value;
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(.44, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(.0001, .44 * s), t + a + de);
    const offT = t + dur;
    g.gain.setValueAtTime(Math.max(.0001, .44 * s), offT);
    g.gain.exponentialRampToValueAtTime(.0001, offT + r);
    o1.start(t); o2.start(t); o1.stop(offT + r + .03); o2.stop(offT + r + .03);
  };

  const schedKick = t => {
    const o = off.createOscillator(), g = off.createGain();
    o.type = 'sine'; o.connect(g); g.connect(filt);
    o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(45, t + .16);
    g.gain.setValueAtTime(.88, t); g.gain.exponentialRampToValueAtTime(.0001, t + .28);
    o.start(t); o.stop(t + .3);
  };

  const schedHat = t => {
    const length = Math.floor(sr * .14), buffer = off.createBuffer(1, length, sr), data = buffer.getChannelData(0);
    for(let i=0;i<length;i++) data[i] = Math.random() * 2 - 1;
    const src = off.createBufferSource(), hp = off.createBiquadFilter(), bp = off.createBiquadFilter(), g = off.createGain();
    src.buffer = buffer; hp.type = 'highpass'; hp.frequency.value = 6500; bp.type = 'bandpass'; bp.frequency.value = 8800; bp.Q.value = .8;
    g.gain.setValueAtTime(.24, t); g.gain.exponentialRampToValueAtTime(.0001, t + .075);
    src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(filt); src.start(t); src.stop(t + .09);
  };

  for(let i=0;i<16;i++){
    const t = .05 + i * stepDur + (i % 2 ? stepDur * (Number($('#swing').value)/100) * .5 : 0);
    if(synthPattern[i]) schedSynth($('#rootNote').value, t, stepDur * .72);
    if(kickPattern[i]) schedKick(t);
    if(hatPattern[i]) schedHat(t);
  }

  setStatus(true, 'WAV wird gerendert', 'Einen Moment …');
  const rendered = await off.startRendering();
  downloadBlob(new Blob([encodeWav(rendered)], {type:'audio/wav'}), 'NEVO-loop.wav');
  setStatus(true, 'WAV fertig', '16-Step-Loop wurde exportiert.');
}

function startMeter(){
  if(!analyser || meterRAF) return;
  const data = new Uint8Array(analyser.fftSize);
  const fill = $('#masterMeterFill');
  const label = $('#meterLabel');

  const tick = () => {
    if(analyser){
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for(let i=0;i<data.length;i++) peak = Math.max(peak, Math.abs(data[i] - 128) / 128);
      const db = peak > 0 ? 20 * Math.log10(peak) : -Infinity;
      const pct = clamp(peak * 130, 0, 100);
      fill.style.width = pct + '%';
      label.textContent = Number.isFinite(db) ? `${db.toFixed(1)} dB` : '-∞ dB';
    }
    meterRAF = requestAnimationFrame(tick);
  };
  tick();
}

$('#audioBtn').onclick = initAudio;
$('#playBtn').onclick = play;
$('#stopBtn').onclick = stop;
$('#recBtn').onclick = toggleRecord;
$('#exportBtn').onclick = exportWav;
$('#saveBtn').onclick = () => { localStorage.setItem('nevoSynthProject', JSON.stringify(projectData())); setStatus(audioReady, 'Projekt gespeichert', 'Im Browser gespeichert.'); };
$('#loadBtn').onclick = () => {
  const d = localStorage.getItem('nevoSynthProject');
  if(d){ applyProject(JSON.parse(d)); setStatus(audioReady, 'Projekt geladen', 'Browser-Speicher wurde geladen.'); }
  else alert('Noch kein gespeichertes Projekt gefunden.');
};
$('#downloadProjectBtn').onclick = () => downloadBlob(new Blob([JSON.stringify(projectData(), null, 2)], {type:'application/json'}), 'NEVO-project.json');
$('#importProject').onchange = async e => {
  const f = e.target.files[0]; if(!f) return;
  try{ applyProject(JSON.parse(await f.text())); setStatus(audioReady, 'Projekt importiert', f.name); }
  catch{ alert('Ungültige Projektdatei.'); }
};
$('#clearSeq').onclick = () => { synthPattern.fill(false); kickPattern.fill(false); hatPattern.fill(false); buildSteps(); };
$('#fillSeq').onclick = () => {
  synthPattern.fill(false); kickPattern.fill(false); hatPattern.fill(false);
  [0,3,6,10,12,14].forEach(i => synthPattern[i] = true);
  [0,4,8,12].forEach(i => kickPattern[i] = true);
  [2,6,10,14].forEach(i => hatPattern[i] = true);
  [5,7,13,15].forEach(i => hatPattern[i] = true);
  $('#swing').value = 22; $('#swingValue').textContent = '22%';
  buildSteps();
};
$('#bpm').onchange = () => { $('#bpm').value = clamp(Number($('#bpm').value) || 150, 60, 220); };
$('#swing').oninput = () => { $('#swingValue').textContent = `${$('#swing').value}%`; if(isPlaying) setStatus(true, 'Loop läuft', `${$('#bpm').value} BPM · Swing ${$('#swing').value}%`); };

buildMacros();
buildKnobs();
buildKeyboard();
buildSteps();

// --- PWA install support ---
let deferredInstallPrompt = null;
const installBtn = document.querySelector('#installBtn');
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

function refreshInstallButton(){
  if(!installBtn) return;
  if(isStandalone()){
    installBtn.textContent = '✓ INSTALLIERT';
    installBtn.classList.add('installed');
    installBtn.classList.remove('ready');
    installBtn.disabled = true;
    return;
  }
  if(deferredInstallPrompt){
    installBtn.textContent = '⬇ INSTALLIEREN';
    installBtn.classList.add('ready');
  } else if(location.protocol === 'file:'){
    installBtn.textContent = 'INSTALL INFO';
    installBtn.classList.remove('ready');
  } else {
    installBtn.textContent = 'APP INSTALL';
    installBtn.classList.remove('ready');
  }
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  refreshInstallButton();
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  refreshInstallButton();
  setStatus(audioReady, 'App installiert', 'NÉVO Synth Lab ist jetzt als App verfügbar.');
});
if(installBtn){
  installBtn.addEventListener('click', async () => {
    if(isStandalone()) return;
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      refreshInstallButton();
      return;
    }
    if(location.protocol === 'file:'){
      alert('Für eine echte Installation muss die PWA einmal über HTTPS geöffnet werden. Lade den PWA-Ordner z. B. auf GitHub Pages. Danach erscheint im Browser „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.');
    } else {
      alert('Falls kein Installationsfenster erscheint: Browser-Menü öffnen und „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.');
    }
  });
}
refreshInstallButton();
