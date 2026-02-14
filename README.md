# Real-Time Poll Rooms

## Public URL
**Live App:** https://realtime-poll.vercel.app

## GitHub Repository
**Source Code:** https://github.com/Pushkar2103/Realtime-Poll

---

## Project Overview
This is a full-stack web application that allows users to create polls, share them via a link, and collect votes while results update in real time for all viewers. The application focuses on correctness, persistence, real-time updates, and abuse prevention while keeping the architecture simple and production-ready.

---

## Tech Stack
- **Frontend:** Next.js (App Router, React)
- **Backend:** Next.js API Routes (Node.js runtime)
- **Database:** PostgreSQL (Supabase, raw SQL using `pg`)
- **Real-time Updates:** Pusher
- **Deployment:** Vercel

---

## Fairness / Anti-Abuse Mechanisms

### 1. Browser-based Voter ID (localStorage)
- A unique voter ID is generated and stored in the browser using `localStorage`.
- The ID is hashed on the backend and used to enforce **one vote per poll per browser**.

**Prevents:**
- Multiple votes by page refresh
- Accidental duplicate submissions

**Limitation:**
- Clearing browser storage or switching devices allows revoting.

---

### 2. Database-Level Uniqueness Constraint
- A unique constraint is enforced on `(poll_id, voter_hash)` at the database level.

**Prevents:**
- Duplicate votes even under concurrent requests
- Race conditions or repeated API calls

**Why this is important:**
- The database acts as the final source of truth for fairness.

---

## Edge Cases Handled
- Page refresh does not reset polls or votes
- Multiple users voting simultaneously
- Polls with zero votes still display all options
- Duplicate vote attempts are gracefully rejected
- Real-time updates stay consistent across multiple open clients
- Invalid or non-existent poll links return a safe error state

---

## Known Limitations & Future Improvements

### Current Limitations
- Clearing browser data allows revoting
- No IP-based restrictions to avoid blocking shared networks
- No user authentication (intentionally kept simple)

### Possible Improvements
- Authentication-based voting
- CAPTCHA or rate limiting for high-traffic polls
- Poll expiration and scheduling
- Analytics dashboard for poll creators
- Improved accessibility and UI animations

---

## Architecture Notes
- All database operations are performed server-side via Next.js API routes.
- Supabase is used strictly as a managed PostgreSQL database (no client-side access).
- Real-time updates are implemented using Pusher for reliability in serverless environments.

