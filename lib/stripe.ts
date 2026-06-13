import Stripe from 'stripe';

let stripeLoadedInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeLoadedInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY environment variable is not defined. Proceeding with secure sandbox placeholders.');
    }
    
    stripeLoadedInstance = new Stripe(key || 'sk_test_placeholder_premium_vista_key', {
      apiVersion: '2025-01-27' as any,
    });
  }

  return stripeLoadedInstance;
}
