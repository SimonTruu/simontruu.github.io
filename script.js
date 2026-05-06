const W=680,H=820;
const gods={};
const selected={cat:new Set(),death:new Set(),trade:new Set()};
let activeGod=null,hoveredNode=null;

let panX=0,panY=0,zoom=1;
let isPanning=false,panStart={x:0,y:0},panOrigin={x:0,y:0};

function n(id,x,y,type,label,val,desc,deps){
  return{id,x,y,type,label,val,desc,deps:deps||[]};
}

function dimColor(hex, factor = 0.5) {
  const r = Math.floor(parseInt(hex.slice(1,3),16) * factor);
  const g = Math.floor(parseInt(hex.slice(3,5),16) * factor);
  const b = Math.floor(parseInt(hex.slice(5,7),16) * factor);
  return `rgb(${r},${g},${b})`;
}

function mixWithWhite(hex, amount = 0.15) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);

  const nr = Math.floor(r + (255 - r) * amount);
  const ng = Math.floor(g + (255 - g) * amount);
  const nb = Math.floor(b + (255 - b) * amount);

  return `rgb(${nr},${ng},${nb})`;
}

function mkCat(){
  const nodes=[
    n('c0',340,44,'start','Sekhara','Ascendancy Start','The Eternal Watcher opens her eyes upon your civilisation.',[]),

    n('cs1',200,130,'stat','Night Hunters','+8% night prod','Cat-spirits keep your workers toiling while others sleep.',['c0']),
    n('cs2',340,130,'stat','Feline Agility','+10% unit speed','Your soldiers move with cat-like grace across all terrain.',['c0']),
    n('cs3',480,130,'stat','Border Sight','+12% vision range','Cats extend your eyes far into neighbouring lands.',['c0']),

    n('cm1',130,220,'minor','Wild Claiming','Borders expand passively','Unclaimed tiles within 2 steps of your border have a 10% chance each turn to peacefully convert to your civilisation.',['cs1']),
    n('cs4',260,220,'stat','Honed Claws','+9% melee atk','Soldiers blessed by Sekhara strike with precision.',['cs1','cs2']),
    n('cs5',400,220,'stat','Whisker Wards','+8% city defence','Cats detect threats before they arrive at your gates.',['cs2','cs3']),
    n('cm2',540,220,'minor','Intimidating Presence','-5% enemy move near cities','Enemy units moving adjacent to your cities lose movement — unnerved by Sekhara\'s watching eyes.',['cs3']),

    n('cs6',200,315,'stat','Velvet Tribute','+7% luxury income','Furs and exotic goods are prized in Sekhara\'s name.',['cm1','cs4']),
    n('cs7',340,315,'stat','Amber Eyes','+9% ambush dmg','Your ambushing units strike with devastating precision.',['cs4','cs5']),
    n('cs8',480,315,'stat','Pounce Ready','+8% first-strike','Explosive opening force — your units always strike first.',['cs5','cm2']),

    n('cm3',130,410,'minor','Moonlit Markets','Trade routes earn +15% at night','Sekhara blesses nocturnal exchange. Trade routes through your cities earn bonus gold during night cycles, making you a prized waypoint.',['cs6']),
    n('cs9',270,410,'stat','Soft Paws','+5% spy success','Sekhara teaches silence. Your spies move unseen.',['cs6','cs7']),
    n('cs10',400,410,'stat','Nine Lives','+10% unit survival','Units have a second chance — 10% to survive at 1 HP.',['cs7','cs8']),
    n('cm4',550,410,'minor','Stalker\'s Discipline','Ambush units never auto-reveal','Ambushing units are no longer revealed by enemy proximity — only direct movement onto their tile triggers detection.',['cs8']),

    n('cs11',200,505,'stat','Cat Naps','+7% pop growth','Sekhara blesses your families with feline fertility.',['cm3','cs9']),
    n('cs12',340,505,'stat','Pack Instinct','+7% ally relations','Diplomats carry Sekhara\'s aura into every negotiation.',['cs9','cs10']),
    n('cs13',480,505,'stat','Keen Ears','+6% intel gain','Nothing passes unheard in Sekhara\'s domain.',['cs10','cm4']),

    n('cm5',130,600,'minor','Cat Patrols','Idle pop generates scout data','Each idle citizen passively generates 0.5 scouting points per turn, as if assigned as scouts — cats wander even where unclaimed.',['cs11']),
    n('cs14',270,600,'stat','Fur & Fortune','+8% artisan output','Artisans work with uncanny cat-blessed inspiration.',['cs11','cs12']),
    n('cs15',400,600,'stat','Claw Mark','+10% scout xp','Scouts learn more deeply from every territory marked.',['cs12','cs13']),
    n('cm6',550,600,'minor','Oracle Whiskers','Foresee one event per era','Once per era, a random future event is revealed one turn before it occurs. Sekhara\'s cats sense the tremors of fate.',['cs13']),

    n('cm7',200,695,'minor','Festival of Sekhara','+20% hap & prod for 3t','Declare a Cat Festival every 20 turns — cities ring with joy, artisans work with divine enthusiasm for 3 full turns.',['cm5','cs14']),
    n('cs16',340,695,'stat','Blessed Fur','+5% all resist','Her favour wraps your people like a warm coat against fate.',['cs14','cs15']),
    n('cm8',480,695,'minor','Familiar Bonds','+1 vision & +5% xp per hero','Each hero gains a sacred cat familiar — extended sight and guided combat, providing tangible battlefield advantages.',['cs15','cm6']),

    n('cj1',200,778,'keystone','The Watcher\'s Compact','Spies detected, no surprise wars','Fog within 5 tiles of cats/cities is permanently reduced. Enemy spies in your cities are always detected. No civilisation can declare a surprise war on you.',['cm7','cs16']),
    n('cj2',480,778,'keystone','Nine-Life Sovereignty','30% chance cities survive capture','When a city would fall, 30% chance it holds at 1 HP with all units revived. Defeated units have 15% chance to reform at the nearest city after 5 turns.',['cs16','cm8']),
  ];
  return{nodes,col:'#d4a055',glow:'#c8843a',dim:'#5a3a15',dark:'#52260a',name:'Sekhara, the Eternal Watcher',flavor:'Her eyes see all things, even the fate of empires.'};
}

