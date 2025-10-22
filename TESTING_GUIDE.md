# Testing Guide

Use this checklist to verify all features of the Kanban Todo App work correctly.

## ✅ Checkpoint 1: Setup & Authentication

### Database Schema
- [ ] All 4 tables created (profiles, boards, columns, tasks)
- [ ] RLS policies enabled on all tables
- [ ] Realtime enabled for columns and tasks tables
- [ ] Indexes created properly

### GitHub OAuth
- [ ] Can access login page at `/login`
- [ ] "Continue with GitHub" button appears
- [ ] Clicking button redirects to GitHub
- [ ] After authorization, redirected back to app
- [ ] Redirected to `/boards` page
- [ ] Profile created in database with GitHub info

### Session Persistence
- [ ] Refresh page - still logged in
- [ ] Close and reopen browser - still logged in
- [ ] Profile avatar and username appear in navbar
- [ ] Logout button works and redirects to login

## ✅ Checkpoint 2: Board Management

### Board List View
- [ ] Empty state shows when no boards exist
- [ ] "New Board" button visible
- [ ] Can click "New Board" button
- [ ] Modal opens with form

### Create Board
- [ ] Can type board title
- [ ] Can add optional description
- [ ] "Create Board" button creates board
- [ ] Redirected to new board detail page
- [ ] Board appears in list when navigating back

### Board Display
- [ ] Board title shows at top
- [ ] Board description shows (if provided)
- [ ] Default columns created (To Do, In Progress, Done)
- [ ] Columns display in correct order

## ✅ Checkpoint 3: Task Management

### Create Task
- [ ] "Add task" button visible in each column
- [ ] Clicking shows input field
- [ ] Can type task title
- [ ] Pressing "Add" creates task
- [ ] Task appears in column
- [ ] Can cancel task creation

### View Task
- [ ] Task card displays title
- [ ] Task card shows description (if present)
- [ ] Task cards are visually distinct
- [ ] Multiple tasks stack vertically
- [ ] Task count shows in column header

### Edit Task
- [ ] Double-clicking task opens edit modal
- [ ] Task title pre-filled
- [ ] Task description pre-filled
- [ ] Can modify title and description
- [ ] Saving updates task display
- [ ] Changes persist after page refresh

### Delete Task
- [ ] Delete button appears in edit modal
- [ ] Clicking delete shows confirmation
- [ ] Confirming removes task from board
- [ ] Deletion is immediate

## ✅ Checkpoint 4: Drag and Drop

### Basic Drag
- [ ] Can click and hold task card
- [ ] Card follows cursor when dragging
- [ ] Card appears slightly rotated during drag
- [ ] Drop zones highlight when dragging over them

### Move Between Columns
- [ ] Can drag task from "To Do" to "In Progress"
- [ ] Can drag task from "In Progress" to "Done"
- [ ] Can drag task back to previous column
- [ ] Task appears in correct column after drop
- [ ] Task order updates properly

### Reorder Within Column
- [ ] Can drag task up in same column
- [ ] Can drag task down in same column
- [ ] Can insert task between two other tasks
- [ ] Order persists after page refresh

### Edge Cases
- [ ] Dragging to empty column works
- [ ] Dropping task back to original position works
- [ ] Rapid drag-drop operations don't break UI

## ✅ Checkpoint 5: Realtime Updates

### Setup
- [ ] Open app in two different browser tabs
- [ ] Login in both tabs (same user)
- [ ] Navigate to same board in both tabs

### Task Creation
- [ ] Create task in Tab 1
- [ ] Task appears in Tab 2 immediately
- [ ] Task appears in correct column

### Task Movement
- [ ] Drag task in Tab 1
- [ ] Task moves in Tab 2 in realtime
- [ ] Position updates correctly in both tabs

### Task Edit
- [ ] Edit task title in Tab 1
- [ ] Title updates in Tab 2
- [ ] Edit description in Tab 1
- [ ] Description updates in Tab 2

### Task Delete
- [ ] Delete task in Tab 1
- [ ] Task disappears from Tab 2 immediately

### Stress Test
- [ ] Rapid task creation (10+ tasks)
- [ ] All tasks appear in both tabs
- [ ] No duplicate tasks
- [ ] No missing tasks

