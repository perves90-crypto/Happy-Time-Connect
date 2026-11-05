import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
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

function MainApp({ lang, setLang }) {
  const tr = (bn, en) => lang === 'bn' ? bn : en;
  const [active,setActive] = useState('chats');
  const [query,setQuery] = useState('');
  const [message,setMessage] = useState('');
  const [mobileMenu,setMobileMenu] = useState(false);
  const [selectedTheme,setSelectedTheme] = useState(()=>Number(localStorage.getItem('htc-theme')||0));
  const [custom,setCustom] = useState(()=>JSON.parse(localStorage.getItem('htc-custom')||'null') || {background:'#071a24',surface:'#173b46',accent:'#38e0b2'});
  const [useCustom,setUseCustom] = useState(()=>localStorage.getItem('htc-use-custom')==='true');
  const title = ({chats:tr('চ্যাট','Chats'),groups:tr('গ্রুপ','Groups'),calls:tr('কল','Calls'),storage:tr('স্টোরেজ','Storage'),private:tr('প্রাইভেট','Private'),settings:tr('থিম ও সেটিংস','Themes & Settings')})[active] || tr('চ্যাট','Chats');
  const filtered = initialChats.filter(c=>(c.name+c.message).toLowerCase().includes(query.toLowerCase()));
  const theme = themes[selectedTheme] || themes[0];
  const vars = useMemo(()=>useCustom?{'--user-bg':custom.background,'--user-surface':custom.surface,'--user-accent':custom.accent}:{'--user-bg':theme.colors[0],'--user-surface':theme.colors[1],'--user-accent':theme.colors[2]},[useCustom,custom,theme]);
  useEffect(()=>{localStorage.setItem('htc-theme',String(selectedTheme));localStorage.setItem('htc-custom',JSON.stringify(custom));localStorage.setItem('htc-use-custom',String(useCustom));},[selectedTheme,custom,useCustom]);

  return <div className="app-shell" style={vars}>
    <aside className={`sidebar ${mobileMenu?'show':''}`}><div className="language-switch app-language"><button onClick={()=>setLang('bn')} className={lang==='bn'?'active':''}>বাংলা</button><button onClick={()=>setLang('en')} className={lang==='en'?'active':''}>English</button></div>
      <div className="brand"><div className="brand-mark"><MessageCircle size={23}/></div><div><strong>Happy Time</strong><span>CONNECT</span></div></div>
      <div className="profile-card"><div className="avatar user">HT</div><div><b>{tr('স্বাগতম','Welcome')}</b><small>{tr('আপনার অ্যাকাউন্ট','Your account')}</small></div><span className="online-dot"/></div>
      <nav>{tabs.map(({id,label,icon:Icon})=><button key={id} className={active===id?'nav-item active':'nav-item'} onClick={()=>{setActive(id);setMobileMenu(false)}}><Icon size={19}/><span>{tr(label, ({'চ্যাট':'Chats','গ্রুপ':'Groups','কল':'Calls','স্টোরেজ':'Storage','প্রাইভেট':'Private','থিম ও সেটিংস':'Themes & Settings'})[label] || label)}</span></button>)}</nav>
      <div className="sidebar-bottom"><ShieldCheck size={17}/><span>{tr('নিরাপদ যোগাযোগ','Secure communication')}</span><button aria-label="Settings" onClick={()=>setActive('settings')}><Settings size={17}/></button></div>
    </aside>
    <main className="main-panel">
      <header className="topbar"><button className="icon-btn mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu/></button><div><p className="eyebrow">{tr('আপনার যোগাযোগের জায়গা','Your communication space')}</p><h1>{title}</h1></div><div className="top-actions"><button className="icon-btn" aria-label="Search"><Search size={19}/></button><div className="avatar user small">HT</div></div></header>
      {active==='chats'&&<section className="content-grid">
        <div className="chat-list panel-card"><div className="section-heading"><div><h2>{tr('আপনার কথোপকথন','Your conversations')}</h2><p>{tr('ব্যক্তিগত ও গ্রুপ মেসেজ','Personal and group messages')}</p></div><button className="primary-icon" aria-label="New chat"><Plus size={19}/></button></div>
          <label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr('চ্যাট খুঁজুন','Search chats')}/></label>
          {filtered.map(chat=><button className="chat-row" key={chat.name} onClick={()=>setMessage('')}><div className={`avatar ${chat.color}`}>{chat.group?<Users size={21}/>:chat.name.slice(0,1)}</div><div className="chat-meta"><b>{chat.name}</b><span>{chat.message}</span></div><div className="chat-side"><small>{chat.time}</small>{chat.unread>0&&<i>{chat.unread}</i>}</div></button>)}
          <div className="empty-note">{tr('এটি প্রাথমিক ইন্টারফেস। চ্যাট সার্ভার যুক্ত হলে এখানে বাস্তব মেসেজ আসবে।','This is the initial interface. Real messages will appear here after the chat service is connected.')}</div></div>
        <div className="conversation panel-card"><div className="conversation-head"><div className="avatar mint"><Users size={21}/></div><div><b>{tr('কথোপকথন নির্বাচন করুন','Select a conversation')}</b><small>{tr('আপনার মেসেজিং স্পেস','Your messaging space')}</small></div></div><div className="welcome"><div className="welcome-icon"><MessageCircle size={34}/></div><h2>{tr('একসাথে থাকুন, সংযুক্ত থাকুন','Stay together, stay connected')}</h2><p>{tr('ব্যক্তিগত চ্যাট, গ্রুপ, অডিও-ভিডিও কল এবং ফাইল শেয়ারিং—সব এক জায়গায়।','Personal chats, groups, audio/video calls and file sharing — all in one place.')}</p><div className="feature-pills"><span><Cloud size={14}/> Cloud Storage</span><span><Smartphone size={14}/> Phone Storage</span><span><LockKeyhole size={14}/> Private Chat</span></div></div><form className="message-compose" onSubmit={e=>{e.preventDefault();setMessage('')}}><button type="button" className="icon-btn"><Paperclip size={19}/></button><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="মেসেজ লিখুন (চ্যাট সংযোগের পর চালু হবে)" disabled/><button type="button" className="icon-btn"><Mic size={19}/></button><button className="send-btn" disabled><Send size={17}/></button></form></div>
      </section>}
      {active==='settings'&&<section className="theme-settings">
        <div className="theme-intro panel-card"><div className="theme-intro-icon"><Palette size={28}/></div><div><h2>{tr('আপনার অ্যাপ, আপনার পছন্দের রং','Your app, your colors')}</h2><p>{tr('৫০টি ভিজ্যুয়াল থিম এবং ১২০টি কালার থেকে বেছে নিন। চাইলে নিজের মতো করে রং সেট করুন।','Choose from 50 visual themes and 120+ colors, or customize your own.')}</p></div></div>
        <div className="theme-section panel-card"><div className="theme-section-head"><div><h2>{tr('থিম গ্যালারি · ৫০টি','Theme Gallery · 50')}</h2><p>{tr('প্রতিটি থিমে আলাদা ব্যাকগ্রাউন্ড ও রঙের সমন্বয়','Each theme has a unique background and color combination')}</p></div><span className="count-badge">50 THEMES</span></div>
          <div className="theme-grid">{themes.map(t=><button key={t.id} className={`theme-tile ${!useCustom&&selectedTheme===t.id?'chosen':''}`} onClick={()=>{setSelectedTheme(t.id);setUseCustom(false)}}><span className={`theme-art art-${t.variant}`} style={{'--t1':t.colors[0],'--t2':t.colors[1],'--t3':t.colors[2]}}><i/><i/><i/></span><span className="theme-tile-name">{t.name}</span>{!useCustom&&selectedTheme===t.id&&<span className="theme-check"><Check size={13}/></span>}</button>)}</div>
        </div>
        <div className="theme-section panel-card"><div className="theme-section-head"><div><h2>{tr('কালার লাইব্রেরি · ১২০+ রং','Color Library · 120+ colors')}</h2><p>{tr('এক ক্লিকে Accent Color পরিবর্তন করুন','Change the accent color with one click')}</p></div><span className="count-badge">120+ COLORS</span></div><div className="color-grid">{colorChoices.map((color,i)=><button key={i} title={color} aria-label={`রং ${i+1}`} className={custom.accent===color?'color-dot active-color':''} style={{background:color}} onClick={()=>{setCustom(v=>({...v,accent:color}));setUseCustom(true)}}/>)}</div></div>
        <div className="theme-section panel-card"><div className="theme-section-head"><div><h2>{tr('ম্যানুয়াল কালার কাস্টমাইজার','Manual Color Customizer')}</h2><p>{tr('নিজের পছন্দমতো Background, Card ও Accent Color ঠিক করুন','Set your preferred background, card and accent colors')}</p></div><button className="reset-theme" onClick={()=>{setCustom({background:'#071a24',surface:'#173b46',accent:'#38e0b2'});setUseCustom(true)}}><RotateCcw size={14}/> Reset</button></div>
          <div className="manual-colors">{[['background','Background Color'],['surface','Card / Panel Color'],['accent','Accent / Button Color']].map(([key,label])=><label className="manual-color" key={key}><span>{label}</span><input type="color" value={custom[key]} onChange={e=>{setCustom(v=>({...v,[key]:e.target.value}));setUseCustom(true)}}/><code>{custom[key]}</code></label>)}</div>
          <div className="theme-preview"><div className="preview-bubble">{tr('এটি আপনার থিমের নমুনা','This is a theme preview')}</div><button className="preview-button">{tr('নমুনা বাটন','Preview Button')}</button></div>
          <button className="apply-theme" onClick={()=>{setUseCustom(true);localStorage.setItem('htc-use-custom','true')}}><Check size={17}/> {tr('আমার থিম সেভ করুন','Save my theme')}</button>
        </div>
      </section>}
      {active!=='chats'&&active!=='settings'&&<section className="single-panel panel-card"><div className="large-feature">{active==='groups'?<Users/>:active==='calls'?<Video/>:active==='storage'?<Folder/>:<LockKeyhole/>}</div><h2>{active==='groups'?tr('গ্রুপ চ্যাট','Group Chat'):active==='calls'?tr('অডিও ও ভিডিও কল','Audio & Video Calls'):active==='storage'?tr('আপনার ব্যক্তিগত স্টোরেজ','Your Personal Storage'):tr('কোড-সুরক্ষিত প্রাইভেট চ্যাট','Code-Protected Private Chat')}</h2><p>{active==='groups'?tr('কোম্পানির টিম ও প্রয়োজন অনুযায়ী গ্রুপ তৈরি করা যাবে।','Create groups for your teams and projects.'):active==='calls'?tr('গ্রুপ অডিও ও ভিডিও কলে ১০০ জন অংশগ্রহণের লক্ষ্য রাখা হয়েছে।','Group audio and video calls are planned for up to 100 participants.'):active==='storage'?tr('ক্লাউডে সংরক্ষিত ফাইল ফোনেও স্বয়ংক্রিয়ভাবে সেভ করার ব্যবস্থা থাকবে।','Cloud files are planned to sync to your phone storage.'):tr('প্রাইভেট চ্যাটে প্রবেশের জন্য অনুমোদিত অ্যাকাউন্ট ও গোপন কোড প্রয়োজন হবে।','Private chat will require an authorized account and a secret code.')}</p><div className="status-tag"><ShieldCheck size={16}/> {tr('প্রাথমিক ডিজাইন — সার্ভিস সংযোগের অপেক্ষায়','Initial design — awaiting service connection')}</div></section>}
      <footer className="footer-note">Happy Time Connect <span>•</span> {tr('প্রাথমিক সংস্করণ 0.2','Early version 0.2')}</footer>
    </main>
    <nav className="mobile-nav">{tabs.map(({id,label,icon:Icon})=><button key={id} className={active===id?'selected':''} onClick={()=>setActive(id)}><Icon size={19}/><span>{tr(label, ({'চ্যাট':'Chats','গ্রুপ':'Groups','কল':'Calls','স্টোরেজ':'Storage','প্রাইভেট':'Private','থিম ও সেটিংস':'Themes & Settings'}[label] || label)}</span></button>)}</nav>
  </div>;
}