function mkDeath(){
  const nodes=[
    n('d0',340,44,'start','Mortvael','Ascendancy Start','The Lord of the Harvested turns his gaze upon the living.',[]),

    n('ds1',200,130,'stat','Grave Tithe','+10% gold from deaths','Each unit killed anywhere in your borders yields a gold tithe to Mortvael.',['d0']),
    n('ds2',340,130,'stat','Dreadful Name','+11% enemy morale dmg','Your reputation precedes your armies. Enemy morale crumbles on contact.',['d0']),
    n('ds3',480,130,'stat','Hollow Iron','-8% unit upkeep','The dead need no food or wages. Costs reduced across all unit types.',['d0']),

    n('dm1',130,220,'minor','Corpse Manpower','Harvest 50 manpower/battle','After each battle, harvest fallen enemies for 5 manpower each — up to 50 per engagement. A gruesome but effective way to sustain armies far from home.',['ds1']),
    n('ds4',270,220,'stat','Sorrow Tax','+7% faith from grief','Temples capture the grief of every death. Faith generation surges near battlefields.',['ds1','ds2']),
    n('ds5',400,220,'stat','Bone Armour','+12% undead defence','Bones of the fallen make stronger armour than any smith.',['ds2','ds3']),
    n('dm2',550,220,'minor','Walking Graves','Free undead worker every 15t','Graveyards now periodically produce Grave Workers — slow but free labourers who consume no food, take no wages, and never strike.',['ds3']),

    n('ds6',200,315,'stat','Plague-Touched','+8% disease spread','Weaponise illness. Disease spreads faster through enemy territory.',['dm1','ds4']),
    n('ds7',340,315,'stat','Marching Dead','+8% undead speed','Risen units move with unnatural, tireless haste across all terrain.',['ds4','ds5']),
    n('ds8',480,315,'stat','Silent March','+9% undead stealth','The dead make no sound. Undead units are harder for enemies to detect.',['ds5','dm2']),

    n('dm3',130,410,'minor','Death Tithe','50% gold refund on any death','Every unit death within your borders — enemy, friendly, or neutral — pays 50% of that unit\'s original cost back to your treasury.',['ds6']),
    n('ds9',270,410,'stat','Pale Harvest','+11% resource from kills','Nothing is wasted. Resources dropped by defeated enemies are dramatically increased.',['ds6','ds7']),
    n('ds10',400,410,'stat','Cold Fields','+9% food preservation','Mortvael\'s chill keeps stores from spoiling. Food loss from distance and time reduced.',['ds7','ds8']),
    n('dm4',550,410,'minor','Plague Economy','Infect cities for Faith & Gold','Deliberately blight a city — yours or enemy — reducing output but triggering 3 turns of escalating Faith and Gold dividends from the suffering.',['ds8']),

    n('ds11',200,505,'stat','Wasting Touch','+7% siege dmg','Siege weapons blessed by Mortvael corrode whatever they strike.',['dm3','ds9']),
    n('ds12',340,505,'stat','Pale Blessing','+6% research speed','Those who study death understand impermanence. Research accelerates.',['ds9','ds10']),
    n('ds13',480,505,'stat','Grief Tax','+7% stability recovery','Cities that have experienced war or disaster recover stability faster.',['ds10','dm4']),

    n('dm5',130,600,'minor','Blood Price','Sacrifice pop for instant prod','Consume 1 population from a city to receive an entire year of its production as an immediate lump sum — a crisis tool for desperate moments.',['ds11']),
    n('ds14',270,600,'stat','Deathless Will','+6% hero resilience','Your heroes have stared into the void. They resist permanent death.',['ds11','ds12']),
    n('ds15',400,600,'stat','Mortuary Guilds','+9% city production','Death is an industry. Mortuary guilds boost output in anticipation of renewal.',['ds12','ds13']),
    n('dm6',550,600,'minor','Deathshroud Lands','-5% enemy morale in your territory','Your very soil whispers of endings. Foreign soldiers feel existential dread — a subtle terror that cannot be countered by morale bonuses.',['ds13']),

    n('dm7',200,695,'minor','Risen Battalion','Raise last battle\'s dead once/era','Once per era, call upon Mortvael to return your fallen soldiers as undead echo-warriors at 60% of original stats — shadows of their former selves, but still deadly.',['dm5','ds14']),
    n('ds16',340,695,'stat','Death Tax','+5% pop capacity','The dead make room for the living. Mortvael keeps the balance.',['ds14','ds15']),
    n('dm8',480,695,'minor','The Great Ledger','Tech per 1000 deaths tracked','Every 1000 deaths across your game unlocks one forbidden technology from Mortvael\'s Archive — disciplines of decay and necromantic engineering.',['ds15','dm6']),

    n('dj1',200,778,'keystone','The Undying Economy','Shades as zero-upkeep workers','Dead citizens reanimate as Shade Workers at 40% output — zero food, zero gold. Up to 50% of your workforce can be Shades. They never rebel, strike, or need housing.',['dm7','ds16']),
    n('dj2',480,778,'keystone','Death Is Not The End','Destroyed cities become undead fortresses','When any city is captured, it collapses into a Mortvael\'s Anchor — an undead fortress loyal to you that generates units, cannot be captured, and yields nothing to destroyers.',['ds16','dm8']),
  ];
  return{nodes,col:'#8a4fd4',glow:'#7040c8',dim:'#2a1550',dark:'#301457',name:'Mortvael, Lord of the Harvested',flavor:'He does not end things — he transforms them.'};
}

