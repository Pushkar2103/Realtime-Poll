## Real-Time Poll App

### Tech Stack
- Next.js (App Router)
- PostgreSQL (raw SQL)
- Pusher (real-time updates)

### Features
- Create polls and share via link
- Vote once per browser
- Real-time results without refresh
- Persistent storage

### Fairness / Anti-abuse
1. Browser-based voter ID stored in localStorage
2. Database-level uniqueness constraint on (poll_id, voter_hash)
3. UI vote disabling after submission

### Edge Cases Handled
- Page refresh
- Concurrent votes
- Duplicate voting attempts

### Limitations & Improvements
- Clearing browser data resets voter ID
- Could add authentication or CAPTCHA for stricter control
