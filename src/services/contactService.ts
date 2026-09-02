/**
 * ──────────────────────────────────────────────────────────────
 *  Contact service — the only file that knows how a message is
 *  delivered. Components call `sendMessage()` and never touch a
 *  network call directly, so swapping in a backend is a one-file
 *  change. See the README section "Connecting a backend".
 * ──────────────────────────────────────────────────────────────
 */

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactResult =
  | { ok: true; mode: 'sent' | 'demo' }
  | { ok: false; error: string };

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

/**
 * Set this to your endpoint to go live, e.g.
 *   'https://formspree.io/f/xxxxxxx'
 *   '/api/contact'
 * Left empty, the form runs in demo mode: it validates and confirms
 * without sending anything anywhere.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Client-side validation. Returns an empty object when the payload is good. */
export function validate(payload: ContactPayload): FieldErrors {
  const errors: FieldErrors = {};

  if (payload.name.trim().length < 2) {
    errors.name = 'Enter your name.';
  }
  if (!EMAIL_PATTERN.test(payload.email.trim())) {
    errors.email = 'Enter an email address that can receive a reply.';
  }
  if (payload.message.trim().length < 10) {
    errors.message = 'Add a little more detail — at least a sentence.';
  }

  return errors;
}

export async function sendMessage(payload: ContactPayload): Promise<ContactResult> {
  const errors = validate(payload);
  const firstError = Object.values(errors)[0];
  if (firstError) return { ok: false, error: firstError };

  // Demo mode — no endpoint configured yet.
  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true, mode: 'demo' };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        message: payload.message.trim(),
        sentAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `The message did not send (${response.status}). Try again, or email directly.` };
    }

    return { ok: true, mode: 'sent' };
  } catch {
    return { ok: false, error: 'No connection to the server. Check your network, or email directly.' };
  }
}
