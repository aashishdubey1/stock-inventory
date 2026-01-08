# Inventory Management System Backend

This is the backend for an Inventory Management System designed for an electrical distributor. It manages stock across multiple godowns (warehouses), tracking both Cable (Drum-based) and Non-Cable items, with a strict Role-Based Access Control (RBAC) system.

## 🚀 Features Implemented

### 1. Authentication & Users
- **JWT-based Authentication**: Secure login and session management.
- **RBAC (Role-Based Access Control)**:
    - **Searcher**: View-only access.
    - **Stock In-Charge**: Data entry (Log movements), no edits.
    - **Supervisor**: Admin control (Overrides/Fixes).
- **Endpoints**:
    - `POST /api/v1/auth/register`
    - `POST /api/v1/auth/login`
    - `GET /api/v1/auth/me`

### 2. Godown Management
- CRUD operations for managing warehouses.
- **Endpoints**:
    - `GET /api/v1/godowns` (List all)
    - `POST /api/v1/godowns` (Create - Supervisor only)
    - `PUT /api/v1/godowns/:id` (Update - Supervisor only)
    - `DELETE /api/v1/godowns/:id` (Delete - Supervisor only)

### 3. Cable Inventory (Stock IN)
- Manage Cable Drums with unique tracking.
- **Endpoints**:
    - `POST /api/v1/cables` (Add Stock - Supervisor/Stock In-Charge)
    - `GET /api/v1/cables` (List Stock with filtering)

## 🛠 Tech Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via NeonDB)
- **ORM**: Prisma
- **Validation**: Zod

## ⚙️ Setup

1.  **Install Dependencies**:
    ```bash
    bun install
    ```

2.  **Environment Variables**:
    Create a `.env` file:
    ```env
    DATABASE_URL="your_postgres_connection_string"
    JWT_SECRET="your_secret_key"
    PORT=3000
    ```

3.  **Database Migration**:
    ```bash
    bunx prisma migrate dev
    ```

4.  **Run Server**:
    ```bash
    bun dev
    ```

## 📂 Project Structure
- `src/config`: Configuration (Prisma, Server).
- `src/controllers`: Request handlers.
- `src/middlewares`: Auth and Validation middleware.
- `src/repositories`: Database access layer.
- `src/routes`: API route definitions (versioned).
- `src/utils`: Helper functions.
- `src/validations`: Zod validation schemas.
