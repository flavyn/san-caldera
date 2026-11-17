H.crime = (s, amount) => { s.heat = Math.min(150, s.heat + amount); s.lastCrime = s.time; s.wanted = Math.ceil(s.heat / 30); };
H.updateWanted = (s, dt) => {
  const observed = s.police.some(p => !p.stun && !p.retreat && H.distance(p, s.player) < 35);
  if (s.time - s.lastCrime > 12 && !observed) s.heat = Math.max(0, s.heat - dt * 4);
  s.wanted = Math.ceil(s.heat / 30);
  if (!s.wanted) for (const p of s.police) p.retreat = true;
};
