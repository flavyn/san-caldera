H.enterOrExit = s => {
  const p = s.player;
  if (p.car) {
    const c = p.car, x = c.x - Math.cos(c.yaw) * 2.8, z = c.z + Math.sin(c.yaw) * 2.8;
    if (H.isSolid(s, x, z)) return H.notify(s, 'Door blocked. Find open ground.');
    p.x = x; p.z = z; p.car = null; c.speed = 0; c.parked = true; c.occupied = false; H.notify(s, 'ON FOOT  /  San Caldera is yours'); return;
  }
  const c = s.cars.filter(v => v.type !== 'police' && H.distance(p, v) < 6).sort((a, b) => H.distance(p, a) - H.distance(p, b))[0];
  if (!c) return H.notify(s, 'Approach a vehicle, then press E');
  if (c.occupied) { H.crime(s, 34); H.notify(s, 'VEHICLE STOLEN  /  Police notified'); }
  else H.notify(s, 'NOMAD S4  /  W accelerate · S brake · A D steer');
  c.occupied = true; c.parked = false; c.speed = 0; p.car = c; p.x = c.x; p.z = c.z; p.yaw = c.yaw; H.sound.effect('unlock');
};
H.updateCar = (s, input, dt) => {
  const c = s.player.car, throttle = (input.keys.has('w') ? 1 : 0) - (input.keys.has('s') ? 1 : 0);
  c.speed = H.clamp(c.speed + (throttle * 17 - c.speed * (input.keys.has(' ') ? 3.6 : .4)) * dt, -12, 48);
  c.yaw += ((input.keys.has('d') ? 1 : 0) - (input.keys.has('a') ? 1 : 0)) * H.clamp(c.speed / 15, -1, 1) * dt * 1.55;
  if (H.moveSolid(s, c, Math.sin(c.yaw) * c.speed * dt, Math.cos(c.yaw) * c.speed * dt, 1.4)) { if (Math.abs(c.speed) > 9) { s.player.health -= 4; H.sound.effect('impact'); } c.speed *= -.3; }
  H.carImpact(s, c);
  for (const ped of s.peds) if (H.distance(c, ped) < 2.3 && Math.abs(c.speed) > 6) { ped.panic = 10; ped.x += 3; H.crime(s, 30); }
  Object.assign(s.player, { x: c.x, z: c.z, yaw: c.yaw });
};