function mkTrade(){
  const nodes=[
    n('tr0',340,44,'start','Aurentis','Ascendancy Start','The Golden Accord extends his hand across all your borders.',[]),

    n('ts1',200,130,'stat','Gilded Tongue','+10% diplomacy success','Diplomatic actions succeed more often when backed by active trade agreements.',['tr0']),
    n('ts2',340,130,'stat','Market Intuition','+9% market gold','Traders read demand before it forms. Markets generate more gold passively.',['tr0']),
    n('ts3',480,130,'stat','Port Authority','+9% coastal trade income','Your ports are orderly and efficient. Sea trade routes earn substantially more.',['tr0']),

    n('tm1',130,220,'minor','Free Market Zones','3 cities get double trade slots','Designate up to 3 cities as Free Market Zones — their trade route capacity doubles and they attract one foreign merchant per era who pays rent and shares knowledge.',['ts1']),
    n('ts4',270,220,'stat','Coin Diplomacy','+11% bribe efficiency','Gold speaks louder than words. Bribes achieve dramatically more effect.',['ts1','ts2']),
    n('ts5',400,220,'stat','Spice Routes','+12% luxury value','Merchants know what buyers truly desire. Luxury goods are worth far more.',['ts2','ts3']),
    n('tm2',550,220,'minor','Trade Contracts','Soft alliances via commerce','Offer Trade Contracts to neutral civilisations — they gain 10% income from their routes; in return they become economic partners and are unlikely to declare war.',['ts3']),

    n('ts6',200,315,'stat','Fair Witness','+9% treaty reliability','Your word is your contract. Allies are far less likely to break agreements.',['tm1','ts4']),
    n('ts7',340,315,'stat','Caravan Guards','+7% trade route safety','Armed escorts keep gold flowing. Route disruption chance significantly reduced.',['ts4','ts5']),
    n('ts8',480,315,'stat','Trade Wind','+8% merchant ship speed','Aurentis fills the sails of every merchant vessel in your fleet.',['ts5','tm2']),

    n('tm3',130,410,'minor','Deficit Spending','Borrow gold at 5% interest/turn','Spend gold you do not have for emergency purchases — armies, walls, food imports — at the cost of compounding interest if ignored too long.',['ts6']),
    n('ts9',270,410,'stat','Surplus Exchange','+10% sell price bonus','Aurentis blesses those who sell at the right moment. All resource sales earn more.',['ts6','ts7']),
    n('ts10',400,410,'stat','Merchant Roads','+8% road build speed','Trade requires infrastructure. Roads are built faster and cheaper across all terrain.',['ts7','ts8']),
    n('tm4',550,410,'minor','Merchant Fleet','5 warships become income galleons','Convert up to 5 military ships into Merchant Galleons — unable to attack, but earning passive gold based on the richness of the seas they patrol.',['ts8']),

    n('ts11',200,505,'stat','Moneylending','+8% interest income','Gold lent is gold earned twice. Treasury interest income increases substantially.',['tm3','ts9']),
    n('ts12',340,505,'stat','Guild Charter','+7% artisan experience','Official guild recognition accelerates artisan skill gain across all cities.',['ts9','ts10']),
    n('ts13',480,505,'stat','Price Control','+6% inflation resistance','Your economists understand the danger of runaway markets. Inflation reduced.',['ts10','tm4']),

    n('tm5',130,600,'minor','Trade Espionage','Undercut rivals by 15%','Spies steal market prices from foreign cities — letting your merchants dump goods just below the target price, seizing their customers while remaining profitable.',['ts11']),
    n('ts14',270,600,'stat','Counting Houses','+8% base city gold','Every major city now holds a counting house. Baseline gold per city increased.',['ts11','ts12']),
    n('ts15',400,600,'stat','Balanced Ledger','+6% stability in trade cities','A prosperous economy is a stable one. Cities with trade routes generate more stability.',['ts12','ts13']),
    n('tm6',550,600,'minor','Economic Sanctions','-20% enemy trade income','Declare sanctions on an enemy — reducing their trade income by 20% and yours by 5%. Other trade-focused civilisations may join, amplifying the pressure.',['ts13']),

    n('tm7',200,695,'minor','Speculative Markets','Triple gold or lose half on bets','Once per 10 turns, bet gold on a resource outcome. Outcomes are tied to real in-game supply and demand — clever players can win consistently.',['tm5','ts14']),
    n('ts16',340,695,'stat','Debt Forgiveness','+8% enemy defect rate','Enemies burdened by war debt are far more likely to surrender when offered terms.',['ts14','ts15']),
    n('tm8',480,695,'minor','Central Bank','2% of treasury as income/turn','Construct the Central Bank wonder — it pays 2% of your total gold each turn and prevents negative treasury effects until gold reaches -500.',['ts15','tm6']),

    n('tj1',200,778,'keystone','The Grand Compact','Trade partners cannot declare war','All civs with active trade routes are permanently friendly. Additionally earn 1 gold per unit of any resource that changes hands anywhere in the world — a global tax.',['tm7','ts16']),
    n('tj2',480,778,'keystone','Monopoly of Heaven','Control one resource globally','Choose a resource: your production +50%, all foreign production pays you 10g/unit, and that resource cannot be traded between others without your permission.',['ts16','tm8']),
  ];
  return{nodes,col:'#4aad7a',glow:'#38956a',dim:'#154530',dark:'#144d33',name:'Aurentis, the Golden Accord',flavor:'All roads, all winds, all rivers exist to move coin.'};
}
/* ---- INIT ---- */
gods.cat=mkCat();
gods.death=mkDeath();
gods.trade=mkTrade();

