# Eliyas Wakjira Portfolio

A full-stack portfolio with a React/Vite frontend and an Express MVC API.
Frontend code and its HTML entry point are under `frontend/`; API code and
server entry points are under `backend/`. Shared build configuration and
package files stay at the repository root. Static assets served by the app live
under `public/`.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MySQL 8.0+

## Local setup

1. Install dependencies:

   ```powershell
   npm install --legacy-peer-deps
   ```

   `--legacy-peer-deps` is currently needed because the declared esbuild range
   is older than Vite 8's optional peer range.

2. Copy `.env.example` to `.env`, then configure an administrator login:

   Configure `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, and
   `MYSQL_PASSWORD` for your MySQL server. Create the database and grant the
   configured user access to it before starting the application. For a local
   database, create it first, then run:

   ```powershell
   mysql -u root -p -e "CREATE DATABASE eliyas_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
   mysql -u root -p eliyas_portfolio < schema.sql
   ```

   In cPanel, create the database and database user with **MySQL Database Wizard**,
   assign the user all privileges on that database, and use the complete
   cPanel-prefixed database and username in the environment. The app does not
   try to create the database; it creates missing tables and seeds an empty
   database with the portfolio data from `backend/config/seedData.js`.

   - Set `ADMIN_EMAIL` to the administrator email.
   - Set `ADMIN_PASSWORD_HASH` to a salted scrypt hash in `salt:hash` format.
   - Set `AUTH_TOKEN_SECRET` to a random secret of at least 32 bytes.

   Generate the hash for your chosen password:

   ```powershell
   node -e "const c=require('node:crypto');const s=c.randomBytes(16);console.log(s.toString('hex')+':'+c.scryptSync('REPLACE_WITH_A_LONG_PASSWORD',s,64).toString('hex'))"
   ```

   Generate the session signing key:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
   ```

   Replace the example password before running the hash command. Keep `.env`
   private; it is excluded from version control.

3. Start the development server:

   ```powershell
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). MySQL connection
   settings are required; sign-in and administrative actions also require the
   administrator environment variables.

4. Build and run the production bundle:

   ```powershell
   npm run build
   npm start
   ```

## Deploying the frontend and backend separately

Both deployments use the repository root. Deploy the API as a Node.js service
with `backend/server.js` as its startup file (or `npm run start:backend` where
the host supports npm start commands). For cPanel, use the backend folder as a
standalone Node.js application root: upload the contents of `backend/` to a
dedicated folder such as `portfolio_backend`, set the startup file to
`server.js`, and run NPM Install there. Its `package.json` contains only the
API's runtime dependencies, avoiding installation of frontend/build packages
on the API host. Create the application for `portfolio.eliyastech.com` and
configure its environment variables in cPanel. Set `ADMIN_EMAIL`,
`ADMIN_PASSWORD_HASH`, `AUTH_TOKEN_SECRET`, and `FRONTEND_ORIGINS` in the API
service environment. Use `https://eliyastech.com` as `FRONTEND_ORIGINS`.
Set `MYSQL_HOST` to the MySQL host shown by cPanel (usually `localhost`),
`MYSQL_DATABASE` and `MYSQL_USER` to their full cPanel-prefixed names, and
`MYSQL_PASSWORD` to the database user's password. The API health check is
available at `https://portfolio.eliyastech.com/api/health`.

Database connections are capped at five, with up to twenty requests waiting
for a connection. Database connection attempts and individual queries time
out after ten seconds; queries from the authenticated SQL console are also
limited to five seconds by MySQL. API responses, incoming HTTP requests, headers, and idle keep-alive sockets
have server-side timeouts to prevent connections from staying open
indefinitely. Monitor cPanel's **Resource Usage** page after deployment.

Deploy the frontend as a static site at `eliyastech.com`: build with
`VITE_API_URL=https://portfolio.eliyastech.com`, then copy the contents of `dist`
to the domain's document root (usually `public_html`). The value is embedded at
build time. If the API stores uploaded screenshots, preserve
`public/frontend/assets/uploads` in the Node.js application's writable storage.
Certificate files accept JPEG, PNG, WebP, and PDF up to 10 MB; uploaded files
are served from that same directory.
If the API is unavailable, the frontend shows saved browser data or its bundled
portfolio defaults. Contact messages and administrator changes require the API.

For administrator sign-in across these subdomains, enable HTTPS on both
domains. The session cookie is HttpOnly and SameSite=Strict; same-site
subdomains allow it to be sent between the frontend and API. Keep
`FRONTEND_ORIGINS` restricted to `https://eliyastech.com`.

## Project screenshots

Projects marked as deployed can use automatic website captures from thum.io.
The project URL must be public HTTPS, and its address is sent to that external
service to generate the screenshot. If the website blocks external capture,
upload a JPEG, PNG, or WebP screenshot from the authenticated Projects Manager.
Uploads are limited to 5 MB and saved in `public/frontend/assets/uploads/`.

## Security notes

- Administrator credentials and token-signing keys are configured only through
  environment variables; no demo passwords are included in client code.
- Administrator API actions require a signed, short-lived HttpOnly session.
- Screenshot uploads require an administrator session and validated image data.
- Use HTTPS when deploying; production cookies are marked `Secure`.
