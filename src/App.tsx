import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Birthday from './pages/Birthday';
import ListToy from './pages/ListToy';
import Profile from './pages/Profile';
import ToyDetail from './pages/ToyDetail';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* 
        This max-w-md mx-auto wrapper makes the app look like a mobile device 
        when viewed on desktop, while filling the screen on mobile.
      */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<div className="max-w-md mx-auto bg-white min-h-screen shadow-xl"><Auth /></div>} />
            {/* All Routes Protected (Login Required for everything) */}
            <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><AppLayout><Discover /></AppLayout></ProtectedRoute>} />
            <Route path="/birthday" element={<ProtectedRoute><AppLayout><Birthday /></AppLayout></ProtectedRoute>} />
            <Route path="/toy/:id" element={<ProtectedRoute><div className="max-w-md mx-auto bg-white min-h-screen shadow-xl"><ToyDetail /></div></ProtectedRoute>} />
            
            <Route path="/list" element={<ProtectedRoute><AppLayout><ListToy /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/checkout/:id" element={<ProtectedRoute><div className="max-w-md mx-auto bg-white min-h-screen shadow-xl"><Checkout /></div></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
