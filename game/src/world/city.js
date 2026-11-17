/* Original, seeded coastal city plan. World distances are metres. */
'use strict';
window.H = {};
H.clamp = (n, a, b) => Math.max(a, Math.min(b, n));
H.distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
H.random = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
H.district = z => z < 110 ? 'SOLANA DOWNTOWN' : z < 310 ? 'AZURE COAST' : 'COPPER HARBOR';
H.makeCity = seed => {
  const rand = H.random(seed), buildings = [], palms = [], props = [];
  const colors = ['#e4c2a0', '#ebd7b4', '#8eada9', '#d1a38b', '#ced4bb', '#a9b8b2'];
  for (let row = -2; row < 10; row++) for (let col = -2; col < 3; col++) {
    const x = col * 60, z = row * 80;
    if (x >= 120) continue;
    for (let side = 0; side < 2; side++) {
      const w = 12 + rand() * 3, d = 19 + rand() * 10;
      buildings.push({ x: x + 16 + side * 19, z: z + 17, w, d, h: 9 + rand() * (row === 0 ? 9 : row < 2 ? 32 : 17), color: colors[Math.floor(rand() * colors.length)], sign: ['CALDERA', 'SOL / HOTEL', 'NACRE', 'LIDO', 'MARÉ', 'ARCO'][Math.floor(rand() * 6)], style: Math.floor(rand() * 3) });
      buildings.push({ x: x + 16 + side * 19, z: z + 51, w, d: 14, h: 8 + rand() * 26, color: colors[Math.floor(rand() * colors.length)], sign: 'MERCADO', style: 1 });
    }
  }
  for (let z = -130; z < 740; z += 23) for (const x of [-12.8, 12.8, 72.8, 127]) palms.push({ x, z, h: 8 + rand() * 3, bend: rand() * 1.1 });
  for (let z = -100; z < 700; z += 40) for (const x of [-11.7, 11.7]) props.push({ x, z, type: 'lamp' });
  return { buildings, palms, props, bounds: { minX: -135, maxX: 130, minZ: -125, maxZ: 710 } };
};
H.newState = seed => ({ seed, time: 0, ticks: 0, mode: 'title', shot: '', city: H.makeCity(seed), player: { x: -5, z: 6, yaw: 0, health: 100, armour: 75, money: 1240, ammo: 72, magazine: 12, car: null, aiming: false, fireAt: -99, reload: 0 }, cars: [], peds: [], police: [], particles: [], heat: 0, wanted: 0, lastCrime: -99, mission: { index: 0, stage: 0, active: false, timer: 0, shots: 0 }, dialogue: null, message: 'Welcome to San Caldera', messageUntil: 7, sound: true, elapsed: 0, selection: 0, slot: 0, camera: null });
H.notify = (s, text, duration = 4) => { s.message = text; s.messageUntil = s.time + duration; };
