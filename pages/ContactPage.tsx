import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Check, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const socialLinks = [
  { name: 'TikTok', url: 'https://tiktok.com/@soundwave' },
  { name: 'Facebook', url: 'https://facebook.com/soundwave' },
  { name: 'YouTube', url: 'https://www.youtube.com/@soundwave-rsa' },
  { name: 'X', url: 'https://twitter.com/soundwave' },
  { name: 'Instagram', url: 'https://instagram.com/soundwave' },
  { name: 'WhatsApp', url: 'https://chat.whatsapp.com/invite' },
  { name: 'Discord', url: 'https://discord.gg/soundwave' },
];

const ContactPage: React.FC = () => {
  const [state, handleSubmit] = useForm('xknavwzp');

  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-brand-border pb-6 sm:pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">Contact SoundWave</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-text sm:text-4xl">Tell us what would help your next session.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">Ask about a pack, report an issue with the library, or share sample suggestions with the community.</p>
      </header>

      <div className="grid gap-8 py-6 sm:py-8 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-5" aria-labelledby="community-heading">
          <h2 id="community-heading" className="text-lg sm:text-xl font-bold tracking-tight text-brand-text">Community channels</h2>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-brand-muted">Join the producer community for sample drops, feedback, and discussion.</p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2" aria-label="SoundWave community links">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-between rounded-xl border border-brand-border bg-brand-surface px-4 text-sm font-semibold text-brand-subtle transition-all hover:border-brand-cyan hover:bg-brand-raised hover:text-brand-text">
                  <span>{social.name}</span>
                  <ExternalLink className="h-4 w-4 text-brand-muted" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-2xl border border-brand-border bg-brand-surface p-5 sm:p-7 lg:col-span-7" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="text-lg sm:text-xl font-bold tracking-tight text-brand-text">Send a message</h2>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-brand-muted">Fields marked with an asterisk are required.</p>

          {state.succeeded ? (
            <div className="mt-6 rounded-xl border border-emerald-300/35 bg-emerald-950/30 p-5" role="status" aria-live="polite">
              <Check className="h-6 w-6 text-brand-success" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-brand-text">Message received</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-subtle">Thanks for getting in touch. The SoundWave team will review your message.</p>
            </div>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <Input id="name" name="name" label="Name" autoComplete="name" placeholder="Your producer or artist name" required />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1.5 block text-xs text-brand-error" />
              </div>
              <div>
                <Input id="email" name="email" type="email" label="Email address" autoComplete="email" placeholder="you@producer.com" required />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1.5 block text-xs text-brand-error" />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-brand-text">Message <span aria-hidden="true">*</span></label>
                <textarea id="message" name="message" required rows={5} placeholder="Tell us what you need help with or suggest a pack..." className="w-full rounded-xl border border-brand-border bg-brand-canvas px-3.5 py-3 text-sm sm:text-base leading-relaxed text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-1.5 block text-xs text-brand-error" />
              </div>
              {state.errors && <div className="rounded-lg border border-red-300/40 bg-red-950/30 p-3 text-xs leading-5 text-red-100" role="alert">Please review the highlighted fields and try again.</div>}
              <Button type="submit" size="lg" className="w-full" isLoading={state.submitting} disabled={state.submitting}>Send message</Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
