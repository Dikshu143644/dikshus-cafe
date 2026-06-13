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
