# FTP API Endpoints – Postman Testing

The FTP API is hosted at **test.vcloudtech.net**. You can call it in two ways:

| Option | Base URL | When to use |
|--------|----------|-------------|
| **Direct API** | `https://test.vcloudtech.net/api` | Postman, server-side, or any client that doesn’t hit CORS |
| **Via proxy** | `http://199.188.207.24:3005/ftp-api` | Browser / same-origin app (proxy avoids CORS) |

**In Postman** you can use either:
- **Direct:** `https://test.vcloudtech.net/api/auth/login`, `https://test.vcloudtech.net/api/ftp-products`, etc.
- **Via proxy:** `http://199.188.207.24:3005/ftp-api/auth/login`, `http://199.188.207.24:3005/ftp-api/ftp-products`, etc.

---

## Step 1: Get Token (Login)

Use this first. Copy the `token` from the response and use it as `Authorization: Bearer <token>` for all other requests.

**URLs (use one):**
- Direct: `https://test.vcloudtech.net/api/auth/login`
- Via proxy: `http://199.188.207.24:3005/ftp-api/auth/login`

| Field | Value |
|-------|--------|
| **Method** | `POST` |
| **URL** | `https://test.vcloudtech.net/api/auth/login` or proxy URL above |
| **Headers** | `Content-Type: application/json`<br>`Accept: application/json` |
| **Body (raw JSON)** | See below |

**Request body:**
```json
{
  "email": "urahim@vcloudchoice.com",
  "password": "sh&^67swa"
}
```

**Success response (201):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "3|qsr7ewZ8u9trMAmPuuTDisWWGOTTnYeZnJ8rCFVJ1063e75c",
  "token_name": "API Token - 2026-01-28 16:57:38",
  "user": {
    "id": 123,
    "name": "Usama Rahim",
    "email": "urahim@vcloudchoice.com"
  }
}
```

**Postman:**  
Body → raw → JSON → paste the JSON above. Send. Copy `token` from the response.

---

## Step 2: Protected Endpoints (Use Token)

For every request below, add this header:

| Header | Value |
|--------|--------|
| **Authorization** | `Bearer <YOUR_TOKEN>` |
| **Accept** | `application/json` |

Replace `<YOUR_TOKEN>` with the token from Step 1.

---

### 1. Get All Products

**URLs (use one):**
- Direct: `https://test.vcloudtech.net/api/ftp-products`
- Via proxy: `http://199.188.207.24:3005/ftp-api/ftp-products`

| Field | Value |
|-------|--------|
| **Method** | `GET` |
| **URL** | `https://test.vcloudtech.net/api/ftp-products` or proxy URL above |
| **Headers** | `Authorization: Bearer <token>`<br>`Accept: application/json` |

**Optional query params:**

| Parameter | Type | Default | Description |
|-----------|------|--------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 50 | Items per page (max 200) |
| `search` | string | - | Search in sku, mfr_sku, vendor_name, description, upc |
| `search_field` | string | - | One of: `internal_sku`, `mfr_sku`, `vendor_name`, `description`, `upc` |
| `search_value` | string | - | Value when using `search_field` |
| `sort_by` | string | id | One of: `id`, `internal_sku`, `mfr_sku`, `vendor_name`, `description`, `msrp`, `cogs`, `weight`, `upc`, `stock`, `created_at`, `updated_at` |
| `sort_direction` | string | asc | `asc` or `desc` |
| `distributor` | string | - | e.g. `ingram`, `synnex`, `dnh`, `asi`, `arrow`, `scansource`, `888voip`, `wholesale_house` |
| `include_icecat` | string | false | `true` or `false` (slower if true) |

**Example URLs:**
- First page, 10 items:  
  `http://199.188.207.24:3005/ftp-api/ftp-products?page=1&per_page=10`
- Search:  
  `http://199.188.207.24:3005/ftp-api/ftp-products?search=laptop&page=1&per_page=20`
