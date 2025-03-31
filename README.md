# ShopHub - E-commerce Platform

A full-stack e-commerce application built with React, Tailwind CSS, Node.js, Express, and PostgreSQL.

## Features

- User authentication (login, register, guest checkout)
- Product browsing and filtering
- Shopping cart functionality
- Order management
- Admin dashboard for product and order management
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- React Query for data fetching
- React Hook Form for form handling

### Backend
- Node.js with Express
- PostgreSQL for database
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v15+)
- Bun (as package manager)

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE ecommerce;
   ```

2. Run the schema and seed SQL files:
   ```bash
   psql -U postgres -d ecommerce -f server/db/schema.sql
   psql -U postgres -d ecommerce -f server/db/seed.sql
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file based on the provided example:
   ```
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   COOKIE_SECRET=your_cookie_secret_key_change_in_production
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   bun run index.ts
   ```

### Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ../
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the frontend development server:
   ```bash
   bun run dev
   ```

4. Access the application at http://localhost:5173

## Sample Accounts

- Admin: admin@example.com / password123
- User: john@example.com / password123
- User: jane@example.com / password123

## Project Structure

```
ecommerce-app/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── context/          # Context providers
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── types/            # TypeScript types
│
├── server/               # Backend source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── db/               # Database scripts
│   ├── middleware/       # Express middleware
│   └── routes/           # API routes
│
├── public/               # Public assets
└── package.json          # Project dependencies
```

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- GET /api/products/featured - Get featured products
- GET /api/products/categories - Get product categories
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Cart
- GET /api/cart - Get cart items
- POST /api/cart/add - Add item to cart
- POST /api/cart/sync - Sync cart after login
- PUT /api/cart/update/:productId - Update cart item
- DELETE /api/cart/remove/:productId - Remove from cart
- DELETE /api/cart/clear - Clear cart

### Orders
- POST /api/orders - Create order
- GET /api/orders/my-orders - Get user orders
- GET /api/orders/:id - Get order details
- GET /api/orders - Get all orders (admin)
- PATCH /api/orders/:id/status - Update order status (admin)

## License

MIT
