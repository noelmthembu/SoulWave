import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { sendContactMessage } from '../services/graphqlService';

// Professional SVG Icons for Social Media
const Icons = {
  TikTok: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.06 1.42.46 2.01.41.61 1.09 1.01 1.81 1.1.81.14 1.68-.08 2.32-.59.7-.51 1.11-1.37 1.11-2.23.01-4.48-.01-8.97.01-13.45z"/>
    </svg>
  ),
  Facebook: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  YouTube: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Twitter: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ),
  Discord: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.862-1.297 1.198-1.99a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.863-.886.077.077 0 0 1-.008-.128c.125-.094.248-.192.366-.292a.077.077 0 0 1 .081-.01c3.901 1.787 8.124 1.787 11.986 0a.077.077 0 0 1 .081.01c.118.1.241.198.366.292a.077.077 0 0 1-.006.128 12.212 12.212 0 0 1-1.863.886.076.076 0 0 0-.041.106c.336.693.736 1.36 1.198 1.99a.078.078 0 0 0 .084.028 19.83 19.83 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.545-5.328-.9-9.84-3.766-13.66a.073.073 0 0 0-.033-.027zm-11.51 10.98c-1.18 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.156 2.419 0 1.334-.956 2.419-2.156 2.419zm7.382 0c-1.18 0-2.156-1.085-2.156-2.419 0-1.333.946-2.419 2.156-2.419 1.21 0 2.175 1.096 2.156 2.419 0 1.334-.946 2.419-2.156 2.419z"/>
    </svg>
  ),
};

const SocialTile = ({ icon: Icon, name, url, colorClass }: { icon: React.FC, name: string, url: string, colorClass: string }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`group flex flex-col items-center justify-center p-8 bg-brand-panel-light/30 border border-white/5 rounded-[2rem] transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:border-brand-cyan/20 ${colorClass}`}
  >
    <div className="mb-4 transition-transform group-hover:scale-110 text-white group-hover:text-brand-cyan">
      <Icon />
    </div>
    <span className="text-[11px] font-black uppercase tracking-widest text-brand-muted group-hover:text-brand-text transition-colors">{name}</span>
  </a>
);

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendContactMessage(form.name, form.email, form.message);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  const socialLinks = [
    { icon: Icons.TikTok, name: 'TikTok', url: 'https://tiktok.com/@soundwave', colorClass: 'hover:shadow-[0_0_20px_rgba(254,44,85,0.05)]' },
    { icon: Icons.Facebook, name: 'Facebook', url: 'https://facebook.com/soundwave', colorClass: 'hover:shadow-[0_0_20px_rgba(24,119,242,0.05)]' },
    { icon: Icons.YouTube, name: 'YouTube', url: 'https://youtube.com/soundwave', colorClass: 'hover:shadow-[0_0_20px_rgba(255,0,0,0.05)]' },
    { icon: Icons.Twitter, name: 'Twitter', url: 'https://twitter.com/soundwave', colorClass: 'hover:shadow-[0_0_20px_rgba(29,161,242,0.05)]' },
    { icon: Icons.Instagram, name: 'Instagram', url: 'https://instagram.com/soundwave', colorClass: 'hover:shadow-[0_0_20px_rgba(225,48,108,0.05)]' },
    { icon: Icons.WhatsApp, name: 'WhatsApp', url: 'https://chat.whatsapp.com/invite', colorClass: 'hover:shadow-[0_0_20px_rgba(37,211,102,0.05)]' },
    { icon: Icons.Discord, name: 'Discord', url: 'https://discord.gg/soundwave', colorClass: 'hover:shadow-[0_0_20px_rgba(88,101,242,0.05)]' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-16">
          <div>
            <h1 className="text-[5rem] font-black mb-8 tracking-tighter leading-none">
              Get in <span className="text-brand-cyan">Touch</span>
            </h1>
            <p className="text-brand-muted text-xl mb-12 leading-relaxed max-w-lg">
              Need a custom drum kit? Having trouble with a VST? Or just want to send us your latest track? We're listening.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
              <span className="w-2 h-8 bg-brand-cyan rounded-full"></span>
              The Community
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {socialLinks.map((social) => (
                <SocialTile key={social.name} {...social} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-brand-panel border border-white/5 p-12 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 blur-[120px] rounded-full -z-10"></div>
          
          <h2 className="text-4xl font-black mb-10 text-white">Direct Message</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input 
              label="Professional Name" 
              placeholder="e.g. Young Guru" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="guru@studio.com" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-muted mb-3 ml-1">YOUR REQUEST</label>
              <textarea 
                className="w-full px-5 py-5 bg-brand-dark/50 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition min-h-[250px] resize-none leading-relaxed text-lg"
                placeholder="Tell us about your project or what you need..."
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full py-6 text-xl rounded-2xl shadow-xl shadow-brand-cyan/10 hover:shadow-brand-cyan/20 transition-all transform hover:-translate-y-1 bg-brand-cyan text-brand-dark border-none" 
              isLoading={status === 'loading'}
            >
              Send Message
            </Button>
            
            {status === 'success' && (
              <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-center text-sm font-bold animate-in zoom-in-95 duration-300">
                Message delivered! Expect a reply within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center text-sm font-bold">
                Something went wrong. Please check your connection.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;