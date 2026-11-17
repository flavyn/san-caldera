H.missions = [
  { name: 'BORROWED TIME', contact: 'INES VEGA', role: 'DISPATCH / PRIVATE CHANNEL', reward: 850, destination: { x: 5, z: 180 }, lines: ['The harbor crew took my courier. Borrow some wheels.', 'Take the sealed package to the Azure Coast kiosk. No detours.'], objectives: ['Find a vehicle', 'Deliver the package to Azure Coast', 'Collect $850'] },
  { name: 'PAPER TRAIL', contact: 'TOMAS REYES', role: 'HARBOR / FREELANCE REPORTER', reward: 1600, destination: { x: -5, z: 360 }, lines: ['The ledger is in that harbor lockbox. Break the seal.', 'Three clean shots. Grab the evidence. Get out alive.'], objectives: ['Reach Copper Harbor', 'Break the lockbox seal · 3 shots', 'Secure the ledger'] },
  { name: 'THE LONG WAY HOME', contact: 'INES VEGA', role: 'DISPATCH / FINAL RUN', reward: 3200, destination: { x: -5, z: 6 }, lines: ['They know what we found. Lose the tail.', 'Bring the ledger home. San Caldera deserves the truth.'], objectives: ['Lose your wanted level', 'Return to Solana Downtown', 'Deliver the ledger · $3,200'] },
];
H.currentMission = s => H.missions[Math.min(s.mission.index, 2)];
H.objective = s => {
  const m = s.mission;
  if (m.index >= 3) return 'Free roam · San Caldera is yours';
  if (!m.active) return 'M  /  Accept ' + H.currentMission(s).name;
  if (m.index === 0) return s.player.car ? 'Deliver the package to Azure Coast' : 'Find a vehicle · E to enter';
  if (m.index === 1) return m.stage === 0 ? 'Reach the Copper Harbor lockbox' : 'Break the seal · ' + Math.min(m.shots, 3) + '/3 shots';
  return s.wanted ? 'Lose the police · break line of sight' : 'Deliver the ledger to Ines';
};
H.acceptMission = s => {
  if (s.mission.index >= 3) return H.notify(s, 'All three contracts complete. Explore freely.');
  const def = H.currentMission(s);
  if (!s.mission.active) { s.mission.active = true; s.mission.timer = 0; s.mission.shots = 0; }
  s.dialogue = { name: def.contact, role: def.role, text: def.lines[s.mission.stage ? 1 : 0], until: s.time + 12 }; H.notify(s, 'CONTRACT ACTIVE  /  ' + def.name);
};
H.finishMission = s => {
  const def = H.currentMission(s); s.player.money += def.reward; s.mission.index++; s.mission.stage = 0; s.mission.active = false; s.player.ammo += 24; s.player.armour = Math.min(100, s.player.armour + 25);
  H.notify(s, 'CONTRACT COMPLETE  /  +$' + def.reward.toLocaleString('en-US'), 8);
  s.dialogue = { name: def.contact, role: 'CONTRACT SETTLED', text: s.mission.index < 3 ? 'Good work. Next job is ready. Press M when you are.' : 'We did it. The city knows. The rest is your story.', until: s.time + 10 };
};
