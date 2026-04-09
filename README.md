# TORCH - Transfer of Records and Command Hand-receipt

A web-based military property accountability application designed for use at the detachment/platoon level.

## Tech Stack

- React (Vite) - Frontend
- Express - Backend
- PostgreSQL - Database

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL

### Install Dependencies

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd server && npm install
```

### Run the App

```bash
# Run client
cd client && npm run dev

# Run server
cd server && npm run dev
```

## API Endpoints

**Base URL:** `http://localhost:8080`

All protected routes require a valid JWT session cookie set by `POST /auth/login`. The cookie is `httpOnly`, expires after 7 days, and is named `token`.

---

### Auth — `/auth`

#### `GET /auth/me` — Auth required
Get the currently authenticated user's profile.

**Request:** No body.

**Response `200`:**
```json
{
  "user": {
    "id": 1,
    "username": "jsmith",
    "name_first": "John",
    "name_last": "Smith",
    "email": "jsmith@example.com",
    "phone": "555-1234",
    "dodid": "1234567890",
    "role": "user",
    "rank_id": 7,
    "rank": "E-7",
    "uic_id": 1,
    "uic": "WCAEB1",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

---

#### `POST /auth/register` — No auth required
Create a new user account.

**Request body:**
```json
{
  "username": "jsmith",
  "name_first": "John",
  "name_last": "Smith",
  "email": "jsmith@example.com",
  "password": "secret",
  "phone": "555-1234",
  "rank": "E-7",
  "uic": "WCAEB1",
  "role": "user",
  "dodid": "1234567890"
}
```
All fields required. `rank` must match an existing rank (e.g. `"E-7"`). `uic` must match an existing UIC code.

**Response `201`:**
```json
{
  "newUser": {
    "username": "jsmith",
    "name_first": "John",
    "name_last": "Smith",
    "email": "jsmith@example.com",
    "phone": "555-1234",
    "rank_id": 7,
    "rank": "E-7",
    "uic_id": 1,
    "uic": "WCAEB1",
    "role": "user",
    "dodid": "1234567890"
  }
}
```

**Errors `400`:** Missing fields, email/username already in use, invalid rank or UIC.

---

#### `POST /auth/login` — No auth required
Authenticate and receive a session cookie.

**Request body:**
```json
{
  "email": "jsmith@example.com",
  "password": "secret"
}
```

**Response `200`:** Sets `httpOnly` cookie `token` (7-day expiry).
```json
{ "message": "Welcome back jsmith@example.com" }
```

**Errors `401`:** Invalid email or password.

---

#### `POST /auth/logout` — Auth required
Clear the session cookie.

**Request:** No body.

**Response `200`:**
```json
{ "message": "Logged out." }
```

---

### Users — `/users`

All endpoints require authentication.

#### `GET /users`
Get all users. Supports filtering, sorting, and pagination via query params.

**Query params:**
| Param | Description |
|-------|-------------|
| `q` | Search across text fields |
| `sort_by` | Field to sort by (default: `id`) |
| `order` | `asc` or `desc` (default: `asc`) |
| `limit` | Max results (1–100) |
| `offset` | Pagination offset (default: `0`) |

**Response `200`:**
```json
{
  "allUsers": [
    {
      "id": 1,
      "username": "jsmith",
      "name_first": "John",
      "name_last": "Smith",
      "email": "jsmith@example.com",
      "phone": "555-1234",
      "dodid": "1234567890",
      "role": "user",
      "rank": "E-7",
      "uic": "WCAEB1",
      "unit_name": "1st Battalion",
      "parent_uic": "W1A1AB",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

#### `GET /users/:id`
Get a single user by ID.

**Response `200`:**
```json
{
  "user": { /* same shape as GET /users item */ }
}
```

---

#### `PATCH /users/:id`
Update a user. All fields optional.

**Request body:**
```json
{
  "username": "jsmith2",
  "name_first": "John",
  "name_last": "Smith",
  "email": "jsmith2@example.com",
  "phone": "555-9999",
  "role": "hrh",
  "dodid": "0987654321"
}
```

**Response `200`:**
```json
{
  "updatedUser": { /* updated user object */ },
  "message": "'jsmith2' has been successfully updated."
}
```

---

#### `DELETE /users/:id`
Delete a user by ID.

**Response `200`:**
```json
{
  "deletedUser": { /* deleted user object */ },
  "message": "'jsmith' was successfully deleted."
}
```

---

### UICs — `/uics`

#### `GET /uics` — No auth required
Get all UICs. Supports filtering, sorting, and pagination.

**Query params:**
| Param | Description |
|-------|-------------|
| `q` | Search the `uic` field |
| `sort_by` | Field to sort by |
| `order` | `asc` or `desc` |
| `limit` | Max results |
| `offset` | Pagination offset |

**Response `200`:**
```json
{
  "allUics": [
    {
      "id": 1,
      "uic": "WCAEB1",
      "unit_name": "1st Battalion",
      "parent_uic": "W1A1AB",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

#### `GET /uics/:id` — No auth required
Get a single UIC by ID.

**Response `200`:**
```json
{
  "uic": { /* same shape as GET /uics item */ }
}
```

---

#### `POST /uics` — Auth required
Create a new UIC.

**Request body:**
```json
{
  "uic": "W1A1AA",
  "unit_name": "1st Battalion",
  "parent_uic": "W1A1AB"
}
```
`uic` and `unit_name` are required. `parent_uic` is optional.

**Response `201`:**
```json
{
  "newUic": { /* uic object */ },
  "message": "UIC 'W1A1AA' has been successfully created."
}
```

---

#### `PATCH /uics/:id` — Auth required
Update a UIC. All fields optional.

**Request body:**
```json
{
  "uic": "W1A1AA",
  "unit_name": "2nd Battalion",
  "parent_uic": "W1A1AC"
}
```

**Response `200`:**
```json
{
  "updatedUic": { /* updated uic object */ },
  "message": "UIC 'W1A1AA' has been successfully updated."
}
```

---

#### `DELETE /uics/:id` — Auth required
Delete a UIC by ID.

**Response `200`:**
```json
{
  "deletedUic": { /* deleted uic object */ },
  "message": "UIC 'W1A1AA' was successfully deleted."
}
```

---

### End Items — `/end-items`

All endpoints require authentication.

#### `GET /end-items`
Get all end items. Supports filtering, sorting, and pagination.

**Query params:**
| Param | Description |
|-------|-------------|
| `id` | Filter by ID |
| `description` | Substring match on description |
| `niin` | Substring match on NIIN |
| `fsc` | Substring match on FSC |
| `lin` | Substring match on LIN |
| `q` | General text search |
| `sort_by` | Field to sort by |
| `order` | `asc` or `desc` |
| `limit` | Max results |
| `offset` | Pagination offset |

**Response `200`:**
```json
{
  "allEndItems": [
    {
      "id": 1,
      "fsc": "1005",
      "description": "RIFLE,5.56 MILLIMETER",
      "niin": "016191936",
      "image": "url-or-path",
      "auth_qty": "1",
      "lin": "R97777",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

#### `GET /end-items/:id`
Get a single end item by ID.

**Response `200`:**
```json
{
  "endItem": { /* same shape as GET /end-items item */ }
}
```

---

#### `POST /end-items`
Create a new end item.

**Request body:**
```json
{
  "fsc": "1005",
  "description": "RIFLE,5.56 MILLIMETER",
  "niin": "016191936",
  "image": "url-or-path",
  "auth_qty": "1",
  "lin": "R97777"
}
```
All fields required.

**Response `201`:**
```json
{
  "newEndItem": { /* end item object */ },
  "message": "LIN: R97777 has been successfully created."
}
```

---

#### `PATCH /end-items/:id`
Update an end item. All fields optional.

**Request body:**
```json
{
  "fsc": "1005",
  "description": "RIFLE,5.56 MILLIMETER",
  "niin": "016191936",
  "image": "url-or-path",
  "auth_qty": "2",
  "lin": "R97777"
}
```

**Response `200`:**
```json
{
  "updatedEndItem": { /* updated end item object */ },
  "message": "LIN: R97777 has been successfully updated."
}
```

---

#### `DELETE /end-items/:id`
Delete an end item by ID.

**Response `200`:**
```json
{
  "deletedEndItem": { /* deleted end item object */ },
  "message": "LIN: R97777 was successfully deleted."
}
```

---

### Components — `/components`

All endpoints require authentication.

#### `GET /components`
Get all components. Supports filtering, sorting, and pagination.

**Query params:**
| Param | Description |
|-------|-------------|
| `id` | Filter by ID |
| `description` | Substring match on description |
| `niin` | Substring match on NIIN |
| `arc` | Substring match on ARC |
| `end_item_id` | Filter by end item ID |
| `q` | General text search |
| `sort_by` | Field to sort by |
| `order` | `asc` or `desc` |
| `limit` | Max results |
| `offset` | Pagination offset |

**Response `200`:**
```json
{
  "allComponents": [
    {
      "id": 1,
      "niin": 123456789,
      "description": "MAGAZINE,30-ROUND",
      "ui": "EA",
      "auth_qty": "6",
      "image": "url-or-path",
      "arc": "B",
      "end_item_id": 1,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

#### `GET /components/:id`
Get a single component by ID.

**Response `200`:**
```json
{
  "component": { /* same shape as GET /components item */ }
}
```

---

#### `POST /components`
Create a new component. Associates the component to an end item via LIN.

**Request body:**
```json
{
  "niin": 123456789,
  "description": "MAGAZINE,30-ROUND",
  "ui": "EA",
  "auth_qty": "6",
  "image": "url-or-path",
  "arc": "B",
  "end_item_lin": "R97777"
}
```
All fields required. `end_item_lin` must match an existing end item's LIN.

**Response `201`:**
```json
{
  "newComponent": { /* component object */ },
  "message": "NIIN: 123456789 has been successfully created."
}
```

---

#### `PATCH /components/:id`
Update a component. All fields optional.

**Request body:**
```json
{
  "niin": 123456789,
  "description": "MAGAZINE,30-ROUND",
  "ui": "EA",
  "auth_qty": "4",
  "image": "url-or-path",
  "arc": "B",
  "end_item_id": 1
}
```

**Response `200`:**
```json
{
  "updatedComponent": { /* updated component object */ },
  "message": "NIIN: 123456789 has been successfully updated."
}
```

---

#### `DELETE /components/:id`
Delete a component by ID.

**Response `200`:**
```json
{
  "deletedComponent": { /* deleted component object */ },
  "message": "NIIN: 123456789 was successfully deleted."
}
```

---

### Serial Items — `/serial-items`

All endpoints require authentication.

#### `GET /serial-items`
Get all serial items. Supports filtering, sorting, and pagination.

**Query params:**
| Param | Description |
|-------|-------------|
| `id` | Filter by ID |
| `serial_number` | Substring match on serial number |
| `status` | Comma-separated status values (e.g. `serviceable,unserviceable`) |
| `item_id` | Filter by end item ID |
| `signed_to` | Filter by signed_to field |
| `q` | General text search |
| `sort_by` | Field to sort by |
| `order` | `asc` or `desc` |
| `limit` | Max results |
| `offset` | Pagination offset |

**Response `200`:**
```json
{
  "allSerialItems": [
    {
      "id": 1,
      "serial_number": "SN-012",
      "status": "serviceable",
      "item_id": 1,
      "user_id": 3,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

#### `GET /serial-items/:id`
Get a single serial item by ID.

**Response `200`:**
```json
{
  "serialItem": { /* same shape as GET /serial-items item */ }
}
```

---

#### `POST /serial-items`
Create a new serial item. Associates to an end item via LIN and a user via DoDID.

**Request body:**
```json
{
  "serial_number": "SN-012",
  "status": "serviceable",
  "end_item_lin": "R97777",
  "user_dodid": "1234567890"
}
```
All fields required. `end_item_lin` must match an existing end item's LIN. `user_dodid` must match an existing user's DoDID.

**Response `201`:**
```json
{
  "newSerialItem": { /* serial item object */ },
  "message": "SN: SN-012 has been successfully posted."
}
```

---

#### `PATCH /serial-items/:id`
Update a serial item. All fields optional.

**Request body:**
```json
{
  "serial_number": "SN-013",
  "status": "unserviceable",
  "item_id": 2,
  "user_id": 5
}
```

**Response `200`:**
```json
{
  "updatedSerialItem": { /* updated serial item object */ },
  "message": "SN: SN-013 has been successfully updated."
}
```

---

#### `DELETE /serial-items/:id`
Delete a serial item by ID.

**Response `200`:**
```json
{
  "deletedSerialItem": { /* deleted serial item object */ },
  "message": "SN: SN-012 was successfully deleted."
}
```

---

### Ingest — `/ingest`

#### `POST /ingest/excel` — No auth currently enforced
Upload and parse an Excel file to ingest bulk data.

**Content-Type:** `multipart/form-data`

**Request:** Form field `file` containing an `.xlsx` file.

**Response `200`:**
```json
{
  "data": [ /* parsed rows from the Excel file */ ]
}
```

**Response `400`:** `"No file uploaded."`

**Response `500`:** `"Error parsing file: {error message}"`

---

### Raw — `/raw`

#### `POST /raw` — Auth required
Create multiple related records (users, UICs, end items, components, serial items) in a single request.

**Request body:**
```json
{
  "usersData": {
    "name_first": "John",
    "name_last": "Smith",
    "email": "jsmith@example.com",
    "phone": "555-1234",
    "rank": "E-7",
    "uic": "WCAEB1",
    "role": "user",
    "DoDID": "1234567890"
  },
  "uicsData": {
    "uic": "W1A1AA",
    "unit_name": "1st Battalion",
    "parent_uic": "W1A1AB"
  },
  "endItemsData": {
    "fsc": "1005",
    "description": "RIFLE,5.56 MILLIMETER",
    "niin": "016191936",
    "image": "url-or-path",
    "auth_qty": "1",
    "lin": "R97777"
  },
  "componentsData": {
    "niin": "123456789",
    "description": "MAGAZINE,30-ROUND",
    "ui": "EA",
    "auth_qty": "6",
    "image": "url-or-path",
    "arc": "B",
    "end_item_id": 1
  },
  "serialItemsData": {
    "serial_number": "SN-012",
    "status": "serviceable",
    "item_id": 1,
    "user_id": 3
  }
}
```

**Response `201`:**
```json
{
  "raw": { /* combined result of all created records */ }
}
```

---

## Team: 'Ctrl+Alpha+Delete'

- Matthew W (Instructor)
- Brian B
- Dylan R
- Jared A
- Corey P
- Keenan M
- Jesus G
- Ben T
- Jordan P
