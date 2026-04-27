# Express Backend

This is the backend for the project, built with Node.js, Express.js, and PostgreSQL.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your PostgreSQL database and update the `.env` file with your credentials.
3. Run the SQL in `tables.sql` to create the tables:
   ```bash
   psql -U youruser -d yourdb -f tables.sql
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

The server will run on http://localhost:5000 by default.
