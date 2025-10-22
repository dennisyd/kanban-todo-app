# Vercel Deployment Guide

This guide walks you through deploying your Kanban Todo App to Vercel.

## Prerequisites

1. ✅ Supabase project set up (see `SUPABASE_SETUP.md`)
2. ✅ GitHub OAuth configured in Supabase
3. ✅ Code pushed to a GitHub repository

## Step 1: Import Project to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

## Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

### Required Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Where to find these:**
- Go to your Supabase Dashboard
- Navigate to **Settings** → **API**
- Copy **Project URL** and **anon/public key**

### How to Add in Vercel

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environment: Select **Production**, **Preview**, and **Development**
3. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Update GitHub OAuth Callback URLs

After your first deployment, Vercel will give you a production URL (e.g., `your-app.vercel.app`).

### 3a. Update GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Select your OAuth app
3. Update **Authorization callback URL**:
   - Add: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Keep existing: `http://localhost:3000/auth/callback`

### 3b. Update Supabase Site URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**:
   - `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - Keep existing localhost URLs for development

## Step 4: Deploy

1. Click **Deploy** in Vercel
2. Wait for build to complete (usually 1-2 minutes)
3. Visit your production URL
4. Test the authentication flow

## Step 5: Verify Deployment

### Test Checklist

- [ ] Can access the site at your Vercel URL
- [ ] GitHub login works
- [ ] Can create a board
- [ ] Can create, edit, and delete tasks
- [ ] Drag-and-drop works
- [ ] Realtime updates work (open two tabs, changes sync)
- [ ] Keyboard shortcuts work (press `?`)

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

- **Push to main** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Automatic preview URLs

## Common Issues

### "Invalid redirect URL" after GitHub login

**Solution:**
- Verify GitHub OAuth callback URL matches Supabase project URL
- Check Supabase Redirect URLs include your Vercel domain
- Clear browser cookies and try again

### Environment variables not working

**Solution:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding environment variables
- Check that variables are added to all environments (Production, Preview, Development)

### Realtime not working in production

**Solution:**
- Verify Realtime is enabled in Supabase for `columns` and `tasks` tables
- Check browser console for WebSocket connection errors
- Ensure Supabase project is not paused (free tier auto-pauses after inactivity)

### Build fails with TypeScript errors

**Solution:**
- Run `npm run build` locally to catch errors before deploying
- Fix any TypeScript errors in your code
- Ensure all dependencies are listed in `package.json`

## Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update Supabase redirect URLs to include your custom domain

## Performance Optimization

Vercel automatically provides:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

## Monitoring

View deployment logs and analytics:
- **Deployments** tab: Build logs and deployment history
- **Analytics** tab: Page views, top pages, etc. (Pro plan)
- **Logs** tab: Runtime logs for serverless functions

## Rollback

If a deployment has issues:

1. Go to **Deployments** tab
2. Find a previous working deployment
3. Click **...** menu → **Promote to Production**

## Environment-Specific Settings

For staging/preview environments:

1. Create a separate Supabase project for staging
2. Add environment-specific variables in Vercel
3. Use Vercel's environment-specific URLs for testing

## Cost

- **Vercel Free Tier**: Perfect for this app
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Preview deployments

- **Supabase Free Tier**: Sufficient for testing
  - 500 MB database
  - 5 GB bandwidth
  - 50 MB file storage
  - Unlimited API requests

## Next Steps

- Set up custom domain
- Configure preview environments for testing
- Add monitoring/error tracking (e.g., Sentry)
- Set up automated tests in CI/CD pipeline

---

🎉 **Congratulations!** Your Kanban Todo App is now live in production!

Share your deployed URL: `https://your-app.vercel.app`

