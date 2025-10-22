# Supabase Setup Guide

Follow these steps to set up your Supabase project for the Kanban Todo App.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be fully initialized

## 2. Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-setup.sql`
3. Paste and run the SQL script
4. Verify that all tables are created by going to **Table Editor**

You should see these tables:
- `profiles`
- `boards`
- `columns`
- `tasks`

## 3. Enable GitHub OAuth

1. Go to **Authentication** → **Providers**
2. Enable **GitHub** provider
3. Follow these steps:

### 3a. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Kanban Todo App` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_PROJECT_REF` with your Supabase project reference
     - Find it in: Settings → API → Project URL
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 3b. Configure Supabase

1. Back in Supabase dashboard, paste:
   - **Client ID** from GitHub
   - **Client Secret** from GitHub
2. Click "Save"

### 3c. Add Site URL (for production)

1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - Site URL: `http://localhost:3000` (development)
   - When deployed: Add your Vercel URL (e.g., `https://your-app.vercel.app`)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-app.vercel.app/auth/callback`

## 4. Get Environment Variables

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Enable Realtime (if not already enabled)

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `columns` table
   - `tasks` table

## 6. Test the Setup

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Continue with GitHub"
4. Authorize the app
5. You should be redirected to `/boards`

## Troubleshooting

### "Invalid redirect URL"
- Make sure your callback URL in GitHub matches your Supabase project URL
- Check that site URLs are correctly configured in Supabase

### "Row Level Security" errors
- Ensure all RLS policies were created by running the SQL script
- Check that you're authenticated (check browser dev tools → Application → Cookies)

### Realtime not working
- Verify Realtime is enabled for `columns` and `tasks` tables
- Check browser console for any subscription errors
- Ensure your Supabase plan supports Realtime (free tier does!)

## Optional: Seed Data

For testing, you can add sample data via SQL Editor:

```sql
-- Insert a sample board (replace USER_ID with your actual user ID from profiles table)
INSERT INTO boards (user_id, title, description) 
VALUES ('YOUR_USER_ID', 'My First Board', 'Getting started with Kanban');

-- Get the board_id from the boards table, then insert columns
INSERT INTO columns (board_id, title, position) VALUES
  ('BOARD_ID', 'To Do', 0),
  ('BOARD_ID', 'In Progress', 1000),
  ('BOARD_ID', 'Done', 2000);

-- Get column_ids, then insert sample tasks
INSERT INTO tasks (column_id, title, description, position) VALUES
  ('TODO_COLUMN_ID', 'Create login page', 'Implement GitHub OAuth', 0),
  ('TODO_COLUMN_ID', 'Set up database', 'Run migrations and RLS', 1000);
```

