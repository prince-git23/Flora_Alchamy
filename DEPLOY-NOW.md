# Flora Alchemy — Deploy Now

**Code status:** v1.0.0 — 377/377 verification tests passing
**Blocker:** No deployment CLI access from this machine
**Action required:** Follow these steps manually

---

## Option A: Render.com (Recommended — Simplest)

### Step 1: Create MongoDB Atlas Database

1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist all IPs (`0.0.0.0/0`) for initial setup
5. Get connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/flora_alchemy`

### Step 2: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Connect GitHub repo: `prince-git23/Flora_Alchamy`
4. Settings:
   - **Name:** `flora-alchemy-api`
   - **Region:** Oregon (or closest)
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Plan:** Starter ($7/mo)
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=4000
   MONGO_URI=<your MongoDB Atlas connection string>
   JWT_SECRET=<generate a random 64-char string>
   CORS_ORIGIN=https://flora-alchemy.onrender.com
   SEED_ON_START=false
   TRUST_PROXY=true
   ```
6. Click **Create Web Service**
7. Wait for deploy to complete
8. Verify: `https://flora-alchemy-api.onrender.com/api/health`

### Step 3: Deploy Frontend on Render

1. Click **New** → **Static Site**
2. Connect same GitHub repo
3. Settings:
   - **Name:** `flora-alchemy`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://flora-alchemy-api.onrender.com/api
   ```
5. Click **Create Static Site**
6. Add rewrite rule:
   - **Source:** `/*`
   - **Destination:** `/index.html`
7. Verify: `https://flora-alchemy.onrender.com`

### Step 4: Update CORS

1. Go to backend service → Environment
2. Update `CORS_ORIGIN` to: `https://flora-alchemy.onrender.com`
3. Service will auto-redeploy

### Step 5: Verify

- [ ] `https://flora-alchemy-api.onrender.com/api/health` → 200
- [ ] `https://flora-alchemy-api.onrender.com/api/readiness` → 200
- [ ] `https://flora-alchemy.onrender.com` → Homepage loads
- [ ] Shop page loads products
- [ ] Login works

---

## Option B: Docker (Self-Hosted)

### Prerequisites
- Docker + Docker Compose installed
- MongoDB Atlas connection string

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/prince-git23/Flora_Alchamy.git
cd Flora_Alchamy

# 2. Create .env file
cat > .env << 'EOF'
JWT_SECRET=your-strong-random-secret-here
CORS_ORIGIN=https://your-domain.com
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/flora_alchemy
EOF

# 3. Build and start
docker-compose up -d --build

# 4. Verify
curl http://localhost:4000/api/health
curl http://localhost:4000/api/readiness

# 5. Check logs
docker-compose logs -f backend
```

---

## Option C: Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add MongoDB plugin
4. Set environment variables (same as Option A)
5. Deploy

---

## Post-Deployment Checklist

### Must Configure
- [ ] MongoDB Atlas: database created, user created, IP whitelist set
- [ ] Backend: `MONGO_URI` set correctly
- [ ] Backend: `JWT_SECRET` is a strong random string
- [ ] Backend: `CORS_ORIGIN` matches frontend URL
- [ ] Backend: `SEED_ON_START=false`
- [ ] Backend: `TRUST_PROXY=true` (if behind proxy)
- [ ] Frontend: `VITE_API_URL` points to backend `/api`

### Optional (When Ready)
- [ ] Razorpay: live keys for real payments
- [ ] ImageKit: CDN credentials for image hosting
- [ ] Custom domain: DNS configured
- [ ] SSL: certificates active
- [ ] Monitoring: uptime service configured

### Verify After Deploy
- [ ] Health endpoint returns 200
- [ ] Readiness endpoint returns 200
- [ ] Homepage loads
- [ ] Products display
- [ ] Login works
- [ ] Admin login works
- [ ] No console errors

---

## Environment Variables Reference

### Backend (Required)
| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `4000` (or hosting default) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random 64+ char string |
| `CORS_ORIGIN` | Frontend URL (e.g., `https://flora-alchemy.onrender.com`) |
| `SEED_ON_START` | `false` |
| `TRUST_PROXY` | `true` |

### Backend (Optional)
| Variable | Value |
|---|---|
| `RAZORPAY_KEY_ID` | Live Razorpay key |
| `RAZORPAY_KEY_SECRET` | Live Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signing secret |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |

### Frontend (Required)
| Variable | Value |
|---|---|
| `VITE_API_URL` | Backend URL + `/api` |

### Frontend (Optional)
| Variable | Value |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key |
