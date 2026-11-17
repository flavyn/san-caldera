// Reproducible artifact checks: standard library only, no browser dependency.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const assert=(test,message)=>{if(!test)throw new Error(message);};
const tree=dir=>readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:1).flatMap(e=>e.isDirectory()?[{path:join(dir,e.name),directory:true},...tree(join(dir,e.name))]:[{path:join(dir,e.name),directory:false}]);
const game=tree(join(root,'game')),files=game.filter(e=>!e.directory),bytes=files.reduce((n,e)=>n+statSync(e.path).size,0);
assert(game.length<=993,'Too many game entries');assert(bytes<=48*1024*1024,'Game exceeds byte cap');
for(const e of files){
 const source=readFileSync(e.path,'utf8');assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(source),'Network API in '+e.path);
 if(e.path.endsWith('.js')){const result=spawnSync(process.execPath,['--check',e.path],{encoding:'utf8'});assert(result.status===0,result.stderr);}
}
const html=readFileSync(join(root,'game/index.html'),'utf8');
for(const [,src]of html.matchAll(/<script src="([^"]+)"/g)){assert(src.startsWith('src/'),'Nonlocal script');assert(existsSync(join(root,'game',src)),'Missing script '+src);}
const images=readdirSync(join(root,'screenshots')).sort();assert(images.length===4,'Need four screenshots');
for(const name of images){const data=readFileSync(join(root,'screenshots',name));assert(data.length<262144,'Oversized screenshot');assert(data[0]===255&&data[1]===216,'Not JPEG');}
const outputs=['out','out-repeat'];
for(const output of outputs){const p=spawnSync(process.execPath,['main.ts'],{cwd:root,env:{...process.env,MAKEFUN_OUTPUT_DIR:resolve(root,output)},encoding:'utf8'});assert(p.status===0,p.stderr);}
const manifest=folder=>tree(join(root,folder)).filter(e=>!e.directory).map(e=>({path:relative(join(root,folder),e.path),sha256:createHash('sha256').update(readFileSync(e.path)).digest('hex')}));
const first=manifest(outputs[0]),second=manifest(outputs[1]);assert(JSON.stringify(first)===JSON.stringify(second),'Output bytes differ');
const again=spawnSync(process.execPath,['main.ts'],{cwd:root,env:{...process.env,MAKEFUN_OUTPUT_DIR:resolve(root,'out')},encoding:'utf8'});assert(again.status===0,again.stderr);assert(JSON.stringify(first)===JSON.stringify(manifest('out')),'Same-directory rerun changed bytes');
console.log(JSON.stringify({node:process.version,gameEntries:game.length,gameFiles:files.length,gameBytes:bytes,screenshots:images.map(name=>({name,bytes:statSync(join(root,'screenshots',name)).size})),deterministic:true,outputFiles:first.length,dossierSha256:first.find(e=>e.path==='dossier.json').sha256},null,2));
