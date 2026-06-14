import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface SecureCopyButtonProps {
  value: string;
  label: string;
}

export default function SecureCopyButton({ value, label }: SecureCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-cafe-smoky/10 bg-white/80 text-cafe-charcoal/60 transition hover:border-cafe-bronze/40 hover:bg-cafe-warm-white hover:text-cafe-bronze focus:outline-none focus-visible:ring-2 focus-visible:ring-cafe-bronze/45"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
