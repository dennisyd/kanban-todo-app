# Kanban Todo App

A production-ready Kanban-style todo application built with Next.js 14, Supabase, and TailwindCSS. This project demonstrates modern web development practices with realtime collaboration, optimistic UI updates, and drag-and-drop interactions.

## ✨ Features

- 🔐 **GitHub OAuth** - Secure authentication via Supabase Auth
- 📋 **Kanban Board** - Visual task management with drag-and-drop
- ⚡ **Realtime Sync** - Live updates across multiple clients
- 🎯 **Optimistic UI** - Instant feedback with automatic rollback
- ⌨️ **Keyboard Shortcuts** - Power user navigation (press `?`)
- 🎨 **Modern UI** - Clean, responsive design with dark mode
- 🔒 **Row-Level Security** - Secure data with Supabase RLS
- 🚀 **Edge Ready** - Optimized for Vercel deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- GitHub OAuth app

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd kanban-todo-app
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL in `supabase-setup.sql` in your SQL Editor
   - Enable GitHub OAuth provider
   - See `SUPABASE_SETUP.md` for detailed steps

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[Installation Guide](INSTALLATION.md)** - Complete setup instructions
- **[Supabase Setup](SUPABASE_SETUP.md)** - Database and auth configuration
- **[Vercel Deployment](VERCEL_DEPLOYMENT.md)** - Production deployment guide
- **[Architecture Plan](kanban-todo-app.plan.md)** - Design decisions and tradeoffs

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Database** | Supabase (PostgreSQL) |
| **Realtime** | Supabase Realtime |
| **Auth** | Supabase Auth (GitHub OAuth) |
| **Styling** | TailwindCSS |
| **Drag & Drop** | @dnd-kit |
| **Language** | TypeScript |
| **Deployment** | Vercel |

## 🎯 Key Features Explained

### Realtime Collaboration
Open the app in multiple tabs/browsers to see changes sync instantly. Uses Supabase's realtime subscriptions for live updates.

### Optimistic UI Updates
Tasks move immediately when you drag them, with automatic rollback if the server update fails. This provides a smooth, responsive experience even on slow connections.

### Drag and Drop
Built with @dnd-kit for accessible, performant drag-and-drop. Supports:
- Moving tasks between columns
- Reordering within columns
- Keyboard navigation
- Touch device support

### Keyboard Shortcuts
- `?` - Show shortcuts help
- `Esc` - Close modals
- `Enter` / `Space` - Edit task (when focused)
- Double-click task - Edit task

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page
│   │   └── auth/callback/   # OAuth callback handler
│   ├── (dashboard)/         # Protected routes
│   │   └── boards/          # Board list & detail pages
│   └── layout.tsx           # Root layout
├── components/
│   ├── board/               # Kanban components
│   │   ├── KanbanBoard.tsx  # Main board with DnD context
│   │   ├── Column.tsx       # Droppable column
│   │   ├── TaskCard.tsx     # Draggable task card
│   │   └── AddTaskButton.tsx
│   ├── ui/                  # Reusable UI components
│   └── providers/           # React context providers
└── lib/
    ├── supabase/            # Supabase clients (browser/server)
    ├── hooks/               # Custom React hooks
    └── utils/               # Types & utilities
```

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint
```

## 🚢 Deployment

Deploy to Vercel with one click:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed steps.

## 🧪 Testing Checklist

- [ ] GitHub login works
- [ ] Can create/edit/delete boards
- [ ] Can create/edit/delete tasks
- [ ] Drag-and-drop between columns works
- [ ] Drag-and-drop reordering works
- [ ] Realtime updates (test with 2 tabs)
- [ ] Optimistic UI shows immediate feedback
- [ ] Keyboard shortcuts work (press `?`)
- [ ] Responsive on mobile
- [ ] Dark mode works

## 🎨 Architecture Highlights

### Position Management
Uses integer-based positioning with gaps (0, 1000, 2000...) for efficient reordering without updating all items. Can insert between positions without rebalancing.

### Realtime Strategy
Subscribes to database changes at the board level, filtering by `board_id` to minimize data transfer. Uses optimistic updates for instant UI feedback.

### Auth Flow
- Next.js middleware protects routes
- Server Components read session from cookies (no client JS)
- Client Components use Supabase Provider for mutations

### Row-Level Security
All database tables have RLS policies ensuring users can only access their own data. No data leaks possible.

## 🤝 Contributing

This is a test project, but feel free to fork and extend it!

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/)

---

**Made with ❤️ as a production-ready test project**