const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
const treeArea=document.getElementById('tree-area');

function resizeCanvas(){
  canvas.width=treeArea.clientWidth||window.innerWidth;
  canvas.height=treeArea.clientHeight||(window.innerHeight-80);
  if(activeGod) drawTree(activeGod);
}

window.addEventListener('resize',resizeCanvas);
// Initial size set after DOM ready

function nm(god){const m={};gods[god].nodes.forEach(n=>m[n.id]=n);return m;}

function canUnlock(god,node){
  if(node.type==='start') return true;
  if(!node.deps.length) return true;
  return node.deps.some(d=>selected[god].has(d));
}

function drawTree(god){
  const g=gods[god];
  const {col,glow,dim,dark}=g;
  const sel=selected[god];
  const map=nm(god);
  const cw=canvas.width,ch=canvas.height;
  const base = col;
  const dimCol = dimColor(col, 0.35);
  const midCol = dimColor(col, 0.6);
  const fillLocked = mixWithWhite(col, 0.08);
  const fillAvailable = mixWithWhite(col, 0.18);
  const fillSelected = dark;

  ctx.clearRect(0,0,cw,ch);
  ctx.fillStyle='#1a1816';
  ctx.fillRect(0,0,cw,ch);

  ctx.save();
  ctx.translate(panX,panY);
  ctx.scale(zoom,zoom);

  // Grid
  ctx.strokeStyle='rgba(200,168,75,0.03)';
  ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  g.nodes.forEach(node=>{
    node.deps.forEach(depId=>{
  const dep = map[depId];
  if(!dep) return;

  const bothSelected = sel.has(node.id) && sel.has(depId);
  const oneSelected = sel.has(node.id) || sel.has(depId);

  // thickness
  ctx.lineWidth = bothSelected ? 3 : (oneSelected ? 2.2 : 1.6);

  // color (use god color always)
  ctx.strokeStyle = bothSelected
    ? col
    : (oneSelected ? col + 'aa' : col + '55');

  // brightness / visibility
  ctx.globalAlpha = bothSelected ? 0.9 : (oneSelected ? 0.7 : 0.5);

  // subtle glow for active paths
  if(bothSelected){
    ctx.shadowColor = col;
    ctx.shadowBlur = 10;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.beginPath();
  ctx.moveTo(dep.x, dep.y);
  ctx.lineTo(node.x, node.y);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
});
  });

  g.nodes.forEach(node=>{
    const isSel=sel.has(node.id);
    const canUnlk=canUnlock(god,node);
    const isHov=hoveredNode&&hoveredNode.id===node.id;
    const t=node.type;

    ctx.shadowBlur=0;
    if(isSel){ctx.shadowColor=glow;ctx.shadowBlur=isHov?24:16;}
    else if(isHov&&canUnlk){ctx.shadowColor=col;ctx.shadowBlur=10;}

    if(t==='start'){
      const r=20;
      ctx.beginPath();ctx.arc(node.x,node.y,r,0,Math.PI*2);
      ctx.fillStyle=isSel?dark:'#0c0a07';
      ctx.fill();
      ctx.strokeStyle=isSel?col:dim;
      ctx.lineWidth=isSel?2:1;
      ctx.stroke();
      ctx.beginPath();ctx.arc(node.x,node.y,r-5,0,Math.PI*2);
      ctx.strokeStyle=isSel?col+'88':dim+'55';
      ctx.lineWidth=.5;ctx.stroke();

    } else if(t==='keystone'){
      const s=24;
      ctx.save();ctx.translate(node.x,node.y);ctx.rotate(Math.PI/4);
      ctx.fillStyle=isSel?dark:'#0c0a07';
      ctx.strokeStyle=isSel?col:dim;
      ctx.lineWidth=isSel?2.5:1;
      ctx.beginPath();ctx.rect(-s,-s,s*2,s*2);
      ctx.fill();ctx.stroke();
      const s2=s+5;
      ctx.strokeStyle=isSel?col+'55':dim+'33';
      ctx.lineWidth=.5;
      ctx.beginPath();ctx.rect(-s2,-s2,s2*2,s2*2);
      ctx.stroke();
      ctx.restore();

    } else if(t==='minor'){
      const r=18;
      ctx.save();ctx.translate(node.x,node.y);

      if(isSel){
        ctx.beginPath();ctx.arc(0,0,r+6,0,Math.PI*2);
        ctx.fillStyle=col+'18';ctx.fill();
      }

      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3-Math.PI/6;
        const x2=r*Math.cos(a),y2=r*Math.sin(a);
        i===0?ctx.moveTo(x2,y2):ctx.lineTo(x2,y2);
      }
      ctx.closePath();
      ctx.fillStyle = isSel
  ? dark
  : (canUnlk ? dimColor(col, 0.15) : '#0a0806');
      ctx.fill();
      ctx.strokeStyle = isSel
  ? col
  : (canUnlk ? midCol : dimCol);
      ctx.lineWidth=isSel?2:1;
      ctx.stroke();

      if(isSel){
        const ir=10;
        ctx.beginPath();
        for(let i=0;i<6;i++){
          const a=i*Math.PI/3-Math.PI/6;
          const x2=ir*Math.cos(a),y2=ir*Math.sin(a);
          i===0?ctx.moveTo(x2,y2):ctx.lineTo(x2,y2);
        }
        ctx.closePath();
        ctx.fillStyle=col+'33';ctx.fill();
        ctx.strokeStyle=col+'66';ctx.lineWidth=.5;ctx.stroke();
      }

      if(!isSel&&canUnlk){
        ctx.beginPath();
        for(let i=0;i<6;i++){
          const a=i*Math.PI/3-Math.PI/6;
          const r2=r+3;
          const x2=r2*Math.cos(a),y2=r2*Math.sin(a);
          i===0?ctx.moveTo(x2,y2):ctx.lineTo(x2,y2);
        }
        ctx.closePath();
        ctx.strokeStyle=col+'25';ctx.lineWidth=1;ctx.stroke();
      }

      ctx.restore();

    } else {
      const r=12;
      ctx.beginPath();ctx.arc(node.x,node.y,r,0,Math.PI*2);
      ctx.fillStyle = isSel
  ? dark
  : (canUnlk ? dimColor(col, 0.15) : '#0a0806');
      ctx.fill();
      ctx.strokeStyle = isSel
  ? col
  : (canUnlk ? midCol : dimCol);
      ctx.lineWidth=isSel?1.5:1;
      ctx.stroke();
      if(isSel){
        ctx.beginPath();ctx.arc(node.x,node.y,5,0,Math.PI*2);
        ctx.fillStyle=col;ctx.fill();
      }
    }

    ctx.shadowBlur=0;

    const lblY=node.y+(t==='start'?26:t==='keystone'?32:t==='minor'?26:18);
    const textColor = isSel
  ? col
  : (canUnlk ? midCol : dimCol);

    ctx.fillStyle=textColor;
    ctx.textAlign='center';
    ctx.textBaseline='top';

    const words=node.label.split(' ');
    const fontSize=t==='keystone'?10:t==='minor'?10:9;
    ctx.font=`${t==='minor'||t==='keystone'?'600':'500'} ${fontSize}px 'Cinzel', serif`;

    if(words.length<=2){
      ctx.fillText(node.label,node.x,lblY);
    } else {
      const m=Math.ceil(words.length/2);
      ctx.fillText(words.slice(0,m).join(' '),node.x,lblY);
      ctx.fillText(words.slice(m).join(' '),node.x,lblY+11);
    }

    if(t==='minor'&&isSel){
      ctx.font='bold 13px sans-serif';
      ctx.fillStyle=col;
      ctx.fillText('⬡',node.x,node.y-8);
    }
  });

  ctx.restore(); // end pan/zoom transform
}

