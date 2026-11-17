H.saveKey = slot => 'heatline.save.v1.' + slot;
H.readSlot = slot => { try { const d = JSON.parse(localStorage.getItem(H.saveKey(slot))); return d && d.version === 1 && Number.isFinite(d.player.x) && Number.isFinite(d.player.z) ? d : null; } catch { return null; } };
H.writeSlot = (s, slot) => {
  try { const p = { ...s.player }; delete p.car; const data = { version: 1, seed: s.seed, elapsed: s.elapsed, time: s.time, player: p, mission: { ...s.mission }, heat: s.heat, lastCrime: s.lastCrime, car: s.player.car ? { ...s.player.car } : null }; localStorage.setItem(H.saveKey(slot), JSON.stringify(data)); H.notify(s, 'SAVED TO SLOT ' + (slot + 1)); s.slot = slot; return true; }
  catch { H.notify(s, 'Storage unavailable. Enable local storage to save.', 8); return false; }
};
H.loadSlot = (s, slot) => {
  const d = H.readSlot(slot); if (!d) { H.notify(s, 'Empty slot. Start a new story.'); return false; }
  const next = H.newState(d.seed); H.spawnTraffic(next); H.spawnPedestrians(next); Object.assign(next, { time: d.time, elapsed: d.elapsed, player: { ...next.player, ...d.player, car: null }, mission: d.mission, heat: d.heat, lastCrime: d.lastCrime, mode: 'play', slot });
  if (d.car) { next.cars.push(d.car); next.player.car = d.car; }
  Object.assign(s, next); s.wanted=Math.ceil(s.heat/30); H.updateCamera(s, 0, true); H.notify(s, 'SLOT ' + (slot + 1) + ' LOADED'); return true;
};
H.drawTitle = (c, s) => {
  const g = c.createLinearGradient(0, 0, 1040, 0); g.addColorStop(0, 'rgba(8,31,37,.98)'); g.addColorStop(.58, 'rgba(8,31,37,.87)'); g.addColorStop(1, 'rgba(8,31,37,0)'); c.fillStyle = g; c.fillRect(0, 0, 1280, 720);
  c.fillStyle = '#eabd7b'; c.fillRect(52, 49, 44, 4); H.text(c, 'AN ORIGINAL OPEN-WORLD CRIME STORY', 108, 57, 11, '#d3dbc1', 700);
  H.text(c, 'HEATLINE', 43, 166, 103, '#f9ebca', 900); H.text(c, 'S A N   C A L D E R A', 53, 204, 22, '#f5bc77', 500);
  H.text(c, 'A bright city. A dirty ledger. Your way out.', 54, 247, 17, '#c1d0bf', 400);
  H.panel(c, 52, 279, 462, 43, .9); c.fillStyle = '#edb86d'; c.fillRect(52, 279, 4, 43); H.text(c, 'CONTINUE', 72, 307, 17, '#fff2d4', 800); H.text(c, 'ENTER', 491, 306, 11, '#b9cfbd', 700, 'right');
  H.text(c, 'NEW STORY', 72, 354, 16, '#ecdfc3', 700); H.text(c, 'N', 491, 354, 11, '#b9cfbd', 700, 'right');
  H.text(c, s.mode === 'pause' ? 'SAVE YOUR STORY  /  SELECT SLOT' : 'YOUR STORIES  /  THREE LOCAL SAVE SLOTS', 53, 398, 10, '#9dbaae', 700);
  const sample = s.shot === 'title' ? [{ player: { money: 3690, z: 20 }, elapsed: 1500 }, { player: { money: 2090, z: 180 }, elapsed: 804 }, { player: { money: 1240, z: 390 }, elapsed: 323 }] : null;
  for (let i = 0; i < 3; i++) {
    const slot = sample ? sample[i] : H.readSlot(i), y = 413 + i * 64;
    H.panel(c, 52, y, 462, 55, i === s.slot ? .96 : .65); c.strokeStyle = i === s.slot ? '#e8b876' : '#395b59'; c.strokeRect(52, y, 462, 55);
    H.text(c, '0' + (i + 1), 67, y + 34, 22, i === s.slot ? '#f4c581' : '#74988f', 700); H.text(c, slot ? H.district(slot.player.z) : 'EMPTY STORY', 112, y + 22, 11, '#e4e1c4', 700);
    const seconds = slot ? Math.floor(slot.elapsed) : 0, clock = Math.floor(seconds / 3600).toString().padStart(2, '0') + ':' + Math.floor(seconds / 60 % 60).toString().padStart(2, '0');
    H.text(c, slot ? clock + ' PLAYED  /  $' + slot.player.money.toLocaleString('en-US') : 'START NEW GAME TO BEGIN', 112, y + 41, 10, '#9cb8a8'); H.text(c, '' + (i + 1), 493, y + 33, 11, '#ebc284', 700, 'right');
  }
  H.chip(c, '1–3', 'SELECT SLOT', 54, 641); H.chip(c, 'F', 'SAVE', 229, 641); H.chip(c, 'L', 'LOAD', 354, 641);
  H.text(c, 'WASD MOVE   /   E ENTER + STEAL   /   M CONTRACT   /   CLICK FIRE', 54, 681, 10, '#9eb4a4', 500);
  H.text(c, 'SOLANA DOWNTOWN', 1230, 658, 14, '#fff0cf', 800, 'right'); H.text(c, 'GOLDEN HOUR  /  17:42', 1230, 679, 10, '#f1bc7e', 600, 'right'); H.text(c, 'BUILT OFFLINE. MADE ORIGINAL.', 1230, 42, 10, '#f3e1bd', 700, 'right');
};
