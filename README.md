# Login/Signup App

Full-stack authentication app with Prisma ORM, Neon database, Express backend, and React frontend with Tailwind CSS.

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your Neon database URL:
   - Go to [Neon Console](https://console.neon.tech/)
   - Create a new project or use existing one
   - Copy the connection string
   - Paste it in `.env` as `DATABASE_URL`

4. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start backend server:
```bash
npm run dev
```

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:3000`

## Features

- User signup with email, password, and name
- User login with JWT authentication
- Protected dashboard route
- Tailwind CSS styling
- Prisma ORM with Neon PostgreSQL database
# capstonefinal
