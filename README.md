# UB Restaurant

UB Restaurant is a modern restaurant ordering and admin management web app built with React, Vite, Tailwind CSS, and a Node.js/Express backend. It supports customer browsing, cart checkout, online and cash-on-delivery payments, and an admin dashboard for managing orders and customers.

## Features

- Responsive restaurant storefront with home, about, services, gallery, contact, and cart pages
- User authentication for customers and admins
- Shopping cart experience with checkout flow
- Paystack-powered online payments and cash-on-delivery support
- Admin dashboard for viewing and managing orders
- Clean, branded UI with a professional restaurant experience

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Sonner for toast notifications
- Recharts for dashboard visuals

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Joi validation
- Paystack integration

## Project Structure

- `src/` — frontend React application
- `src/pages/` — public pages and admin pages
- `src/components/` — reusable UI components
- `src/contexts/` — auth, cart, and admin state
- `public/` — static assets such as the restaurant logo

## Getting Started

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at the local Vite URL.

### Backend

1. Change into the backend folder:
   ```bash
   cd ../ub-restaurant-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables such as:
   ```env
   PORT=5000
   MONGO_URI_LOCAL=mongodb://localhost:27017/ubrestaurant
   JWT_SECRET=your_secret_key
   PAYSTACK_SECRET_KEY=your_paystack_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

## Environment Notes

- The frontend expects the backend to be running for authentication, products, orders, and payments.
- Make sure MongoDB is running locally or update the connection string to your remote database.

## Deployment

This project can be deployed separately for the frontend and backend. The frontend is suited for Vercel or similar static hosting, while the backend can run on Render, Railway, or any Node.js hosting platform.

## License

This project is intended for local development and demo purposes.