function hitTest(god,mx,my){
  // Convert screen coords to tree coords
  const tx=(mx-panX)/zoom;
  const ty=(my-panY)/zoom;
  let best=null,bestD=Infinity;
  gods[god].nodes.forEach(n=>{
    const r=(n.type==='keystone'?28:n.type==='minor'?22:n.type==='start'?24:16)/zoom;
    const d=Math.hypot(tx-n.x,ty-n.y);
    if(d<r&&d<bestD){bestD=d;best=n;}
  });
  return best;
}

function getPos(e){
  const r=canvas.getBoundingClientRect();
  if(e.touches) return[e.touches[0].clientX-r.left,e.touches[0].clientY-r.top];
  return[e.clientX-r.left,e.clientY-r.top];
}

// ── Pan events ──────────────────────────────────────────────
canvas.addEventListener('mousedown',e=>{
  if(!activeGod) return;
  isPanning=true;
  panStart={x:e.clientX,y:e.clientY};
  panOrigin={x:panX,y:panY};
  treeArea.classList.add('dragging');
  document.getElementById('tt').style.display='none';
});

window.addEventListener('mousemove',e=>{
  if(!activeGod) return;
  if(isPanning){
    panX=panOrigin.x+(e.clientX-panStart.x);
    panY=panOrigin.y+(e.clientY-panStart.y);
    drawTree(activeGod);
    return;
  }
  const [mx,my]=getPos(e);
  const hit=hitTest(activeGod,mx,my);
  hoveredNode=hit;
  canvas.style.cursor=hit?'pointer':'grab';

  if(hit){
    document.getElementById('tt-t').textContent=hit.label;
    document.getElementById('tt-t').style.color=gods[activeGod].col;
    const tl=hit.type==='start'?'Ascendancy Start':hit.type==='keystone'?'Major · Keystone':hit.type==='minor'?'Minor · Gameplay':'Minor · Statistic';
    document.getElementById('tt-ty').textContent=tl;
    document.getElementById('tt-d').textContent=hit.desc;
    document.getElementById('tt-v').textContent=hit.val;
    document.getElementById('tt-v').style.color=gods[activeGod].col;
    document.getElementById('node-hover-desc').textContent=hit.label+' — '+hit.val;

    const tr=treeArea.getBoundingClientRect();
    const cr=canvas.getBoundingClientRect();
    // tooltip in screen space
    const sx=panX+hit.x*zoom;
    const sy=panY+hit.y*zoom;
    let tx=sx+20, ty=sy-90;
    if(tx+220>tr.width) tx=sx-235;
    if(ty<0) ty=sy+20;
    const tt=document.getElementById('tt');
    tt.style.left=tx+'px';tt.style.top=ty+'px';tt.style.display='block';
  } else {
    document.getElementById('tt').style.display='none';
    document.getElementById('node-hover-desc').textContent='Hover a node';
  }
  drawTree(activeGod);
});

