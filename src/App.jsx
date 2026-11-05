import { useState } from 'react';
import { MessageCircle, Users, Phone, Video, LockKeyhole, Folder, Settings, Search, Plus, Send, Paperclip, Mic, ShieldCheck, Cloud, Smartphone, Menu } from 'lucide-react';

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
];

function App() {
  const [active, setActive] = useState('chats');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const title = tabs.find(t => t.id === active)?.label || 'চ্যাট';
  const filtered = initialChats.filter(c => (c.name + c.message).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'show' : ''}`}>
        <div className="brand"><div className="brand-mark"><MessageCircle size={23}/></div><div><strong>Happy Time</strong><span>CONNECT</span></div></div>
        <div className="profile-card"><div className="avatar user">HT</div><div><b>স্বাগতম</b><small>আপনার অ্যাকাউন্ট</small></div><span className="online-dot"/></div>
        <nav>{tabs.map(({id,label,icon:Icon}) => <button key={id} className={active===id?'nav-item active':'nav-item'} onClick={()=>{setActive(id);setMobileMenu(false)}}><Icon size={19}/><span>{label}</span></button>)}</nav>
        <div className="sidebar-bottom"><ShieldCheck size={17}/><span>নিরাপদ যোগাযোগ</span><button aria-label="Settings"><Settings size={17}/></button></div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu/></button>
          <div><p className="eyebrow">T.K FOOD PRODUCTS DISTRIBUTION LIMITED</p><h1>{title}</h1></div>
          <div className="top-actions"><button className="icon-btn" aria-label="Search"><Search size={19}/></button><div className="avatar user small">HT</div></div>
        </header>

        {active === 'chats' && <section className="content-grid">
          <div className="chat-list panel-card">
            <div className="section-heading"><div><h2>আপনার কথোপকথন</h2><p>ব্যক্তিগত ও গ্রুপ মেসেজ</p></div><button className="primary-icon" aria-label="New chat"><Plus size={19}/></button></div>
            <label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="চ্যাট খুঁজুন"/></label>
            {filtered.map((chat,i)=><button className="chat-row" key={chat.name} onClick={()=>setMessage('')}><div className={`avatar ${chat.color}`}>{chat.group?<Users size={21}/>:chat.name.slice(0,1)}</div><div className="chat-meta"><b>{chat.name}</b><span>{chat.message}</span></div><div className="chat-side"><small>{chat.time}</small>{chat.unread>0&&<i>{chat.unread}</i>}</div></button>)}
            <div className="empty-note">এটি প্রাথমিক ইন্টারফেস। চ্যাট সার্ভার যুক্ত হলে এখানে বাস্তব মেসেজ আসবে।</div>
          </div>
          <div className="conversation panel-card">
            <div className="conversation-head"><div className="avatar mint"><Users size={21}/></div><div><b>কথোপকথন নির্বাচন করুন</b><small>আপনার মেসেজিং স্পেস</small></div></div>
            <div className="welcome"><div className="welcome-icon"><MessageCircle size={34}/></div><h2>একসাথে থাকুন, সংযুক্ত থাকুন</h2><p>ব্যক্তিগত চ্যাট, গ্রুপ, অডিও-ভিডিও কল এবং ফাইল শেয়ারিং—সব এক জায়গায়।</p><div className="feature-pills"><span><Cloud size={14}/> Cloud Storage</span><span><Smartphone size={14}/> Phone Storage</span><span><LockKeyhole size={14}/> Private Chat</span></div></div>
            <form className="message-compose" onSubmit={e=>{e.preventDefault();setMessage('')}}><button type="button" className="icon-btn"><Paperclip size={19}/></button><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="মেসেজ লিখুন (চ্যাট সংযোগের পর চালু হবে)" disabled/><button type="button" className="icon-btn"><Mic size={19}/></button><button className="send-btn" disabled><Send size={17}/></button></form>
          </div>
        </section>}

        {active !== 'chats' && <section className="single-panel panel-card">
          <div className="large-feature">{active==='groups'?<Users/>:active==='calls'?<Video/>:active==='storage'?<Folder/>:<LockKeyhole/>}</div>
          <h2>{active==='groups'?'গ্রুপ চ্যাট':active==='calls'?'অডিও ও ভিডিও কল':active==='storage'?'আপনার ব্যক্তিগত স্টোরেজ':'কোড-সুরক্ষিত প্রাইভেট চ্যাট'}</h2>
          <p>{active==='groups'?'কোম্পানির টিম ও প্রয়োজন অনুযায়ী গ্রুপ তৈরি করা যাবে।':active==='calls'?'গ্রুপ অডিও ও ভিডিও কলে ১০০ জন অংশগ্রহণের লক্ষ্য রাখা হয়েছে।':active==='storage'?'ক্লাউডে সংরক্ষিত ফাইল ফোনেও স্বয়ংক্রিয়ভাবে সেভ করার ব্যবস্থা থাকবে।':'প্রাইভেট চ্যাটে প্রবেশের জন্য অনুমোদিত অ্যাকাউন্ট ও গোপন কোড প্রয়োজন হবে।'}</p>
          <div className="status-tag"><ShieldCheck size={16}/> প্রাথমিক ডিজাইন — সার্ভিস সংযোগের অপেক্ষায়</div>
        </section>}

        <footer className="footer-note">Happy Time Connect <span>•</span> প্রাথমিক সংস্করণ 0.1</footer>
      </main>
      <nav className="mobile-nav">{tabs.map(({id,label,icon:Icon})=><button key={id} className={active===id?'selected':''} onClick={()=>setActive(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    </div>
  );
}

export default App;