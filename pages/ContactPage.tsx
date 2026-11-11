import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { ArrowUpRight, Check } from 'lucide-react';
import Button from '../components/Button';
import ErrorNotice from '../components/ErrorNotice';
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
      <header className="border-b border-brand-border pb-7 sm:pb-9">
        <p className="eyebrow">Contact SoundWave</p>
        <h1 className="display mt-3 max-w-2xl text-[2rem] leading-[1.05] text-brand-text sm:text-4xl lg:text-5xl">
          Tell us what would help your next session.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
          Ask about a pack, report an issue with the library, or share sample suggestions with the community.
        </p>
      </header>

      <div className="grid gap-8 py-7 sm:py-9 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-5" aria-labelledby="community-heading">
          <h2 id="community-heading" className="display text-2xl leading-tight text-brand-text">Community channels</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            Join the producer community for sample drops, feedback, and discussion.
          </p>
          <ul className="mt-5 border-t border-brand-border" aria-label="SoundWave community links">
            {socialLinks.map((social) => (
              <li key={social.name} className="border-b border-brand-border">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-12 items-center justify-between gap-3 px-1 text-sm text-brand-subtle transition-colors hover:text-brand-accent"
                >
                  <span>{social.name}</span>
                  <ArrowUpRight className="h-4 w-4 text-brand-muted transition-colors group-hover:text-brand-accent" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <section className="border border-brand-border bg-brand-surface p-5 sm:p-7 lg:col-span-7" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="display text-2xl leading-tight text-brand-text">Send a message</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">Fields marked with an asterisk are required.</p>

          {state.succeeded ? (
            <div className="mt-6 border-l-2 border-brand-accent bg-brand-accent-soft p-5" role="status" aria-live="polite">
              <Check className="h-5 w-5 text-brand-accent" aria-hidden="true" />
              <h3 className="display mt-3 text-xl leading-tight text-brand-text">Message received</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-subtle">
                Thanks for getting in touch. The SoundWave team will review your message.
              </p>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <Input id="name" name="name" label="Name" autoComplete="name" placeholder="Your producer or artist name" required />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1.5 block text-xs text-brand-error" />
              </div>
              <div>
                <Input id="email" name="email" type="email" label="Email address" autoComplete="email" placeholder="you@producer.com" required />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1.5 block text-xs text-brand-error" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-[13px] font-medium text-brand-text">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us what you need help with or suggest a pack..."
                  className="w-full rounded-none border border-brand-border bg-brand-surface px-3 py-3 text-base leading-relaxed text-brand-text placeholder:text-brand-muted/80 transition-colors hover:border-brand-border-strong focus:border-brand-accent focus:outline-none"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-1.5 block text-xs text-brand-error" />
              </div>
              {state.errors && <ErrorNotice message="Please review the highlighted fields and try again." />}
              <Button type="submit" size="lg" className="w-full" isLoading={state.submitting} disabled={state.submitting}>
                Send message
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
