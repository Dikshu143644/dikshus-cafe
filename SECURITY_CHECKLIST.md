# Dikshu's Cafe Secure Authentication and Payments Security Checklist

This document details the defensive security architecture implemented in the Dikshu's Cafe full-stack Web Application to guard against standard OWASP and payment-system vulnerabilities.

---

## 1. URL Edit / Access Bypass Prevention
*   **Defensive Measure**: Route protection is enforced at both the application level and the network API controllers.
*   **Verification**: 
    1.  The client Router validates the user's role and redirects unauthenticated users away from restricted dashboards (`/dashboard`).
    2.  Rather than trusting state coordinates sent by the client, all protected server routes (e.g., `GET /api/orders`, `GET /api/bookings`) pass through active passport-style JWT session validation middleware (`requireAuth`).
    3.  If the HttpOnly session token is tampered with or absent, the server rejects the request block immediately with a `401 Unauthorized` status.

---

## 2. Insecure Direct Object Reference (IDOR) & Access Control
*   **Defensive Measure**: Every query checking confidential data uses composite criteria that bind to the verified actor.
*   **Verification**:
    1.  Standard users cannot request another customer's orders by altering query parameters. 
    2.  For any database command (fetching individual orders, table bookings, or carts), the system checks both the resource ID and the validated caller ID:
        ```sql
        WHERE order_id = $1 AND user_id = USER_SESSION_ID
        ```
    3.  This ensures that horizontal privilege escalation is structurally impossible in the SQL data access layers.

---

## 3. SQL Injection Prevention
*   **Defensive Measure**: Total elimination of unparameterized raw SQL blocks.
*   **Verification**:
    1.  The application uses **Drizzle ORM** type-safe abstract query builders (complying with the Cloud SQL mandate) for standard database interactions.
    2.  All dynamic constraints and parameters are evaluated and converted into standard parameterized SQL placeholders (e.g., `$1`, `$2`), neutralizing malicious script injections.
    3.  Schema definitions in `src/db/schema.ts` act as compile-time guards preventing invalid attributes or field type coercion.

---

## 4. Wrong-User Payment Validation
*   **Defensive Measure**: Pre-transaction ownership validation.
*   **Verification**:
    1.  During payment verification (`POST /api/payments/verify`), the server fetches the target order by its ID from the PostgreSQL database first.
    2.  The server directly verifies that the order's registered `userId` matches the `id` of the user currently logged in via the secure cryptographic session token.
    3.  If a user attempts to verify or pay for another customer's order, the server blocks the process immediately and issues an `Access Denied` notification.

---

## 5. Fake Payment Success Prevention
*   **Defensive Measure**: Cryptographic signature validation on the server.
*   **Verification**:
    1.  Before marking any order as `paid` or transition-processing, the server requires real verification parameters: `razorpayOrderId`, `razorpayPaymentId`, and `razorpaySignature`.
    2.  The server recalculates the cryptographic signature signature using a server-side HMAC SHA256 hashing algorithm with our private `RAZORPAY_KEY_SECRET`.
    3.  An attacker cannot simulate successful payment by sending mock status flags from the frontend; the order status only updates once the backend successfully verifies the cryptographic signature matches the payment provider's seal.

---

## 6. Brute-Force & request spam prevention
*   **Defensive Measure**: High-density API Rate Limiting.
*   **Verification**:
    1.  Integrated a sliding-window rate limiter in Express to restrict traffic on highly critical endpoints.
    2.  Endpoints under rate limitation:
        *   `POST /api/auth/login` (Max 5 attempts per min to block dictionary/credential stuffing attacks).
        *   `POST /api/auth/signup` (Max 5 creations per min).
        *   `POST /api/auth/forgot-password` (Max 5 queries per min).
        *   `POST /api/orders` & `POST /api/payments/verify` (Limits order/payment spam).
        *   `POST /api/contact` (Protects support routes from automated form-filling bots).
    3.  A generic error message ("Invalid email or password") is used for login failures to prevent user/email enumeration.

---

## 7. HTML/SSTI Injection Prevention in Email Templates
*   **Defensive Measure**: User-controlled template values are escaped before interpolation.
*   **Verification**:
    1.  Signup names are normalized and passed through `escapeHtml()` before rendering in OTP email HTML.
    2.  Generated OTP values are escaped before insertion into email templates.
    3.  Contact/support messages remain React-rendered text and are never inserted through unsafe HTML APIs.

---

## 8. ReDoS and Payload DoS Prevention
*   **Defensive Measure**: Regex-based email and phone checks were replaced with the `validator` package.
*   **Verification**:
    1.  Email checks use `validator.isEmail()`.
    2.  Phone checks normalize human separators, then use `validator.isMobilePhone()`.
    3.  JSON request bodies are capped at 100kb.
    4.  Passwords are rejected unless they are 6-128 characters before bcrypt hashing or comparison.

---

## 9. NoSQL/Shape Injection Prevention
*   **Defensive Measure**: Critical endpoints reject object/array payloads where plain strings are required.
*   **Verification**:
    1.  Auth, OTP, contact, payment, booking, order, and manager status routes validate primitive types before use.
    2.  Order IDs and booking IDs are parsed through a shared prefix-aware ID parser.
    3.  Manager status updates are allowlisted to approved transition values.

---

## 10. Session Replay and Cookie Hardening
*   **Defensive Measure**: Session cookies are shorter-lived and stricter.
*   **Verification**:
    1.  JWT expiry is 2 hours.
    2.  The `session_token` cookie uses `httpOnly`, production-only `secure`, and `sameSite: 'strict'`.
    3.  Production requests behind a proxy receive HSTS and are redirected to HTTPS when `x-forwarded-proto` is not HTTPS.

---

## 11. Clipboard and Secret Exposure Controls
*   **Defensive Measure**: Copy actions use the secure Clipboard API and secrets stay server-side.
*   **Verification**:
    1.  Dashboard and manager copy controls use `navigator.clipboard.writeText`.
    2.  No `document.execCommand('copy')` or selection-based clipboard fallback is used.
    3.  No private payment or API keys are exposed with `VITE_` or other public prefixes.
    4.  `.env*` files remain ignored except `.env.example`; downloaded Razorpay CSV key files must not be imported or committed.

---

## 12. Dependency and SEO Baseline
*   **Defensive Measure**: Known vulnerable Vite/esbuild dependency paths are pinned to patched versions.
*   **Verification**:
    1.  `package.json` includes an `esbuild` override for the patched line.
    2.  `npm audit --audit-level=moderate` should report zero vulnerabilities.
    3.  SEO metadata, `robots.txt`, `sitemap.xml`, canonical URLs, and LocalBusiness JSON-LD are present for public pages.
