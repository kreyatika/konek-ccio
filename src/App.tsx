import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetails from '@/pages/ProjectDetails';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import EmailConfirmation from '@/pages/EmailConfirmation';
import { AuthProvider } from '@/contexts/auth';
import RequireAuth from '@/components/auth/RequireAuth';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import RequireSuperAdmin from '@/components/auth/RequireSuperAdmin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Meetings from '@/pages/Meetings';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Calendar from '@/pages/Calendar';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import Kanban from '@/pages/Kanban';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            
            <Route element={<AppLayout><Outlet /></AppLayout>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
              <Route path="/projects/:id" element={<RequireAuth><ProjectDetails /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/admin" element={<RequireSuperAdmin><Admin /></RequireSuperAdmin>} />
              <Route path="/meetings" element={<RequireAuth><Meetings /></RequireAuth>} />
              <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
              <Route path="/events/:id" element={<RequireAuth><EventDetail /></RequireAuth>} />
              <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
              <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
              <Route path="/kanban" element={<RequireAuth><Kanban /></RequireAuth>} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
