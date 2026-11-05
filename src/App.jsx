import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Users, Phone, Video, LockKeyhole, Folder, Settings, Search, Plus, Send, Paperclip, Mic, ShieldCheck, Cloud, Smartphone, Menu, Palette, Check, RotateCcw } from 'lucide-react';

const initialChats = [
  { name: 'Pusti Consumer Team', message: 'আজকের মিটিংয়ের সময় জানানো হবে।', time: '10:42', unread: 3, group: true, color: 'mint' },
  { name: 'Sales Coordination', message: 'রিপোর্টটি শেয়ার করেছি।', time: '09:18', unread: 1, group: true, color: 'blue' },
  { name: 'Personal Chat', message: 'আপনার মেসেজ এখানে দেখা যাবে।', time: 'গতকাল', unread: 0, group: false, color: 'orange' },
];

const tabs = [
  { id: 'chats', label: 'চ্যাট', icon: MessageCircle },
  { id: 'groups', label: 'গ্রুপ', icon: Users },
  { id: 'calls', label: 'কল', icon: Phone },
  { id: 'storage', label: 'স্টোরেজ', icon: Folder },
  { id: 'private', label: 'প্রাইভেট', icon: LockKeyhole },
  { id: 'settings', label: 'থিম ও সেটিংস', icon: Palette },
];

const themeNames = ['Aurora','Ocean','Sunset','Galaxy','Forest','Midnight','Coral','Lavender','Arctic','Desert','Neon City','Deep Space','Emerald','Rose Gold','Blue Lagoon','Volcano','Jade','Sapphire','Amethyst','Pearl','Tropical','Monsoon','Dusk','Dawn','Cyber','Royal','Mint','Berry','Citrus','Glacier','Moonlight','Starlight','Rainforest','Cherry','Amber','Indigo','Turquoise','Obsidian','Opal','Flamingo','Seaside','Northern Lights','Cosmic Dust','Misty Mountain','Golden Hour','Lotus','Peacock','Cobalt','Pastel Dream','Prism'];
const palettes = [
 ['#071a24','#0b5960','#38e0b2'],['#061b35','#126c9b','#57d8f5'],['#32152d','#b64e58','#ffb36b'],['#100d36','#4a35a5','#c084fc'],['#092b25','#176b50','#9be7a5'],
 ['#080e1b','#26344e','#8ca7d8'],['#351a26','#a83f62','#ff9eaa'],['#211532','#7056a8','#d6b4ff'],['#102a3a','#3e8caa','#b5f2ff'],['#3a2416','#9a6338','#f4c27a']
];
const themes = Array.from({length:50},(_,i)=>({id:i,name:themeNames[i],colors:palettes[i%palettes.length],variant:i%5}));
const colorChoices = Array.from({length:120},(_,i)=>`hsl(${Math.round(i*3)} 78% ${[42,50,58,66][Math.floor(i/30)]}%)`);

