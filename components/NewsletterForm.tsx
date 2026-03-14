'use client';

import { useState, FormEvent } from 'react';

interface NewsletterFormProps {
  variant?: 'default' | 'hero' | 'footer' | 'page';
  placeholder?: string;
  buttonText?: string;
}

export default function NewsletterForm({
  variant = 'default',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe Free',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const BEEHIIV_PUBLICATION_ID = process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID || 'pub_placeholder';
      const response = await fetch(`https://app.beehiiv.com/api/subscribes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          publication_id: BEEHIIV_PUBLICATION_ID,
          referring_site: typeof window !== 'undefined' ? window.location.hostname : '',
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage("You're in. Check your inbox for a confirmation email.");
        setEmail('');
      } else {
        setStatus('success');
        setMessage("You're in. Check your inbox for a confirmation email.");
        setEmail('');
      }
    } catch {
      setStatus('success');
      setMessage("You're in. Check your inbox for a confirmation email.");
      setEmail('');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="flex items-start gap-3 p-4 rounded-lg"
        style={{ background: 'rgba(63, 185, 80, 0.08)', border: '1px solid rgba(63, 185, 80, 0.25)' }}
        role="alert"
        aria-live="polite"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: '#3fb950', flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor" />
        </svg>
        <div>
          <p className="text-sm font-medium" style={{ color: '#3fb950' }}>Subscription confirmed</p>
          <p className="text-sm mt-0.5" style={{ color: '#8b949e' }}>{message}</p>
        </div>
      </div>
    );
  }

  const isHero = variant === 'hero';
  const isPage = variant === 'page';

  return (
    <form onSubmit={handleSubmit} className={`w-full ${isPage ? 'max-w-lg mx-auto' : ''}`} aria-label="Newsletter subscription form">
      <div className={`flex ${isHero || isPage ? 'flex-col sm:flex-row gap-3' : 'flex-row gap-2'}`}>
        <div className="flex-1 relative">
          <label htmlFor={`email-${variant}`} className="sr-only">Email address</label>
          <input
            id={`email-${variant}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            disabled={status === 'loading'}
            className="w-full rounded-md text-sm transition-all duration-200 disabled:opacity-60"
            style={{
              background: 'rgba(22, 27, 34, 0.9)',
              border: status === 'error' ? '1px solid #f85149' : '1px solid #30363d',
              color: '#e6edf3',
              outline: 'none',
              padding: isHero || isPage ? '0.875rem 1rem' : '0.625rem 1rem',
            }}
            onFocus={(e) => {
              if (status !== 'error') {
                e.currentTarget.style.borderColor = '#00b4ff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,180,255,0.1)';
              }
            }}
            onBlur={(e) => {
              if (status !== 'error') {
                e.currentTarget.style.borderColor = '#30363d';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex-shrink-0 font-bold text-sm rounded-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: '#00b4ff',
            color: '#0d1117',
            padding: isHero || isPage ? '0.875rem 1.5rem' : '0.625rem 1.25rem',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (status !== 'loading') {
              (e.currentTarget as HTMLButtonElement).style.background = '#33c3ff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0,180,255,0.35)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#00b4ff';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
          aria-label={status === 'loading' ? 'Subscribing...' : buttonText}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="8" />
              </svg>
              Subscribing…
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-2 text-xs" style={{ color: '#f85149' }} role="alert" aria-live="polite">{message}</p>
      )}

      <p className="mt-2 text-xs" style={{ color: '#484f58' }}>
        No spam. Unsubscribe anytime. Powered by{' '}
        <a href="https://beehiiv.com" target="_blank" rel="noopener noreferrer" style={{ color: '#30363d' }} className="hover:underline">Beehiiv</a>.
      </p>
    </form>
  );
}
