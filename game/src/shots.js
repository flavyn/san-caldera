/* Photography uses actual entities + renderer at a frozen simulation tick. */
H.setupShot = (s, name) => {
  s.shot = name; s.time = 42; s.ticks = 2520; s.elapsed = 1500; s.mode = name === 'title' ? 'title' : 'play'; s.messageUntil = 0;
  s.cars = []; s.peds = []; s.police = [];
  Object.assign(s.player, { x: -3.5, z: 6, yaw: 0, money: 3690, health: 86, armour: 62, aiming: true, magazine: 8 });
  Object.assign(s.mission, { index: 1, stage: 1, active: true, shots: 2 });
  const addCar = (x,z,color,yaw=0,type='civilian') => { const c=H.vehicle(x,z,color,yaw,type); c.parked=true; s.cars.push(c); return c; };
  addCar(-6.4,21,'#cc9651');addCar(5.2,28,'#519e9e',Math.PI);addCar(5.6,70,'#e5d2af');addCar(-5,99,'#ba6557');addCar(5,120,'#aec7bb',Math.PI);
  const cruiser=addCar(.5,16,'#e2e4d1',Math.PI*.49,'police');
  s.police.push({x:-4.8,z:14,color:'#234654',skin:'#ad7859',phase:0,stun:0},{x:4.2,z:18,color:'#234654',skin:'#d7a27b',phase:1,stun:0});
  addCar(6,62,'#e2e4d1',Math.PI,'police');
  for(const [x,z,color] of [[-12,18,'#e4ad65'],[-13,25,'#c66b61'],[-12.5,36,'#eee1bc'],[12,26,'#458f89'],[13,37,'#d89d77'],[12,52,'#c7ca98']]) s.peds.push({x,z,color,skin:'#c48e69',phase:z*.3,panic:3});
  s.heat=85;s.wanted=3;s.lastCrime=42;
  if(name==='mission') {
    Object.assign(s.player,{x:-4,z:349,magazine:6});
    for(const c of s.cars)c.z+=343;for(const p of s.peds)p.z+=343;for(const p of s.police)p.z+=343;
    addCar(-3.4,353,'#b3654a',.14);s.dialogue={name:'TOMAS REYES',role:'HARBOR / PRIVATE CHANNEL',text:'The seal is almost broken. One more shot. Grab the ledger!',until:100};
    s.particles.push({x:-3.7,z:350.2,y:1.5,life:1,type:'flash'});
    s.particles.push({x:-3.7,z:350.2,y:1.5,endX:3.2,endZ:365,life:1,type:'tracer'});
  }
  if(name==='drive') {
    s.cars=[];s.peds=[];s.police=[];s.wanted=0;s.heat=0;Object.assign(s.player,{x:120,z:180,yaw:0});
    const car=addCar(120,180,'#d17b4a');car.speed=24;s.player.car=car;
    addCar(125.3,186,'#f0d3aa',Math.PI);addCar(115.4,202,'#60aaa2');addCar(125,218,'#f3d6a4');addCar(115,245,'#b6594e');addCar(125,258,'#587c8c');addCar(115,287,'#dfb467');
    for(let i=0;i<5;i++)s.peds.push({x:130,z:205+i*13,color:'#e0c08b',skin:'#b9845f',phase:i});
    Object.assign(s.mission,{index:0,stage:1,active:true});s.dialogue=null;
    // Coast delivery kiosk sits beside the eastern promenade for this exhibit.
    s.shotDestination={x:125,z:295};
  }
  if(name==='title') {s.player.x=2;s.player.z=4;s.player.yaw=.1;s.player.car=null;s.wanted=0;s.heat=0;s.police=[];s.cars=s.cars.filter(c=>c.type!=='police');}
  H.updateCamera(s,0,true);
  if(name==='title')Object.assign(s.camera,{x:-1,z:-10,y:5,yaw:.1,horizon:288});
};
