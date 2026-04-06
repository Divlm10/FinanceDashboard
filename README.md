                                                Finance Dashboard Backend
A RESTful API backend for a finance dashboard system with role-based access control, financial records management, and analytics.

Tech Stack:

Runtime: Node.js(ES Modules)
Framework: Express.js
Database: PostgreSQL
Authentication: JWT (JSON Web Tokens)
Password Hashing: bcryptjs
Validation: express-validator

finance-dashboard/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── roleGuard.js       # Role-based access control middleware
│   ├── routes/
│   │   ├── auth.routes.js     # Login and registration
│   │   ├── users.routes.js    # User management
│   │   ├── records.routes.js  # Financial records CRUD
│   │   └── dashboard.routes.js# Analytics and summary APIs
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── records.controller.js
│   │   └── dashboard.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── users.service.js
│   │   ├── records.service.js
│   │   └── dashboard.service.js
│   └── validators/
│       ├── auth.validator.js
│       ├── records.validator.js
│       └── users.validator.js
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── schema.sql
└── server.js


Setup Instructions:

    Prerequisites-

        Node.js v18 or above
        PostgreSQL 14 or above

    1. Clone the repository
    git clone https://github.com/Divlm10/FinanceDashboard.git
    cd finance-dashboard

    2. Install dependencies
    npm install

    3. Set up environment variables
    cp .env.example .env

    Fill in your values in .env:
    PORT=5000
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=finance_dashboard
    DB_PASSWORD=your_password
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d

    4. Create the database
    In pgAdmin or psql, create a database named finance_dashboard, then run:
    psql -U postgres -d finance_dashboard -f schema.sql

    5. Start the server
    # Development
    npm run dev

    # Production
    npm start

    Server runs on `http://localhost:5000`

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "viewer"         // optional: viewer | analyst | admin (default: viewer)
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```
Response includes a `token` — use it as `Authorization: Bearer <token>` on all protected routes.

---

### Financial Records

All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/records` | Viewer+ | Get all records with filters and pagination |
| GET | `/api/records/:id` | Viewer+ | Get a single record |
| POST | `/api/records` | Admin | Create a new record |
| PUT | `/api/records/:id` | Admin | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |

#### Query Parameters for GET /api/records
| Parameter | Type | Description |
|---|---|---|
| `type` | string | Filter by `income` or `expense` |
| `category` | string | Filter by category (partial match) |
| `start_date` | date | Filter from date (YYYY-MM-DD) |
| `end_date` | date | Filter to date (YYYY-MM-DD) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10) |

#### Create Record
```
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "notes": "January salary"   // optional
}
```

---

### Dashboard

All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Viewer+ | Total income, expenses, net balance |
| GET | `/api/dashboard/recent` | Viewer+ | Recent transactions |
| GET | `/api/dashboard/categories` | Analyst+ | Category wise totals |
| GET | `/api/dashboard/trends/monthly` | Analyst+ | Monthly income vs expense trends |
| GET | `/api/dashboard/trends/weekly` | Analyst+ | Weekly income vs expense trends |

#### Sample Summary Response
```json
{
  "success": true,
  "data": {
    "total_income": "65000.00",
    "total_expenses": "5000.00",
    "net_balance": "60000.00",
    "total_records": "5"
  }
}
```

---

### User Management

All routes require Admin token.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users with pagination |
| GET | `/api/users/:id` | Get a single user |
| PATCH | `/api/users/:id/role` | Update user role |
| PATCH | `/api/users/:id/status` | Activate or deactivate user |

#### Update Role
```
PATCH /api/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "analyst"    // viewer | analyst | admin
}
```

#### Update Status
```
PATCH /api/users/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "is_active": false
}
```

---

## Key Design Decisions

### Soft Delete
Financial records are never permanently deleted. A `is_deleted` flag is set to `true` instead. This preserves audit trails and prevents accidental data loss — important in financial systems.

### Parameterized Queries
All database queries use parameterized inputs (`$1`, `$2`) to prevent SQL injection attacks.

### Dynamic Filtering and Updates
The records service builds WHERE and SET clauses dynamically based on what the client actually sends — avoiding unnecessary conditions and partial update issues.

### Layered Architecture
The codebase follows a strict separation of concerns:
- **Routes** — URL mapping only
- **Controllers** — handle request/response
- **Services** — business logic and database queries
- **Middleware** — authentication and authorization

This makes the code easy to debug, test, and extend.

### Role Hierarchy
Three roles with clearly defined permissions: `viewer` (read only), `analyst` (read + insights), `admin` (full access). Enforced at the route level via middleware — not just in business logic.

### Self-modification Protection
An admin cannot change their own role or deactivate their own account, preventing accidental system lockout.

---

## Assumptions Made

- A user's role is assigned at registration time and can only be changed by an admin afterwards.
- Financial record amounts must always be positive. The `type` field (`income` or `expense`) determines the direction.
- Deleted records are excluded from all dashboard analytics and record listings.
- JWT tokens expire in 7 days by default (configurable via `.env`).
- Pagination defaults to page 1 with 10 items per page if not specified.

---

## Error Response Format

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Description of the error"
}
```

Validation errors return an array:
```json
{
  "success": false,
  "errors": ["Amount must be a positive number", "Date is required"]
}
```

### HTTP Status Codes Used
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / Validation error |
| 401 | Unauthenticated |
| 403 | Forbidden / Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Internal server error |
