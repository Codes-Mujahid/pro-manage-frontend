# ⚡ Advanced React Developer Assignment

## 🧠 Overview

Build a **Project Management Dashboard** using **React.js**.  
This dashboard allows **authenticated users** to manage multiple **projects and tasks**, featuring CRUD operations, filtering, pagination, and state persistence.

The goal of this assignment is to assess your ability to structure a scalable React app, handle complex state logic, interact with APIs, and deliver a clean, modern UI.

---

## 🎯 Core Objectives

### 1. **Authentication**

- Implement **Login** and **Register** pages.
- Use **JWT-based authentication** (mocked or via a simple Node/JSON Server API).
- After login:
  - Store the token in **localStorage** or **HTTP-only cookie**.
  - Redirect the user to the dashboard.
- Protect routes — unauthenticated users cannot access the dashboard.

---

### 2. **Dashboard Features**

#### 🗂️ Projects

- View all projects (paginated list).
- Add, edit, and delete projects.
- Each project contains:
  - `name`
  - `description`
  - `status` (`Active`, `On Hold`, `Completed`)
  - `created_at` (auto-generated)

#### ✅ Tasks (per project)

- Each project has multiple tasks.
- Task fields:
  - `title`
  - `assigned_to`
  - `due_date`
  - `priority` (`Low`, `Medium`, `High`)
  - `status` (`Pending`, `In Progress`, `Done`)
- Allow:
  - Creating, editing, deleting tasks.
  - Filtering by status or priority.
  - Sorting by due date.

---

### 3. **Search, Filter & Pagination**

- Search projects or tasks by name/title.
- Filter tasks by `status` or `priority`.
- Paginate both project and task lists (client-side or API-based).

---

### 4. **State Management**

- Use one of the following (your choice):
  - **Redux Toolkit**
  - **React Context + useReducer**
- Persist authentication and project/task state.

---

### 5. **API Handling**

- Use **Axios** for API requests.
- Mock backend using:
  - **JSON Server** with routes:
    - `/auth/login`
    - `/auth/register`
    - `/projects`
    - `/tasks`
- Or connect to any backend you prefer (if you already have one).

---

## 💎 Bonus (Optional but Impressive)

✅ Drag-and-drop tasks between statuses (`react-beautiful-dnd` or `@dnd-kit/core`).  
✅ Implement **dark/light mode** with a toggle.  
✅ Add **toast notifications** (e.g., success/error messages using `react-hot-toast` or `react-toastify`).  
✅ Add **lazy loading** for routes using React Router.  
✅ Use **React Query** for API caching and automatic refetching.  
✅ Add a **chart** (using `recharts` or `chart.js`) showing task completion per project.

---
