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

All protected routes require a valid session cookie set by `POST /auth/login`.

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/me` | Yes | Get current authenticated user |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive session cookie |
| POST | `/auth/logout` | Yes | Logout and clear session cookie |

**Register body:** `username`, `name_first`, `name_last`, `email`, `password`, `phone`, `rank`, `uic_id`, `role`, `DoDID`

**Login body:** `email`, `password`

---

### Users — `/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Yes | Get all users |
| GET | `/users/:id` | Yes | Get user by ID |
| PATCH | `/users/:id` | Yes | Update a user |
| DELETE | `/users/:id` | Yes | Delete a user |

**Update body:** `username`, `name_first`, `name_last`, `email`, `password`, `phone`, `rank`, `uic_id`, `role`, `DoDID`

---

### UIC — `/uic`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/uic` | Yes | Get all UICs |
| GET | `/uic/:id` | Yes | Get UIC by ID |
| POST | `/uic` | Yes | Create a UIC |
| PATCH | `/uic/:id` | Yes | Update a UIC |
| DELETE | `/uic/:id` | Yes | Delete a UIC |

**Create body:** `uic`, `unit_name`, `parent_uic`

---

### End Items — `/end-items`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/end-items` | Yes | Get all end items |
| GET | `/end-items/:id` | Yes | Get end item by ID |
| POST | `/end-items` | Yes | Create an end item |
| PATCH | `/end-items/:id` | Yes | Update an end item |
| DELETE | `/end-items/:id` | Yes | Delete an end item |

**Create body:** `fsc`, `description`, `niin`, `image`, `auth_qty`, `lin`

---

### Components — `/components`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/components` | Yes | Get all components |
| GET | `/components/:id` | Yes | Get component by ID |
| POST | `/components` | Yes | Create a component |
| PATCH | `/components/:id` | Yes | Update a component |
| DELETE | `/components/:id` | Yes | Delete a component |

**Create body:** `niin`, `description`, `ui`, `auth_qty`, `image`, `arc`, `end_item_id`

---

### Serial Items — `/serial-items`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/serial-items` | Yes | Get all serial items |
| GET | `/serial-items/:id` | Yes | Get serial item by ID |
| POST | `/serial-items` | Yes | Create a serial item |
| PATCH | `/serial-items/:id` | Yes | Update a serial item |
| DELETE | `/serial-items/:id` | Yes | Delete a serial item |

**Create body:** `item_id`, `serial_number`, `signed_to`, `assigned_at`, `status`

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
