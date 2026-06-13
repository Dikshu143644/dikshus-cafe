# Dikshu's Cafe Customer Data Security Blueprint

This document details the storage locations, cryptographic guidelines, and session management protocols implemented to secure all personal identifiable information (PII) and system data for Dikshu's Cafe.

---

## 1. Where Customer Data is Stored
All data is housed securely in a managed **PostgreSQL** relational database.
The relational schema comprises the following structured tables:

*   `users`: Stores core profile configurations (name, email lookup, phone, role, verified flag, dates).
*   `addresses`: Customer-supplied billing and delivery addresses mapped directly using foreign-key constraints to individual users (`userId`).
*   `cartItems`: Stores active physical and digital selections on behalf of users before cart conversion.
*   `orders`: Tracks constructed orders, checkout subtotal, total, and status details.
*   `orderItems`: Links purchased products, quantities, and price stamps at time of checkout to a parent order.
*   `bookings`: Tracks physical reservation slots (approved, completed, pending, date, time).
*   `passwordResetTokens`: Stores hashed values of temporary password-restoration links.

---

## 2. Password Encryption and Protection
*   **Plain-text Passwords are NEVER Stored**:
    *   No employee, database administrator, or developer can view a client's plain-text password.
    *   Passwords are encrypted with **bcryptjs** (adaptive hashing algorithm with high-entropy salt factor).
*   **Secure Sign Up Workflow**:
    1.  Upon registration, the client submits credentials over an SSL-encrypted tunnel.
    2.  The server generates a premium Salt factor with 12 computational rounds (`bcrypt.genSaltSync(12)`).
    3.  The password is encrypted:
        ```text
        PasswordHash = Bcrypt(PlaintextPassword, Salt)
        ```
    4.  Only `PasswordHash` is committed to the database.
    5.  During logins, we compare hashes on the CPU using constant-time evaluation to prevent timing side-channel analysis.

---

## 3. Sensitive Payment Data (What is NEVER Stored)
*   **Compliance Standard**: Zero PCI-DSS liability.
*   **Unstored Elements**:
    *   We **NEVER** store complete Credit Card Numbers, Cardholder Verification Values (CVV / CVC), bank passwords, or UPI personal identification numbers (PINs).
*   **Third-Party Handover**:
    *   Payment and payment details are processed directly via secure overlay portals managed by **Razorpay** and **Stripe**.
    *   Dikshu's Cafe stores only standard, safe API reference coefficients returned securely by the gateways:
        1.  `providerName` ('razorpay' | 'stripe')
        2.  `providerOrderId` (e.g. `order_test_XYZ`)
        3.  `providerPaymentId` (e.g. `pay_test_ABC`)
        4.  `paymentStatus` ('paid' | 'unpaid')

---

## 4. Personal Data and Address Isolation (IDOR Guards)
*   Every address table record and cart item is strictly partitioned using a `userId` foreign key.
*   No query retrieving address metrics or allowing updating can run without validating the active JWT session:
    ```sql
    SELECT * FROM address WHERE user_id = USER_SESSION_ID
    ```
*   This implements robust isolation and resolves cross-user direct access vulnerabilities.

---

## 5. Session Architecture
*   **JWT Session Model**:
    *   We issue secure **JSON Web Tokens (JWT)** generated using `jwt.sign()` and restricted by a private server-side secret (`JWT_SECRET`).
*   **Cookie Security Enforcement**:
    *   **HttpOnly**: The cookie is inaccessible to browser-side scripts (preventing Cross-Site Scripting (XSS) token capture).
    *   **SameSite=Lax**: Prevents Cross-Site Request Forgery (CSRF) transmissions.
    *   **Secure**: If the environment is production, the cookie is marked `Secure`, enforcing transport exclusively over HTTPS connections.

---

## 6. Password Reset Token Security
*   **Hashed Tokens Only**: Raw reset strings dispatched via email are hashed using SHA-256 before insertion into the `passwordResetTokens` ledger.
*   **Quick Expiry**: Verification codes and reset hashes expire in 15 minutes.
*   **Single-Use Safeguard**: Once a token is processed, it is immediately deleted or marked as invalid, preventing replay attacks.
