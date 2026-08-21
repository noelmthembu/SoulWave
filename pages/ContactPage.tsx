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
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-brand-border pb-8 sm:pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-cyan">Contact SoundWave</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.04em] text-brand-text sm:text-4xl">Tell us what would help your next session.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">Ask about a pack, report an issue with the library, or share a useful idea with the team.</p>
      </header>

      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)] lg:py-12">
        <aside aria-labelledby="community-heading">
          <h2 id="community-heading" className="text-xl font-bold tracking-[-0.02em] text-brand-text">Community channels</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-brand-muted">Use these public channels for updates and conversation. For a library-specific request, use the form.</p>
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="SoundWave community links">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between rounded-lg border border-brand-border bg-brand-surface px-3 text-sm font-semibold text-brand-subtle hover:border-brand-cyan hover:text-brand-text">
                  {social.name}<ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-xl border border-brand-border bg-brand-surface p-5 sm:p-7" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="text-xl font-bold tracking-[-0.02em] text-brand-text">Send a message</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Fields marked with an asterisk are required.</p>

          {state.succeeded ? (
            <div className="mt-6 rounded-lg border border-emerald-300/35 bg-emerald-950/30 p-5" role="status" aria-live="polite">
              <Check className="h-6 w-6 text-brand-success" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-brand-text">Message received</h3>
              <p className="mt-2 text-sm leading-6 text-brand-subtle">Thanks for getting in touch. The SoundWave team will review your message.</p>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <Input id="name" name="name" label="Name" autoComplete="name" placeholder="Your name" required />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-2 block text-sm text-brand-error" />
              </div>
              <div>
                <Input id="email" name="email" type="email" label="Email address" autoComplete="email" placeholder="you@example.com" required />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-2 block text-sm text-brand-error" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-brand-text">Message <span aria-hidden="true">*</span></label>
                <textarea id="message" name="message" required rows={7} placeholder="Tell us what you need help with" className="w-full rounded-lg border border-brand-border bg-brand-canvas px-3 py-3 text-base leading-6 text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-2 block text-sm text-brand-error" />
              </div>
              {state.errors && <div className="rounded-lg border border-red-300/40 bg-red-950/30 p-3 text-sm leading-6 text-red-100" role="alert">Please review the highlighted fields and try again. Your message is still in the form.</div>}
              <Button type="submit" size="lg" className="w-full" isLoading={state.submitting} disabled={state.submitting}>Send message</Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