const countryDialCodes = [
  ['AF','93'],['AL','355'],['DZ','213'],['AD','376'],['AO','244'],['AG','1-268'],['AR','54'],['AM','374'],['AU','61'],['AT','43'],['AZ','994'],
  ['BS','1-242'],['BH','973'],['BD','880'],['BB','1-246'],['BY','375'],['BE','32'],['BZ','501'],['BJ','229'],['BT','975'],['BO','591'],['BA','387'],['BW','267'],['BR','55'],['BN','673'],['BG','359'],['BF','226'],['BI','257'],
  ['KH','855'],['CM','237'],['CA','1'],['CV','238'],['CF','236'],['TD','235'],['CL','56'],['CN','86'],['CO','57'],['KM','269'],['CG','242'],['CD','243'],['CR','506'],['CI','225'],['HR','385'],['CU','53'],['CY','357'],['CZ','420'],
  ['DK','45'],['DJ','253'],['DM','1-767'],['DO','1-809'],['EC','593'],['EG','20'],['SV','503'],['GQ','240'],['ER','291'],['EE','372'],['SZ','268'],['ET','251'],['FJ','679'],['FI','358'],['FR','33'],['GA','241'],['GM','220'],['GE','995'],['DE','49'],['GH','233'],['GR','30'],['GD','1-473'],['GT','502'],['GN','224'],['GW','245'],['GY','592'],
  ['HT','509'],['HN','504'],['HK','852'],['HU','36'],['IS','354'],['IN','91'],['ID','62'],['IR','98'],['IQ','964'],['IE','353'],['IL','972'],['IT','39'],['JM','1-876'],['JP','81'],['JO','962'],['KZ','7'],['KE','254'],['KI','686'],['KP','850'],['KR','82'],['KW','965'],['KG','996'],['LA','856'],['LV','371'],['LB','961'],['LS','266'],['LR','231'],['LY','218'],['LI','423'],['LT','370'],['LU','352'],
  ['MO','853'],['MG','261'],['MW','265'],['MY','60'],['MV','960'],['ML','223'],['MT','356'],['MH','692'],['MR','222'],['MU','230'],['MX','52'],['FM','691'],['MD','373'],['MC','377'],['MN','976'],['ME','382'],['MA','212'],['MZ','258'],['MM','95'],['NA','264'],['NR','674'],['NP','977'],['NL','31'],['NZ','64'],['NI','505'],['NE','227'],['NG','234'],['MK','389'],['NO','47'],['OM','968'],['PK','92'],['PW','680'],['PS','970'],['PA','507'],['PG','675'],['PY','595'],['PE','51'],['PH','63'],['PL','48'],['PT','351'],['QA','974'],['RO','40'],['RU','7'],['RW','250'],
  ['KN','1-869'],['LC','1-758'],['VC','1-784'],['WS','685'],['SM','378'],['ST','239'],['SA','966'],['SN','221'],['RS','381'],['SC','248'],['SL','232'],['SG','65'],['SK','421'],['SI','386'],['SB','677'],['SO','252'],['ZA','27'],['SS','211'],['ES','34'],['LK','94'],['SD','249'],['SR','597'],['SE','46'],['CH','41'],['SY','963'],['TW','886'],['TJ','992'],['TZ','255'],['TH','66'],['TL','670'],['TG','228'],['TO','676'],['TT','1-868'],['TN','216'],['TR','90'],['TM','993'],['TV','688'],['UG','256'],['UA','380'],['AE','971'],['GB','44'],['US','1'],['UY','598'],['UZ','998'],['VU','678'],['VA','379'],['VE','58'],['VN','84'],['YE','967'],['ZM','260'],['ZW','263']
];
const countryNames = new Intl.DisplayNames(['bn'], { type: 'region' });
const countryOptions = countryDialCodes.map(([iso, dial]) => ({iso,dial,name:countryNames.of(iso)})).sort((a,b)=>a.name.localeCompare(b.name,'bn'));

