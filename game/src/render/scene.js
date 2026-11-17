/* Software perspective renderer. Canvas paths are the only graphics primitive. */
H.renderScene = (ctx, s) => {
  const cam = s.camera, queue = [], project = (x, y, z) => H.project(cam, x, y, z), cos = Math.cos(cam.yaw), sin = Math.sin(cam.yaw);
  const sky = ctx.createLinearGradient(0, 0, 0, 470); sky.addColorStop(0, '#609da5'); sky.addColorStop(.48, '#ced6b8'); sky.addColorStop(.78, '#f1c78b'); sky.addColorStop(1, '#e7ac71'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1280, 720);
  const sunX = 655 - Math.sin(cam.yaw) * 460, sunY = 136;
  const glow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 265); glow.addColorStop(0, '#ffe3a3aa'); glow.addColorStop(1, '#ffe3a300'); ctx.fillStyle = glow; ctx.fillRect(0, 0, 1280, 450); ctx.fillStyle = '#ffe3a9'; ctx.beginPath(); ctx.arc(sunX, sunY, 43, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#91b4ae'; ctx.beginPath(); ctx.moveTo(0, 296); for (let i = 0; i <= 1280; i += 40) ctx.lineTo(i, 270 + Math.sin(i * .013 + 3) * 15 + Math.cos(i * .029) * 8); ctx.lineTo(1280, 360); ctx.lineTo(0, 360); ctx.fill();
  ctx.strokeStyle='#fff2c242';ctx.lineWidth=4;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(340+i*57,95+i*12);ctx.bezierCurveTo(480+i*27,90+i*12,540+i*39,118+i*12,810+i*17,112+i*12);ctx.stroke();}
  const rawPoly = (points, color, stroke) => {
    // Clip against the camera's near plane before projecting, including road tiles.
    const depth = p => (p[0] - cam.x) * sin + (p[2] - cam.z) * cos;
    const depths=points.map(depth);if(depths.every(d=>d<.6)||depths.every(d=>d>340))return;
    let clipped = [];
    for (let i = 0; i < points.length; i++) { const p = points[i], q = points[(i + 1) % points.length], dp = depth(p), dq = depth(q); if (dp >= .6) clipped.push(p); if ((dp >= .6) !== (dq >= .6)) { const t = (.6 - dp) / (dq - dp); clipped.push(p.map((v, k) => v + (q[k] - v) * t)); } }
    if (clipped.length < 3) return;
    const pp = clipped.map(p => project(...p)); if (pp.some(p => !p)) return;
    if (pp.every(p => p.x < -10) || pp.every(p => p.x > 1290) || pp.every(p => p.y < -10) || pp.every(p => p.y > 730)) return;
    ctx.beginPath(); pp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = .7; ctx.stroke(); }
  };
  const poly = (points, color, bias = 0, stroke) => { const z = points.reduce((sum, p) => sum + (p[0] - cam.x) * Math.sin(cam.yaw) + (p[2] - cam.z) * Math.cos(cam.yaw), 0) / points.length; if (z > -30 && z < 340) queue.push({ depth: z + bias, draw: () => rawPoly(points, color, stroke) }); };
  const ground = (x, z, w, d, color, y = 0) => rawPoly([[x, y, z], [x + w, y, z], [x + w, y, z + d], [x, y, z + d]], color);
  const face = (x, y, z, w, h, color) => poly([[x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z]], color, -.02);
  const box = (x, y, z, w, h, d, color, yaw = 0, trim = false) => {
    const v = (a, b, e) => [x + a * Math.cos(yaw) + e * Math.sin(yaw), y + b, z - a * Math.sin(yaw) + e * Math.cos(yaw)];
    const sides = [
      { p: [v(-w/2,0,-d/2),v(w/2,0,-d/2),v(w/2,h,-d/2),v(-w/2,h,-d/2)], shade: -.18, visible: (cam.x-x)*Math.sin(yaw)+(cam.z-z)*Math.cos(yaw)<-d/2 },
      { p: [v(w/2,0,d/2),v(-w/2,0,d/2),v(-w/2,h,d/2),v(w/2,h,d/2)], shade: .03, visible: (cam.x-x)*Math.sin(yaw)+(cam.z-z)*Math.cos(yaw)>d/2 },
      { p: [v(-w/2,0,d/2),v(-w/2,0,-d/2),v(-w/2,h,-d/2),v(-w/2,h,d/2)], shade: -.28, visible: (cam.x-x)*Math.cos(yaw)-(cam.z-z)*Math.sin(yaw)<-w/2 },
      { p: [v(w/2,0,-d/2),v(w/2,0,d/2),v(w/2,h,d/2),v(w/2,h,-d/2)], shade: -.09, visible: (cam.x-x)*Math.cos(yaw)-(cam.z-z)*Math.sin(yaw)>w/2 },
      { p: [v(-w/2,h,-d/2),v(w/2,h,-d/2),v(w/2,h,d/2),v(-w/2,h,d/2)], shade: .16, visible: cam.y>y+h },
    ];
    for (const f of sides) if(f.visible)poly(f.p, H.shade(color, f.shade), 0, trim ? '#23404533' : null);
    return v;
  };
  // Ground is tiled in depth order so the near plane never leaves a gap.
  ctx.fillStyle = '#b6b699'; ctx.fillRect(0, cam.horizon + 26, 1280, 720);
  ground(-300, -200, 700, 1100, '#b6b79a'); ground(135, -200, 280, 1100, '#4b9eac'); ground(129, -200, 6, 1100, '#e3cc9c');
  for (let z = 790; z >= -180; z -= 10) {
    for (let x = -120; x <= 120; x += 60) { ground(x - 14, z, 28, 10, '#d4c7aa', .05); ground(x - 10.5, z, 21, 10, '#536164', .08); if (((z % 80) + 80) % 80 > 12) { ground(x - .14, z, .11, 5.4, '#e9c47c', .09); ground(x + .14, z, .11, 5.4, '#e9c47c', .09); ground(x - 6, z, .12, 3.2, '#d0d2b6', .09); ground(x + 6, z, .12, 3.2, '#d0d2b6', .09); } }
  }
  for (let z = -160; z <= 800; z += 80) {
    ground(-150, z - 10, 288, 20, '#58676a', .1);
    for (let x = -120; x <= 120; x += 60) {
      for (let stripe = -8; stripe <= 8; stripe += 2) { ground(x + stripe, z + 11, 1.05, 3.3, '#e7dabb', .12); ground(x + stripe, z - 14, 1.05, 3.3, '#e7dabb', .12); }
      box(x + 11.5, 0, z + 11, .18, 5.5, .18, '#526d66'); box(x + 11.5, 4.5, z + 11, .55, 1.4, .45, '#233b40');
      const l = project(x + 11.5, Math.floor(s.time / 9) % 2 ? 4.7 : 5.4, z + 10.74); if (l) queue.push({ depth: l.depth - .4, draw: () => { ctx.fillStyle = Math.floor(s.time / 9) % 2 ? '#8cddae' : '#ff9b6c'; ctx.beginPath(); ctx.arc(l.x, l.y, Math.max(1, l.k * .15), 0, 7); ctx.fill(); } });
    }
  }
  for (let z = -120; z < 720; z += 18) ground(135, z, 110, .15, '#89c3c2', .1);
  // Small painted road repairs, drain covers and concrete sidewalk seams.
  for(let z=-120;z<720;z+=13){for(const road of [0,60,120]){
    ground(road-13.9,z,.12,9,'#9ca990',.16);ground(road+10.7,z,3.1,.07,'#b4b394',.16);
    if(z%3===0){ground(road-8.8,z,1.1,.48,'#344d51',.16);for(let a=0;a<5;a++)ground(road-8.7+a*.18,z+.04,.07,.35,'#87938b',.17);}
    if(z%2===0)ground(road+2.7,z,1.2,.05,'#6f7a76',.15);
  }}
  for(let z=-80;z<700;z+=80)for(const road of [0,60,120]){
    poly([[road+4,.17,z+31],[road+4,.17,z+38],[road+3.25,.17,z+38],[road+4.65,.17,z+41],[road+6,.17,z+38],[road+5.25,.17,z+38],[road+5.25,.17,z+31]],'#c9cbb0',-.3);
  }
  // Waterfront rail, breakwaters and sailboats are original geometry.
  for (let z = -100; z < 700; z += 15) { box(131.5, 0, z, .16, 1, .16, '#577e78'); box(131.5, .9, z, .12, .12, 15, '#cbd1ba'); }
  // Sailboats and a harbor gantry give the coast its own silhouette.
  for(const z of [150,270,410,550]){
    box(170,.1,z,2,.7,8,'#e5d3ac',.3);box(170,.6,z,.12,10,.12,'#647f7c');
    poly([[170,10,z],[170,1.4,z],[174,1.4,z]],'#fff0cf');poly([[169.7,8,z],[169.7,1.4,z],[167,1.4,z]],'#d39665');
  }
  for (const b of s.city.buildings) {
    const mid = project(b.x + b.w/2, 0, b.z + b.d/2); if (!mid || mid.depth > 280 || Math.abs(mid.x - 640) > 2400) continue;
    // Long warm shadows, cornices and recessed shopfronts.
    ground(b.x - b.h * .42, b.z + 3, b.w + b.h * .42, b.d, '#84948b', .14);
    box(b.x + b.w/2, 0, b.z + b.d/2, b.w, b.h, b.d, b.color, 0, true);
    box(b.x + b.w/2, b.h, b.z + b.d/2, b.w + .6, .45, b.d + .6, '#e6d9bd');
    box(b.x + b.w/2, b.h + .4, b.z + b.d/2, b.w * .5, .7, b.d * .45, '#91a5a1');
    const floors = Math.floor((b.h - 4) / 3.4), front = b.z - .035;
    for (let floor = 0; floor < floors; floor+=mid.depth>125?2:1) {
      const y = 4 + floor * 3.4;
      if(cam.z<b.z)for (let col = 1; col < b.w - 1; col += 2.8) {
        face(b.x + col, y, front, 1.5, 1.9, (floor + Math.floor(col)) % 4 ? '#3e6870' : '#eac18a');
        face(b.x + col, y + 1.6, front - .015, 1.5, .2, '#adc2b6');
      }
      // Side windows on both facades create a dense skyline from every angle.
      for (let j = 1; j < b.d - 1; j += mid.depth>125?6:3) for (const side of [b.x - .03, b.x + b.w + .03]) if(side<b.x?cam.x<b.x:cam.x>b.x+b.w)poly([[side,y,b.z+j],[side,y,b.z+j+1.5],[side,y+1.9,b.z+j+1.5],[side,y+1.9,b.z+j]], '#46696c', -.035);
    }
    for (let col = 1; col < b.w - 2; col += 3.6) { face(b.x + col, .3, front - .03, 2.8, 2.8, '#244c54'); face(b.x + col + .15, .5, front - .05, .08, 2.5, '#d4c6a6'); }
    // Every street-facing ground floor has shop windows, including side facades.
    for(const edge of [b.x-.08,b.x+b.w+.08])if(edge<b.x?cam.x<b.x:cam.x>b.x+b.w){
      for(let j=1;j<b.d-3;j+=4){
        poly([[edge,.25,b.z+j],[edge,.25,b.z+j+3],[edge,2.8,b.z+j+3],[edge,2.8,b.z+j]],'#2f6066',-.13);
        poly([[edge,2.8,b.z+j],[edge,2.8,b.z+j+3],[edge,3.05,b.z+j+3],[edge,3.05,b.z+j]],'#e3c794',-.15);
        poly([[edge,.3,b.z+j+1.5],[edge,.3,b.z+j+1.57],[edge,2.8,b.z+j+1.57],[edge,2.8,b.z+j+1.5]],'#aebda6',-.17);
        poly([[edge,.4,b.z+j+.15],[edge,.4,b.z+j+1.3],[edge,1,b.z+j+1.3],[edge,1,b.z+j+.15]],'#e4b36e',-.2);
      }
      const ad=project(edge,3.5,b.z+b.d*.5);if(ad&&ad.depth<50)queue.push({depth:ad.depth-.3,draw:()=>H.text(ctx,b.sign+'  /  CAFÉ',ad.x,ad.y,Math.min(28,ad.k*.48),'#ffe1a4',800,'center')});
    }
    if (b.style === 1) {box(b.x + b.w/2, 3.1, b.z - .6, b.w, .4, 1.5, '#cc7754');for(let a=0;a<b.w;a+=1.5)face(b.x+a,2.76,b.z-1.36,.72,.35,'#f1d5a0');}
    if(b.h<20){
      // Art-deco horizontal facade bands and pilasters.
      for(let y=3.3;y<b.h;y+=3.4)face(b.x,y,b.z-.065,b.w,.13,'#ead5b2');
      for(const edge of [b.x+.1,b.x+b.w-.45])face(edge,.1,b.z-.09,.28,b.h-.2,'#e2cba7');
    }
    if(b.style===2){
      for(let y=5;y<b.h-2;y+=6.8){box(b.x+b.w/2,y,b.z-.65,b.w*.8,.22,1.3,'#d3ccb1');for(let j=1.5;j<b.w-1;j+=2)box(b.x+j,y+.2,b.z-1.23,.045,.7,.045,'#638378');}
    }
    const sign = project(b.x + b.w / 2, 3.65, b.z - .1);
    if (sign && sign.k > 8) queue.push({ depth: sign.depth - .2, draw: () => { ctx.save(); ctx.translate(sign.x, sign.y); H.text(ctx, b.sign, 0, 0, Math.max(6, Math.min(27, sign.k * .43)), '#ffe6af', 800, 'center'); ctx.restore(); } });
  }
  for (const palm of s.city.palms) {
    const q = project(palm.x, 0, palm.z); if (!q || q.depth > 260 || q.x < -500 || q.x > 1780) continue;
    queue.push({ depth: q.depth, draw: () => {
      const top = project(palm.x + palm.bend, palm.h, palm.z); if (!top) return;
      ctx.strokeStyle = '#796c4c'; ctx.lineWidth = Math.max(2, q.k * .25); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.quadraticCurveTo(q.x - q.k * .3, (q.y + top.y) / 2, top.x, top.y); ctx.stroke();
      ctx.strokeStyle = '#b49a67'; ctx.lineWidth = Math.max(.6, q.k * .06); ctx.beginPath(); ctx.moveTo(q.x + q.k * .09, q.y); ctx.lineTo(top.x + q.k * .09, top.y); ctx.stroke();
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + .2, len = q.k * (2.5 + Math.sin(i * 6) * .6), ex = top.x + Math.cos(a) * len, ey = top.y + Math.sin(a) * len * .25 + len * .23; ctx.fillStyle = i % 2 ? '#315f52' : '#47745a'; ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.quadraticCurveTo(top.x + Math.cos(a) * len * .5, top.y - len * .34, ex, ey); ctx.quadraticCurveTo(top.x + Math.cos(a) * len * .45, top.y + len * .07, top.x, top.y); ctx.fill(); }
    } });
  }
  // Benches, planters and bollards sit on the promenade, outside travel lanes.
  for(let z=-80;z<700;z+=39){
    box(128,.45,z,.65,.15,2.6,'#aa7c52');box(128.3,.6,z,.12,.58,2.6,'#aa7c52');for(const end of [-1,1])box(128,.02,z+end,.14,.5,.15,'#385951');
    for(const x of [-12,12]){box(x,.1,z+8,.75,.65,.75,'#c6ae87');box(x,.75,z+8,1,.35,1,'#637b4e');}
  }
  for (const lamp of s.city.props) {
    const q = project(lamp.x, 0, lamp.z); if (!q || q.depth > 160) continue;
    queue.push({ depth: q.depth, draw: () => { const top = project(lamp.x, 6, lamp.z); ctx.strokeStyle = '#456460'; ctx.lineWidth = Math.max(1, q.k * .09); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(top.x, top.y); ctx.lineTo(top.x + q.k * .8, top.y); ctx.stroke(); ctx.fillStyle = '#ffe2a3'; ctx.fillRect(top.x + q.k * .6, top.y, q.k * .45, q.k * .12); } });
  }
  const drawCar = car => {
    const q = project(car.x, 0, car.z); if (!q || q.depth > 250) return;
    const yaw = car.yaw, local = (a,y,e) => [car.x + a * Math.cos(yaw) + e * Math.sin(yaw), y, car.z - a * Math.sin(yaw) + e * Math.cos(yaw)];
    poly([local(-1.5,.11,-2.8),local(1.7,.11,-2.8),local(2.4,.11,2.6),local(-.7,.11,2.6)], '#273f414d', 1);
    box(car.x, .42, car.z, 2.1, .68, 4.7, car.color, yaw, true);
    box(car.x, .95, car.z - Math.cos(yaw) * .15, 1.82, .72, 2.35, car.type === 'police' ? '#263f47' : H.shade(car.color,-.05), yaw);
    // Sloped rear pillars and rear-window trim soften the boxy silhouette.
    poly([local(-.92,1.05,-1.42),local(.92,1.05,-1.42),local(.77,1.69,-.91),local(-.77,1.69,-.91)],H.shade(car.color,.1),-.08);
    poly([local(-.7,1.13,-1.425),local(.7,1.13,-1.425),local(.62,1.6,-1.02),local(-.62,1.6,-1.02)],'#8bbabe',-.12);
    // Windshields, rear glass, separate windows and door handles.
    poly([local(-.79,1.1,-1.36),local(.79,1.1,-1.36),local(.79,1.58,-1.36),local(-.79,1.58,-1.36)], '#88bec1', -.04);
    poly([local(-.79,1.1,1.06),local(.79,1.1,1.06),local(.79,1.58,1.06),local(-.79,1.58,1.06)], '#709da6', -.04);
    for (const side of [-1,1]) {
      for (const z of [-.72,.38]) poly([local(side*.93,1.12,z-.39),local(side*.93,1.12,z+.39),local(side*.93,1.57,z+.39),local(side*.93,1.57,z-.39)], '#6a9ca6', -.06);
      for (const z of [-1.5,1.5]) { const v = local(side*1.05,.18,z); box(v[0],v[1],v[2],.3,.7,.83,'#21363b',yaw); const hub = local(side*1.22,.38,z); box(hub[0],hub[1],hub[2],.04,.3,.4,'#a4b7b1',yaw); }
      for (const z of [-.8,.45]) { const v = local(side*1.07,.85,z); box(v[0],v[1],v[2],.035,.06,.28,'#d5d9c5',yaw); }
    }
    for (const side of [-1,1]) {
      const rear = local(side*.76,.67,-2.37), front = local(side*.76,.67,2.37); box(...[rear[0],rear[1],rear[2],.43,.19,.035,'#f58061',yaw]); box(front[0],front[1],front[2],.43,.19,.035,'#f6e8b8',yaw);
    }
    const bumper = local(0,.46,-2.4); box(bumper[0],bumper[1],bumper[2],1.86,.12,.1,'#9ba8a2',yaw);
    const plate = local(0,.65,-2.405); box(plate[0],plate[1],plate[2],.48,.18,.04,'#f7d9a3',yaw);
    if (car.type === 'police') {
      for(const side of [-1,1])poly([local(side*1.06,.61,-1.1),local(side*1.06,.61,1.1),local(side*1.06,.9,1.1),local(side*1.06,.9,-1.1)],'#244858',-.15);
      box(car.x,1.69,car.z,1.5,.12,.4,'#172e39',yaw);
      for (const side of [-1,1]) { const v = local(side*.47,1.82,0); box(v[0],v[1],v[2],.5,.16,.32,side < 0 ? '#ff6357' : '#58d8ef',yaw); }
      // Tactical door ajar in the incident photographs; actual officers are outside.
      if(s.shot&&s.shot!=='drive'&&Math.abs(car.z-s.player.z)<30){
        const door=local(-1.25,.48,.1);box(door[0],door[1],door[2],.16,.65,1.1,'#dce5cf',yaw-.65);
        const window=local(-1.3,1.13,.1);box(window[0],window[1],window[2],.07,.45,.9,'#78aeb6',yaw-.65);
      }
      const label = project(car.x, .94, car.z - 1.3); if (label) queue.push({ depth: label.depth - 1.3, draw: () => H.text(ctx, 'POLICE', label.x, label.y, Math.max(7,label.k*.25), '#f9e8c2', 900, 'center') });
      if (s.wanted) { const glow = project(car.x,1.9,car.z); queue.push({ depth: q.depth - 2, draw: () => { ctx.save(); ctx.globalCompositeOperation='screen'; const g=ctx.createRadialGradient(glow.x,glow.y,1,glow.x,glow.y,q.k*1.2); g.addColorStop(0,'#ff545744'); g.addColorStop(1,'#ff545700'); ctx.fillStyle=g; ctx.fillRect(glow.x-q.k*2,glow.y-q.k*2,q.k*4,q.k*4); ctx.restore(); } }); }
    }
  };
  for (const car of s.cars) drawCar(car);
  const person = (p, isPlayer = false, cop = false) => {
    const q = project(p.x,0,p.z); if (!q || q.depth > 160 || q.x < -70 || q.x > 1350) return;
    queue.push({ depth: q.depth, draw: () => H.drawPerson(ctx, q, p, isPlayer, cop, s) });
  };
  s.peds.forEach(p => person(p)); s.police.filter(o => !o.car).forEach(o => person(o,false,true));
  if (!s.player.car) person(s.player,true);
  if(s.mission.active&&s.mission.index===1){box(-5,0,360,1.3,1.1,1,'#577c77');box(-5,1.1,360,1.38,.12,1.08,'#dfbb75');box(-5,.5,359.47,.23,.35,.05,'#ffd18b');}
  const target = s.shotDestination || H.currentMission(s).destination, marker = project(target.x, 0, target.z);
  if (s.mission.active && marker && marker.depth > 8 && marker.depth < 270) queue.push({ depth: marker.depth - .5, draw: () => {
    ctx.strokeStyle = '#ffce7b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(marker.x,marker.y,Math.max(8,marker.k*2.8),Math.max(3,marker.k*.5),0,0,7); ctx.stroke();
    const a=project(target.x,6,target.z); ctx.fillStyle='#ffd18b'; ctx.beginPath(); ctx.moveTo(a.x,a.y-14); ctx.lineTo(a.x+10,a.y); ctx.lineTo(a.x,a.y+14); ctx.lineTo(a.x-10,a.y); ctx.closePath(); ctx.fill(); H.text(ctx,Math.round(H.distance(s.player,target))+' m',a.x,a.y-23,12,'#fff0c8',800,'center');
  } });
  queue.sort((a,b)=>b.depth-a.depth); for (const item of queue) item.draw();
  for (const part of s.particles) { const q=project(part.x,part.y,part.z); if(q) {
    if(part.type==='tracer'){const end=project(part.endX,part.y,part.endZ);if(end){ctx.strokeStyle='#ffe4a578';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(end.x,end.y);ctx.stroke();}}
    else {ctx.fillStyle='#ffe3a3';ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,r=q.k*(i%2?.09:.25);if(i)ctx.lineTo(q.x+Math.cos(a)*r,q.y+Math.sin(a)*r);else ctx.moveTo(q.x+Math.cos(a)*r,q.y+Math.sin(a)*r);}ctx.closePath();ctx.fill();}
  } }
  const vignette=ctx.createRadialGradient(640,330,250,640,360,790);vignette.addColorStop(0,'#102f3300');vignette.addColorStop(1,'#102f335c');ctx.fillStyle=vignette;ctx.fillRect(0,0,1280,720);
};
H.shade = (hex, amount) => { const n = parseInt(hex.slice(1),16), values = hex.startsWith('rgb') ? hex.match(/[\d.]+/g).slice(0,3).map(Number) : [n>>16,n>>8&255,n&255], f = v => H.clamp(Math.round(v * (1+amount)),0,255); return `rgb(${values.map(f).join(',')})`; };
H.drawPerson = (c, q, p, hero, cop, s) => {
  const k=q.k, x=q.x, y=q.y, swing=hero?Math.sin(s.time*8)*.12:Math.sin(p.phase||0)*.22, skin=p.skin||'#b77e59';
  c.save();c.translate(x,y);c.scale(k,k);
  c.fillStyle='#213b4144';c.beginPath();c.ellipse(.35,0,.62,.13,-.3,0,7);c.fill();
  const limb=(x1,y1,x2,y2,w,color)=>{c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  limb(-.15,-.75,-.23+swing,-.08,.23,hero?'#283e46':'#34494c');limb(.15,-.75,.23-swing,-.08,.23,'#203b42');
  limb(-.22+swing,-.07,-.37+swing,-.05,.17,'#1a3037');limb(.23-swing,-.07,.37-swing,-.05,.17,'#172f36');
  c.fillStyle=hero?'#c5b48e':cop?'#254755':p.color;c.beginPath();c.moveTo(-.35,-1.5);c.lineTo(.3,-1.5);c.lineTo(.3,-.78);c.lineTo(-.28,-.78);c.closePath();c.fill();
  c.fillStyle=hero?'#e2c59c':cop?'#466977':'#ffffff28';c.fillRect(-.32,-1.46,.13,.62);c.fillStyle='#243d44';c.fillRect(-.28,-.85,.58,.12);
  if(hero||cop) {limb(-.28,-1.4,-.44,-1.12,.2,hero?'#d0be99':'#355c67');limb(-.44,-1.12,.15,-1.29,.16,skin);limb(.27,-1.39,.47,-1.19,.21,hero?'#c3b18e':'#355c67');limb(.47,-1.19,.35,-1.55,.16,skin);c.fillStyle='#19323c';c.fillRect(.27,-1.74,.14,.37);c.fillRect(.27,-1.77,.27,.14);c.fillStyle='#53747a';c.fillRect(.29,-1.78,.25,.06);}
  else {limb(-.33,-1.4,-.4-swing,-.86,.16,skin);limb(.31,-1.4,.4+swing,-.85,.16,skin);}
  c.fillStyle=skin;c.fillRect(-.14,-1.64,.28,.19);c.beginPath();c.ellipse(0,-1.82,.235,.29,0,0,7);c.fill();c.fillStyle='#263c3c';c.beginPath();c.ellipse(-.015,-1.98,.24,.16,0,Math.PI,Math.PI*2);c.fill();c.fillRect(-.24,-2,.46,.12);
  if(cop){c.fillStyle='#244653';c.fillRect(-.29,-2.03,.58,.09);c.fillStyle='#ecc584';c.fillRect(-.04,-1.99,.08,.06);c.fillRect(-.18,-1.4,.08,.09);}
  if(hero){c.fillStyle='#374b47';c.fillRect(-.22,-1.46,.28,.6);c.strokeStyle='#8c9575';c.lineWidth=.035;c.strokeRect(-.22,-1.46,.28,.6);}
  c.restore();
};
