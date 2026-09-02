import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Linkedin, Github, Send, Loader2, Check } from 'lucide-react';
import { personal } from '../data/personal';
import {
  sendMessage,
  validate,
  type ContactPayload,
  type FieldErrors,
} from '../services/contactService';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: ContactPayload = { name: '', email: '', message: '' };

export function Contact() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');

  const update =
    (field: keyof ContactPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus('error');
      setFeedback('Check the highlighted fields.');
      return;
    }

    setStatus('sending');
    setFeedback('');

    const result = await sendMessage(values);

    if (result.ok) {
      setStatus('sent');
      setValues(EMPTY);
      setFeedback(
        result.mode === 'demo'
          ? 'Message validated. No endpoint is connected yet, so nothing was sent — email works in the meantime.'
          : 'Message sent. I will reply to the address you gave.',
      );
      return;
    }

    setStatus('error');
    setFeedback(result.error);
  };

  return (
    <section id="contact" className="section overflow-hidden">
      <div className="shell">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[620px] max-w-full -translate-x-1/2 rounded-full bg-azure/10 blur-[130px]"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <p className="eyebrow mb-5">07 / Contact</p>
              <h2 className="text-headline text-ink">Let&apos;s build something useful.</h2>
              <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink-muted md:text-base">
                Have an idea, opportunity, or project? Let&apos;s connect.
              </p>

              <div className="mt-9 space-y-1">
                <ContactRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={personal.email}
                  href={`mailto:${personal.email}`}
                />
                <ContactRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={personal.phone}
                  href={`tel:${personal.phone.replace(/\s/g, '')}`}
                />
                <ContactRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={personal.location}
                />
                <ContactRow
                  icon={<Linkedin className="h-4 w-4" />}
                  label="LinkedIn"
                  value={personal.socials.linkedin === '#' ? 'Add your profile URL' : 'View profile'}
                  href={personal.socials.linkedin}
                />
                <ContactRow
                  icon={<Github className="h-4 w-4" />}
                  label="GitHub"
                  value={personal.socials.github === '#' ? 'Add your profile URL' : 'View profile'}
                  href={personal.socials.github}
                />
              </div>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              noValidate
              className="glass rounded-3xl p-6 md:p-8"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Field
                id="name"
                label="Name"
                value={values.name}
                onChange={update('name')}
                error={errors.name}
                placeholder="Your name"
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={update('email')}
                error={errors.email}
                placeholder="you@example.com"
              />
              <Field
                id="message"
                label="Message"
                value={values.message}
                onChange={update('message')}
                error={errors.message}
                placeholder="What would you like to work on?"
                multiline
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[14px] font-medium text-void transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : status === 'sent' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Sent
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {feedback && (
                <p
                  role="status"
                  className={`mt-4 text-[13px] leading-relaxed ${
                    status === 'error' ? 'text-[#FF9B85]' : 'text-cyan-soft'
                  }`}
                >
                  {feedback}
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inactive = !href || href === '#';

  const content = (
    <>
      <span className="flex items-center gap-3 text-ink-faint">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{label}</span>
      </span>
      <span className={`text-[14.5px] ${inactive ? 'text-ink-faint' : 'text-ink'}`}>{value}</span>
    </>
  );

  const shared =
    'flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-white/[0.06] py-3.5';

  if (inactive) return <div className={shared}>{content}</div>;

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer noopener"
      className={`${shared} group transition-colors hover:border-white/20`}
    >
      {content}
    </a>
  );
}

type FieldProps = {
  id: keyof ContactPayload;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
};

function Field({ id, label, value, onChange, error, placeholder, type = 'text', multiline }: FieldProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`field resize-none ${error ? 'border-[#FF9B85]/60' : ''}`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`field ${error ? 'border-[#FF9B85]/60' : ''}`}
        />
      )}

      {error && <p className="mt-1.5 text-[12.5px] text-[#FF9B85]">{error}</p>}
    </div>
  );
}
