H.updateMissions = (s, dt) => {
  const m = s.mission; if (!m.active || m.index >= 3) return; m.timer += dt;
  const close = H.distance(s.player, H.currentMission(s).destination) < 13;
  if (m.index === 0 && close && s.player.car) H.finishMission(s);
  else if (m.index === 1 && close) { if (m.stage === 0) { m.stage = 1; m.shots = 0; H.acceptMission(s); } if (m.shots >= 3) { H.crime(s, 65); H.finishMission(s); } }
  else if (m.index === 2 && !s.wanted && close) H.finishMission(s);
};
