# Flora Alchemy — Deploy Now (v1.0.0)

**Code:** 369/369 verification tests passing
**Blocker:** No deployment CLI available on development machine
**Solution:** Follow these exact steps in your browser

---

## Quick Deploy (Render.com — 20 minutes)

### Step 1: Create MongoDB Atlas (Free)

1. Go to **https://cloud.mongodb.com** → Sign up / Log in
2. Click **Build a Database** → Choose **M0 (Free)**
3. Select a region close to you
4. Create a **database user**:
   - Username: `flora-admin`
   - Password: (generate a strong password, save it)
5. Under **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
6. Go to **Database** → **Connect** → **Connect your application**
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://flora-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password. Add `/flora_alchemy` before the `?`:
   ```
   mongodb+srv://flora-admin:YourPassword123@cluster0.xxxxx.mongodb.net/flora_alchemy?retryWrites=true&w=majority
   ```
9. **Save this string** — you'll need it in Step 3.

### Step 2: Deploy Backend on Render

1. Go to **https://dashboard.render.com** → Sign up / Log in
2. Click **New** → **Web Service**
3. Click **Build and deploy from a Git repository** → **Next**
4. Connect your GitHub account if prompted
5. Select repository: **prince-git23/Flora_Alchamy**
6. Configure:
   - **Name:** `flora-alchemy-api`
   - **Region:** Oregon (or closest to you)
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Plan:** Starter ($7/month)
7. Scroll to **Environment Variables** → **Add Environment Variable** for each:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `4000` |
   | `MONGO_URI` | (paste your MongoDB connection string from Step 1) |
   | `JWT_SECRET` | (generate: run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` or use any 64+ character random string) |
   | `CORS_ORIGIN` | `https://flora-alchemy-frontend.onrender.com` |
   | `SEED_ON_START` | `false` |
   | `TRUST_PROXY` | `true` |

8. Click **Create Web Service**
9. Wait for the deploy to complete (2-3 minutes)
10. Note your backend URL: `https://flora-alchemy-api.onrender.com`

### Step 3: Verify Backend

Open in your browser:
```
https://flora-alchemy-api.onrender.com/api/health
```
You should see:
```json
{"success":true,"service":"flora-alchemy-api","status":"ok","time":"..."}
```

Also check:
```
https://flora-alchemy-api.onrender.com/api/readiness
```
Should return:
```json
{"success":true,"status":"ready"}
```

### Step 4: Deploy Frontend on Render

1. Go back to **https://dashboard.render.com**
2. Click **New** → **Static Site**
3. Select same repository: **prince-git23/Flora_Alchamy**
4. Configure:
   - **Name:** `flora-alchemy-frontend`
   - **Build Command:** `cd frontend && npm ci && npm run build`
   - **Publish Directory:** `frontend/dist`
5. Add **Environment Variable**:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://flora-alchemy-api.onrender.com/api` |

6. Click **Create Static Site**
7. After deploy completes, go to **Settings** → **Rewrites and Redirects**
8. Click **Add Rule**:
   - **Source:** `/*`
   - **Destination:** `/index.html`
9. Note your frontend URL: `https://flora-alchemy-frontend.onrender.com`

### Step 5: Update CORS

1. Go to your **backend service** on Render
2. Go to **Environment** tab
3. Edit `CORS_ORIGIN` to: `https://flora-alchemy-frontend.onrender.com`
4. Save — Render will auto-redeploy

### Step 6: Verify Everything

Open **https://flora-alchemy-frontend.onrender.com** in your browser.

Check:
- [ ] Homepage loads with products
- [ ] Shop page works
- [ ] Product detail works
- [ ] Login page appears
- [ ] Can register a new account
- [ ] Can login
- [ ] Account page loads
- [ ] No console errors (F12 → Console)

---

## Environment Variables Reference

### Backend — Required

| Variable | Purpose | Example |
|---|---|---|
| `NODE_ENV` | Must be `production` | `production` |
| `PORT` | Server port (Render sets automatically) | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Random string for JWT signing (64+ chars) | `a1b2c3...` |
| `CORS_ORIGIN` | Frontend URL(s), comma-separated | `https://flora-alchemy-frontend.onrender.com` |
| `SEED_ON_START` | Must be `false` in production | `false` |
| `TRUST_PROXY` | `true` behind Render/Railway proxy | `true` |

### Backend — Optional

| Variable | Purpose | When to set |
|---|---|---|
| `RAZORPAY_KEY_ID` | Razorpay live/test key | When payments are enabled |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | When payments are enabled |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret | When webhooks are configured |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit CDN private key | When CDN image hosting is needed |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit CDN public key | When CDN image hosting is needed |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | When CDN image hosting is needed |
| `IMAGEKIT_FOLDER` | ImageKit folder path | Optional (defaults to `/flora-alchemy/products`) |

### Frontend — Required

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://flora-alchemy-api.onrender.com/api` |

---

## ImageKit Configuration

Without ImageKit, product images are stored locally on the server. This works but:
- Images are lost on redeployment
- Only works on a single server instance

For production, configure ImageKit:

1. Go to **https://imagekit.io** → Sign up (free tier: 20GB bandwidth/month)
2. Go to **Developer** → **API Keys**
3. Copy:
   - **Private Key**
   - **Public Key**
   - **URL Endpoint** (looks like `https://ik.imagekit.io/xxxxx`)
4. Add to backend environment:

| Key | Value |
|---|---|
| `IMAGEKIT_PRIVATE_KEY` | (your private key) |
| `IMAGEKIT_PUBLIC_KEY` | (your public key) |
| `IMAGEKIT_URL_ENDPOINT` | (your URL endpoint) |
| `IMAGEKIT_FOLDER` | `/flora-alchemy/products` |

---

## Razorpay Configuration

### TEST Mode (Default)

The app works with Razorpay TEST mode out of the box. No configuration needed for testing.

### LIVE Mode (When Ready)

1. Go to **https://dashboard.razorpay.com** → Sign up / Log in
2. Go to **Settings** → **API Keys** → **Generate Live Key**
3. Copy Key ID and Key Secret
4. Go to **Settings** → **Webhooks** → **Add New Webhook**
   - URL: `https://flora-alchemy-api.onrender.com/api/payments/webhook`
   - Secret: (generate and save)
   - Events: `payment.captured`, `payment.failed`
5. Add to backend environment:

| Key | Value |
|---|---|
| `RAZORPAY_KEY_ID` | (your live key ID) |
| `RAZORPAY_KEY_SECRET` | (your live key secret) |
| `RAZORPAY_WEBHOOK_SECRET` | (your webhook secret) |
| `VITE_RAZORPAY_KEY_ID` | (your live key ID — frontend env) |

---

## Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. On Render:
   - Go to frontend service → **Settings** → **Custom Domains**
   - Add your domain
   - Follow DNS instructions (add CNAME record)
3. Update `CORS_ORIGIN` to include your custom domain
4. Render provides free SSL certificates automatically

---

## Rollback

If something goes wrong:

### Frontend
1. Go to Render → frontend service → **Deploys**
2. Find the last working deploy
3. Click **Rollback to this deploy**

### Backend
1. Go to Render → backend service → **Deploys**
2. Find the last working deploy
3. Click **Rollback to this deploy**

### Database
- MongoDB data persists independently of code deploys
- Rolling back code does not affect database data

---

## Troubleshooting

### Backend won't start
- Check `MONGO_URI` is correct (no typos, password is correct)
- Check `JWT_SECRET` is set
- Check `CORS_ORIGIN` is set
- Check Render logs: backend service → **Logs** tab

### Readiness returns 503
- MongoDB connection failed
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Check connection string format

### Frontend shows "Failed to fetch"
- `VITE_API_URL` is not set or incorrect
- Backend is not running (check health endpoint)
- CORS blocking (check `CORS_ORIGIN` matches frontend URL)

### Images don't load
- Without ImageKit, images are stored locally and lost on redeploy
- Configure ImageKit for persistent image storage

### CORS error in browser console
- `CORS_ORIGIN` must exactly match the frontend URL
- Include `https://` prefix
- No trailing slash

---

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed and health returns 200
- [ ] Frontend deployed and loads
- [ ] CORS_ORIGIN matches frontend URL
- [ ] SEED_ON_START=false
- [ ] TRUST_PROXY=true
- [ ] Customer registration works
- [ ] Customer login works
- [ ] Products display correctly
- [ ] Cart works
- [ ] Admin login works
- [ ] No console errors
- [ ] (Optional) ImageKit configured
- [ ] (Optional) Razorpay live keys configured
- [ ] (Optional) Custom domain configured
