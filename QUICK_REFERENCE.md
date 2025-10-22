# Quick Reference Card

Fast reference for common tasks and troubleshooting.

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint
```

## 🔑 Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Find in: Supabase Dashboard → Settings → API

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/app/(auth)/login/page.tsx` | Login page |
| `src/app/(dashboard)/boards/page.tsx` | Board list |
| `src/components/board/KanbanBoard.tsx` | Main Kanban logic |
| `src/lib/supabase/server.ts` | Server-side Supabase |
| `src/lib/supabase/client.ts` | Client-side Supabase |
| `src/middleware.ts` | Auth protection |
| `supabase-setup.sql` | Database schema |

## 🔧 Common Tasks

### Add a New UI Component

1. Create file in `src/components/ui/`
2. Export as default
3. Import where needed

```tsx
// src/components/ui/NewComponent.tsx
export default function NewComponent() {
  return <div>New Component</div>
}
```

### Add a New Page

1. Create folder in `src/app/`
2. Add `page.tsx` file
3. Export default component

```tsx
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

### Add a Custom Hook

1. Create file in `src/lib/hooks/`
2. Export hook function

```tsx
// src/lib/hooks/useCustomHook.ts
export function useCustomHook() {
  // Hook logic
}
```

## 🐛 Troubleshooting

### Cannot connect to Supabase

```bash
# Check environment variables
cat .env.local

# Verify NEXT_PUBLIC_ prefix
# Restart dev server after changes
```

### GitHub OAuth not working

1. Check callback URL in GitHub app
2. Verify Site URL in Supabase
3. Clear browser cookies
4. Try incognito mode

### Realtime not updating

1. Check Supabase Realtime is enabled
2. Verify table replication is on
3. Check browser console for errors
4. Ensure WebSocket connection is open

### Build errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript errors

```bash
# Check for type errors
npx tsc --noEmit

# Fix type issues in reported files
```

## 📱 Local URLs

- **App**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Boards**: http://localhost:3000/boards

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Show shortcuts help |
| `Esc` | Close modal |
| `Enter` | Edit focused task |
| `Space` | Edit focused task |
| Double-click | Edit task |

## 🗄️ Database Tables

```
profiles → stores user info from GitHub
boards → user's Kanban boards
columns → board columns (To Do, In Progress, Done)
tasks → individual tasks in columns
```

## 🔒 Security Notes

- All tables have RLS enabled
- Users can only see their own data
- Auth required for `/boards/*` routes
- Session stored in httpOnly cookies

## 📊 Performance Tips

1. Use Server Components when possible
2. Minimize client-side JavaScript
3. Optimize images with Next.js Image
4. Use Suspense boundaries for loading states
5. Subscribe only to needed realtime events

## 🎨 Styling

```tsx
// TailwindCSS utility classes
className="bg-white dark:bg-gray-800 rounded-lg p-4"

// Responsive design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Hover states
className="hover:bg-gray-100 transition-colors"
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Vercel auto-deploys preview
```

## 🚢 Deployment

```bash
# Push to main branch
git push origin main

# Vercel auto-deploys to production
# Check deployment at vercel.com
```

## 📞 Important Links

- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub OAuth Apps**: https://github.com/settings/developers
- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **@dnd-kit Docs**: https://docs.dndkit.com

## 💡 Pro Tips

1. **Use Server Components** for data fetching (faster, no client JS)
2. **Optimistic updates** make UI feel instant
3. **RLS policies** handle security automatically
4. **Realtime subscriptions** should be filtered by board_id
5. **Position gaps** allow easy reordering without reindex

## 🎯 Common Patterns

### Fetching Data (Server Component)

```tsx
const supabase = await createClient()
const { data } = await supabase
  .from('boards')
  .select('*')
  .eq('user_id', user.id)
```

### Mutating Data (Client Component)

```tsx
'use client'
import { useSupabase } from '@/components/providers/SupabaseProvider'

const { supabase } = useSupabase()
await supabase.from('tasks').insert({ ... })
```

### Realtime Subscription

```tsx
const channel = supabase
  .channel('board-updates')
  .on('postgres_changes', { ... }, (payload) => {
    // Handle update
  })
  .subscribe()
```

---

**Keep this handy for quick reference! 📌**