window.addEventListener('mouseup',e=>{
  if(!isPanning) return;
  const dx=Math.abs(e.clientX-panStart.x),dy=Math.abs(e.clientY-panStart.y);
  isPanning=false;
  treeArea.classList.remove('dragging');
  // If it was a click (tiny movement), handle as click
  if(dx<4&&dy<4&&activeGod){
    const [mx,my]=getPos(e);
    const hit=hitTest(activeGod,mx,my);
    if(hit&&canUnlock(activeGod,hit)){
      const sel=selected[activeGod];
      if(sel.has(hit.id)) sel.delete(hit.id);
      else sel.add(hit.id);
      const map=nm(activeGod);
      sel.forEach(id=>{const nd=map[id];if(nd&&!canUnlock(activeGod,nd))sel.delete(id);});
      updateBar();
    }
  }
  if(activeGod) drawTree(activeGod);
});

canvas.addEventListener('mouseleave',()=>{
  if(!isPanning){
    hoveredNode=null;
    document.getElementById('tt').style.display='none';
    if(activeGod) drawTree(activeGod);
  }
});

// ── Scroll to zoom ──────────────────────────────────────────
canvas.addEventListener('wheel',e=>{
  if(!activeGod) return;
  e.preventDefault();
  const factor=e.deltaY<0?1.1:0.91;
  const [mx,my]=getPos(e);
  // Zoom around cursor point
  const newZoom=Math.min(Math.max(zoom*factor,0.4),3);
  panX=mx-(mx-panX)*(newZoom/zoom);
  panY=my-(my-panY)*(newZoom/zoom);
  zoom=newZoom;
  drawTree(activeGod);
},{passive:false});

