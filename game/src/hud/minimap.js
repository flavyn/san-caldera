H.drawMinimap = (ctx, s) => {
  const x = 30, y = 500, w = 238, h = 174, p = s.player, scale = .79;
  ctx.save(); ctx.fillStyle = '#102f34'; ctx.fillRect(x, y, w, h); ctx.beginPath(); ctx.rect(x + 3, y + 3, w - 6, h - 6); ctx.clip();
  const point = a => [x + w / 2 + (a.x - p.x) * scale, y + h / 2 - (a.z - p.z) * scale];
  ctx.fillStyle = '#38646a';
  for (const b of s.city.buildings) { const [bx, by] = point({ x: b.x, z: b.z + b.d }); ctx.fillRect(bx, by, b.w * scale, b.d * scale); }
  ctx.fillStyle = '#2f8790'; const ocean = point({ x: 138, z: p.z }); ctx.fillRect(ocean[0], y, 200, h); ctx.strokeStyle = '#84948b'; ctx.lineWidth = 9;
  for (let road = -120; road <= 120; road += 60) { const r = point({ x: road, z: p.z }); ctx.beginPath(); ctx.moveTo(r[0], y); ctx.lineTo(r[0], y + h); ctx.stroke(); }
  for (let road = -160; road <= 800; road += 80) { const r = point({ x: p.x, z: road }); ctx.beginPath(); ctx.moveTo(x, r[1]); ctx.lineTo(x + w, r[1]); ctx.stroke(); }
  const dest = point(s.shotDestination || H.currentMission(s).destination), center = [x + w / 2, y + h / 2];
  if (s.mission.active) { ctx.strokeStyle = '#f4c56e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...center); ctx.lineTo(center[0], dest[1]); ctx.lineTo(...dest); ctx.stroke(); ctx.fillStyle = '#ffd282'; ctx.fillRect(dest[0] - 4, dest[1] - 4, 8, 8); }
  for (const car of s.cars) { const q = point(car); ctx.fillStyle = car.type === 'police' ? '#ff6859' : '#c5d0c0'; ctx.fillRect(q[0] - 2, q[1] - 2, car.type === 'police' ? 6 : 3, car.type === 'police' ? 6 : 3); }
  for (const cop of s.police) { const q = point(cop); ctx.fillStyle = '#ff6658'; ctx.beginPath(); ctx.arc(...q, 3.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.translate(...center); ctx.rotate(p.yaw); ctx.fillStyle = '#fff7dd'; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(6, 7); ctx.lineTo(0, 4); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#d9ddbf'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h); H.text(ctx, 'N', x + w - 18, y + 21, 12, '#fff0d0', 800);
  H.text(ctx, 'SAN CALDERA / ' + (s.wanted ? 'PURSUIT ACTIVE' : 'LIVE ROUTE'), x, y + h + 18, 10, '#ecdfc2', 700);
};
