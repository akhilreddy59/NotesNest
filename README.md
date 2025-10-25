# Notes Nest Frontend

A React-based frontend for the Notes Nest application, allowing users to share and manage educational notes.

## 🚀 Quick Start

1. Clone the repository

```bash
git clone https://github.com/akhilreddy59/notes-nest-frontend.git
cd notes-nest-frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

4. Start development server

```bash
npm start
```

## 🏗️ Build for Production

1. Ensure environment variables are set correctly in `.env`

2. Build the project

```bash
npm run build
```

3. The `build` folder will contain production-ready files

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel dashboard:
   - Add `REACT_APP_BACKEND_URL`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Set environment variables in Netlify dashboard
5. Deploy!

## 🔧 Environment Variables

- `REACT_APP_BACKEND_URL`: URL of your backend API

## 📝 Additional Notes

- Ensure CORS is properly configured on your backend
- Update API endpoints in code if your backend routes change
- Test the production build locally before deploying:
  ```bash
  npm run build
  npm install -g serve
  serve -s build
  ```

# NotesNest

This is the frontend for Notes Nest – a platform to share and manage notes.