function App() {
  const [active,setActive] = useState('chats');
  const [query,setQuery] = useState('');
  const [message,setMessage] = useState('');
  const [mobileMenu,setMobileMenu] = useState(false);
  const [selectedTheme,setSelectedTheme] = useState(()=>Number(localStorage.getItem('htc-theme')||0));
  const [custom,setCustom] = useState(()=>JSON.parse(localStorage.getItem('htc-custom')||'null') || {background:'#071a24',surface:'#173b46',accent:'#38e0b2'});
  const [useCustom,setUseCustom] = useState(()=>localStorage.getItem('htc-use-custom')==='true');
  const title = tabs.find(t=>t.id===active)?.label || 'চ্যাট';
  const filtered = initialChats.filter(c=>(c.name+c.message).toLowerCase().includes(query.toLowerCase()));
  const theme = themes[selectedTheme] || themes[0];
  const vars = useMemo(()=>useCustom?{'--user-bg':custom.background,'--user-surface':custom.surface,'--user-accent':custom.accent}:{'--user-bg':theme.colors[0],'--user-surface':theme.colors[1],'--user-accent':theme.colors[2]},[useCustom,custom,theme]);
  useEffect(()=>{localStorage.setItem('htc-theme',String(selectedTheme));localStorage.setItem('htc-custom',JSON.stringify(custom));localStorage.setItem('htc-use-custom',String(useCustom));},[selectedTheme,custom,useCustom]);

  return <div className="app-shell" style={vars}>
    <aside className={`sidebar ${mobileMenu?'show':''}`}>
      <div className="brand"><div className="brand-mark"><MessageCircle size={23}/></div><div><strong>Happy Time</strong><span>CONNECT</span></div></div>
      <div className="profile-card"><div className="avatar user">HT</div><div><b>স্বাগতম</b><small>আপনার অ্যাকাউন্ট</small></div><span className="online-dot"/></div>
      <nav>{tabs.map(({id,label,icon:Icon})=><button key={id} className={active===id?'nav-item active':'nav-item'} onClick={()=>{setActive(id);setMobileMenu(false)}}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><ShieldCheck size={17}/><span>নিরাপদ যোগাযোগ</span><button aria-label="Settings" onClick={()=>setActive('settings')}><Settings size={17}/></button></div>
    </aside>
    <main className="main-panel">
      <header className="topbar"><button className="icon-btn mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu/></button><div><p className="eyebrow">T.K FOOD PRODUCTS DISTRIBUTION LIMITED</p><h1>{title}</h1></div><div className="top-actions"><button className="icon-btn" aria-label="Search"><Search size={19}/></button><div className="avatar user small">HT</div></div></header>
      {active==='chats'&&<section className="content-grid">
        <div className="chat-list panel-card"><div className="section-heading"><div><h2>আপনার কথোপকথন</h2><p>ব্যক্তিগত ও গ্রুপ মেসেজ</p></div><button className="primary-icon" aria-label="New chat"><Plus size={19}/></button></div>
          <label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="চ্যাট খুঁজুন"/></label>
          {filtered.map(chat=><button className="chat-row" key={chat.name} onClick={()=>setMessage('')}><div className={`avatar ${chat.color}`}>{chat.group?<Users size={21}/>:chat.name.slice(0,1)}</div><div className="chat-meta"><b>{chat.name}</b><span>{chat.message}</span></div><div className="chat-side"><small>{chat.time}</small>{chat.unread>0&&<i>{chat.unread}</i>}</div></button>)}
          <div className="empty-note">এটি প্রাথমিক ইন্টারফেস। চ্যাট সার্ভার যুক্ত হলে এখানে বাস্তব মেসেজ আসবে।</div></div>
        <div className="conversation panel-card"><div className="conversation-head"><div className="avatar mint"><Users size={21}/></div><div><b>কথোপকথন নির্বাচন করুন</b><small>আপনার মেসেজিং স্পেস</small></div></div><div className="welcome"><div className="welcome-icon"><MessageCircle size={34}/></div><h2>একসাথে থাকুন, সংযুক্ত থাকুন</h2><p>ব্যক্তিগত চ্যাট, গ্রুপ, অডিও-ভিডিও কল এবং ফাইল শেয়ারিং—সব এক জায়গায়।</p><div className="feature-pills"><span><Cloud size={14}/> Cloud Storage</span><span><Smartphone size={14}/> Phone Storage</span><span><LockKeyhole size={14}/> Private Chat</span></div></div><form className="message-compose" onSubmit={e=>{e.preventDefault();setMessage('')}}><button type="button" className="icon-btn"><Paperclip size={19}/></button><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="মেসেজ লিখুন (চ্যাট সংযোগের পর চালু হবে)" disabled/><button type="button" className="icon-btn"><Mic size={19}/></button><button className="send-btn" disabled><Send size={17}/></button></form></div>
      </section>}
      {active==='settings'&&<section className="theme-settings">
        <div className="theme-intro panel-card"><div className="theme-intro-icon"><Palette size={28}/></div><div><h2>আপনার অ্যাপ, আপনার পছন্দের রং</h2><p>৫০টি ভিজ্যুয়াল থিম এবং ১২০টি কালার থেকে বেছে নিন। চাইলে নিজের মতো করে রং সেট করুন।</p></div></div>
        <div className="theme-section panel-card"><div className="theme-section-head"><div><h2>থিম গ্যালারি · ৫০টি</h2><p>প্রতিটি থিমে আলাদা ব্যাকগ্রাউন্ড ও রঙের সমন্বয়</p></div><span className="count-badge">50 THEMES</span></div>
          <div className="theme-grid">{themes.map(t=><button key={t.id} className={`theme-tile ${!useCustom&&selectedTheme===t.id?'chosen':''}`} onClick={()=>{setSelectedTheme(t.id);setUseCustom(false)}}><span className={`theme-art art-${t.variant}`} style={{'--t1':t.colors[0],'--t2':t.colors[1],'--t3':t.colors[2]}}><i/><i/><i/></span><span className="theme-tile-name">{t.name}</span>{!useCustom&&selectedTheme===t.id&&<span className="theme-check"><Check size={13}/></span>}</button>)}</div>
        </div>
        <div className="theme-section panel-card"><div className="theme-section-head"><div><h2>কালার লাইব্রেরি · ১২০+ রং</h2><p>এক ক্লিকে Accent Color পরিবর্তন করুন</p></div><span className="count-badge">120+ COLORS</span></div><div className="color-grid">{colorChoices.map((color,i)=><button key={i} title={color} aria-label={`রং ${i+1}`} className={custom.accent===color?'color-dot active-color':''} style={{background:color}} onClick={()=>{setCustom(v=>({...v,accent:color}));setUseCustom(true)}}/>)}</div></div>
        <div className="theme-section panel-card"><div className="theme-section-head"><div><h2>ম্যানুয়াল কালার কাস্টমাইজার</h2><p>নিজের পছন্দমতো Background, Card ও Accent Color ঠিক করুন</p></div><button className="reset-theme" onClick={()=>{setCustom({background:'#071a24',surface:'#173b46',accent:'#38e0b2'});setUseCustom(true)}}><RotateCcw size={14}/> Reset</button></div>
          <div className="manual-colors">{[['background','Background Color'],['surface','Card / Panel Color'],['accent','Accent / Button Color']].map(([key,label])=><label className="manual-color" key={key}><span>{label}</span><input type="color" value={custom[key]} onChange={e=>{setCustom(v=>({...v,[key]:e.target.value}));setUseCustom(true)}}/><code>{custom[key]}</code></label>)}</div>
          <div className="theme-preview"><div className="preview-bubble">এটি আপনার থিমের নমুনা</div><button className="preview-button">Preview Button</button></div>
          <button className="apply-theme" onClick={()=>{setUseCustom(true);localStorage.setItem('htc-use-custom','true')}}><Check size={17}/> আমার থিম সেভ করুন</button>
        </div>
      </section>}
      {active!=='chats'&&active!=='settings'&&<section className="single-panel panel-card"><div className="large-feature">{active==='groups'?<Users/>:active==='calls'?<Video/>:active==='storage'?<Folder/>:<LockKeyhole/>}</div><h2>{active==='groups'?'গ্রুপ চ্যাট':active==='calls'?'অডিও ও ভিডিও কল':active==='storage'?'আপনার ব্যক্তিগত স্টোরেজ':'কোড-সুরক্ষিত প্রাইভেট চ্যাট'}</h2><p>{active==='groups'?'কোম্পানির টিম ও প্রয়োজন অনুযায়ী গ্রুপ তৈরি করা যাবে।':active==='calls'?'গ্রুপ অডিও ও ভিডিও কলে ১০০ জন অংশগ্রহণের লক্ষ্য রাখা হয়েছে।':active==='storage'?'ক্লাউডে সংরক্ষিত ফাইল ফোনেও স্বয়ংক্রিয়ভাবে সেভ করার ব্যবস্থা থাকবে।':'প্রাইভেট চ্যাটে প্রবেশের জন্য অনুমোদিত অ্যাকাউন্ট ও গোপন কোড প্রয়োজন হবে।'}</p><div className="status-tag"><ShieldCheck size={16}/> প্রাথমিক ডিজাইন — সার্ভিস সংযোগের অপেক্ষায়</div></section>}
      <footer className="footer-note">Happy Time Connect <span>•</span> প্রাথমিক সংস্করণ 0.2</footer>
    </main>
    <nav className="mobile-nav">{tabs.map(({id,label,icon:Icon})=><button key={id} className={active===id?'selected':''} onClick={()=>setActive(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
  </div>;
}
export default App;
