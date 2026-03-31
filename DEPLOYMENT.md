# Deployment Notes

## Architecture

- `client-customer` deploy to Vercel
- `client-admin` deploy to Vercel
- `server` deploy to Render

## Render

- Create a new Web Service from the repo that contains this project.
- Use `server` as the root directory.
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/hello`

Set these Render environment variables:

- `DB_URI`
- `EMAIL_SERVICE=gmail`
- `EMAIL_USER`
- `EMAIL_PASS`
- `JWT_SECRET`
- `JWT_EXPIRES=86400000`
- `OTP_LENGTH=6`
- `OTP_EXPIRES_MS=600000`
- `CLIENT_ORIGINS=https://<customer-project>.vercel.app,https://<admin-project>.vercel.app`

## Vercel Customer

- Import `client-customer` as its own Vercel project.
- Framework preset: `Create React App`
- Root directory: `client-customer`

Set these Vercel environment variables:

- `REACT_APP_API_BASE_URL=https://<render-service>.onrender.com`
- `REACT_APP_ADMIN_DASHBOARD_URL=https://<admin-project>.vercel.app/home`

## Vercel Admin

- Import `client-admin` as its own Vercel project.
- Framework preset: `Create React App`
- Root directory: `client-admin`

Set this Vercel environment variable:

- `REACT_APP_API_BASE_URL=https://<render-service>.onrender.com`

## Notes

- Customer login now transfers admin JWT to the admin app through the URL hash so cross-domain redirect still works after deploy.
- Both Vercel apps include SPA rewrites to `index.html`, so routes like `/login`, `/myprofile`, and `/home` keep working.
