# Dryway MERN E-Commerce Hosting & Deployment Guide

This guide provides clear, step-by-step instructions to host and deploy the Dryway MERN Stack Application (Express Backend + React Vite Frontend + MongoDB + Stripe + Loyalty Points System) live on cloud hosting providers.

---

## Option 1: Render (Recommended for Full MERN Stack)

Render offers free/low-cost Web Services for Express backends and Static Sites for React frontends.

### Step 1: Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Create a free M0 cluster or database.
3. In **Database Access**, create a database user and password.
4. In **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Copy your MongoDB Connection String (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/dryway?retryWrites=true&w=majority`).

### Step 2: Deploy Backend API on Render
1. Push your project repository to GitHub or GitLab.
2. Log in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Set the following fields:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `5001`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *Your custom secret string*
   - `CLIENT_URL`: *Your frontend URL (e.g. `https://dryway.onrender.com` or `https://dryway.vercel.app`)*
   - `STRIPE_SECRET_KEY`: *Your Stripe secret key (optional for mock payment mode)*
6. Click **Create Web Service**. Note down your backend URL (e.g., `https://dryway-api.onrender.com`).

### Step 3: Deploy Frontend Application on Render or Vercel
#### On Render (Static Site):
1. On Render, click **New +** -> **Static Site**.
2. Connect your repository.
3. Set the following fields:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://dryway-api.onrender.com` *(Replace with your deployed backend URL)*
5. Click **Create Static Site**.

---

## Option 2: Vercel (Frontend) + Render / Railway (Backend)

### Step 1: Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Set **Framework Preset** to **Vite**.
4. Set **Root Directory** to `frontend`.
5. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com`
6. Click **Deploy**.

---

## Option 3: Railway / Heroku (Single Container Fullstack)

1. Push your repository to GitHub.
2. Link your repository to Railway or Heroku.
3. Set environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=mongodb+srv://...`
   - `JWT_SECRET=your_secret_key`
4. In production mode, the Express server will automatically serve the built static frontend from `frontend/dist` on a single port.

---

## Post-Deployment Checklist

- [ ] Verify database connectivity on MongoDB Atlas.
- [ ] Log in with Master Admin (`admin@dryway.com` / `password123`).
- [ ] Test catalog loading, adding items to cart, and placing orders.
- [ ] Verify **Loyalty Points** badge display, point redemption at checkout, and point balance updates!
