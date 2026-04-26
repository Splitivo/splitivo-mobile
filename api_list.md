# Splitivo — Estimated API List

Base URL: `https://api.splitivo.app/v1`

All endpoints require `Authorization: Bearer <token>` unless marked **[public]**.

---

## Table of Contents

1. [Auth](#1-auth)
2. [Users](#2-users)
3. [Participants / Contacts](#3-participants--contacts)
4. [Trips](#4-trips)
5. [Bills](#5-bills)
6. [Bill Items & Assignments](#6-bill-items--assignments)
7. [Settlements](#7-settlements)
8. [Expenses / Analytics](#8-expenses--analytics)
9. [Scan (OCR)](#9-scan-ocr)
10. [Currencies](#10-currencies)
11. [Notifications](#11-notifications)

---

## 1. Auth

| Method | Endpoint                | Description                                                        |
| ------ | ----------------------- | ------------------------------------------------------------------ |
| `POST` | `/auth/register`        | Register new account (username, email/phone, password)             |
| `POST` | `/auth/login`           | Login with email/phone + password, returns access + refresh tokens |
| `POST` | `/auth/login/google`    | OAuth login via Google ID token                                    |
| `POST` | `/auth/login/apple`     | OAuth login via Apple identity token                               |
| `POST` | `/auth/otp/send`        | Send OTP to email or phone number                                  |
| `POST` | `/auth/otp/verify`      | Verify OTP code, returns access + refresh tokens                   |
| `POST` | `/auth/token/refresh`   | Refresh access token using refresh token                           |
| `POST` | `/auth/logout`          | Invalidate current refresh token                                   |
| `POST` | `/auth/password/forgot` | Send password reset link                                           |
| `POST` | `/auth/password/reset`  | Reset password using reset token                                   |

### Request / Response Examples

**`POST /auth/login`**

```json
// Request
{
  "identifier": "john@example.com",
  "password": "••••••••"
}

// Response 200
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "u1",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "john@example.com",
    "baseCurrency": "USD"
  }
}
```

**`POST /auth/otp/verify`**

```json
// Request
{
  "phone": "+1234567890",
  "code": "483920"
}

// Response 200
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

## 2. Users

| Method   | Endpoint                                     | Description                                                 |
| -------- | -------------------------------------------- | ----------------------------------------------------------- |
| `GET`    | `/users/me`                                  | Get current user profile                                    |
| `PATCH`  | `/users/me`                                  | Update profile (displayName, avatarUrl, baseCurrency, etc.) |
| `DELETE` | `/users/me`                                  | Delete account                                              |
| `GET`    | `/users/me/bank-accounts`                    | List saved bank accounts                                    |
| `POST`   | `/users/me/bank-accounts`                    | Add a bank account                                          |
| `PATCH`  | `/users/me/bank-accounts/:accountId`         | Update a bank account                                       |
| `DELETE` | `/users/me/bank-accounts/:accountId`         | Remove a bank account                                       |
| `PATCH`  | `/users/me/bank-accounts/:accountId/default` | Set as default bank account                                 |

### Request / Response Examples

**`GET /users/me`**

```json
// Response 200
{
  "id": "u1",
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "avatarUrl": null,
  "baseCurrency": "USD",
  "bankAccounts": [
    {
      "id": "ba1",
      "bankName": "Chase",
      "accountNumber": "****4321",
      "isDefault": true
    }
  ]
}
```

**`PATCH /users/me`**

```json
// Request
{
  "displayName": "John D.",
  "baseCurrency": "IDR"
}
```

**`POST /users/me/bank-accounts`**

```json
// Request
{
  "bankName": "Bank of America",
  "accountNumber": "1234567890"
}
```

---

## 3. Participants / Contacts

| Method | Endpoint                  | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| `GET`  | `/users/search?q={query}` | Search registered users by name or phone |
| `GET`  | `/users/me/contacts`      | List frequently split-with contacts      |

### Request / Response Examples

**`GET /users/search?q=alice`**

```json
// Response 200
{
  "results": [
    {
      "id": "u2",
      "displayName": "Alice Chen",
      "phone": "+1987654321",
      "avatarUrl": null
    }
  ]
}
```

---

## 4. Trips

| Method   | Endpoint                                     | Description                                    |
| -------- | -------------------------------------------- | ---------------------------------------------- |
| `GET`    | `/trips`                                     | List all trips for the current user            |
| `POST`   | `/trips`                                     | Create a new trip                              |
| `GET`    | `/trips/:tripId`                             | Get trip detail (with hydrated bills)          |
| `PATCH`  | `/trips/:tripId`                             | Update trip (name, dates, currency, status)    |
| `DELETE` | `/trips/:tripId`                             | Delete a trip                                  |
| `POST`   | `/trips/:tripId/finalize`                    | Finalize trip (locks editing, marks completed) |
| `GET`    | `/trips/:tripId/participants`                | List participants in a trip                    |
| `POST`   | `/trips/:tripId/participants`                | Add participant(s) to a trip                   |
| `DELETE` | `/trips/:tripId/participants/:participantId` | Remove a participant from a trip               |
| `GET`    | `/trips/:tripId/transfers`                   | Get optimized transfer list for the trip       |

### Request / Response Examples

**`POST /trips`**

```json
// Request
{
  "name": "Bali Trip 2026",
  "startDate": "2026-05-01",
  "endDate": "2026-05-08",
  "currency": "IDR",
  "participants": [
    { "userId": "u2" },
    { "userId": "u3" },
    { "guestName": "Charlie" }
  ]
}

// Response 201
{
  "id": "t1",
  "name": "Bali Trip 2026",
  "startDate": "2026-05-01",
  "endDate": "2026-05-08",
  "currency": "IDR",
  "status": "active",
  "participants": [...],
  "totalSpend": 0,
  "createdAt": "2026-04-26T10:00:00Z"
}
```

**`GET /trips/:tripId/transfers`**

```json
// Response 200
{
  "originalTransferCount": 6,
  "optimizedTransferCount": 3,
  "transfers": [
    {
      "id": "tf1",
      "from": { "id": "u3", "displayName": "Bob Wilson" },
      "to": { "id": "u1", "displayName": "John Doe" },
      "amount": 450000,
      "currency": "IDR",
      "isCompleted": false
    }
  ]
}
```

---

## 5. Bills

| Method   | Endpoint                   | Description                                         |
| -------- | -------------------------- | --------------------------------------------------- |
| `GET`    | `/bills`                   | List all bills (single + trip) for the current user |
| `GET`    | `/bills?tripId={tripId}`   | Filter bills by trip                                |
| `GET`    | `/bills?splitType=single`  | Filter single bills only                            |
| `GET`    | `/bills?status=pending`    | Filter by status                                    |
| `POST`   | `/bills`                   | Create a new bill                                   |
| `GET`    | `/bills/:billId`           | Get bill detail                                     |
| `PATCH`  | `/bills/:billId`           | Update bill (merchant, date, items, etc.)           |
| `DELETE` | `/bills/:billId`           | Delete a bill                                       |
| `POST`   | `/bills/:billId/finalize`  | Finalize bill (locks editing)                       |
| `GET`    | `/bills/:billId/breakdown` | Get per-person payment breakdown                    |

### Request / Response Examples

**`POST /bills`**

```json
// Request
{
  "tripId": "t1",
  "merchantName": "Bali Seafood Grill",
  "date": "2026-05-03",
  "currency": "IDR",
  "category": "food_dining",
  "splitType": "trip",
  "participants": ["u1", "u2", "u3"],
  "items": [
    {
      "name": "Grilled Lobster",
      "quantity": 2,
      "unitPrice": 185000,
      "assignedTo": ["u1", "u2"]
    },
    {
      "name": "Nasi Goreng",
      "quantity": 3,
      "unitPrice": 45000,
      "assignedTo": ["u1", "u2", "u3"]
    }
  ],
  "tax": 55000,
  "serviceCharge": 37000,
  "discount": 0
}

// Response 201
{
  "id": "b3",
  "merchantName": "Bali Seafood Grill",
  "totalAmount": 592000,
  "status": "pending",
  ...
}
```

**`GET /bills/:billId/breakdown`**

```json
// Response 200
{
  "billId": "b3",
  "breakdown": [
    {
      "participantId": "u1",
      "displayName": "John Doe",
      "amount": 247333,
      "isPaid": false
    },
    {
      "participantId": "u2",
      "displayName": "Alice Chen",
      "amount": 247333,
      "isPaid": false
    },
    {
      "participantId": "u3",
      "displayName": "Bob Wilson",
      "amount": 97334,
      "isPaid": false
    }
  ]
}
```

---

## 6. Bill Items & Assignments

| Method   | Endpoint                                   | Description                               |
| -------- | ------------------------------------------ | ----------------------------------------- |
| `POST`   | `/bills/:billId/items`                     | Add an item to a bill                     |
| `PATCH`  | `/bills/:billId/items/:itemId`             | Update item (name, quantity, unitPrice)   |
| `DELETE` | `/bills/:billId/items/:itemId`             | Remove an item from a bill                |
| `PUT`    | `/bills/:billId/items/:itemId/assignments` | Replace assigned participants for an item |

### Request / Response Examples

**`PUT /bills/:billId/items/:itemId/assignments`**

```json
// Request
{
  "assignedTo": ["u1", "u3"]
}
```

---

## 7. Settlements

| Method   | Endpoint                                        | Description                             |
| -------- | ----------------------------------------------- | --------------------------------------- |
| `POST`   | `/bills/:billId/settle/:participantId`          | Mark a participant as paid in a bill    |
| `DELETE` | `/bills/:billId/settle/:participantId`          | Unmark a participant as paid            |
| `POST`   | `/trips/:tripId/transfers/:transferId/complete` | Mark an optimized transfer as completed |
| `DELETE` | `/trips/:tripId/transfers/:transferId/complete` | Unmark a transfer as completed          |

### Request / Response Examples

**`POST /bills/:billId/settle/:participantId`**

```json
// Response 200
{
  "billId": "b3",
  "participantId": "u2",
  "isPaid": true,
  "billStatus": "partial"
}
```

---

## 8. Expenses / Analytics

| Method | Endpoint                                | Description                                       |
| ------ | --------------------------------------- | ------------------------------------------------- |
| `GET`  | `/expenses`                             | List all expense records for the current user     |
| `GET`  | `/expenses?period=monthly`              | Filter by period (`daily`, `monthly`, `annually`) |
| `GET`  | `/expenses?period=monthly&date=2026-04` | Filter by period + specific month/year            |
| `GET`  | `/expenses/breakdown?period=monthly`    | Category breakdown with totals + percentages      |
| `GET`  | `/expenses/summary`                     | Total spend across all time                       |

### Request / Response Examples

**`GET /expenses?period=monthly&date=2026-04`**

```json
// Response 200
{
  "period": "monthly",
  "date": "2026-04",
  "expenses": [
    {
      "id": "e1",
      "billId": "b1",
      "merchantName": "Pizza Palace",
      "category": "food_dining",
      "amount": 45.5,
      "currency": "USD",
      "date": "2026-04-19"
    }
  ]
}
```

**`GET /expenses/breakdown?period=monthly`**

```json
// Response 200
{
  "period": "monthly",
  "totalAmount": 312.75,
  "currency": "USD",
  "breakdown": [
    { "category": "food_dining", "amount": 145.0, "percentage": 46.4 },
    { "category": "transport", "amount": 87.5, "percentage": 28.0 },
    { "category": "shopping", "amount": 80.25, "percentage": 25.6 }
  ]
}
```

---

## 9. Scan (OCR)

| Method | Endpoint        | Description                             |
| ------ | --------------- | --------------------------------------- |
| `POST` | `/scan/receipt` | Upload receipt image for OCR processing |

### Request / Response Examples

**`POST /scan/receipt`**

```
Content-Type: multipart/form-data

// Fields
image: <binary file>
currency: "USD"
```

```json
// Response 200
{
  "merchantName": "The Grand Bistro",
  "date": "2026-04-20",
  "currency": "USD",
  "items": [
    { "name": "Caesar Salad", "quantity": 1, "unitPrice": 14.5 },
    { "name": "Grilled Salmon", "quantity": 2, "unitPrice": 28.0 },
    { "name": "Tiramisu", "quantity": 1, "unitPrice": 9.0 },
    { "name": "Sparkling Water", "quantity": 3, "unitPrice": 5.0 },
    { "name": "Espresso", "quantity": 2, "unitPrice": 4.0 }
  ],
  "tax": 9.15,
  "serviceCharge": 6.1,
  "total": 106.75
}
```

> The OCR endpoint may return a `202 Accepted` with a job ID for async processing, polling via `GET /scan/receipt/:jobId`.

---

## 10. Currencies

| Method | Endpoint                                    | Description                                   |
| ------ | ------------------------------------------- | --------------------------------------------- |
| `GET`  | `/currencies` **[public]**                  | List all supported currencies                 |
| `GET`  | `/currencies/:code` **[public]**            | Get currency by code (e.g. `USD`, `IDR`)      |
| `GET`  | `/currencies/search?q={query}` **[public]** | Search currencies by code, name, or symbol    |
| `GET`  | `/currencies/rates?base={code}`             | Get latest exchange rates for a base currency |

### Request / Response Examples

**`GET /currencies/USD`**

```json
// Response 200
{
  "code": "USD",
  "name": "US Dollar",
  "namePlural": "US dollars",
  "symbol": "$",
  "symbolNative": "$",
  "decimalDigits": 2,
  "rounding": 0
}
```

**`GET /currencies/rates?base=USD`**

```json
// Response 200
{
  "base": "USD",
  "date": "2026-04-26",
  "rates": {
    "IDR": 16350.0,
    "EUR": 0.92,
    "SGD": 1.35,
    "JPY": 154.2
  }
}
```

---

## 11. Notifications

| Method   | Endpoint                  | Description                               |
| -------- | ------------------------- | ----------------------------------------- |
| `GET`    | `/notifications`          | List notifications for the current user   |
| `PATCH`  | `/notifications/:id/read` | Mark a notification as read               |
| `POST`   | `/notifications/read-all` | Mark all notifications as read            |
| `POST`   | `/devices/push-token`     | Register a push notification token (Expo) |
| `DELETE` | `/devices/push-token`     | Unregister push notification token        |

### Notification Types

| Type                 | Trigger                                  |
| -------------------- | ---------------------------------------- |
| `bill.created`       | Added to a new bill by another user      |
| `bill.settled`       | Someone marked their share as paid       |
| `trip.invite`        | Invited to a new trip                    |
| `trip.finalized`     | A trip you're in has been finalized      |
| `transfer.completed` | Someone marked a transfer to you as done |
| `transfer.reminder`  | Reminder to complete a pending transfer  |

---

## Error Responses

All endpoints return a consistent error shape:

```json
{
  "error": {
    "code": "BILL_NOT_FOUND",
    "message": "The requested bill does not exist.",
    "statusCode": 404
  }
}
```

### Common Error Codes

| Code                    | HTTP Status | Description                                            |
| ----------------------- | ----------- | ------------------------------------------------------ |
| `UNAUTHORIZED`          | 401         | Missing or invalid access token                        |
| `FORBIDDEN`             | 403         | Authenticated but not allowed (e.g. not a participant) |
| `NOT_FOUND`             | 404         | Resource does not exist                                |
| `VALIDATION_ERROR`      | 422         | Request body failed validation                         |
| `BILL_FINALIZED`        | 409         | Attempt to modify a finalized bill                     |
| `TRIP_FINALIZED`        | 409         | Attempt to modify a finalized trip                     |
| `DUPLICATE_PARTICIPANT` | 409         | Participant already exists in the trip/bill            |
| `RATE_LIMIT_EXCEEDED`   | 429         | Too many requests                                      |
| `INTERNAL_ERROR`        | 500         | Unexpected server error                                |

---

## Pagination

List endpoints support cursor-based pagination:

```
GET /bills?limit=20&cursor=eyJpZCI6ImIxMCJ9
```

```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6ImIzMCJ9",
    "hasMore": true,
    "total": 84
  }
}
```
