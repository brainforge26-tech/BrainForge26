# STEP — Client Portal & Project Tracking System
## Master Prompt

---

You are a **Senior Full Stack Engineer**. Your task is to build a complete, production-ready **Client Portal & Project Tracking System** from scratch.

---

## TECH STACK

Use the existing stack in this monorepo:
- **Frontend**: React (with the existing frontend project setup)
- **Backend**: Node.js / Express (with the existing backend project setup)
- Follow all conventions, folder structures, and patterns already present in the codebase.

---

## ROLES & ACCESS CONTROL

The system has at least two roles:

| Role    | Description |
|---------|-------------|
| CLIENT  | Can sign up publicly, views only their own data |
| MANAGER | Assigned internally, manages projects and clients |

**Rules:**
- Clients can **only** create an account from the **public Sign Up page**.
- Clients can **only** view data assigned to them — never another client's data.
- Managers are assigned internally (not through public sign-up).
- Every API endpoint must enforce **role-based authorization**.
- Never expose sensitive data to unauthorized users.

---

## FEATURE BREAKDOWN

---

### 1. CLIENT DASHBOARD (Overview)

Build a professional dashboard for authenticated clients showing:

- **Active Projects** — count of in-progress projects
- **Completed Projects** — count of finished projects
- **Pending Projects** — count of not-yet-started projects
- **Total Payments** — sum of all payments made
- **Recent Activities** — latest updates, milestones, or messages

---

### 2. MY PROJECTS (Project List)

Clients can view all projects assigned to them.

Each **project card** displays:

- Project Name
- Project ID
- Manager (name)
- Assigned Developers (list of names)
- Project Type
- Start Date
- Estimated Delivery Date
- Current Status (`Pending` / `In Progress` / `Completed`)
- Completion Percentage (progress bar)
- Priority (`Low` / `Medium` / `High`)
- Last Updated (timestamp)

Clicking a project card navigates to the **Project Details** page.

---

### 3. PROJECT DETAILS PAGE

When a client opens a project, display a rich detail page with:

- **Project Overview** — name, ID, type, status, priority
- **Description** — full project description
- **Technologies Used** — list of tech/tools
- **Assigned Team** — manager + developers with roles
- **Timeline** — milestone-based visual timeline (see section 5)
- **Milestones** — list with name, due date, status
- **Progress Bar** — visual completion percentage
- **Estimated Delivery Date**
- **Files Shared** — downloadable files (see section 6)
- **Notes from Manager** — manager-only notes visible to the client

---

### 4. WORK PROGRESS UPDATES

Managers post progress updates on a project. Clients can **only view** them.

Each progress update contains:

- Title
- Description
- Progress Percentage (updates the overall project completion %)
- Images (optional, gallery view)
- Attachments (optional, downloadable)
- Date
- Updated By (manager name)

Display updates in a clean feed/timeline style, newest first.

---

### 5. PROJECT TIMELINE

Show a beautiful, step-by-step visual timeline for each project.

Default stages (can be customized per project):

```
✓ Project Created
✓ Requirements Approved
✓ UI Design Completed
✓ Frontend Development
✓ Backend Development
✓ Testing
✓ Client Review
✓ Bug Fixes
✓ Deployment
✓ Completed
```

Each stage shows:
- Status: `Completed` ✓ / `In Progress` ⏳ / `Pending` ○
- Date completed (if applicable)

Managers can add new timeline stages and mark them as complete.

---

### 6. PAYMENTS

Clients can view their payment history. **No editing allowed.**

Each payment record displays:

- Invoice Number
- Amount
- Payment Date
- Payment Method
- Payment Status (`Paid` / `Pending` / `Overdue`)
- Download Invoice (PDF)

---

### 7. FILES

Clients can **download** files shared by their manager:

- Proposal
- Contract
- Requirement Document
- Design Files
- Final Deliverables

**Only Managers** can upload files. Clients cannot upload.

Files should be organized by category and project.

---

### 8. MESSAGES

Clients can communicate directly with their assigned Manager.

Features:
- **Conversation List** — list of ongoing conversations
- **Send Messages** — text input with send button
- **Receive Messages** — real-time or polling-based updates
- **File Attachments** — attach files to messages
- **Read Status** — show read/unread indicators

Scope: Each client can only message their assigned manager(s).

---

### 9. CLIENT PROFILE

Clients can view and edit their own profile:

| Field | Editable |
|-------|----------|
| Company Name | ✓ |
| Company Logo | ✓ (image upload) |
| Contact Person | ✓ |
| Phone | ✓ |
| Email | ✓ |
| Website | ✓ |
| Address | ✓ |
| Company Description | ✓ |

---

### 10. MANAGER FEATURES (Manager-Side Actions)

Managers have access to additional capabilities:

- **Assign Projects** to specific clients
- **Update Project Status** (Pending / In Progress / Completed)
- **Update Progress Percentage** on a project
- **Create Milestones** with name, due date, and status
- **Upload Files** to a project (visible to the assigned client)
- **Add Timeline Updates** (mark stages as complete, add new stages)
- **Post Work Progress Updates** (title, description, %, images, attachments)
- **Add Notes** visible to the client on the project details page
- **Mark Project as Completed**

---

## SECURITY REQUIREMENTS

- Every API route must check the authenticated user's role before returning data.
- A CLIENT can **only access** projects, payments, files, and messages tied to their own account.
- A MANAGER can manage all projects assigned to them.
- Use JWT-based authentication (or the existing auth mechanism in the project).
- Sanitize all inputs and validate all data server-side.
- File uploads must be validated for type and size.

---

## UI/UX GUIDELINES

- Design should be **clean, professional, and modern**.
- Use a consistent color palette and typography.
- All data tables should support **sorting and filtering** where applicable.
- Progress bars and percentage indicators should be visually clear.
- The timeline should be a **vertical stepper** with icons and dates.
- The dashboard overview should use **stat cards** with icons.
- Fully **responsive** — works on desktop and tablet.

---

## IMPLEMENTATION ORDER

Build in this order:

1. Auth — Sign Up (client), Login, JWT middleware, role guards
2. Database models — User, Project, Milestone, ProgressUpdate, Payment, File, Message
3. API routes — scoped by role, fully authorized
4. Client Dashboard — overview stats
5. My Projects — list + project card
6. Project Details — full detail page
7. Work Progress Updates — feed view
8. Project Timeline — visual stepper
9. Payments — history table + invoice download
10. Files — upload (manager) / download (client)
11. Messages — conversation UI
12. Profile — edit form
13. Manager Panel — all manager-side actions

---

> Build each section completely before moving to the next. Follow existing code conventions. Do not skip authorization checks on any route.
