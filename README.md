# Ludo Pro Frontend (India)

Production-ready React + Vite frontend matched with the India Ludo backend.

## Features
- Indian mobile number login (OTP)
- Date of Birth + Terms & Conditions (18+)
- Real-time multiplayer Ludo board
- Play vs Bots
- Mobile-first UI

## Local Development
```bash
cp .env.example .env
# Edit .env with your backend URLs
npm install
npm run dev
```

## Deploy to Netlify (Recommended)

1. Push this folder to GitHub
2. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Select the repository
4. Build settings (auto-detected from netlify.toml):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add Environment Variables in Netlify:
   ```
   VITE_API_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app/api
   VITE_SOCKET_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app
   ```
6. Deploy

## Environment Variables

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` | Yes |
| `VITE_SOCKET_URL` | `https://your-backend.up.railway.app` | Yes |

## Important Notes
- Backend must allow your Netlify domain in `FRONTEND_URL` env var (CORS)
- OTP in development is printed in backend console
- For production SMS use MSG91 / Fast2SMS on the backend
