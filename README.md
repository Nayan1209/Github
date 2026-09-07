# Troubleshooting HTTP 400: Bad Request

A comprehensive guide to diagnosing, understanding, and resolving HTTP 400 status codes in client-server communications.

---

## What is an HTTP 400 Error?

The **HTTP 400 Bad Request** status code indicates that the server cannot or will not process the request due to an apparent client error. This encompasses malformed request syntax, invalid request message framing, deceptive routing, or payloads that violate business logic rules.

Unlike 5xx errors, which point to server-side infrastructure failures, a 400 error indicates that the client sent data that the server could not comprehend or refused to accept.

---

## Common Causes

```
┌─────────────────────────────────────────────────────────────────┐
│                    Common HTTP 400 Catalysts                    │
├───────────────────────┬────────────────────────┬────────────────┤
│      Client-Side      │  Proxy & Gateway/WAF   │  Server-Side   │
├───────────────────────┼────────────────────────┼────────────────┤
│ • Malformed JSON/XML  │ • Oversized Headers    │ • Schema/DTO   │
│ • Invalid URL/Query   │ • Bad Cookie Payload   │   Violations   │
│ • Missing Headers     │ • Security/WAF Rules   │ • File Size    │
│                       │                        │   Exceeded     │
└───────────────────────┴────────────────────────┴────────────────┘
```

### 1. Client-Side Format Issues
* **Malformed Payload Syntax:** Unescaped strings, missing commas, or mismatched brackets in JSON/XML payloads.
* **Invalid URL or Query Parameters:** Special characters in the URL query string that are not properly percent-encoded (e.g., spaces left as ` ` instead of `%20` or `+`).
* **Incorrect Headers:** Missing required protocol headers (e.g., `Host`, `Content-Type`) or sending invalid values (e.g., sending JSON while specifying `Content-Type: text/plain`).

### 2. Infrastructure & Gateway Interventions
* **Oversized Headers (Token Bloat):** When security tokens (such as JWTs) or cookies grow too large, intermediate proxies (Nginx, IIS, Cloudflare) reject the request with a 400 error.
* **WAF & Security Rule Triggers:** Web Application Firewalls (WAF) may flag safe request parameters as potential SQL injection (SQLi) or Cross-Site Scripting (XSS) attempts, returning a generic 400 or 403 status.
* **HTTP/2 or HTTP/3 Protocol Violations:** Mismatched pseudo-headers or framing issues over multiplexed connections.

### 3. Server-Side Domain & Validation Rules
* **Schema Validation Failures:** The payload violates the server's Data Transfer Object (DTO) contract (e.g., sending a string to an integer field, missing a required `@NotNull` parameter).
* **Payload Size Limits:** Uploading files or sending payloads that exceed maximum payload limits configured on the web server or application gateway.

---

## How to Diagnose

### Step 1: Inspect the Network Request
Open your browser's Developer Tools (F12) and navigate to the **Network** tab:
1. Trigger the action that causes the HTTP 400 error.
2. Click on the failed request.
3. Inspect the **Payload** tab to verify the exact data structure being sent.
4. Check the **Response** tab. Standard-compliant APIs usually return a JSON payload detailing exactly which validation constraint failed.

### Step 2: Isolate with cURL (Verbose Mode)
Eliminate browser-side interference (such as local caching, service workers, or automatic cookie injection) by isolating the request in your terminal. Use `--verbose` (`-v`) to inspect the complete handshake and raw headers:

```bash
curl -v -X POST https://api.example.com/v1/resource \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name": "test_item", "quantity": 5}'
```

### Step 3: Analyze Intermediate Proxies & Gateways
If the request does not reach your application backend:
* Check for custom headers added by API Gateways (e.g., `cf-ray` for Cloudflare, `X-Amzn-Trace-Id` for AWS Application Load Balancers).
* Inspect the HTTP response headers for `Server` or `X-Cache` to see if an edge node rejected the request before your application layer could process it.

### Step 4: Examine Server-Side Application Logs
If you have access to the backend logs, check for:
* **Validation Exceptions:** Look for standard framework validation logs (e.g., Spring's `MethodArgumentNotValidException`, NestJS's `ValidationPipe` logs, or Django's serialization validation errors).
* **Parser Errors:** Check if the JSON parser threw an exception while trying to deserialize the incoming stream.

---

## Resolution Checklist

### For Frontend Developers & API Consumers

- [ ] **Verify HTTP Headers:** Ensure the `Content-Type` matches the payload format (e.g., `application/json`, `application/x-www-form-urlencoded`).
- [ ] **Verify JSON Schema Integrity:** Run the payload through a linter/validator to ensure there are no syntax anomalies.
- [ ] **URL Encoding:** Always wrap dynamic parameters with `encodeURIComponent()` (JavaScript) or your language's equivalent before inserting them into a URL.
- [ ] **Check Cookie and Header Sizes:** If the user is authenticated, check if their authorization token/cookie size exceeds server limits. Try clearing site storage and cookies to test.

### For Backend Engineers & API Providers

#### 1. Implement Standardized Error Responses
Instead of returning a silent or empty 400 response, implement RFC 7807 (Problem Details for HTTP APIs) to provide structured debug insights:

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Bad Request",
  "status": 400,
  "detail": "The request payload failed to validate against the schema rules.",
  "instance": "/v1/resource",
  "invalid_params": [
    {
      "name": "quantity",
      "reason": "Must be an integer value between 1 and 100"
    }
  ]
}
```

#### 2. Configure Web Server Buffer and Body Limits
If clients frequently run into 400 errors during file uploads or heavy token handshakes, tune your web server configuration:

##### Nginx Configuration (`nginx.conf`)
```nginx
http {
    # Increase maximum allowed body size for file uploads
    client_max_body_size 20M;

    # Increase maximum header size limit (useful for large JWTs/Cookies)
    client_header_buffer_size 16k;
    large_client_header_buffers 4 16k;
}
```

##### Apache Configuration (`httpd.conf`)
```apache
# Set maximum body size limit in bytes (e.g., 20MB)
LimitRequestBody 20971520

# Increase maximum size of HTTP request header fields
LimitRequestFieldSize 16384
```

<!-- Maintenance pass complete -->