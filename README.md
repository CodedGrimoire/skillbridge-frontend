# SkillBridge AI — Frontend

A modern Next.js (App Router) frontend for SkillBridge AI — a mentor-led career accelerator with resume analysis, mentor matching, tasks, courses, and market insights.

## Live URLs

- Local dev: http://localhost:3000
- API base (local): http://localhost:5000/api
- Production: _add your deployed frontend/API URLs here_

## Features

- **Role-aware dashboards** for mentors and jobseekers (tasks, mentees, skills, history).
- **Mentor Task Board**: create tasks, assign mentees, collect submissions, review/approve.
- **Course Marketplace** with Stripe checkout (client-verified flow).
- **Career Vision Tree**: interactive roadmap, skill gap, to-do tracking.
- **Market Intelligence**: always-on trending skills view (fallback-friendly).
- **Mentor directory & requests**: browse mentors, request, rate, and manage meetings.
- **Profile & Settings** pages with link management.
- **Custom 404** page.
- **Dark, minimal UI** with neutral palette and subtle indigo accents.

## Technologies Used

- **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**
- **Axios** for API calls
- **Framer Motion** for lightweight animations
- **Recharts** for simple charts
- **React Icons** for minimal iconography

## Environment

- `NEXT_PUBLIC_API_BASE_URL` — points to the Express backend (defaults to `http://localhost:5001/api`).

## Key Routes

- `/dashboard` — jobseeker dashboard
- `/dashboard/mentors` — mentor discovery & requests
- `/tasks` — jobseeker tasks & submissions
- `/mentor/tasks` — mentor task board
- `/courses` — course marketplace (buy with Stripe)
- `/mentor/courses` — mentor course management
- `/career-path` — Career Vision Tree
- `/market` — Market Intelligence
- `/profile`, `/settings`
- `/success` — Stripe success + verification
- `/*` — custom 404

## Styling

- Base layout: black/neutral surfaces, border-neutral-800, rounded-md/lg, shadow-sm
- Buttons: primary indigo, secondary neutral
- Status/badges: indigo (submitted), green (approved), red (rejected), neutral (pending)

## Setup Instructions

1) Install dependencies  
```bash
cd frontend
npm install
```
2) Configure environment  
Create `.env.local` with `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:5000/api`).
3) Run the dev server  
```bash
npm run dev
```
4) Open the app at `http://localhost:3000`.
