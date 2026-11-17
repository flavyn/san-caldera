H.updatePursuit = (s, dt) => {
  const p = s.player;
  if (s.wanted && s.police.filter(o => !o.retreat).length < s.wanted + 1) {
    const i = s.police.length, car = H.vehicle(p.x + (i % 2 ? -6 : 6), p.z + 48 + i * 7, '#e0e8df', Math.PI, 'police');
    car.speed = 13; s.cars.push(car); s.police.push({ x: car.x, z: car.z, car, color: '#223e51', skin: '#b98565', phase: 0, stun: 0, retreat: false });
    H.notify(s, 'DISPATCH  /  Units converging on your location');
  }
  for (const o of s.police) {
    o.stun = Math.max(0, o.stun - dt); if (o.stun) continue;
    const d = H.distance(o, p), sign = o.retreat ? -1 : 1;
    if (o.car && d > 14) { const c = o.car; c.yaw = Math.atan2(p.x - c.x, p.z - c.z); H.moveSolid(s, c, Math.sin(c.yaw) * dt * 12 * sign, Math.cos(c.yaw) * dt * 12 * sign, 1.5); o.x = c.x; o.z = c.z; }
    else {
      if (o.car) { o.car.speed = 0; o.x += 2.4; o.car = null; }
      if (d > 8) H.moveSolid(s, o, (p.x - o.x) / d * dt * 2.8 * sign, (p.z - o.z) / d * dt * 2.8 * sign);
      o.phase += dt * 6;
      if (!o.retreat && d < 30 && s.time - s.lastCrime > 1 && Math.floor(s.time * 2) !== Math.floor((s.time - dt) * 2)) { if (p.armour > 0) p.armour = Math.max(0, p.armour - 2); else p.health -= 1; s.particles.push({ x: o.x, z: o.z, y: 1.5, life: .1, type: 'flash' }); }
    }
  }
  if (p.health <= 0) { p.health = 100; p.armour = 25; p.money = Math.max(0, p.money - 200); p.x = -5; p.z = 6; p.car = null; s.heat = 0; s.wanted = 0; s.police = []; s.cars = s.cars.filter(c => c.type !== 'police'); H.notify(s, 'RECOVERED  /  Clinic charged $200', 6); }
};
