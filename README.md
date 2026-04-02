# WHENEVER Atelier

WHENEVER Atelier is a full-stack fashion storefront project built around a React customer app, a React admin dashboard, and an Express + MongoDB API. The project was adapted from a MERN lab series and expanded into a branded ecommerce experience inspired by `whenever.vn`.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/MochiKawaiii/projectweb)

## Live Apps

- Customer storefront: https://client-customer.vercel.app
- Admin dashboard: https://client-admin-pearl.vercel.app
- API health check: https://whenever-api.onrender.com/hello

## What This Project Includes

- Customer storefront with homepage, collections, search, product detail, cart, and COD checkout
- Customer account flow with signup, email OTP verification, login, profile, and order history
- Customer order actions, including canceling an order while it is still `PENDING`
- Admin dashboard for categories, products, customers, and orders
- Admin analytics summary with fallback loading when the Render API is still waking up
- Order lifecycle management with `PENDING -> APPROVED -> SHIPPING -> DELIVERED`
- Manual product management from admin, including image URL input and local image upload from a personal computer
- Catalog import script for syncing product data from the Whenever storefront into MongoDB

## Tech Stack

- Frontend: React, React Router, Axios, Create React App
- Backend: Express, Mongoose, JWT, Nodemailer
- Database: MongoDB Atlas
- Deployment: Vercel for `client-customer` and `client-admin`, Render for `server`

## Project Structure

- `client-customer/`: customer-facing storefront
- `client-admin/`: admin dashboard
- `server/`: Express API, MongoDB models, auth, order logic, import script
- `render.yaml`: Render blueprint for the API service
- `DEPLOYMENT.md`: deployment checklist for Vercel + Render
- `index.html`, `css/`, `js/`: static prototype files kept from earlier design work

## Main Workflows

### Customer

- Browse all products and collection pages
- Search by keyword
- View product details and images
- Add to cart and place COD orders
- Sign up with 6-digit email OTP verification
- Manage profile and review order history

### Admin

- Login to the admin dashboard
- Manage categories, products, customers, and orders
- Review dashboard metrics and recent orders
- Update order progress through the delivery pipeline
- Activate, deactivate, email, add, edit, and delete customer accounts

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm
- A MongoDB Atlas connection string
- Gmail account + app password if you want OTP email to work locally

### Install Dependencies

Run these commands in three separate folders:

```bash
cd server
npm install
```

```bash
cd client-admin
npm install
```

```bash
cd client-customer
npm install
```

### Environment Files

Use the example files as your starting point:

- `server/.env.example`
- `client-admin/.env.example`
- `client-customer/.env.example`

Key backend variables:

```env
DB_URI=
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASS=
JWT_SECRET=
JWT_EXPIRES=86400000
OTP_LENGTH=6
OTP_EXPIRES_MS=600000
CLIENT_ORIGINS=http://localhost:3001,http://localhost:3002
```

Key frontend variables:

```env
# client-admin
PORT=3001
REACT_APP_API_BASE_URL=http://localhost:3000
```

```env
# client-customer
PORT=3002
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_ADMIN_DASHBOARD_URL=http://localhost:3001/home
```

### Run Locally

Start the API:

```bash
cd server
npm start
```

Start the admin app:

```bash
cd client-admin
npm start
```

Start the customer app:

```bash
cd client-customer
npm start
```

Default local ports:

- API: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Customer: `http://localhost:3002`

## Useful Scripts

### Server

```bash
npm start
npm run dev
npm run import:whenever
```

### Frontends

```bash
npm start
npm run build
```

## Deployment

### Recommended Setup

- Deploy `client-customer` to Vercel
- Deploy `client-admin` to Vercel
- Deploy `server` to Render
- Keep MongoDB on MongoDB Atlas

### Render API

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/hello`

Important Render environment variables:

- `DB_URI`
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `OTP_LENGTH`
- `OTP_EXPIRES_MS`
- `CLIENT_ORIGINS`

### Vercel Frontends

Customer app variables:

```env
REACT_APP_API_BASE_URL=https://whenever-api.onrender.com
REACT_APP_ADMIN_DASHBOARD_URL=https://client-admin-pearl.vercel.app/home
```

Admin app variables:

```env
REACT_APP_API_BASE_URL=https://whenever-api.onrender.com
```

More detail is documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Notes

- Render free instances can sleep after inactivity, so the first request may take a few seconds.
- The admin dashboard includes fallback loading logic so it can still display metrics even if the newest summary endpoint is not available yet.
- The static files in the repo root are not the main production apps. The React apps inside `client-customer` and `client-admin` are the source of truth.
- Product data can be refreshed with the importer in `server/scripts/importWheneverCatalog.js`.

## Repository

- GitHub: https://github.com/MochiKawaiii/projectweb