- Sort by price:  
  `http://199.188.207.24:3005/ftp-api/ftp-products?sort_by=msrp&sort_direction=asc&page=1&per_page=50`
- By distributor:  
  `http://199.188.207.24:3005/ftp-api/ftp-products?distributor=ingram&page=1&per_page=50`

**Success response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "internal_sku": "SKU123",
      "mfr_sku": "MFR-SKU-123",
      "vendor_name": "DELL",
      "description": "Product description",
      "msrp": 99.99,
      "cogs": 75.00,
      "weight": 2.5,
      "upc": "123456789012",
      "stock": 100,
      "distributor": "Ingram",
      "table_name": "ingram_tech_ftps",
      "icecat": null,
      "created_at": "2025-01-27T10:00:00.000000Z",
      "updated_at": "2025-01-27T10:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 2000,
    "last_page": 200,
    "from": 1,
    "to": 10
  },
  "filters": { ... }
}
```

---

### 2. Get Single Product by ID

**URLs (use one):**
- Direct: `https://test.vcloudtech.net/api/ftp-products/{id}`
- Via proxy: `http://199.188.207.24:3005/ftp-api/ftp-products/{id}`

| Field | Value |
|-------|--------|
| **Method** | `GET` |
| **URL** | `https://test.vcloudtech.net/api/ftp-products/{id}` or proxy URL above |
| **Headers** | `Authorization: Bearer <token>`<br>`Accept: application/json` |

**Example:**  
`http://199.188.207.24:3005/ftp-api/ftp-products/123`

**Optional query param:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `table_name` | string | Specific table name if known |

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "internal_sku": "SKU123",
    "mfr_sku": "MFR-SKU-123",
    "vendor_name": "DELL",
    "description": "Product description",
    "msrp": 99.99,
    "cogs": 75.00,
    "weight": 2.5,
    "upc": "123456789012",
    "stock": 100,
    "distributor": "Ingram",
    "table_name": "ingram_tech_ftps",
    "icecat": { ... },
    "created_at": "2025-01-27T10:00:00.000000Z",
    "updated_at": "2025-01-27T10:00:00.000000Z"
  }
}
```

---

## Postman Checklist

1. **Login**
   - Method: `POST`
   - URL: `http://199.188.207.24:3005/ftp-api/auth/login`
   - Body: raw JSON with `email` and `password`
   - Send → copy `token` from response.

2. **Get products**
   - Method: `GET`
   - URL: `http://199.188.207.24:3005/ftp-api/ftp-products?page=1&per_page=10`
   - Header: `Authorization: Bearer <paste_token>`
   - Send.

3. **Get one product**
   - Method: `GET`
   - URL: `http://199.188.207.24:3005/ftp-api/ftp-products/123` (use real ID from step 2)
   - Header: `Authorization: Bearer <paste_token>`
   - Send.

---

## Error Responses

| Code | Meaning |
|------|--------|
| 401 | Invalid or missing token → run Step 1 again and use new token |
| 404 | Product or resource not found |
| 405 | Wrong method or path → check URL and method |
| 422 | Validation error (e.g. invalid query params) |
| 429 | Rate limit → wait and retry |
| 500 | Server error |

---

## Quick Copy – Postman

**Direct API (test.vcloudtech.net):**

**1. Login**
```
POST https://test.vcloudtech.net/api/auth/login
Content-Type: application/json
Accept: application/json

{"email":"urahim@vcloudchoice.com","password":"sh&^67swa"}
```

**2. Get products (after adding token to Authorization)**
```
GET https://test.vcloudtech.net/api/ftp-products?page=1&per_page=10
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

**3. Get product by ID**
```
GET https://test.vcloudtech.net/api/ftp-products/123
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

**Via proxy:** Replace `https://test.vcloudtech.net/api` with `http://199.188.207.24:3005/ftp-api` in the URLs above.
