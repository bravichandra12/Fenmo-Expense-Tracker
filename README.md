# Fenmo Expense Tracker 💸

**Live Application:** [https://fenmoexpenses.netlify.app/](https://fenmoexpenses.netlify.app/)

A full-stack personal finance tool that allows users to record, review, filter, and sort their personal expenses. Built with resilience in mind to handle real-world conditions like unreliable networks and dropped connections.

## Project Overview (Tech Stack)
- **Frontend:** React.js, React Router for SPA navigation, Vanilla CSS (Premium Glassmorphism UI). Deployed on **Netlify**.
- **Backend:** Node.js, Express.js API, `pg` (PostgreSQL client). Deployed on **Render**.
- **Database:** PostgreSQL. Hosted on **Render**.

---

## Persistence Mechanism Choice: PostgreSQL
For this project, **PostgreSQL** was chosen as the persistence mechanism over SQLite, JSON files, or in-memory stores. 

*Why?* Dealing with financial data requires strict data integrity, precision, and reliability. PostgreSQL's `NUMERIC(12,2)` type guarantees exact decimal precision for currency, preventing the infamous floating-point rounding errors common in JavaScript math. Additionally, it provides a robust, production-ready foundation should the app need to scale, handle concurrent transactions, or implement complex aggregations in the future.

---

## Key Design Decisions

1. **Network Resilience & Auto-Retries:** To meet the requirement of handling unreliable networks, a custom `fetchWithRetry` wrapper was implemented on the frontend. It automatically retries failed network requests under the hood before gracefully degrading to a user-friendly error banner with a manual "↺ Retry" button.
2. **Double-Submit Prevention:** The frontend manages an `isSubmitting` state during form submission, actively disabling the submit button and changing its text. This prevents impatient users from creating duplicate expense entries via double-clicking.
3. **Backend Connection Stability:** The Postgres connection pool is configured with aggressive idle timeouts and error catchers (`pool.on('error')`). This ensures the Node.js server never crashes if Render's database drops an idle connection (a common issue on cloud free tiers).
4. **Client-Side vs Server-Side Sorting:** While the backend explicitly supports the `sort=date_desc` query parameter per the assignment instructions, the UI handles dynamic sorting (Newest/Oldest) entirely on the client-side. This eliminates unnecessary network roundtrips for a snappier user experience.

---

## Trade-offs Made (Due to Timebox)

- **Authentication / Users:** The app currently operates as a single-tenant tracker. Adding full JWT authentication, user registration, and multi-tenancy was skipped to prioritize core stability and resilience within the time limit.
- **Backend Idempotency Keys:** While the frontend explicitly blocks double-clicks, a truly bulletproof enterprise system would utilize UUID idempotency headers on the `POST /api/expenses` endpoint to guarantee exact-once processing. This was traded for solid frontend state management.
- **Pagination:** The `GET /api/expenses` endpoint currently returns the entire list of expenses. In a real-world scenario spanning several years, this would require cursor-based or offset pagination to maintain performance.

---

## Intentionally Left Out

- **Tailwind / UI Frameworks:** I intentionally used pure Vanilla CSS with a bespoke design system rather than relying on heavy UI component libraries (like Material UI) or Tailwind. This keeps the bundle size incredibly small and demonstrates core CSS competency.
- **Complex State Management:** Redux or the Context API were intentionally omitted. The state is simple enough to be managed effectively using lifted state in React hooks (`useState`, `useCallback`) at the top level of the routing tree.
- **Automated Testing:** While tests are incredibly valuable, writing comprehensive Jest/Cypress test suites was skipped. Instead, the time was reallocated to ensuring the live deployment, UI polish, and network resilience behaved perfectly under manual "stress" testing.
