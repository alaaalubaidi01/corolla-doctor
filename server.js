const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'public'),DATA=path.join(__dirname,'data');
fs.mkdirSync(DATA,{recursive:true});
const rd=(f,d)=>{try{return JSON.parse(fs.readFileSync(path.join(DATA,f),'utf8'))}catch(e){return d}};
const wr=(f,v)=>fs.writeFileSync(path.join(DATA,f),JSON.stringify(v,null,1));
if(!fs.existsSync(path.join(DATA,'shops.json')))wr('shops.json',[
 {name:'مركز الكرادة للصيانة السريعة',area:'الكرادة',spec:'زيوت وفلاتر',phone:'',verified:false},
 {name:'ورشة المنصور للتشخيص',area:'المنصور',spec:'تشخيص أعطال',phone:'',verified:false},
 {name:'مركز بغداد الجديدة',area:'بغداد الجديدة',spec:'صيانة سريعة',phone:'',verified:false}]);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.webmanifest':'application/manifest+json'};
const hits={};
const clean=(x,n)=>String(x||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,n);
const body=req=>new Promise(r=>{let b='';req.on('data',c=>{b+=c;if(b.length>4000)req.destroy()});req.on('end',()=>{try{r(JSON.parse(b))}catch(e){r({})}})});
const json=(res,c,o)=>{res.writeHead(c,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(o))};
const limited=ip=>{const n=Date.now();hits[ip]=(hits[ip]||[]).filter(t=>n-t<60000);if(hits[ip].length>=10)return true;hits[ip].push(n);return false};
http.createServer(async(req,res)=>{
 const u=req.url.split('?')[0],ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0];
 if(u==='/api/shops')return json(res,200,rd('shops.json',[]));
 if(u==='/api/chat'&&req.method==='GET')return json(res,200,rd('chat.json',[]).slice(-50));
 if(u==='/api/chat'&&req.method==='POST'){
  if(limited(ip))return json(res,429,{error:'slow down'});
  const b=await body(req),text=clean(b.text,200);if(!text)return json(res,400,{error:'empty'});
  const m=rd('chat.json',[]);m.push({name:clean(b.name,20)||'سائق',text,t:Date.now()});wr('chat.json',m.slice(-200));return json(res,200,{ok:1});}
 if(u==='/api/feedback'&&req.method==='POST'){
  if(limited(ip))return json(res,429,{error:'slow down'});
  const b=await body(req),text=clean(b.text,500);if(!text)return json(res,400,{error:'empty'});
  const f=rd('feedback.json',[]);f.push({text,t:Date.now()});wr('feedback.json',f);return json(res,200,{ok:1});}
 const p=path.resolve(PUB,'.'+(u==='/'?'/index.html':u));
 if(!p.startsWith(PUB)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(res);
}).listen(PORT,()=>console.log('http://localhost:'+PORT));
