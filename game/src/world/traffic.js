H.vehicle = (x, z, color, yaw = 0, type = 'civilian') => ({ x, z, color, yaw, type, speed: 0, occupied: true, health: 100, length: 4.7 });
H.spawnTraffic = s => {
  const colors = ['#e2aa47', '#b95043', '#4a9b99', '#d5dbcf', '#415f78', '#efcda3'];
  for (let i = 0; i < 28; i++) {
    const lane = i % 4, c = H.vehicle([-5.2, 5.2, 55, 65][lane], -75 + Math.floor(i / 4) * 96, colors[i % 6], lane % 2 ? Math.PI : 0);
    c.cruise = 8 + i % 5; c.speed = c.cruise; s.cars.push(c);
  }
  const parked = H.vehicle(-8.8, 10, '#d17849'); parked.occupied = false; parked.parked = true; s.cars.push(parked);
};
H.updateTraffic = (s, dt) => {
  const signal = Math.floor(s.time / 9) % 2;
  for (const c of s.cars) {
    if (c === s.player.car || c.parked || c.type === 'police') continue;
    const crossing = ((c.z % 80) + 80) % 80;
    const stop = signal === 0 && (crossing < 10 || crossing > 70);
    const blocked = s.cars.some(o => o !== c && Math.abs(o.x - c.x) < 2.8 && (o.z - c.z) * Math.cos(c.yaw) > 0 && (o.z - c.z) * Math.cos(c.yaw) < 10);
    c.speed += ((stop || blocked ? 0 : c.cruise || 9) - c.speed) * dt * 2;
    c.z += Math.cos(c.yaw) * c.speed * dt;
    if (c.z > 700) c.z = -100; if (c.z < -120) c.z = 690;
  }
};
