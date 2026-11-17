H.updateFoot = (s, input, dt) => {
  const p = s.player; p.aiming = input.mouse || input.keys.has('shift');
  p.yaw += ((input.keys.has('arrowright') ? 1 : 0) - (input.keys.has('arrowleft') ? 1 : 0)) * dt * 1.8 + input.look * .0025; input.look = 0;
  let f = (input.keys.has('w') ? 1 : 0) - (input.keys.has('s') ? 1 : 0), side = (input.keys.has('d') ? 1 : 0) - (input.keys.has('a') ? 1 : 0);
  const norm = Math.hypot(f, side) || 1, speed = input.keys.has('shift') ? 7 : 4.3;
  f *= speed * dt / norm; side *= speed * dt / norm;
  const dx = Math.sin(p.yaw) * f + Math.cos(p.yaw) * side, dz = Math.cos(p.yaw) * f - Math.sin(p.yaw) * side;
  if (!s.cars.some(c => Math.hypot(p.x + dx - c.x, p.z + dz - c.z) < 1.45)) H.moveSolid(s, p, dx, dz);
  if (p.reload > 0) { p.reload -= dt; if (p.reload <= 0) { const n = Math.min(12 - p.magazine, p.ammo); p.magazine += n; p.ammo -= n; } }
  if (input.keys.has('r') && !p.reload && p.ammo && p.magazine < 12) p.reload = 1.2;
  if ((input.firing || input.keys.has(' ')) && s.time - p.fireAt > .22 && !p.reload) H.fire(s);
};
H.fire = s => {
  const p = s.player;
  if (!p.magazine) { if (p.ammo) p.reload = 1.2; return; }
  p.magazine--; p.fireAt = s.time; p.aiming = true; H.sound.effect('shot'); H.crime(s, 23); s.mission.shots++;
  for (const ped of s.peds) if (H.distance(ped, p) < 60) ped.panic = 8;
  // Aim at the reticle's intersection with torso height, accounting for shoulder offset.
  const camera=s.camera, rayDepth=camera?H.clamp((camera.y-1.35)*camera.focal/(355-camera.horizon),10,80):35;
  const aim=camera?{x:camera.x+Math.sin(camera.yaw)*rayDepth,z:camera.z+Math.cos(camera.yaw)*rayDepth}:{x:p.x+Math.sin(p.yaw)*35,z:p.z+Math.cos(p.yaw)*35};
  const length=Math.hypot(aim.x-p.x,aim.z-p.z)||1,dir={x:(aim.x-p.x)/length,z:(aim.z-p.z)/length};
  for (const o of s.police) { const dx = o.x - p.x, dz = o.z - p.z, along = dx * dir.x + dz * dir.z; if (along > 0 && along < 65 && Math.abs(dx * dir.z - dz * dir.x) < 2) o.stun = 5; }
  s.particles.push({ x: p.x + dir.x, z: p.z + dir.z, y: 1.3, life: .09, type: 'flash' });
  s.particles.push({x:p.x+dir.x,z:p.z+dir.z,y:1.35,endX:p.x+dir.x*45,endZ:p.z+dir.z*45,life:.06,type:'tracer'});
};
