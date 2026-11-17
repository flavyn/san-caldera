H.isSolid = (s, x, z, radius = .35) => {
  const b = s.city.bounds;
  if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) return true;
  return s.city.buildings.some(a => x > a.x - radius && x < a.x + a.w + radius && z > a.z - radius && z < a.z + a.d + radius);
};
H.moveSolid = (s, entity, dx, dz, radius = .4) => {
  let collided = false;
  if (!H.isSolid(s, entity.x + dx, entity.z, radius)) entity.x += dx; else collided = true;
  if (!H.isSolid(s, entity.x, entity.z + dz, radius)) entity.z += dz; else collided = true;
  return collided;
};
H.carImpact = (s, car) => {
  for (const other of s.cars) {
    if (other === car || H.distance(car, other) > 3.2) continue;
    if (Math.abs(car.speed) > 7) { H.crime(s, 18); H.sound.effect('impact'); H.notify(s, 'COLLISION  /  Witnesses alerted'); }
    car.speed *= -.25; car.x += (car.x - other.x) * .13; car.z += (car.z - other.z) * .13;
  }
};
