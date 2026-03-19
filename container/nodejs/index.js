'use strict';
const os=require('os'),http=require('http'),fs=require('fs'),net=require('net'),path=require('path');
const {execSync,exec}=require('child_process');
const {WebSocket,createWebSocketStream}=require('ws');
const PORT=parseInt(process.env.PORT,10)||3000, TOKEN=process.env.TOKEN, DOMAIN=process.env.DOMAIN;
if(!TOKEN||!DOMAIN||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(TOKEN))process.exit(1);
try{require.resolve('ws')}catch{execSync('npm install ws',{stdio:'ignore'})}

const htmlContent=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wildlife Conservation Portal</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0c3b2e 0%, #1a5c48 30%, #2d936c 70%, #4bc992 100%);
            background-attachment: fixed;
            color: #fff;
            line-height: 1.6;
            min-height: 100vh;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-top: 20px;
        }
        
        .header h1 {
            font-size: 3.2rem;
            margin-bottom: 10px;
            background: linear-gradient(to right, #fff, #b8f1d0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .header p {
            font-size: 1.2rem;
            max-width: 800px;
            margin: 0 auto 30px;
            opacity: 0.9;
        }
        
        .search-container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto 40px;
        }
        
        .search-box {
            width: 100%;
            padding: 18px 25px;
            font-size: 1.1rem;
            border: none;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.93);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            outline: none;
            color: #0c3b2e;
        }
        
        .search-box:focus {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(76, 201, 146, 0.5);
        }
        
        .search-box::placeholder {
            color: #6b8c7d;
        }
        
        .main-container {
            max-width: 1300px;
            margin: 0 auto;
        }
        
        .category {
            margin-bottom: 50px;
        }
        
        .category-title {
            font-size: 1.8rem;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
        }
        
        .category-title i {
            margin-right: 15px;
            color: #4bc992;
        }
        
        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        
        .link-card {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 22px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        
        .link-card:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            border-color: rgba(76, 201, 146, 0.3);
        }
        
        .link-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 18px;
            font-size: 1.5rem;
            color: #4bc992;
            flex-shrink: 0;
        }
        
        .link-content {
            flex: 1;
        }
        
        .link-content h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: #fff;
        }
        
        .link-content p {
            font-size: 0.9rem;
            opacity: 0.8;
            line-height: 1.4;
        }
        
        .stats-bar {
            display: flex;
            justify-content: space-around;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            padding: 20px;
            margin: 40px 0;
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4bc992;
            display: block;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
            margin-top: 5px;
        }
        
        .quote-section {
            background-color: rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 30px;
            margin: 50px 0;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            border-left: 5px solid #4bc992;
        }
        
        .quote-section blockquote {
            font-size: 1.4rem;
            font-style: italic;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .quote-section cite {
            font-size: 1rem;
            opacity: 0.8;
        }
        
        .footer {
            text-align: center;
            margin-top: 60px;
            padding: 30px 0 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0.8;
        }
        
        .footer a {
            color: #4bc992;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer a:hover {
            color: #b8f1d0;
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.2rem;
            }
            
            .stats-bar {
                flex-direction: column;
                gap: 20px;
            }
            
            .links-grid {
                grid-template-columns: 1fr;
            }
            
            .quote-section blockquote {
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 Wildlife Conservation Portal</h1>
        <p>Your gateway to protecting Earth's precious biodiversity. Discover organizations, resources, and ways to make a difference for our planet's incredible wildlife.</p>
        
        <div class="search-container">
            <input type="text" class="search-box" placeholder="🔍 Search conservation topics, species, or organizations...">
        </div>
    </div>
    
    <div class="stats-bar">
        <div class="stat-item">
            <span class="stat-value">41,000+</span>
            <div class="stat-label">Threatened Species</div>
        </div>
        <div class="stat-item">
            <span class="stat-value">15%</span>
            <div class="stat-label">Land Protected</div>
        </div>
        <div class="stat-item">
            <span class="stat-value">8%</span>
            <div class="stat-label">Ocean Protected</div>
        </div>
        <div class="stat-item">
            <span class="stat-value">1M+</span>
            <div class="stat-label">Species at Risk</div>
        </div>
    </div>
    
    <div class="main-container">
        <div class="category">
            <h2 class="category-title"><i class="fas fa-globe-americas"></i> Major Conservation Organizations</h2>
            <div class="links-grid">
                <div class="link-card" onclick="window.open('https://www.worldwildlife.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-paw"></i>
                    </div>
                    <div class="link-content">
                        <h3>World Wildlife Fund (WWF)</h3>
                        <p>Leading conservation organization working in 100 countries to protect endangered species and habitats.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.conservation.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div class="link-content">
                        <h3>Conservation International</h3>
                        <p>Protecting nature for the benefit of humanity through science, partnerships, and field demonstrations.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.nature.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-tree"></i>
                    </div>
                    <div class="link-content">
                        <h3>The Nature Conservancy</h3>
                        <p>Global environmental organization working to create a world where people and nature can thrive.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.wcs.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-binoculars"></i>
                    </div>
                    <div class="link-content">
                        <h3>Wildlife Conservation Society</h3>
                        <p>Saving wildlife and wild places worldwide through science, conservation action, education, and inspiring people.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.fws.gov', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-flag-usa"></i>
                    </div>
                    <div class="link-content">
                        <h3>U.S. Fish & Wildlife Service</h3>
                        <p>Federal agency dedicated to the conservation and management of fish, wildlife, plants, and their habitats.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.iucn.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="link-content">
                        <h3>IUCN</h3>
                        <p>International Union for Conservation of Nature - the global authority on the status of the natural world.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <h2 class="category-title"><i class="fas fa-water"></i> Marine & Ocean Conservation</h2>
            <div class="links-grid">
                <div class="link-card" onclick="window.open('https://www.oceanconservancy.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-fish"></i>
                    </div>
                    <div class="link-content">
                        <h3>Ocean Conservancy</h3>
                        <p>Working to protect the ocean from today's greatest global challenges through science-based solutions.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.seashepherd.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-ship"></i>
                    </div>
                    <div class="link-content">
                        <h3>Sea Shepherd</h3>
                        <p>International marine conservation organization using direct action tactics to defend marine wildlife.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://coral.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-water"></i>
                    </div>
                    <div class="link-content">
                        <h3>Coral Reef Alliance</h3>
                        <p>Uniting communities to save coral reefs through innovative programs and science-based solutions.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.projectaware.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-diving"></i>
                    </div>
                    <div class="link-content">
                        <h3>Project AWARE</h3>
                        <p>Global movement for ocean protection, working with divers to protect marine environments.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.marinemegafauna.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-fish"></i>
                    </div>
                    <div class="link-content">
                        <h3>Marine Megafauna Foundation</h3>
                        <p>Research and conservation organization focused on threatened marine megafauna like sharks, rays, and whales.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.savethesea.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="link-content">
                        <h3>Oceana</h3>
                        <p>International organization focused exclusively on ocean conservation, protecting marine ecosystems.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <h2 class="category-title"><i class="fas fa-book"></i> Research & Data Resources</h2>
            <div class="links-grid">
                <div class="link-card" onclick="window.open('https://www.worldwildlife.org/species/directory', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="link-content">
                        <h3>WWF Species Directory</h3>
                        <p>Comprehensive database of threatened and endangered species worldwide with conservation status.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.iucnredlist.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-list-alt"></i>
                    </div>
                    <div class="link-content">
                        <h3>IUCN Red List</h3>
                        <p>The world's most comprehensive inventory of the global conservation status of species.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.birdlife.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-crow"></i>
                    </div>
                    <div class="link-content">
                        <h3>BirdLife International</h3>
                        <p>Global partnership of conservation organizations focusing on bird conservation.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.unep-wcmc.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="link-content">
                        <h3>UNEP-WCMC</h3>
                        <p>United Nations Environment Programme World Conservation Monitoring Centre.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.traffic.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="link-content">
                        <h3>TRAFFIC</h3>
                        <p>Wildlife trade monitoring network working to ensure trade is not a threat to conservation.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.rewild.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <div class="link-content">
                        <h3>RE:wild</h3>
                        <p>Protecting and restoring biodiversity, wilderness areas, and wild animals globally.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="quote-section">
            <blockquote>
                "Wildlife conservation is not just about saving animals; it's about saving ourselves. The fate of humanity is inextricably linked to the fate of the natural world."
            </blockquote>
            <cite>— Dr. Jane Goodall, Primatologist and Conservationist</cite>
        </div>
        
        <div class="category">
            <h2 class="category-title"><i class="fas fa-tools"></i> Tools & Resources</h2>
            <div class="links-grid">
                <div class="link-card" onclick="window.open('https://www.inaturalist.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <div class="link-content">
                        <h3>iNaturalist</h3>
                        <p>Community science platform to record and share observations of biodiversity worldwide.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.globalwildlife.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    <div class="link-content">
                        <h3>Global Wildlife Conservation</h3>
                        <p>Protecting biodiversity through scientific research, exploration, and conservation action.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.wwf.org.uk/learn/love-nature/planet-saving-hacks', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="link-content">
                        <h3>Conservation Tips</h3>
                        <p>Practical ways to help protect wildlife and habitats in your daily life.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.earthsendangered.com', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="link-content">
                        <h3>Earth's Endangered Creatures</h3>
                        <p>Database of endangered species with information on threats and conservation status.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.wildlifetrusts.org', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-hands"></i>
                    </div>
                    <div class="link-content">
                        <h3>Wildlife Trusts</h3>
                        <p>Network of local conservation organizations protecting wildlife across the UK.</p>
                    </div>
                </div>
                
                <div class="link-card" onclick="window.open('https://www.conservationcareers.com', '_blank')">
                    <div class="link-icon">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div class="link-content">
                        <h3>Conservation Careers</h3>
                        <p>Job board and career advice for those wanting to work in wildlife conservation.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>Wildlife Conservation Portal | Created to support biodiversity protection | 
        <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a> | 
        <a href="https://www.un.org/sustainabledevelopment/biodiversity/" target="_blank">UN Sustainable Development Goal 15</a></p>
        <p style="margin-top: 10px;">"The greatness of a nation and its moral progress can be judged by the way its animals are treated." — Mahatma Gandhi</p>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchBox = document.querySelector('.search-box');
            
            const linkCards = document.querySelectorAll('.link-card');
            linkCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.style.transform = 'translateY(-5px) scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-5px) scale(1)';
                    }, 150);
                });
            });
            
            searchBox.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = this.value.trim();
                    if (query) {
                        const searchUrl = \`https://www.google.com/search?q=\${encodeURIComponent(query + " wildlife conservation")}\`;
                        window.open(searchUrl, '_blank');
                    }
                }
            });
        });
    </script>
</body>
</html>`;

const server=http.createServer((req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Content-Security-Policy',"default-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.google.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com;");
    res.setHeader('Cache-Control','no-store');
    if(req.url==='/'){
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        res.end(htmlContent);
        return;
    }
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