function App() {
  const [lang,setLang] = useState(() => localStorage.getItem('htc-language') || 'bn');
  const tr = (bn,en) => lang === 'bn' ? bn : en;
  useEffect(() => { localStorage.setItem('htc-language',lang); }, [lang]);
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [country, setCountry] = useState('BD');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newRecoveryCode, setNewRecoveryCode] = useState('');
  const [mode, setMode] = useState('signup');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const selectedCountry = countryOptions.find(item=>item.iso===country) || countryOptions.find(item=>item.iso==='BD');
  const loginEmail = (fullPhone) => fullPhone.replace(/\D/g, '') + '@phone.happytimeconnect.invalid';
  const normalizedPhone = () => {
    const digits = phone.replace(/\D/g, '');
    if ((country === 'BD' && !/^\d{11}$/.test(digits)) || (country !== 'BD' && !/^\d{7,15}$/.test(digits))) return null;
    const local = country === 'BD' ? digits.replace(/^0/, '') : digits;
    return '+' + selectedCountry.dial.replace(/\D/g, '') + local;
  };
  const makeRecoveryCode = () => {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return String((((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0) % 10000).padStart(4, '0');
  };
  const hashCode = async (value) => {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), b=>b.toString(16).padStart(2,'0')).join('');
  };

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setChecking(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    const fullPhone = normalizedPhone();
    if (!fullPhone) {
      setError(country === 'BD' ? 'বাংলাদেশের ১১ সংখ্যার মোবাইল নম্বর লিখুন।' : 'নির্বাচিত দেশের সঠিক মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!supabase) { setError('Supabase সংযোগ পাওয়া যায়নি।'); return; }

    if (mode === 'forgot') {
      if (!/^\d{4}$/.test(recoveryCode)) { setError('আপনার ৪ সংখ্যার Recovery Code লিখুন।'); return; }
      if (!/^[A-Za-z0-9]{6}$/.test(pin)) { setError('নতুন পাসওয়ার্ড ঠিক ৬ অক্ষরের হতে হবে।'); return; }
      setBusy(true);
      const recoveryHash = await hashCode(recoveryCode);
      const { data, error: rpcError } = await supabase.rpc('reset_password_with_recovery_code', {
        p_phone: fullPhone,
        p_recovery_hash: recoveryHash,
        p_new_password: pin
      });
      setBusy(false);
      if (rpcError) { setError(rpcError.message); return; }
      if (data !== true) { setError('মোবাইল নম্বর অথবা Recovery Code সঠিক নয়।'); return; }
      setNotice('নতুন পাসওয়ার্ড সেট হয়েছে। এখন লগইন করুন।');
      setMode('login');
      setPin('');
      setRecoveryCode('');
      return;
    }

    if (!/^[A-Za-z0-9]{6}$/.test(pin)) {
      setError('পাসওয়ার্ড ঠিক ৬ অক্ষরের হতে হবে। ইংরেজি অক্ষর ও সংখ্যা ব্যবহার করতে পারবেন।');
      return;
    }
    setBusy(true);
    const email = loginEmail(fullPhone);
    let result;
    let generatedCode = '';
    if (mode === 'signup') {
      generatedCode = makeRecoveryCode();
      const recoveryHash = await hashCode(generatedCode);
      result = await supabase.auth.signUp({
        email,
        password: pin,
        options: { data: { phone: fullPhone, display_name: fullPhone, recovery_code_hash: recoveryHash } }
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password: pin });
    }
    setBusy(false);
    if (result.error) { setError(result.error.message); return; }
    if (mode === 'signup' && !result.data.session) {
      setError('অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু Supabase-এ Confirm email বন্ধ করতে হবে।');
      return;
    }
    if (mode === 'signup') setNewRecoveryCode(generatedCode);
  }

  async function copyRecoveryCode() {
    try { await navigator.clipboard.writeText(newRecoveryCode); setNotice('Recovery Code কপি হয়েছে। নিরাপদ জায়গায় লিখে রাখুন।'); }
    catch { setNotice('কোডটি হাতে লিখে নিরাপদ জায়গায় সংরক্ষণ করুন।'); }
  }

  if (checking) return <div className="auth-screen"><div className="auth-card"><h1>Happy Time Connect</h1><p>অ্যাকাউন্ট যাচাই হচ্ছে...</p></div></div>;
  if (newRecoveryCode) return <div className="auth-screen"><section className="auth-card recovery-card">
    <div className="auth-mark"><ShieldCheck size={28}/></div><h1>{tr('আপনার Recovery Code','Your Recovery Code')}</h1>
    <p>{tr('এই ৪ সংখ্যার কোডটি এখনই কপি করে কাগজে লিখে নিরাপদ জায়গায় রাখুন। পাসওয়ার্ড ভুলে গেলে এই কোড দিয়ে নতুন পাসওয়ার্ড সেট করতে পারবেন।','Copy this 4-digit code and keep it somewhere safe. If you forget your password, you can use this code to set a new one.')}</p>
    <div className="recovery-code-box" dir="ltr">{newRecoveryCode}</div>
    <button type="button" className="auth-submit" onClick={copyRecoveryCode}>{tr(tr('কোড কপি করুন','Copy recovery code'),'Copy recovery code')}</button>
    {notice && <div className="auth-notice">{notice}</div>}
    <button type="button" className="auth-submit" onClick={()=>{setNewRecoveryCode('');setNotice('');}} >{tr(tr('কোড সংরক্ষণ করেছি — চালিয়ে যান','I have saved the code — Continue'),'I have saved the code — Continue')}</button>
    <small>এই কোড আর পরে দেখানো হবে না। কাউকে দেবেন না। ফোন হারালে কোডটি আলাদা নিরাপদ জায়গায় রাখুন।</small>
  </section></div>;
  if (!session) return <div className="auth-screen"><form className="auth-card" onSubmit={handleAuth}><div className="language-switch"><button type="button" className={lang==='bn'?'active':''} onClick={()=>setLang('bn')}>বাংলা</button><button type="button" className={lang==='en'?'active':''} onClick={()=>setLang('en')}>English</button></div>
    <div className="auth-mark"><MessageCircle size={28}/></div>
    <h1>Happy Time Connect</h1>
    <p>{tr('মোবাইল নম্বর ও ৬ অক্ষরের পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খুলুন বা প্রবেশ করুন।','Create an account or sign in with your mobile number and 6-character password.')}</p>
    {!isSupabaseConfigured && <div className="auth-error">Supabase URL ও Publishable Key সেট করা নেই।</div>}
    <div className="auth-mode-switch">
      <button type="button" className={mode==='signup'?'active':''} onClick={()=>{setMode('signup');setError('');setNotice('');}}>সাইন আপ</button>
      <button type="button" className={mode==='login'?'active':''} onClick={()=>{setMode('login');setError('');setNotice('');}}>লগইন</button>
    </div>
    <label>{tr('দেশ নির্বাচন ও মোবাইল নম্বর','Country and mobile number')}</label>
    <div className="phone-entry">
      <select className="country-select" value={country} onChange={e=>{setCountry(e.target.value);setPhone('');}} aria-label="দেশের কোড নির্বাচন">
        {countryOptions.map(item=><option key={item.iso} value={item.iso}>{item.name} (+{item.dial})</option>)}
      </select>
      <input className="auth-input phone-number-input" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,country==='BD'?11:15))} placeholder={country==='BD'?'01XXXXXXXXX':tr('মোবাইল নম্বর','Mobile number')} autoComplete="tel-national" inputMode="numeric"/>
    </div>
    {mode==='forgot' && <>
      <label>৪ সংখ্যার Recovery Code</label>
      <input className="auth-input" value={recoveryCode} onChange={e=>setRecoveryCode(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder={tr(tr('৪ সংখ্যার কোড','4-digit code'),'4-digit recovery code')} inputMode="numeric" maxLength={4}/>
    </>}
    <label>{mode==='forgot'?tr('নতুন ৬ অক্ষরের পাসওয়ার্ড','New 6-character password'):tr('৬ অক্ষরের পাসওয়ার্ড (অক্ষর বা সংখ্যা)','6-character password (letters or numbers)')}</label>
    <input className="auth-input" value={pin} onChange={e=>setPin(e.target.value.replace(/[^A-Za-z0-9]/g,'').slice(0,6))} placeholder={tr(tr('৬ অক্ষরের পাসওয়ার্ড','6-character password'),'6-character password')} type="password" autoComplete={mode==='signup'?'new-password':'current-password'} maxLength={6}/>
    {mode==='login' && <button type="button" className="forgot-link" onClick={()=>{setMode('forgot');setPin('');setError('');setNotice('');}}>পাসওয়ার্ড ভুলে গেছেন? Forgot Password</button>}
    <button className="auth-submit" disabled={busy || !isSupabaseConfigured}>{busy?tr('অপেক্ষা করুন...','Please wait...'):mode==='signup'?tr('সাইন আপ','Sign up'):mode==='forgot'?tr('নতুন পাসওয়ার্ড সেট করুন','Set new password'):tr('লগইন','Sign in')}</button>
    <p className="facebook-note">{tr('পরামর্শ: আপনি যদি Facebook-এর মাধ্যমে লগইন করেন, তাহলে ভবিষ্যতে অ্যাকাউন্টে প্রবেশ বা তথ্য ফিরে পেতে এটি সহায়ক হতে পারে।','Tip: If you sign in with Facebook, it may help you regain access to your account or recover your information in the future.')}</p>
    <button type="button" className="facebook-login" onClick={async()=>{setError('');const {error:e}=await supabase.auth.signInWithOAuth({provider:'facebook',options:{redirectTo:window.location.origin}});if(e)setError(e.message);}}>{tr('Facebook দিয়ে লগইন (ঐচ্ছিক)','Continue with Facebook (Optional)')}</button>
    {mode==='forgot' && <button type="button" className="auth-back" onClick={()=>{setMode('login');setError('');}} >{tr('লগইনে ফিরে যান','Back to login')}</button>}
    {notice && <div className="auth-notice">{notice}</div>}
    {error && <div className="auth-error">{error}</div>}
    <small>{tr('SMS/OTP প্রয়োজন নেই। সাইনআপের পর পাওয়া ৪ সংখ্যার Recovery Code নিরাপদে সংরক্ষণ করুন।','No SMS/OTP is required. Keep the 4-digit recovery code from signup in a safe place.')}</small>
  </form></div>;
  return <MainApp lang={lang} setLang={setLang}/>;
}

export default App;

