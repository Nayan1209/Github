# Troubleshooting HTTP 400: Bad Request

A comprehensive guide to diagnosing, understanding, and resolving HTTP 400 status codes in client-server communications.

## What is an HTTP 400 Error?

The **HTTP 400 Bad Request** status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

---

## Common Causes

### 1. Client-Side Issues
* **Malformed Syntax:** Incorrectly formatted JSON, XML, or query parameters.
* **Invalid Headers:** Missing required headers (e.g., `Content-Type`, `Authorization`) or oversized header fields.
* **Cookie Issues:** Corrupted or expired cookies associated with the target domain.
* **Invalid URL:** Typos in the URL path or improperly encoded characters (e.g., unencoded spaces or special symbols).

### 2. Server-Side Validation
* **Schema Validation Failures:** The payload does not match the server's expected data contract or schema rules (e.g., a missing required field or incorrect data type).
* **File Size Limits:** Uploading files that exceed the maximum size limits configured on the web server (e.g., Nginx, Apache).

---

## How to Diagnose

### Step 1: Inspect the Network Request
Open your browser's Developer Tools (F12) and navigate to the **Network** tab:
1. Trigger the action that causes the HTTP 400 error.
2. Click on the failed request.
3. Inspect the **Payload** (or Request Body) to verify the data structure.
4. Check the **Response** tab. Good APIs often return a JSON payload explaining *why* the request was bad.

### Step 2: Isolate with cURL
Eliminate browser-specific behavior (like caching or automatic cookie submission) by testing the request directly from your terminal:

```bash
curl -i -X POST https://api.example.com/v1/resource \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "quantity": 5}'
```

### Step 3: Check Server Application Logs
If you have backend access, inspect your application logs. Modern frameworks usually log validation exceptions that specify the exact field or constraint that caused the failure.

---

## Resolution Checklist

### For Frontend Developers & API Consumers
* [ ] **Verify Content-Type:** Ensure the `Content-Type` header matches your payload (e.g., `application/json` for JSON payloads).
* [ ] **Validate JSON Payload:** Run your payload through a JSON validator to catch syntax errors like missing commas or unescaped quotes.
* [ ] **URL Encoding:** Ensure query parameters containing spaces or special characters are properly URL-encoded.
* [ ] **Clear Cookies & Cache:** If the error happens on a standard web page, try clearing your browser cookies and site cache for that domain.

### For Backend Engineers & API Providers
* [ ] **Provide Detailed Error Responses:** Instead of returning a generic 400 status, return a structured payload outlining the validation errors:
  ```json
  {
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "errors": [
      {
        "field": "email",
        "reason": "Must be a valid email address"
      }
    ]
  }
  ```
* [ ] **Adjust Web Server Limits:** If users are uploading large payloads, verify your server configuration limits (e.g., `client_max_body_size` in Nginx).

<!-- Maintenance pass complete -->