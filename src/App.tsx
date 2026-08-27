import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Birthday from './pages/Birthday';
import ListToy from './pages/ListToy';
import Profile from './pages/Profile';
import ToyDetail from './pages/ToyDetail';
import Checkout from './pages/Checkout';

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
    <AppProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/discover" element={<AppLayout><Discover /></AppLayout>} />
        <Route path="/birthday" element={<AppLayout><Birthday /></AppLayout>} />
        <Route path="/list" element={<AppLayout><ListToy /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        
        {/* Detail and Checkout routes might hide bottom nav in a real app, but we keep layout simple for MVP */}
        <Route path="/toy/:id" element={<div className="max-w-md mx-auto bg-white min-h-screen"><ToyDetail /></div>} />
        <Route path="/checkout/:id" element={<div className="max-w-md mx-auto bg-white min-h-screen"><Checkout /></div>} />
      </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