// ── Touch pan + pinch zoom ──────────────────────────────────
let lastTouches=null;
canvas.addEventListener('touchstart',e=>{
  e.preventDefault();
  lastTouches=e.touches;
  isPanning=true;
  if(e.touches.length===1){
    panStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
    panOrigin={x:panX,y:panY};
  }
},{passive:false});

canvas.addEventListener('touchmove',e=>{
  e.preventDefault();
  if(!activeGod) return;
  if(e.touches.length===2&&lastTouches&&lastTouches.length===2){
    // Pinch zoom
    const d0=Math.hypot(lastTouches[0].clientX-lastTouches[1].clientX,lastTouches[0].clientY-lastTouches[1].clientY);
    const d1=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    const cx=(e.touches[0].clientX+e.touches[1].clientX)/2;
    const cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
    const r=canvas.getBoundingClientRect();
    const mx=cx-r.left,my=cy-r.top;
    const factor=d1/d0;
    const newZoom=Math.min(Math.max(zoom*factor,0.4),3);
    panX=mx-(mx-panX)*(newZoom/zoom);
    panY=my-(my-panY)*(newZoom/zoom);
    zoom=newZoom;
  } else if(e.touches.length===1){
    panX=panOrigin.x+(e.touches[0].clientX-panStart.x);
    panY=panOrigin.y+(e.touches[0].clientY-panStart.y);
  }
  lastTouches=e.touches;
  drawTree(activeGod);
},{passive:false});

