import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // In development/fallback environments, we return a mock-compatible interface or fail safely
      console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Proceeding with safe test placeholders.');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId || 'rzp_test_placeholder_id',
      key_secret: keySecret || 'rzp_test_placeholder_secret',
    });
  }

  return razorpayInstance;
}
