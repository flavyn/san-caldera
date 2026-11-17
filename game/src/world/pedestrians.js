H.spawnPedestrians = s => {
  const r = H.random(s.seed + 11), colors = ['#dba85b', '#b95c58', '#e9dfc2', '#479e9b', '#d8bb91'];
  for (let i = 0; i < 58; i++) s.peds.push({ x: i % 2 ? -13 : 13, z: -65 + i * 12, yaw: i % 2 ? 0 : Math.PI, color: colors[i % 5], skin: ['#b87552', '#e6b38b', '#835342'][i % 3], phase: r() * 6, panic: 0 });
};
H.updatePedestrians = (s, dt) => {
  for (const p of s.peds) {
    p.panic = Math.max(0, p.panic - dt);
    if (s.wanted && H.distance(p, s.player) < 26) p.panic = 4;
    const speed = p.panic ? 4.5 : 1.2;
    p.z += Math.cos(p.yaw) * speed * dt; p.phase += dt * speed * 3;
    if (p.z > 700) p.z = -100; if (p.z < -120) p.z = 690;
    if (!p.panic && ((Math.floor(p.z) % 80 + 80) % 80) < 5 && Math.floor(s.time / 9) % 2 === 0) p.x += (p.x > 0 ? -1 : 1) * dt * .6;
    else p.x += ((p.x > 0 ? 13 : -13) - p.x) * dt;
  }
};
