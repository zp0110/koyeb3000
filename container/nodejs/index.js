'use strict';

const os=require('os'),http=require('http'),fs=require('fs'),net=require('net'),path=require('path');
const {execSync,exec}=require('child_process');
const {WebSocket,createWebSocketStream}=require('ws');

const PORT=parseInt(process.env.PORT,10)||3000, TOKEN=process.env.TOKEN, DOMAIN=process.env.DOMAIN;
if(!TOKEN||!DOMAIN||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(TOKEN))process.exit(1);

try{require.resolve('ws')}catch{execSync('npm install ws',{stdio:'ignore'})}

const s=path.resolve(__dirname,'start.sh');
if(fs.existsSync(s))fs.chmod(s,0o700,e=>{if(!e)exec(`bash ${s}`,{stdio:'ignore'})});

const server=http.createServer((req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Content-Security-Policy',"default-src 'none'");
    res.setHeader('Cache-Control','no-store');
    if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});res.end('🟢 Service is running.');return;}
    res.writeHead(404);res.end();
});
server.on('error',()=>process.exit(1));
server.listen(PORT);

const tokenBytes=TOKEN.replace(/-/g,'');
const wsServer=new WebSocket.Server({server});

wsServer.on('connection',ws=>{
    ws.once('message',msg=>{
        if(!Buffer.isBuffer(msg)||msg.length<22){ws.close();return;}
        const ver=msg[0];
        if(!msg.slice(1,17).every((v,i)=>v===parseInt(tokenBytes.substr(i*2,2),16))){ws.close();return;}
        let i=18+msg.readUInt8(17)+1;
        if(msg.length<i+3){ws.close();return;}
        const port=msg.readUInt16BE(i);i+=2;
        const addrType=msg.readUInt8(i);i+=1;
        let host='';
        if(addrType===1){
            if(msg.length<i+4){ws.close();return;}
            host=msg.slice(i,i+4).join('.');i+=4;
        }else if(addrType===2){
            if(msg.length<i+1){ws.close();return;}
            const l=msg.readUInt8(i);i+=1;
            if(msg.length<i+l){ws.close();return;}
            host=msg.slice(i,i+l).toString('utf8');i+=l;
        }else if(addrType===3){
            if(msg.length<i+16){ws.close();return;}
            const p=[];
            for(let j=0;j<16;j+=2)p.push(msg.readUInt16BE(i+j).toString(16));
            host=p.join(':');i+=16;
        }else{ws.close();return;}
        ws.send(Buffer.from([ver,0]));
        const stream=createWebSocketStream(ws),payload=msg.slice(i);
        const conn=net.connect({host,port},()=>{
            if(payload.length>0)conn.write(payload);
            stream.on('error',()=>{}).pipe(conn).on('error',()=>{}).pipe(stream);
        });
        conn.on('error',()=>ws.close());
        conn.on('close',()=>{if(ws.readyState!==WebSocket.CLOSED)ws.close();});
        stream.on('close',()=>conn.destroy());
    });
    ws.on('error',()=>{});
});
wsServer.on('error',()=>{});

function shutdown(){wsServer.close(()=>server.close(()=>process.exit(0)));setTimeout(()=>process.exit(1),5000).unref();}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
process.on('uncaughtException',()=>{});process.on('unhandledRejection',()=>{});
