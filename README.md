# VCS — Frontend

React (Vite) dashboard for a custom **Version Control System**: create repositories, browse files stored in S3, view CLI commands, star repos, and see contribution activity.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, React Router 7 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| HTTP | Axios |
| Charts | `@uiw/react-heat-map` |
| Icons | `react-icons` |

## Prerequisites

- **Node.js** 20+ (recommended for Vite 8)
- A running **backend API** (local or deployed)

## Environment variables

Create `.env` in this folder (Vite only exposes variables prefixed with `VITE_`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the backend **without** a trailing slash. |

**Local development**

```env
VITE_API_URL=http://localhost:3000
```

**Production (e.g. AWS Amplify)**

Use your **HTTPS** API URL (typically **API Gateway** in front of EC2), not a raw `http://EC2_IP:3000` URL, so the browser does not block requests from the Amplify domain.

```env
VITE_API_URL=https://YOUR_API_ID.execute-api.REGION.amazonaws.com
```

The app normalizes the value in `src/config/api.js` (trims quotes and trailing slashes).

## Scripts

```bash
npm install
npm run dev      # Vite dev server (default http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

## Amplify hosting

1. Connect this repo (or the frontend-only repo) to **AWS Amplify Hosting**.
2. Set build settings: build command `npm run build`, output directory `dist`.
3. Add environment variable **`VITE_API_URL`** in Amplify → App settings → Environment variables.
4. For **React Router** client-side routes, add a rewrite rule: source `/<*>` → target `/index.html` (200).

## Main routes (high level)

| Path | Purpose |
|------|---------|
| `/` | Dashboard (your repos, suggested repos, events) |
| `/auth`, `/signup` | Login / signup |
| `/profile` | Profile, repositories tab, starred repos, heat map |
| `/repo/create` | Create repository |
| `/repo/:id` | Repository detail (S3 files, commit IDs, file preview, repo ID for CLI) |
| `/repo/commands` | CLI reference (`init`, `add`, `commit`, `push`, `pull`, `revert`) |

## Project layout

```
src/
  components/   # UI by feature (auth, dashboard, repo, user, common)
  config/       # API base URL (api.js)
  authContext.jsx
  Routes.jsx
```

## Related

- **Backend** — Express API, MongoDB, S3, JWT, and the **CLI** live in the sibling `../backend` folder.
