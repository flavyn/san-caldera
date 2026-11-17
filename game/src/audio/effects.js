/* Every sound is oscillator/noise synthesis; no recordings or media requests. */
H.sound = {
  ctx: null, master: null, engine: null, siren: null, nextNote: 0, beat: 0,
  start() {
    if (this.ctx) { this.ctx.resume(); return; }
    const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return;
    this.ctx = new Audio(); this.master = this.ctx.createGain(); this.master.gain.value = .18; this.master.connect(this.ctx.destination); this.engine = this.osc('sawtooth', 45, 0); this.siren = this.osc('sine', 720, 0);
  },
  osc(type, frequency, volume) { const o = this.ctx.createOscillator(), g = this.ctx.createGain(); o.type = type; o.frequency.value = frequency; g.gain.value = volume; o.connect(g); g.connect(this.master); o.start(); return { o, g }; },
  tone(f, duration, type = 'sine', volume = .2) { if (!this.ctx) return; const t = this.ctx.currentTime, a = this.osc(type, f, volume); a.g.gain.setValueAtTime(volume, t); a.g.gain.exponentialRampToValueAtTime(.001, t + duration); a.o.stop(t + duration + .02); },
  effect(type) {
    if (!this.ctx) return;
    if (type === 'unlock') { this.tone(660, .12); this.tone(880, .18); return; }
    const duration = type === 'shot' ? .13 : .24, buffer = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * duration), this.ctx.sampleRate), data = buffer.getChannelData(0), r = H.random(908);
    for (let i = 0; i < data.length; i++) data[i] = (r() * 2 - 1) * Math.exp(-i / data.length * 9);
    const node = this.ctx.createBufferSource(); node.buffer = buffer; node.connect(this.master); node.start(); this.tone(type === 'shot' ? 68 : 44, duration, 'triangle', .7);
  },
  update(s) {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(s.sound ? .18 : 0, t, .03); this.engine.g.gain.setTargetAtTime(s.player.car && s.mode === 'play' ? .15 : 0, t, .1); this.engine.o.frequency.setTargetAtTime(40 + Math.abs(s.player.car?.speed || 0) * 3, t, .06);
    this.siren.g.gain.setTargetAtTime(s.wanted && s.mode === 'play' ? .1 : 0, t, .1); this.siren.o.frequency.setTargetAtTime(740 + Math.sin(s.time * 5) * 260, t, .06);
    if (t >= this.nextNote) { this.nextNote = t + .3; const notes = [110, 0, 164.81, 220, 130.81, 0, 196, 164.81], note = notes[this.beat++ % notes.length]; if (note) this.tone(note, .28, 'triangle', .12); if (this.beat % 4 === 0) this.tone(55, .2, 'sine', .3); }
  },
};
