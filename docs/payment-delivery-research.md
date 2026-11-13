# Secure WayForPay → Telegram PDF delivery

Research date: 2026-11-09

This note records the provider contracts and a recommended server-side flow for
accepting a WayForPay payment, marking the order paid, and delivering a PDF (or
a short-lived PDF link) in Telegram. The provider documents below are the
source of truth; the idempotency and token-storage parts are implementation
recommendations derived from those contracts.

## 1. WayForPay contract

### Payment result callback

For a Purchase, `serviceUrl` is the merchant URL that receives the payment
result directly. `returnUrl` is the customer redirect, so it must not be used
as proof of payment. WayForPay sends an HTTP POST to `serviceUrl` for
authorized/checked orders and for order-status changes. The request includes
the order data and an HMAC-MD5 control signature. If WayForPay does not receive
a correct merchant response, it retries for four days or until it receives a
correct response. See [WayForPay Accept payment (Purchase)](https://wiki.wayforpay.com/en/view/852102), especially the `serviceUrl` and
notification sections.

For the callback, compute the HMAC-MD5 over this exact UTF-8, semicolon-joined
sequence (using the callback values, not values supplied by the browser):

```text
merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
```

Compare the computed digest with `merchantSignature` before changing order
state. The field order and encoding are specified by WayForPay in the
[callback signature documentation](https://wiki.wayforpay.com/en/view/852102#L216).

After the callback is durably accepted, respond with JSON in this shape:

```json
{
  "orderReference": "<the callback orderReference>",
  "status": "accept",
  "time": 1700000000,
  "signature": "<HMAC-MD5>"
}
```

The response signature is computed over the UTF-8, semicolon-joined sequence
`orderReference;status;time`, with the merchant secret key. The example and
formula are in the [WayForPay merchant response section](https://wiki.wayforpay.com/en/view/852102#L287).

### Which status can unlock the PDF?

Only a verified terminal success should create fulfillment. WayForPay lists
`Approved` as a successful payment where funds were withdrawn. `inProcessing`,
`Pending`, and `WaitingAuthComplete` are not the same as settled success;
`Declined`, `Expired`, and `Refunded/Voided` must not unlock a paid artifact.
The complete status table is in [WayForPay Codes of responses](https://wiki.wayforpay.com/en/view/852131#L43).

The callback handler should also compare the verified callback against the
server-created order: `merchantAccount`, `orderReference`, expected amount,
and expected currency. A valid signature authenticates the message, but it does
not make a mismatched amount or currency valid for this particular order. This
comparison is an application-level safety check.

### Status reconciliation

If the callback is missing, ambiguous, or the order is still non-terminal, the
merchant can query WayForPay's status API. Send an HTTP POST to
`https://api.wayforpay.com/api` with `transactionType: "CHECK_STATUS"`, the
merchant account, the order reference, API version, and a request signature.
The request signature is HMAC-MD5 over
`merchantAccount;orderReference`. The response signature is HMAC-MD5 over
`merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode`.
See [WayForPay Checking of payment status](https://wiki.wayforpay.com/en/view/852117#L41).

Reconciliation should apply the same merchant/order/amount/currency checks and
the same `Approved`-only fulfillment rule as the callback path. It should be a
repair/retry path, not a way to bypass signature verification.

## 2. Telegram delivery contract

Bot API calls use Telegram's HTTPS endpoint form
`https://api.telegram.org/bot<token>/METHOD_NAME`; keep the bot token in a
server-side secret, never in browser code or a PDF URL. The [Telegram Bot API](https://core.telegram.org/bots/api)
defines `sendMessage` with required `chat_id` and `text` (1–4096 characters
after entity parsing). A successful call returns the sent `Message`; therefore
store the returned `message_id` for audit and deduplication.

For link delivery, send a short message containing an HTTPS download URL:

```json
{
  "chat_id": 123456789,
  "text": "Дякуємо за оплату! Ваш PDF: https://example.com/download/<opaque-token>"
}
```

For direct PDF delivery, call `sendDocument`. Telegram documents the `document`
argument as an upload, an existing `file_id`, or an HTTP URL; current Bot API
limits are up to 50 MB for files sent by the bot. When sending by URL,
`sendDocument` currently supports PDF and ZIP URLs. A previously uploaded
`file_id` can be reused for the same bot. See [Telegram sending files](https://core.telegram.org/bots/api#sending-files)
and [sendDocument](https://core.telegram.org/bots/api#senddocument).

The simplest and safest delivery for a private paid book is normally an
opaque, short-lived HTTPS link in `sendMessage`: the PDF stays behind the
application's authorization/download checks, and the Telegram message does
not contain the bot token or a guessable order number. If direct attachment is
preferred, use `sendDocument` and persist the returned Telegram message/file
metadata.

Before payment, the user must have contacted the bot and the application must
have stored the resulting `chat_id`. Telegram's official tutorial says a bot
cannot send a user's first private message until the user has contacted it.
Use a `/start` deep-link or an explicit “connect Telegram” step to bind a
user-owned opaque state token to the chat ID; do not infer a chat ID from an
email address. See [Telegram's official bot tutorial](https://core.telegram.org/bots/tutorial#sending-messages)
and [Bot API sendMessage](https://core.telegram.org/bots/api#sendmessage).

## 3. Recommended idempotent flow

1. **Create the order on the server.** Generate a unique `orderReference` and
   store the expected amount, currency, product/PDF identifier, and (if the
   customer opted in) the already-bound Telegram `chat_id`. Sign the WayForPay
   payment request server-side with the merchant secret. Treat the browser's
   `returnUrl` result as display-only.

2. **Receive and verify `serviceUrl`.** Parse the JSON body, validate required
   fields and the expected merchant account, calculate the exact callback
   HMAC-MD5 string above, and use a constant-time digest comparison. Reject
   invalid signatures, unknown order references, and amount/currency mismatches
   without changing fulfillment state.

3. **Commit payment and an outbox record atomically.** In one database
   transaction, record the verified provider status and insert a delivery job
   only when the status is `Approved`. Give the job a unique key such as
   `(orderReference, artifactId, channel, chatId)` (or a stable order-level
   delivery key). This makes WayForPay's repeated callbacks harmless. Do not
   rely on an in-memory “already sent” flag.

4. **Acknowledge WayForPay promptly.** Once the verified callback and outbox
   row are durable, return the `accept` response and its signature. Do not make
   the callback request wait for PDF generation or Telegram network latency;
   WayForPay explicitly retries when its response is not accepted.

5. **Deliver asynchronously.** A worker claims the unique delivery job,
   creates/uses the protected PDF URL (or PDF file), and calls `sendMessage` or
   `sendDocument`. On success, store Telegram `message_id`, delivery timestamp,
   and any `file_id`. On transient failure, retry with backoff; on permanent
   failures such as an unconnected/blocked chat, mark the job failed and expose
   a manual resend or HTTPS fallback.

6. **Make retries safe.** A duplicate callback must find the existing paid
   order and existing delivery job, not create another job. A worker retry must
   use the persisted delivery state/claim and a unique key. If a network timeout
   occurs after Telegram accepted a message, reconciliation should prefer the
   persisted successful result or an operator-controlled resend policy rather
   than blindly sending unlimited duplicates.

7. **Reconcile.** Periodically retry failed callbacks/jobs and use WayForPay
   `CHECK_STATUS` for orders stuck in a non-terminal state. A later
   `Refunded/Voided` status should stop future downloads or revoke links as
   appropriate; it should not silently create a second fulfillment.

## 4. Minimal state to persist

```text
orders
  orderReference (unique)
  expectedAmount, expectedCurrency
  providerStatus, providerPayloadHash, paidAt
  artifactId, telegramChatId (nullable)

delivery_jobs
  idempotencyKey (unique)
  orderReference, artifactId, channel, telegramChatId
  status: pending | sending | sent | failed
  attempts, nextAttemptAt, telegramMessageId, telegramFileId
  lastError, sentAt

download_tokens (if sending a link)
  tokenHash (unique), orderReference, artifactId
  expiresAt, revokedAt, firstUsedAt (optional)
```

The provider's callback does not expose a unique event ID in the documented
payload, so deduplicate on the merchant's stable order reference and the
fulfillment key, while retaining a hash/audit record of each verified payload.

## Official sources

- [WayForPay Accept payment (Purchase)](https://wiki.wayforpay.com/en/view/852102)
- [WayForPay Checking of payment status](https://wiki.wayforpay.com/en/view/852117)
- [WayForPay Codes of responses](https://wiki.wayforpay.com/en/view/852131)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Bot API: sending files](https://core.telegram.org/bots/api#sending-files)
- [Telegram Bot API: sendMessage](https://core.telegram.org/bots/api#sendmessage)
- [Telegram Bot API: sendDocument](https://core.telegram.org/bots/api#senddocument)
- [Telegram official bot tutorial: sending messages](https://core.telegram.org/bots/tutorial#sending-messages)
