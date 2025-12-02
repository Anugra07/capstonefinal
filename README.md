# FounderFlow 🚀

A comprehensive platform for startup founders to manage their journey from idea to growth, powered by AI.

## Features

### 🎯 Core Functionality
- **Landing & Onboarding**: Beautiful landing page with multi-step onboarding questionnaire
- **Workspace Management**: Create and join startup spaces with team collaboration
- **AI-Powered Journal**: Document your founder journey with AI-generated insights and feedback
- **Smart Task Management**: Kanban-style task board with AI-generated milestones
- **Real-time Chat**: Team collaboration with live messaging
- **Document Management**: Upload and analyze research docs with AI coaching
- **Team Management**: Invite members, manage roles, and track team activity

### 🤖 AI Features (Mock/Stub - Ready for Integration)
- Journal entry analysis and sentiment tracking
- Automated task generation based on startup stage
- Document insights and gap analysis
- Chat conversation analysis

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Supabase Client** for auth and realtime
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Prisma ORM** with PostgreSQL (Neon DB)
- **Supabase Auth** for authentication
- **JWT** for session management

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Neon DB account (or any PostgreSQL database)
- Supabase account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd capstonefinal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
PORT=4000
JWT_SECRET=your-secret-key-here
```

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Start the frontend dev server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

## Project Structure

```
capstonefinal/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── spaces.js              # Workspace management
│   │   ├── journal.js             # Journal entries
│   │   └── tasks.js               # Task management
│   ├── server.js                  # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Chat/              # Chat components
    │   │   ├── Dashboard/         # Dashboard overview
    │   │   ├── Documents/         # Document manager
    │   │   ├── Journal/           # Journal components
    │   │   ├── Tasks/             # Task management
    │   │   └── Team/              # Team management
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── pages/
    │   │   ├── Landing.jsx        # Landing page
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Signup.jsx         # Signup page
    │   │   ├── Onboarding.jsx     # Onboarding flow
    │   │   ├── CreateSpace.jsx    # Space creation
    │   │   └── SpaceDashboard.jsx # Main dashboard
    │   ├── App.jsx                # Main app component
    │   ├── supabaseClient.js      # Supabase configuration
    │   └── index.css              # Global styles
    └── package.json
```

## User Flow

1. **Landing** → User arrives and sees features
2. **Signup/Login** → Supabase Auth (Email or Google OAuth)
3. **Onboarding** → Multi-step questionnaire
4. **Create/Join Space** → Setup workspace
5. **Dashboard** → Access all features:
   - Journal entries with AI insights
   - Task management with AI generation
   - Real-time team chat
   - Document upload and analysis
   - Team member management

## Database Schema

### Models
- **User**: User accounts and profiles
- **Space**: Startup workspaces
- **SpaceMember**: User-space relationships with roles
- **JournalEntry**: Founder journal entries
- **Task**: Tasks and milestones
- **Message**: Chat messages
- **Document**: Uploaded documents

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login

### Spaces
- `POST /api/spaces` - Create space
- `POST /api/spaces/join` - Join space via invite
- `GET /api/spaces/:id` - Get space details

### Journal
- `GET /api/journal/:spaceId` - Get entries
- `POST /api/journal` - Create entry
- `POST /api/journal/analyze` - AI analysis (mock)

### Tasks
- `GET /api/tasks/:spaceId` - Get tasks
- `POST /api/tasks` - Create task
- `POST /api/tasks/generate` - AI generate tasks (mock)

## Future Enhancements

- [ ] Real OpenAI integration for AI features
- [ ] Email notifications and weekly summaries
- [ ] Analytics dashboard with charts
- [ ] Mobile app (React Native)
- [ ] Export journal entries as PDF
- [ ] Integration with Slack/Discord
- [ ] Investor pitch deck generator

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own startup journey!

---

Built with ❤️ for founders, by founders.
