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
   `MYSQL_PASSWORD` for a MySQL 8 server. The configured user must be allowed
   to create the database. To create the database and tables manually, run:

   ```powershell
   mysql -u root -p < schema.sql
   ```

   When the application starts, it also creates any missing tables and seeds an
   empty database with the portfolio data from `backend/config/seedData.js`.
   Frontend portfolio content is then read through the API from MySQL.

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
with `npm run start:backend` as its start command. Set `ADMIN_EMAIL`,
`ADMIN_PASSWORD_HASH`, `AUTH_TOKEN_SECRET`, and `FRONTEND_ORIGINS` in the API
service environment. `FRONTEND_ORIGINS` must contain the exact HTTPS frontend
origin, without a trailing slash (for example, `https://portfolio.example.com`).
The API health check is available at `/api/health`.

Deploy the frontend as a static site: use `npm run build` as its build command,
`dist` as its publish directory, and set `VITE_API_URL` to the API origin
(for example, `https://api.example.com`) in the frontend build environment.
The value is embedded at build time. If the API stores uploaded screenshots,
keep its persistent storage enabled for `public/frontend/assets/uploads`.
Certificate files accept JPEG, PNG, WebP, and PDF up to 10 MB; uploaded files
are served from that same directory.

For administrator sign-in across the separately hosted services, use HTTPS
custom domains on the same site, such as `portfolio.example.com` and
`api.example.com`. The session cookie is HttpOnly and SameSite=Strict; unrelated
provider domains may block it in browsers. Keep `FRONTEND_ORIGINS` restricted
to the actual frontend origin.

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
