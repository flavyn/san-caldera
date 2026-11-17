H.updateCamera = (s, dt, snap = false) => {
  const p = s.player, driving = !!p.car, yaw = p.yaw, distance = driving ? 11 : 8.7, shoulder = driving ? 0 : 2.5;
  const target = { x: p.x - Math.sin(yaw) * distance + Math.cos(yaw) * shoulder, z: p.z - Math.cos(yaw) * distance - Math.sin(yaw) * shoulder, y: driving ? 4.3 : 3.8, yaw, horizon: driving ? 258 : 272, focal: 690 };
  if (!s.camera || snap) s.camera = target;
  else { const t = 1 - Math.exp(-dt * 8); for (const key of ['x', 'z', 'y', 'horizon']) s.camera[key] += (target[key] - s.camera[key]) * t; s.camera.yaw = yaw; }
};
H.project = (cam, x, y, z) => {
  const dx = x - cam.x, dz = z - cam.z, c = Math.cos(cam.yaw), a = Math.sin(cam.yaw), depth = dx * a + dz * c;
  if (depth < .5) return null;
  return { x: 640 + (dx * c - dz * a) * cam.focal / depth, y: cam.horizon + (cam.y - y) * cam.focal / depth, k: cam.focal / depth, depth };
};
