# Installation Guide

Complete guide to set up the Kanban Todo App locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git
- A Supabase account (free tier works)
- A GitHub account

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd kanban-todo-app
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TailwindCSS
- Supabase client libraries
- @dnd-kit for drag-and-drop
- TypeScript

## Step 3: Set Up Supabase

Follow the detailed guide in `SUPABASE_SETUP.md` or quick steps below:

### 3a. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for initialization (takes ~2 minutes)

### 3b. Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy contents of `supabase-setup.sql`
3. Paste and execute the SQL script

This creates:
- `profiles` table for user data
- `boards` table for Kanban boards
- `columns` table for board columns
- `tasks` table for tasks
- RLS policies for security
- Realtime subscriptions

### 3c. Configure GitHub OAuth

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **GitHub** provider
3. Create a GitHub OAuth App:
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. In Supabase, add redirect URL: `http://localhost:3000/auth/callback`

## Step 4: Configure Environment Variables

Create `.env.local` in project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Find these values:**
- Supabase Dashboard → Settings → API
- Copy **Project URL** and **anon public key**

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the Application

1. Click **"Continue with GitHub"**
2. Authorize the application
3. You should be redirected to `/boards`
4. Create your first board
5. Add columns and tasks
6. Test drag-and-drop
7. Open in another tab to see realtime updates

## Common Setup Issues

### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection fails

- Verify `.env.local` has correct values
- Check Supabase project is not paused
- Ensure environment variables start with `NEXT_PUBLIC_`

### GitHub OAuth not working

- Verify callback URLs match exactly
- Check GitHub OAuth app is not suspended
- Clear browser cookies and try again
- Ensure Site URL is configured in Supabase

### TypeScript errors

```bash
# Run type checking
npm run build
```

Fix any type errors before continuing.

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

Update your GitHub OAuth callback to match the new port.

## Project Structure Overview

```
kanban-todo-app/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Auth routes (login, callback)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── board/             # Kanban components
│   │   ├── ui/                # Reusable UI components
│   │   └── providers/         # React context providers
│   └── lib/
│       ├── supabase/          # Supabase client utilities
│       ├── hooks/             # Custom React hooks
│       └── utils/             # Utility functions & types
├── public/                     # Static assets
├── supabase-setup.sql         # Database schema
└── [config files]
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Features to Test

- ✅ GitHub OAuth login/logout
- ✅ Create/view/edit boards
- ✅ Create/edit/delete tasks
- ✅ Drag-and-drop tasks between columns
- ✅ Drag-and-drop to reorder within column
- ✅ Realtime updates (open 2+ tabs)
- ✅ Optimistic UI updates
- ✅ Keyboard shortcuts (press `?`)
- ✅ Responsive design
- ✅ Dark mode support

## Next Steps

1. ✅ **Test locally** - Verify all features work
2. 📖 **Read architecture** - Check `kanban-todo-app.plan.md`
3. 🚀 **Deploy to Vercel** - Follow `VERCEL_DEPLOYMENT.md`
4. 🎨 **Customize** - Add your own features!

## Getting Help

If you encounter issues:

1. Check the troubleshooting sections in:
   - This file
   - `SUPABASE_SETUP.md`
   - `VERCEL_DEPLOYMENT.md`

2. Verify environment variables are correct

3. Check browser console for errors

4. Check Supabase logs in Dashboard

5. Ensure all dependencies are installed

## Development Tips

### Hot Reload

Next.js automatically reloads on file changes. If it doesn't:
- Restart the dev server
- Clear `.next` folder: `rm -rf .next`

### Database Changes

After modifying database schema:
1. Update `supabase-setup.sql`
2. Update types in `src/lib/utils/types.ts`
3. Run migrations in Supabase SQL Editor

### Adding New Features

1. Create components in `src/components`
2. Add pages in `src/app`
3. Use TypeScript for type safety
4. Follow existing patterns for consistency

### Debugging Realtime

Check Supabase Realtime in browser console:
- Open DevTools → Network → WS
- Look for WebSocket connection
- Verify messages are being sent/received

---

Happy coding! 🚀