canvas.addEventListener('touchend',e=>{
  e.preventDefault();
  if(e.touches.length===0&&isPanning){
    const dx=lastTouches?Math.abs(lastTouches[0].clientX-panStart.x):99;
    const dy=lastTouches?Math.abs(lastTouches[0].clientY-panStart.y):99;
    isPanning=false;
    if(dx<8&&dy<8&&activeGod&&lastTouches){
      const r=canvas.getBoundingClientRect();
      const mx=lastTouches[0].clientX-r.left,my=lastTouches[0].clientY-r.top;
      const hit=hitTest(activeGod,mx,my);
      if(hit&&canUnlock(activeGod,hit)){
        const sel=selected[activeGod];
        if(sel.has(hit.id)) sel.delete(hit.id);
        else sel.add(hit.id);
        const map=nm(activeGod);
        sel.forEach(id=>{const nd=map[id];if(nd&&!canUnlock(activeGod,nd))sel.delete(id);});
        updateBar();drawTree(activeGod);
      }
    }
  }
},{passive:false});

// ── Helpers ─────────────────────────────────────────────────
function updateBar(){
  if(!activeGod) return;
  const cnt=selected[activeGod].size;
  document.getElementById('ib-pts').textContent=`${cnt} / 30`;
  document.getElementById('ib-pts').style.color=gods[activeGod].col;
}

function resetView(){
  if(!activeGod) return;
  const cw=canvas.width,ch=canvas.height;
  zoom=Math.min(cw/W,ch/H,1)*0.95;
  panX=(cw-W*zoom)/2;
  panY=(ch-H*zoom)/2;
  drawTree(activeGod);
}

function adjustZoom(delta){
  if(!activeGod) return;
  const cw=canvas.width,ch=canvas.height;
  const cx=cw/2,cy=ch/2;
  const newZoom=Math.min(Math.max(zoom+delta,0.4),3);
  panX=cx-(cx-panX)*(newZoom/zoom);
  panY=cy-(cy-panY)*(newZoom/zoom);
  zoom=newZoom;
  drawTree(activeGod);
}


/* ---- UI HELPERS ---- */
function switchGod(god){
  activeGod = god;

  // Auto-select the start node
  const startNode = gods[god].nodes.find(n => n.type === 'start');
  if(startNode){
    selected[god].add(startNode.id);
  }

  document.getElementById('select-screen').style.display='none';
  document.getElementById('tree-screen').style.display='flex';

  resizeCanvas();
  resetView();
  updateBar(); // update points display
}

function goBack(){
  activeGod=null;
  document.getElementById('tree-screen').style.display='none';
  document.getElementById('select-screen').style.display='flex';
}

function resetTree(){
  if(!activeGod) return;
  selected[activeGod].clear();

const startNode = gods[activeGod].nodes.find(n => n.type === 'start');
if(startNode){
  selected[activeGod].add(startNode.id);
}

updateBar();
drawTree(activeGod);
}

/* ---- START ---- */
resizeCanvas();