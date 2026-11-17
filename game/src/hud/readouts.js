H.text = (c, value, x, y, size = 14, color = '#fff0d4', weight = 600, align = 'left') => { c.font = `${weight} ${size}px Arial, sans-serif`; c.fillStyle = color; c.textAlign = align; c.fillText(value, x, y); c.textAlign = 'left'; };
H.panel = (c, x, y, w, h, alpha = .87) => { c.fillStyle = `rgba(12,35,40,${alpha})`; c.fillRect(x, y, w, h); };
H.chip = (c, key, label, x, y) => { H.panel(c, x, y - 16, 24, 24, .9); c.strokeStyle = '#96b0a0'; c.strokeRect(x, y - 16, 24, 24); H.text(c, key, x + 12, y + 1, 10, '#f6eacb', 800, 'center'); H.text(c, label, x + 33, y + 1, 11, '#eee2c7', 600); };
H.drawHUD = (c, s) => {
  const p = s.player, def = H.currentMission(s), top = c.createLinearGradient(0, 0, 0, 180); top.addColorStop(0, 'rgba(5,28,33,.85)'); top.addColorStop(1, 'rgba(5,28,33,0)'); c.fillStyle = top; c.fillRect(0, 0, 1280, 180);
  H.text(c, 'HEATLINE', 30, 43, 28, '#fff2d3', 900); c.fillStyle = '#e8b16b'; c.fillRect(30, 53, 42, 3); H.text(c, 'SAN CALDERA', 84, 57, 10, '#e8c991', 800);
  H.text(c, H.district(p.z), 30, 89, 14, '#faf1d6', 700); H.text(c, '17:42  /  28°C  /  PACIFIC STANDARD', 30, 107, 9, '#b9c7bc');
  H.text(c, '$' + Math.floor(p.money).toLocaleString('en-US'), 641, 43, 28, '#f7e8c6', 800, 'center'); H.text(c, 'CASH ON HAND', 641, 59, 9, '#c6cfba', 700, 'center');
  for (let i = 0; i < 5; i++) H.text(c, '★', 970 + i * 52, 49, 36, i < s.wanted ? '#ffc478' : '#546767', 800);
  H.text(c, s.wanted ? 'WANTED  /  ' + (s.wanted >= 3 ? 'TACTICAL RESPONSE' : 'LOCAL PATROL') : 'NO ACTIVE WARRANT', 1238, 72, 10, s.wanted ? '#ffd19a' : '#b6c9ba', 700, 'right');
  H.panel(c, 927, 106, 323, 141); c.fillStyle = '#e9b56f'; c.fillRect(927, 106, 3, 141); H.text(c, 'CONTRACT 0' + Math.min(s.mission.index + 1, 3) + '  /  STORY', 945, 130, 10, '#c7ccb9', 700); H.text(c, def.name, 945, 156, 19, '#fff0cd', 800);
  H.text(c, '◇  ' + H.objective(s).slice(0, 43), 945, 181, 12, '#f3ca88', 600);
  if(s.shot==='mission') { H.text(c,'✓  Reach Copper Harbor',945,205,11,'#a9c8b4'); H.text(c,'02  Break the seal  →  03  Secure ledger',945,226,10,'#c9d0b6'); }
  else H.text(c, '01 ━━━ 02 ━━━ 03   /   $' + def.reward.toLocaleString('en-US'), 945, 225, 11, '#b4c2b5');
  H.drawMinimap(c, s);
  for (const [label, amount, y, color] of [['HEALTH', p.health, 639, '#9cd6a2'], ['ARMOUR', p.armour, 674, '#77cbd4']]) { H.text(c, label, 292, y - 12, 9, '#dce4ce', 700); H.text(c, Math.ceil(amount) + '', 486, y - 12, 11, color, 700, 'right'); c.fillStyle = '#183c42'; c.fillRect(292, y - 5, 194, 6); c.fillStyle = color; c.fillRect(292, y - 5, 194 * H.clamp(amount / 100, 0, 1), 6); }
  if (p.car) { H.panel(c, 1060, 537, 190, 142, .8); H.text(c, String(Math.round(Math.abs(p.car.speed) * 3.6)).padStart(3, '0'), 1081, 608, 62, '#fff1d6', 800); H.text(c, 'KM/H', 1219, 607, 10, '#d6d4b7', 700, 'right'); H.text(c, 'NOMAD S4  /  REAR DRIVE', 1080, 636, 10, '#a8c9bc'); c.fillStyle = '#efbc75'; c.fillRect(1080, 650, Math.min(150, Math.abs(p.car.speed) * 3.1), 4); }
  else { H.text(c, 'SABLE 9  /  SIDEARM', 1246, 603, 11, '#d9d6b7', 700, 'right'); H.text(c, String(p.magazine).padStart(2, '0'), 1160, 653, 46, '#fff1d6', 800, 'right'); H.text(c, '/ ' + p.ammo, 1174, 649, 22, '#c2cfbd'); H.text(c, p.reload > 0 ? 'RELOADING' : 'SEMI AUTO', 1246, 678, 10, '#9ac7b9', 700, 'right'); c.strokeStyle = '#fff0cd'; c.lineWidth = 1.5; c.beginPath(); c.arc(640, 355, 8, 0, Math.PI * 2); c.moveTo(623, 355); c.lineTo(630, 355); c.moveTo(650, 355); c.lineTo(657, 355); c.moveTo(640, 338); c.lineTo(640, 345); c.stroke(); }
  if (s.messageUntil > s.time && !s.dialogue) { H.panel(c, 427, 109, 426, 32, .8); H.text(c, s.message, 640, 130, 11, '#ffe4ad', 700, 'center'); }
  if (s.dialogue && s.dialogue.until > s.time) H.drawDialogue(c, s);
  H.chip(c, 'W', p.car ? 'ACCELERATE' : 'MOVE / WASD', 523, 697); H.chip(c, 'E', p.car ? 'EXIT' : 'ENTER / STEAL', 693, 697); H.chip(c, 'M', 'CONTRACT', 861, 697); H.chip(c, 'ESC', 'SAVE', 1010, 697);
};
H.drawDialogue = (c, s) => { const d = s.dialogue; H.panel(c, 315, 507, 640, 99, .94); c.fillStyle = '#e8b16b'; c.fillRect(315, 507, 3, 99); H.text(c, d.name, 337, 534, 16, '#ffc883', 800); H.text(c, d.role, 925, 534, 9, '#9bbeb3', 600, 'right'); H.text(c, d.text, 337, 564, 14, '#fff0d4', 500); H.text(c, 'ENCRYPTED VOICE  ▂ ▅ ▃ ▇ ▂ ▄ ▆ ▃', 337, 589, 9, '#82ada4'); };