## ✅ Checkpoint 6: Optimistic UI

### Normal Operation
- [ ] Creating task shows immediately
- [ ] Moving task updates position instantly
- [ ] Editing task reflects changes right away
- [ ] No visible loading states for fast operations

### Network Simulation
To test, open DevTools → Network → Throttle to "Slow 3G":

- [ ] Create task - appears immediately even with slow network
- [ ] Drag task - moves instantly despite network delay
- [ ] Edit task - changes show before save completes

### Error Handling
To test, disconnect network:

- [ ] Try creating task while offline
- [ ] UI shows task optimistically
- [ ] After reconnecting, check if task persists
- [ ] If error occurs, UI should rollback gracefully

## ✅ Checkpoint 7: Keyboard Shortcuts

### Help Dialog
- [ ] Press `?` key
- [ ] Shortcuts help dialog appears
- [ ] All shortcuts listed
- [ ] Press `Esc` to close
- [ ] Dialog closes

### Task Interaction
- [ ] Tab to focus on a task card
- [ ] Press `Enter` to edit task
- [ ] Edit modal opens
- [ ] Make changes and save
- [ ] Press `Esc` to close modal

### Hint Display
- [ ] Help hint visible in bottom-right corner
- [ ] Hint shows "Press ? for shortcuts"

## ✅ Checkpoint 8: UI/UX

### Responsive Design
- [ ] Resize browser to mobile width (< 768px)
- [ ] Board scrolls horizontally
- [ ] Columns remain usable
- [ ] Touch drag-and-drop works on mobile
- [ ] Buttons are tap-friendly

### Dark Mode
- [ ] System dark mode changes app theme
- [ ] All text remains readable
- [ ] Contrast is sufficient
- [ ] Modals have proper dark styling

### Accessibility
- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Screen reader announces button purposes
- [ ] Drag handles are keyboard accessible

### Loading States
- [ ] Navigate to `/boards`
- [ ] Loading spinner shows briefly
- [ ] Content loads smoothly
- [ ] No layout shift during load

### Empty States
- [ ] No boards: Shows helpful empty state
- [ ] Empty column: Shows "Add task" button
- [ ] Messages are clear and actionable

## ✅ Checkpoint 9: Security

### Row-Level Security
- [ ] Create a board
- [ ] Logout and login as different user
- [ ] Cannot see previous user's boards
- [ ] Cannot access board by direct URL
- [ ] Redirected or shown error

### Authentication
- [ ] Direct URL to `/boards` redirects to login when not authenticated
- [ ] After login, redirected to originally requested page
- [ ] Session expires appropriately
- [ ] Cannot bypass auth by manipulating cookies

## ✅ Checkpoint 10: Performance

### Load Time
- [ ] Initial page load < 2 seconds
- [ ] Board with 50+ tasks loads quickly
- [ ] No janky animations
- [ ] Smooth scrolling

### Realtime Performance
- [ ] 100+ tasks on board
- [ ] Realtime updates still fast
- [ ] No memory leaks (check DevTools Memory)
- [ ] WebSocket connection stable

### Drag Performance
- [ ] Dragging feels smooth (60fps)
- [ ] No lag when hovering over columns
- [ ] Drop action is immediate

## 🐛 Bug Reporting Template

If you find issues, document them:

```
**Bug Title**: Brief description

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. Observe...

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Network: Fast 3G

**Screenshots/Console Errors**:
[Attach if available]
```

## ✅ Production Readiness Checklist

Before deploying:

- [ ] All above tests pass
- [ ] Environment variables set correctly
- [ ] GitHub OAuth configured for production domain
- [ ] Supabase redirect URLs updated
- [ ] No console errors in browser
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Database has RLS policies enabled
- [ ] Tested with different user accounts
- [ ] Mobile responsiveness verified

## 🎉 Success Criteria

Your app is ready for production when:

✅ All authentication flows work
✅ CRUD operations function correctly
✅ Drag-and-drop is smooth and reliable
✅ Realtime updates sync across clients
✅ UI is responsive on all devices
✅ Security policies prevent unauthorized access
✅ Performance is acceptable under load
✅ No critical bugs or errors

---

**Happy Testing! 🧪**

