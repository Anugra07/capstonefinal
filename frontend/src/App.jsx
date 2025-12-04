import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import SpaceSelector from './pages/SpaceSelector';
import CreateSpace from './pages/CreateSpace';
import SpaceDashboard from './pages/SpaceDashboard';
import DashboardOverview from './components/Dashboard/Overview';
import Journal from './components/Journal/JournalView';
import Tasks from './components/Tasks/TasksView';
import ChatRoom from './components/Chat/ChatRoom';
import TeamManagement from './components/Team/TeamManagement';
import DocumentManager from './components/Documents/DocumentManager';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/space-selector" element={<SpaceSelector />} />
        <Route path="/create-space" element={<CreateSpace />} />

        <Route path="/space/:id" element={<SpaceDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="journal" element={<Journal />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="chat" element={<ChatRoom />} />
          <Route path="docs" element={<DocumentManager />} />
          <Route path="team" element={<TeamManagement />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/create-space" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
