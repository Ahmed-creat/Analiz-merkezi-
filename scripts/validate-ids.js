#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const root=process.cwd(), registryPath=path.join(root,'content','mufredat','konu_kayit_defteri.json');
if(!fs.existsSync(registryPath)){console.error('konu kayıt defteri yok');process.exit(1);}
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8')); const ids=new Set((registry.records||[]).map(x=>x.konu_id)); let failed=false;
if(registry.conflicts&&registry.conflicts.length){console.warn('kimlik çakışmaları owner onayına devredildi: '+registry.conflicts.length); registry.conflicts.forEach(x=>console.warn(' - '+x.konu_id));}
const graph=JSON.parse(fs.readFileSync(path.join(root,'content','iliski_grafi.json'))); for(const n of graph.dugumler||[]){if(!ids.has(n.konu_id)){console.error('graf düğümü defterde yok: '+n.konu_id);failed=true;}}
const dir=path.join(root,'content','soru_havuzlari'); for(const file of fs.readdirSync(dir).filter(x=>x.endsWith('.json')&&x!=='index.json')){const pool=JSON.parse(fs.readFileSync(path.join(dir,file)));if(!ids.has(pool.konu_id)){console.error('havuz konu_id defterde yok: '+pool.konu_id);failed=true;}}
if(failed)process.exit(1); console.log('validate:ids: '+ids.size+' kayıt, graf/havuz kimlikleri uyumlu');
