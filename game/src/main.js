/* Fixed 60 Hz world steps. Render-only frame rate never changes simulation rules. */
(() => {
  const canvas=document.getElementById('game'), ctx=canvas.getContext('2d',{alpha:false}), query=new URLSearchParams(location.search), seed=Number(query.get('seed')||71)>>>0;
  const s=H.newState(seed), input={keys:new Set(),mouse:false,firing:false,look:0};
  H.spawnTraffic(s);H.spawnPedestrians(s);H.updateCamera(s,0,true);
  const requested=query.get('shot');if(['play','drive','mission','title'].includes(requested))H.setupShot(s,requested);
  const startNew=()=>{const next=H.newState(seed);H.spawnTraffic(next);H.spawnPedestrians(next);Object.assign(s,next);s.mode='play';H.updateCamera(s,0,true);H.acceptMission(s);};
  const resume=()=>{if(s.mode==='pause')s.mode='play';else if(!H.loadSlot(s,s.slot))startNew();};
  const audio=()=>{try{H.sound.start();}catch(error){H.notify(s,'Audio unavailable. Visual play continues.');}};
  window.addEventListener('keydown',event=>{
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Tab'].includes(event.key))event.preventDefault();
    const key=event.key.toLowerCase();input.keys.add(key);if(event.repeat||s.shot)return;audio();
    if(key==='escape'){s.mode=s.mode==='play'?'pause':'play';input.firing=false;return;}
    if(key==='v'){s.sound=!s.sound;H.notify(s,s.sound?'SOUND ON':'SOUND MUTED');}
    if(s.mode!=='play'){
      if(['1','2','3'].includes(key))s.slot=Number(key)-1;
      if(key==='enter')resume();if(key==='n')startNew();if(key==='l')H.loadSlot(s,s.slot);if(key==='f')H.writeSlot(s,s.slot);
    }else {if(key==='e')H.enterOrExit(s);if(key==='m')H.acceptMission(s);if(key==='f')H.writeSlot(s,s.slot);}
  });
  window.addEventListener('keyup',event=>input.keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur',()=>{input.keys.clear();input.firing=false;input.mouse=false;});
  canvas.addEventListener('contextmenu',event=>event.preventDefault());
  canvas.addEventListener('mousedown',event=>{
    audio();canvas.focus();if(s.shot)return;
    const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*1280/rect.width,y=(event.clientY-rect.top)*720/rect.height;
    if(s.mode!=='play') {if(x>52&&x<514){if(y>279&&y<323)resume();else if(y>328&&y<371)startNew();else if(y>413&&y<605)s.slot=H.clamp(Math.floor((y-413)/64),0,2);else if(y>621&&y<655&&x>225&&x<325)H.writeSlot(s,s.slot);else if(y>621&&y<655&&x>350)H.loadSlot(s,s.slot);}return;}
    input.mouse=event.button===2;input.firing=event.button===0;
  });
  window.addEventListener('mouseup',()=>{input.mouse=false;input.firing=false;});
  canvas.addEventListener('mousemove',event=>{if(input.mouse)input.look+=event.movementX;});
  H.step = dt=>{
    s.time+=dt;s.ticks++;if(s.mode==='play'){
      s.elapsed+=dt;if(s.player.car)H.updateCar(s,input,dt);else H.updateFoot(s,input,dt);
      H.updateTraffic(s,dt);H.updatePedestrians(s,dt);H.updateWanted(s,dt);H.updatePursuit(s,dt);H.updateMissions(s,dt);
      for(const p of s.particles)p.life-=dt;s.particles=s.particles.filter(p=>p.life>0);
    }else if(s.mode==='title'){H.updateTraffic(s,dt);H.updatePedestrians(s,dt);}
    if(s.dialogue&&s.dialogue.until<s.time)s.dialogue=null;
    H.updateCamera(s,dt);
  };
  H.draw=()=>{H.renderScene(ctx,s);if(s.mode==='play')H.drawHUD(ctx,s);else H.drawTitle(ctx,s);};
  H.state=s;H.input=input;H.startNew=startNew;H.canvas=canvas;
  H.draw();window.__shotReady=!!s.shot;
  let previous=performance.now(),accumulator=0;
  const frame=now=>{const delta=Math.min(.1,(now-previous)/1000);previous=now;if(!s.shot){accumulator+=delta;let steps=0;while(accumulator>=1/60&&steps++<6){H.step(1/60);accumulator-=1/60;}H.draw();H.sound.update(s);}requestAnimationFrame(frame);};
  requestAnimationFrame(frame);
})();
